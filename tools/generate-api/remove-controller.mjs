import fs from 'fs';
import path from 'path';

const rootPath = process.cwd();
const folderPath = path.resolve(rootPath, 'src/api/generated'); // 🔁 modifie si besoin

// 🧠 Fonction qui enlève "controller" uniquement s'il n'est pas au début d'un mot
const removeControllerWords = content => content.replace(/(?<!\b)(Controller|controller)/g, '');

function processDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);

  items.forEach(item => {
    const fullPath = path.join(dirPath, item);

    if (fs.lstatSync(fullPath).isDirectory()) {
      processDirectory(fullPath); // récursion
    } else {
      // 🛑 Ne pas toucher aux fichiers qui commencent par "controller"
      if (/^controller/i.test(item)) {
        console.log(`🛑 ${item} skipped`);
        return;
      }

      // ✅ Lire et modifier le contenu du fichier
      const originalContent = fs.readFileSync(fullPath, 'utf8');
      const updatedContent = removeControllerWords(originalContent);

      // ✅ Renommer le fichier s'il contient "controller"
      const newFileName = item.replace(/Controller/g, '').replace(/controller/g, '');
      const newFullPath = path.join(dirPath, newFileName);

      fs.writeFileSync(newFullPath, updatedContent, 'utf8');

      if (newFullPath !== fullPath) {
        fs.unlinkSync(fullPath);
        console.log(`🔁 ${item} renamed -> ${newFileName}`);
      } else {
        console.log(`✅ ${item} modified`);
      }
    }
  });
}

processDirectory(folderPath);
