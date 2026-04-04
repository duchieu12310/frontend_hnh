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
  let changed = false;

  // Find Configs name (e.g. UserConfigs from 'pages/user/UserConfigs')
  const configsMatch = content.match(/(\w+Configs)\.resourceUrl/);
  if (!configsMatch) continue;
  const configName = configsMatch[1];

  // Try to find status badge fragment usage in showedPropertiesFragment
  if (content.includes('StatusBadgeFragment(entity.status)')) {
    content = content.replace(
      /{(\w+)StatusBadgeFragment\(entity\.status\)}/g,
      `<StatusToggle status={entity.status} entityId={entity.id} resourceUrl={${configName}.resourceUrl} resourceKey={${configName}.resourceKey} />`
    );
    changed = true;
  }

  // Remove the old fragment definition
  content = content.replace(/const \w+StatusBadgeFragment = \(status: number\) => {[\s\S]*?};\n+/g, '');

  if (changed) {
    // Add StatusToggle to the import from 'components'
    if (content.includes("from 'components'")) {
      if (!content.includes("StatusToggle")) {
         content = content.replace(/(\s+)ManageTable,([\s\S]*?)from 'components';/, `$1ManageTable,$2StatusToggle,$1from 'components';`);
      }
    } else {
        // Fallback or skip
    }
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated', file);
  }
}
