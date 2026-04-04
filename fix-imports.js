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

  if (content.includes('StatusToggle') && !content.includes('StatusToggle,')) {
    // It's used but not imported
    const extractComponentsMatches = content.match(/import\s+{([^}]+)}\s+from\s+'components';/);
    if (extractComponentsMatches) {
        let inside = extractComponentsMatches[1];
        if (!inside.includes('StatusToggle')) {
            inside = inside + '  StatusToggle,\n';
            content = content.replace(/import\s+{([^}]+)}\s+from\s+'components';/, `import {\n${inside}} from 'components';`);
            fs.writeFileSync(file, content, 'utf8');
            console.log('Fixed imports in', file);
        }
    } else {
        console.log('No components import found in', file);
    }
  }
}
