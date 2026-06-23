import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import ky from "ky";
import { getApiUrl } from "./api-url.mjs";

const SWAGGER_URL = `${getApiUrl()}/swagger`;
const env = process.env.NODE_ENV || "production";

(async () => {
  try {
    let swagger;
    let localFile = process.env.SWAGGER_FILE;

    if (env !== "localhost" && !localFile) {
      console.log(`🌐 Env is "${env}", trying to fetch artifact from GitHub...`);

      let branchName = "main";
      if (env === "development") branchName = "dev";
      if (env === "preview" || env === "staging") branchName = "staging";

      try {
        const tempDir = path.resolve(process.cwd(), ".artifacts");
        if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
        fs.mkdirSync(tempDir);

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
      } catch (err) {
        console.warn(
          "⚠️ Could not fetch from GitHub (gh cli missing or error). Falling back to HTTP download.",
        );
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
