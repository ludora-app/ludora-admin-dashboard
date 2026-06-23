import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import ky from "ky";
import { getApiUrl } from "./api-url.mjs";

const SWAGGER_URL = `${getApiUrl()}/swagger`;
const env = process.env.NODE_ENV || "production";
const BACKEND_REPO = "ludora-app/ludora-back";

// Extrait un fichier d'une archive zip (les artifacts GitHub sont des zips)
const extractFromZip = (zip, fileName) => {
  // Fin du central directory : signature 0x06054b50, cherchée depuis la fin du fichier
  let eocd = zip.length - 22;
  while (eocd >= 0 && zip.readUInt32LE(eocd) !== 0x06054b50) eocd--;
  if (eocd < 0) throw new Error("Invalid zip archive");

  const entries = zip.readUInt16LE(eocd + 10);
  let offset = zip.readUInt32LE(eocd + 16);

  for (let i = 0; i < entries; i++) {
    const method = zip.readUInt16LE(offset + 10);
    const compressedSize = zip.readUInt32LE(offset + 20);
    const nameLength = zip.readUInt16LE(offset + 28);
    const extraLength = zip.readUInt16LE(offset + 30);
    const commentLength = zip.readUInt16LE(offset + 32);
    const localHeader = zip.readUInt32LE(offset + 42);
    const name = zip.toString("utf8", offset + 46, offset + 46 + nameLength);

    if (name.endsWith(fileName)) {
      const dataStart =
        localHeader + 30 + zip.readUInt16LE(localHeader + 26) + zip.readUInt16LE(localHeader + 28);
      const data = zip.subarray(dataStart, dataStart + compressedSize);
      return method === 0 ? data : zlib.inflateRawSync(data);
    }
    offset += 46 + nameLength + extraLength + commentLength;
  }
  throw new Error(`${fileName} not found in zip archive`);
};

// Récupère swagger.json depuis le dernier artifact valide via l'API REST GitHub (sans gh CLI, absent sur Vercel)
const fetchSwaggerFromGithubApi = async (branchName, destDir) => {
  const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GH_TOKEN is not defined");

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  const listRes = await fetch(
    `https://api.github.com/repos/${BACKEND_REPO}/actions/artifacts?name=swagger-${branchName}&per_page=50`,
    { headers },
  );
  if (!listRes.ok) throw new Error(`GitHub API error ${listRes.status}: ${await listRes.text()}`);

  const { artifacts } = await listRes.json();
  const artifact = artifacts.find((a) => !a.expired && a.workflow_run?.head_branch === branchName);
  if (!artifact) throw new Error(`No valid swagger artifact found on branch ${branchName}`);

  console.log(`📡 Downloading artifact ${artifact.id} (run ${artifact.workflow_run.id})`);

  // L'API redirige vers une URL signée ; fetch retire le header Authorization sur la redirection
  const zipRes = await fetch(artifact.archive_download_url, { headers });
  if (!zipRes.ok) throw new Error(`Artifact download error ${zipRes.status}`);

  const zip = Buffer.from(await zipRes.arrayBuffer());
  const swaggerPath = path.resolve(destDir, "swagger.json");
  fs.writeFileSync(swaggerPath, extractFromZip(zip, "swagger.json"));
  return swaggerPath;
};

(async () => {
  try {
    let swagger;
    let localFile = process.env.SWAGGER_FILE;

    if (env !== "localhost" && !localFile) {
      console.log(`🌐 Env is "${env}", trying to fetch artifact from GitHub...`);

      // Determine the backend branch based on APP_ENV or the git branch name directly
      let branchName = "main";
      if (env === "development" || env === "dev") branchName = "dev";
      else if (env === "preview" || env === "staging") branchName = "staging";
      // If env looks like a raw git branch name, use it directly
      else if (!["production", "main"].includes(env)) branchName = env;

      const tempDir = path.resolve(process.cwd(), ".artifacts");
      if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
      fs.mkdirSync(tempDir);

      // En prod, /swagger-json n'est pas exposé par l'API : on passe par l'API REST GitHub (gh CLI absent sur Vercel)
      if ((process.env.VERCEL_GIT_COMMIT_REF || branchName) === "main") {
        console.log('📥 Using GitHub API to find latest swagger artifact on branch "main"...');
        try {
          localFile = await fetchSwaggerFromGithubApi("main", tempDir);
        } catch (err) {
          throw new Error(`Could not fetch swagger artifact from GitHub: ${err.message}`);
        }
        console.log("✅ Found artifact at:", localFile);
      } else {
        try {
          console.log(`📥 Using GH CLI to find latest run on branch "${branchName}"...`);

          const repo = "ludora-app/ludora-back";
          const ghEnv = {
            ...process.env,
            GH_TOKEN: process.env.GH_TOKEN || process.env.GITHUB_TOKEN,
          };

          // 1. Récupérer l'ID du dernier run sur la branche (permet de récupérer l'artefact même si le run a échoué plus tard)
          const runId = execSync(
            `gh run list --repo ${repo} --branch "${branchName}" --workflow "CI/CD Pipeline" --limit 1 --json databaseId --jq ".[0].databaseId"`,
            { env: ghEnv },
          )
            .toString()
            .trim();

          if (!runId || runId === "null") {
            throw new Error(`No runs found on branch ${branchName}`);
          }

          console.log(`📡 Downloading artifact from run ID: ${runId}`);

          // 2. Télécharger l'artefact du run trouvé
          execSync(
            `gh run download ${runId} --repo ${repo} --pattern "swagger-*" --dir "${tempDir}"`,
            {
              stdio: "inherit",
              env: ghEnv,
            },
          );

          const files = fs.readdirSync(tempDir, { recursive: true });
          const swaggerPath = files.find((f) => f.endsWith("swagger.json"));

          if (swaggerPath) {
            localFile = path.resolve(tempDir, swaggerPath);
            console.log("✅ Found artifact at:", localFile);
          }
        } catch {
          console.warn(
            "⚠️ Could not fetch from GitHub (gh cli missing or error). Falling back to HTTP download.",
          );
        }
      }
    }

    const fallbackSwaggerFile = path.resolve(process.cwd(), "tools/generate-api/swagger.json");

    if (localFile && fs.existsSync(localFile)) {
      console.log("📄 Using local Swagger file:", localFile);
      const fileContent = fs.readFileSync(localFile, "utf8");
      swagger = JSON.parse(fileContent);
    } else {
      try {
        console.log("📥 Downloading Swagger from:", SWAGGER_URL);
        const res = await ky.get(SWAGGER_URL);
        swagger = await res.json();
      } catch (downloadError) {
        if (fs.existsSync(fallbackSwaggerFile)) {
          console.warn(
            `⚠️ Download failed (${downloadError.message}). Falling back to existing swagger.json.`,
          );
          const fileContent = fs.readFileSync(fallbackSwaggerFile, "utf8");
          swagger = JSON.parse(fileContent);
        } else {
          throw downloadError;
        }
      }
    }

    // Collecter tous les tags utilisés dans les opérations
    const usedTags = new Set();
    for (const path in swagger.paths) {
      for (const method in swagger.paths[path]) {
        const operation = swagger.paths[path][method];
        if (operation.tags && Array.isArray(operation.tags)) {
          operation.tags.forEach((tag) => {
            usedTags.add(tag);
          });
        }
      }
    }

    // S'assurer que tous les tags utilisés sont définis dans la section tags
    if (!swagger.tags) {
      swagger.tags = [];
    }
    const existingTagNames = new Set(swagger.tags.map((t) => t.name));
    for (const tagName of usedTags) {
      if (!existingTagNames.has(tagName)) {
        swagger.tags.push({
          name: tagName,
          description: `${tagName} operations`,
        });
      }
    }

    // Sauvegarder le Swagger modifié
    const rootPath = process.cwd();
    const swaggerFile = path.resolve(rootPath, "tools/generate-api/swagger.json");
    fs.writeFileSync(swaggerFile, JSON.stringify(swagger, null, 2));

    console.log("✅ Swagger downloaded and fixed!");
    console.log(`📁 Saved to: ${swaggerFile}`);
    console.log(`📊 Total tags: ${swagger.tags.length}`);
  } catch (error) {
    console.error("❌ Error downloading Swagger:", error.message);
    process.exit(1);
  }
})();
