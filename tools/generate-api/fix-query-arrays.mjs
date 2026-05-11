import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const apiDir = path.resolve(__dirname, "../../src/api/generated/api");

function fixQueryArrays() {
  const files = getAllTsFiles(apiDir);
  let fixedCount = 0;

  files.forEach((file) => {
    let content = fs.readFileSync(file, "utf-8");
    const originalContent = content;

    // Pattern to replace:
    // if (value !== undefined) {
    //   normalizedParams.append(key, value === null ? 'null' : value.toString())
    // }
    
    const oldPattern = /if \(value !== undefined\) \{\s+normalizedParams\.append\(key, value === null \? 'null' : value\.toString\(\)\)\s+\}/g;
    
    const newPattern = `if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach(v => normalizedParams.append(key, v.toString()));
      } else {
        normalizedParams.append(key, value.toString())
      }
    }`;

    content = content.replace(oldPattern, newPattern);

    if (content !== originalContent) {
      fs.writeFileSync(file, content, "utf-8");
      console.log(`✅ Fixed query arrays in: ${path.relative(apiDir, file)}`);
      fixedCount++;
    }
  });

  console.log(`\n✨ Fixed query arrays in ${fixedCount} file(s).`);
}

function getAllTsFiles(dir) {
  const files = [];

  function walk(currentPath) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    entries.forEach((entry) => {
      const fullPath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.name.endsWith(".api.ts")) {
        files.push(fullPath);
      }
    });
  }

  walk(dir);
  return files;
}

fixQueryArrays();
