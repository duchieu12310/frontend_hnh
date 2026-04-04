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
      if (filePath.endsWith('Create.tsx') || filePath.endsWith('Update.tsx')) {
        fileList.push(filePath);
      }
    }
  }
  return fileList;
};

const formFiles = readFilesRecursively(directoryPath);

for (const file of formFiles) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Find Configs name
  const configsMatch = content.match(/(\w+Configs)\.managerPath/);
  if (!configsMatch) continue;
  const configName = configsMatch[1];

  // Regex to match Select component for status
  // <Select ... label={ConfigName.properties.status.label} ... {...form.getInputProps('status')} />
  const selectRegex = new RegExp(`<Select[\\s\\S]*?label=\\{${configName}\\.properties\\.status\\.label\\}[\\s\\S]*?\\{\\.\\.\\.form\\.getInputProps\\('status'\\)\\}\\s*\\/>`);
  
  if (selectRegex.test(content)) {
    content = content.replace(selectRegex, 
`<Switch
                  size="md"
                  label={${configName}.properties.status.label}
                  checked={form.values.status === '1' || form.values.status === 1}
                  onChange={(event) => form.setFieldValue('status', event.currentTarget.checked ? '1' : '0')}
                />`
    );
    changed = true;
  }

  if (changed) {
    // Add Switch to Mantine imports if not present
    if (content.includes("'@mantine/core'")) {
      if (!content.includes('Switch,')) {
         content = content.replace(/import\s+{([^}]+)}\s+from\s+'@mantine\/core';/, (match, group) => {
             return `import { Switch, ${group} } from '@mantine/core';`;
         });
      }
    }
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated Status Switch in', file);
  }
}
