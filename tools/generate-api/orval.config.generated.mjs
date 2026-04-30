import fs from "node:fs";
import path from "node:path";

const PAGINATION_KEYWORDS = ["collection"];

export default async function getOrvalOperations() {
  const rootPath = process.cwd();
  const swaggerFile = path.resolve(rootPath, "tools/generate-api/swagger.json");

  if (!fs.existsSync(swaggerFile)) {
    console.warn("⚠️ Swagger file not found at:", swaggerFile);
    return {};
  }

  const swagger = JSON.parse(fs.readFileSync(swaggerFile, "utf8"));

  const operations = {};

  for (const path in swagger.paths) {
    for (const method in swagger.paths[path]) {
      const operation = swagger.paths[path][method];
      const operationId = operation.operationId;

      if (operationId) {
        console.log(`📍 Found operation: "${operationId}" at path "${path}"`);
        if (PAGINATION_KEYWORDS.some((keyword) => path.includes(keyword))) {
          console.log(`🔁 Route "${operationId}" marked as infinite query`);
          operations[operationId] = {
            query: {
              useInfinite: true,
              useInfiniteQueryParam: "cursor",
            },
          };
        }
      }
    }
  }

  return operations;
}
