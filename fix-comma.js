const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src', 'pages');

const readFilesRecursively = (dir, fileList = []) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      readFilesRecursively(filePath, fileList);
    } else {
      if (filePath.endsWith('Manage.tsx')) {
        fileList.push(filePath);
      }
    }
  }
  return fileList;
};

const manageFiles = readFilesRecursively(directoryPath);

for (const file of manageFiles) {
  let content = fs.readFileSync(file, 'utf8');

  // Fix the comma issue:
  // Find "ManageTable\n  StatusToggle," or similar without comma
  content = content.replace(/([a-zA-Z0-9_]+)(\s+)StatusToggle,/g, '$1,$2StatusToggle,');
  fs.writeFileSync(file, content, 'utf8');
}
