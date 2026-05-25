import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const apiDir = path.resolve(__dirname, "../../src/api/generated/api");

function fixMultipartImages() {
  const file = path.resolve(apiDir, "fields-admin/fields-admin.api.ts");
  if (!fs.existsSync(file)) {
    console.warn("⚠️ File not found:", file);
    return;
  }

  let content = fs.readFileSync(file, "utf-8");
  const originalContent = content;

  // Remplace le forEach problématique par une version qui gère le Blob
  // On sépare les métadonnées du fichier binaire
  // Note: On utilise une regex qui capture le nom de la variable (updateFieldAdminDto ou updateFieldAdminFormDto)
  // On cherche d'abord si le fichier a déjà été patché pour pouvoir le re-patcher si besoin

  const patchedPattern = /formData\.append\('images_metadata', JSON\.stringify\(metadata\)\);/g;
  if (patchedPattern.test(content)) {
    content = content.replace(/images_metadata/g, "images");
  } else {
    const oldPattern =
      /if\(([^.]+)\.images !== undefined\) \{\s+\1\.images\.forEach\(value => formData\.append\(`images`, JSON\.stringify\(value\)\)\);\s+\}/g;
    content = content.replace(oldPattern, (match, varName) => {
      return `if(${varName}.images !== undefined) {
    ${varName}.images.forEach(value => {
      const { file, ...metadata } = value;
      // On envoie les métadonnées en JSON
      formData.append('images', JSON.stringify(metadata));
      // On envoie le fichier binaire séparément
      if (file instanceof Blob && file.size > 0) {
        formData.append('images_files', file, metadata.name || 'image.jpg');
      }
    });
  }`;
    });
  }

  if (content !== originalContent) {
    fs.writeFileSync(file, content, "utf-8");
    console.log("✅ Fixed multipart images in fields-admin.api.ts");
  } else {
    console.warn("⚠️ Pattern not found in fields-admin.api.ts. Already fixed?");
  }
}

fixMultipartImages();
