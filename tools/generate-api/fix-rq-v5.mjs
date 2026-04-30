import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const apiDir = path.resolve(__dirname, '../../src/api/generated/api');

/**
 * Fix React Query v5 incompatibility in Orval-generated files
 * Removes the redundant 4th type argument from UseInfiniteQueryOptions
 */
function fixRQv5Compatibility() {
  const files = getAllTsFiles(apiDir);
  let fixedCount = 0;

  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf-8');
    const originalContent = content;

    // Fix: Remove the 4th argument (Awaited<ReturnType<...>>) from UseInfiniteQueryOptions
    // Pattern: UseInfiniteQueryOptions<..., TData, Awaited<ReturnType<...>>, QueryKey, ...>
    // Should be: UseInfiniteQueryOptions<..., TData, QueryKey, ...>

    content = content.replace(
      /UseInfiniteQueryOptions<\n\s+([^,]+),\n\s+([^,]+),\n\s+([^,]+),\n\s+Awaited<ReturnType<[^>]+>>,\n\s+(QueryKey),/g,
      'UseInfiniteQueryOptions<\n        $1,\n        $2,\n        $3,\n        $4,',
    );

    // Also handle single-line format
    content = content.replace(
      /UseInfiniteQueryOptions<([^,]+),\s*([^,]+),\s*([^,]+),\s*Awaited<ReturnType<[^>]+>>,\s*(QueryKey),/g,
      'UseInfiniteQueryOptions<$1, $2, $3, $4,',
    );

    if (content !== originalContent) {
      fs.writeFileSync(file, content, 'utf-8');
      console.log(`✅ Fixed: ${path.relative(apiDir, file)}`);
      fixedCount++;
    }
  });

  console.log(`\n✨ Fixed ${fixedCount} file(s) for React Query v5 compatibility.`);
}

function getAllTsFiles(dir) {
  const files = [];

  function walk(currentPath) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    entries.forEach(entry => {
      const fullPath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.name.endsWith('.api.ts')) {
        files.push(fullPath);
      }
    });
  }

  walk(dir);
  return files;
}

fixRQv5Compatibility();
