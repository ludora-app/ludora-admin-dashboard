import fs from "node:fs";
import path from "node:path";

import pkg from "./orval.config.generated.mjs";

const getOrvalOperations = pkg;
const rootPath = process.cwd();

(async () => {
  const operations = await getOrvalOperations();
  const targetFile = path.resolve(rootPath, "tools/generate-api/orval.operations.json");
  fs.writeFileSync(targetFile, JSON.stringify(operations, null, 2));
  console.log("✅ Infinite operations generated.");
})();
