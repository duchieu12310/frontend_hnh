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

  const configsMatch = content.match(/(\w+Configs)\.(properties|managerPath)/);
  if (!configsMatch) continue;
  const configName = configsMatch[1];
  
  const replacement = `<div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {${configName}.properties.status.label} <span className="text-red-500">*</span>
                </label>
                <div 
                  className="flex items-center mt-2 cursor-pointer"
                  onClick={() => form.setFieldValue('status', (form.values.status === 1 || form.values.status === '1') ? '0' : '1')}
                >
                  <div className={\`relative inline-flex h-6 w-11 items-center rounded-full transition-colors \${(form.values.status === 1 || form.values.status === '1') ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}\`}>
                    <span className={\`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform \${(form.values.status === 1 || form.values.status === '1') ? 'translate-x-[22px]' : 'translate-x-[2px]'}\`} />
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {(form.values.status === 1 || form.values.status === '1') ? 'Bật (Hoạt động)' : 'Tắt (Vô hiệu lực)'}
                  </span>
                </div>
                {form.errors.status && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors.status}</p>
                )}
              </div>`;

  // Pattern 1: Native HTML <select> block
  const pattern1 = new RegExp(`<div>\\s*<label[\\s\\S]*?\\{${configName}\\.properties\\.status\\.label\\}[\\s\\S]*?<\\/label>\\s*<select[\\s\\S]*?\\{\\.\\.\\.form\\.getInputProps\\('status'\\)\\}[\\s\\S]*?<\\/select>\\s*(?:\\{form\\.errors\\.status[\\s\\S]*?<\\/p>\\s*\\})?\\s*<\\/div>`, 'g');
  
  if (pattern1.test(content)) {
    content = content.replace(pattern1, replacement);
    changed = true;
  }
  
  // Pattern 2: Mantine Switch wrapped in Grid.Col block
  const pattern2 = new RegExp(`<Grid\\.Col[^>]*>\\s*<Switch[\\s\\S]*?label=\\{${configName}\\.properties\\.status\\.label\\}[\\s\\S]*?\\/>\\s*<\\/Grid\\.Col>`, 'g');
  
  if (pattern2.test(content)) {
    content = content.replace(pattern2, `<Grid.Col xs={6}>\n              ${replacement}\n              </Grid.Col>`);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated Status Toggle in', file);
  }
}
