/**
 * DEMO SCRIPT - MIGRATION TOOL
 * 
 * Đây là script demo để học cách tự động hóa migration từ Mantine sang Tailwind CSS.
 * KHÔNG chạy script này trực tiếp trên codebase thực tế!
 * 
 * Script này chỉ để học và hiểu cách:
 * 1. Tìm và thay thế các Mantine components
 * 2. Convert Mantine props sang Tailwind classes
 * 3. Xử lý các edge cases
 */

const fs = require('fs');
const path = require('path');

// Mapping các Mantine components sang Tailwind equivalents
const COMPONENT_MAPPINGS = {
  // Layout components
  'Container': { replacement: 'div', classes: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' },
  'Stack': { replacement: 'div', classes: 'flex flex-col gap-4' },
  'Group': { replacement: 'div', classes: 'flex items-center gap-2' },
  'Grid': { replacement: 'div', classes: 'grid grid-cols-1 gap-4' },
  'Grid.Col': { replacement: 'div', classes: '' },
  'Box': { replacement: 'div', classes: '' },
  'Paper': { replacement: 'div', classes: 'p-4 rounded-lg shadow-sm bg-white dark:bg-gray-800' },
  'Card': { replacement: 'div', classes: 'p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800' },
  
  // Typography
  'Text': { replacement: 'p', classes: 'text-gray-900 dark:text-gray-100' },
  'Title': { replacement: 'h2', classes: 'text-2xl font-bold text-gray-900 dark:text-gray-100' },
  'Anchor': { replacement: 'a', classes: 'text-blue-600 dark:text-blue-400 hover:underline' },
  
  // Form components
  'TextInput': { replacement: 'input', classes: 'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' },
  'PasswordInput': { replacement: 'input', type: 'password', classes: 'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' },
  'Select': { replacement: 'select', classes: 'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' },
  'NumberInput': { replacement: 'input', type: 'number', classes: 'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' },
  'Checkbox': { replacement: 'input', type: 'checkbox', classes: 'w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500' },
  'Button': { replacement: 'button', classes: 'px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors' },
  
  // Other components
  'Divider': { replacement: 'hr', classes: 'border-t border-gray-300 dark:border-gray-600' },
  'Skeleton': { replacement: 'div', classes: 'bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse' },
};

// Mapping các Mantine props sang Tailwind classes
const PROP_MAPPINGS = {
  'size': {
    'xs': 'text-xs',
    'sm': 'text-sm',
    'md': 'text-base',
    'lg': 'text-lg',
    'xl': 'text-xl',
  },
  'weight': {
    '400': 'font-normal',
    '500': 'font-medium',
    '600': 'font-semibold',
    '700': 'font-bold',
  },
  'color': {
    'dimmed': 'text-gray-600 dark:text-gray-400',
    'red': 'text-red-600 dark:text-red-400',
    'blue': 'text-blue-600 dark:text-blue-400',
  },
  'radius': {
    'xs': 'rounded',
    'sm': 'rounded-sm',
    'md': 'rounded-md',
    'lg': 'rounded-lg',
    'xl': 'rounded-xl',
  },
  'spacing': {
    'xs': 'gap-1',
    'sm': 'gap-2',
    'md': 'gap-4',
    'lg': 'gap-6',
    'xl': 'gap-8',
  },
  'position': {
    'apart': 'justify-between',
    'center': 'justify-center',
    'left': 'justify-start',
    'right': 'justify-end',
  },
  'align': {
    'center': 'text-center',
    'left': 'text-left',
    'right': 'text-right',
  },
};

/**
 * Convert Mantine component sang Tailwind
 */
function convertComponent(componentName, props = {}) {
  const mapping = COMPONENT_MAPPINGS[componentName];
  if (!mapping) return null;
  
  let classes = mapping.classes || '';
  const replacement = mapping.replacement;
  const type = mapping.type;
  
  // Convert props
  if (props.size && PROP_MAPPINGS.size[props.size]) {
    classes += ' ' + PROP_MAPPINGS.size[props.size];
  }
  if (props.weight && PROP_MAPPINGS.weight[props.weight]) {
    classes += ' ' + PROP_MAPPINGS.weight[props.weight];
  }
  if (props.radius && PROP_MAPPINGS.radius[props.radius]) {
    classes += ' ' + PROP_MAPPINGS.radius[props.radius];
  }
  if (props.spacing && PROP_MAPPINGS.spacing[props.spacing]) {
    classes += ' ' + PROP_MAPPINGS.spacing[props.spacing];
  }
  if (props.position && PROP_MAPPINGS.position[props.position]) {
    classes += ' ' + PROP_MAPPINGS.position[props.position];
  }
  if (props.align && PROP_MAPPINGS.align[props.align]) {
    classes += ' ' + PROP_MAPPINGS.align[props.align];
  }
  
  return {
    tag: replacement,
    type: type,
    classes: classes.trim(),
  };
}

/**
 * Parse và convert một file React component
 */
function migrateFile(filePath) {
  console.log(`\n📄 Migrating: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let changes = [];
  
  // 1. Remove Mantine imports
  const mantineImportRegex = /import\s+.*from\s+['"]@mantine\/core['"];?/g;
  const mantineImports = content.match(mantineImportRegex);
  if (mantineImports) {
    changes.push('Removed Mantine imports');
    content = content.replace(mantineImportRegex, '');
  }
  
  // 2. Convert components (ví dụ đơn giản)
  // Trong thực tế, cần parser phức tạp hơn (AST parser)
  Object.keys(COMPONENT_MAPPINGS).forEach(component => {
    const regex = new RegExp(`<${component}([^>]*)>`, 'g');
    const matches = content.match(regex);
    if (matches) {
      changes.push(`Found ${matches.length} instances of ${component}`);
      // Note: Thực tế cần parse props và convert chính xác hơn
    }
  });
  
  // 3. Remove createStyles
  if (content.includes('createStyles')) {
    changes.push('Found createStyles - needs manual removal');
  }
  
  // 4. Remove useMantineTheme, useMantineColorScheme
  if (content.includes('useMantineTheme') || content.includes('useMantineColorScheme')) {
    changes.push('Found Mantine hooks - needs replacement with custom hooks');
  }
  
  console.log('  Changes:', changes.join(', '));
  
  return { content, changes };
}

/**
 * Tìm tất cả files cần migrate
 */
function findFilesToMigrate(dir, extensions = ['.tsx', '.ts']) {
  const files = [];
  
  function walkDir(currentPath) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        walkDir(fullPath);
      } else if (entry.isFile() && extensions.some(ext => entry.name.endsWith(ext))) {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes('@mantine/core') || content.includes('@mantine/')) {
          files.push(fullPath);
        }
      }
    }
  }
  
  walkDir(dir);
  return files;
}

/**
 * Main function - DEMO ONLY
 */
function demo() {
  console.log('🚀 MIGRATION SCRIPT DEMO');
  console.log('⚠️  This is a DEMO script for learning purposes only!');
  console.log('⚠️  DO NOT run this on actual codebase!\n');
  
  const pagesDir = path.join(__dirname, 'src', 'pages');
  
  if (!fs.existsSync(pagesDir)) {
    console.log('❌ Pages directory not found');
    return;
  }
  
  console.log('📁 Scanning for files with Mantine...');
  const files = findFilesToMigrate(pagesDir);
  
  console.log(`\n✅ Found ${files.length} files to migrate`);
  console.log('\n📋 Sample files:');
  files.slice(0, 5).forEach(file => {
    console.log(`  - ${path.relative(pagesDir, file)}`);
  });
  
  if (files.length > 5) {
    console.log(`  ... and ${files.length - 5} more files`);
  }
  
  console.log('\n💡 Example conversion:');
  console.log('  <Container size="xl">');
  console.log('  → <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">');
  
  console.log('\n  <Stack spacing="md">');
  console.log('  → <div className="flex flex-col gap-4">');
  
  console.log('\n  <Button radius="md" size="md">');
  console.log('  → <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors">');
  
  console.log('\n⚠️  IMPORTANT NOTES:');
  console.log('  1. This script is simplified - real migration needs AST parsing');
  console.log('  2. Manual review is required for complex components');
  console.log('  3. Test each migrated component thoroughly');
  console.log('  4. Handle edge cases manually (modals, forms, etc.)');
}

// Export for testing
if (require.main === module) {
  demo();
}

module.exports = {
  convertComponent,
  migrateFile,
  findFilesToMigrate,
  COMPONENT_MAPPINGS,
  PROP_MAPPINGS,
};






