import React, { useState } from 'react';
import { 
  CategoryLevel1Node, 
  CategoryLevel2Node, 
  CategoryLevel3Node 
} from 'models/InventoryHierarchy';
import ProductStorageItem from './ProductStorageItem';
import { ChevronDown, ChevronRight, Folder, Box, Bookmark, LayoutGrid, Folders } from 'tabler-icons-react';
import { Group, Text, Badge, ActionIcon, Collapse } from '@mantine/core';

interface Props {
  node: CategoryLevel1Node | CategoryLevel2Node | CategoryLevel3Node;
  level: 1 | 2 | 3;
  warehouseId: number;
}

const InventoryHierarchyNode: React.FC<Props> = ({ node, level, warehouseId }) => {
  const [isExpanded, setIsExpanded] = useState(level === 1);

  const getLevelStyles = () => {
    switch (level) {
      case 1:
        return {
          bg: 'bg-white dark:bg-gray-800',
          border: 'border-blue-100 dark:border-blue-900/30',
          icon: <LayoutGrid size={18} className="text-blue-500" strokeWidth={2.5} />,
          label: 'Danh mục cấp 1',
          shadow: 'shadow-md',
          color: 'blue'
        };
      case 2:
        return {
          bg: 'bg-gray-50/50 dark:bg-gray-800/50',
          border: 'border-indigo-100 dark:border-indigo-900/20',
          icon: <Folders size={18} className="text-indigo-500" strokeWidth={2.5} />,
          label: 'Danh mục cấp 2',
          shadow: 'shadow-sm',
          color: 'indigo'
        };
      case 3:
        return {
          bg: 'bg-indigo-50/30 dark:bg-indigo-900/10',
          border: 'border-teal-100 dark:border-teal-900/20',
          icon: <Bookmark size={18} className="text-teal-500" strokeWidth={2.5} />,
          label: 'Danh mục cấp 3',
          shadow: 'none',
          color: 'teal'
        };
    }
  };

  const styles = getLevelStyles();

  const hasChildren = (node: any): node is CategoryLevel1Node | CategoryLevel2Node => {
    return (node as CategoryLevel1Node).children !== undefined;
  };

  const hasProducts = (node: any): node is CategoryLevel3Node => {
    return (node as CategoryLevel3Node).products !== undefined;
  };

  const childrenCount = hasChildren(node) ? node.children.length : 0;
  const productCount = hasProducts(node) ? node.products.length : 0;

  return (
    <div className={`rounded-3xl border ${styles.border} ${styles.bg} ${styles.shadow} overflow-hidden transition-all mb-3`}>
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/80 dark:hover:bg-gray-700/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Group spacing="md">
          <Box className={`p-2.5 bg-${styles.color}-100 dark:bg-${styles.color}-900/30 rounded-2xl`}>
            {styles.icon}
          </Box>
          <div>
            <Group spacing="xs" mb={2}>
              <Text size="xs" weight={800} color={styles.color as any} transform="uppercase" sx={{ letterSpacing: '0.05em' }}>{styles.label}</Text>
              {(childrenCount > 0 || productCount > 0) && (
                <Badge variant="dot" size="xs" color={styles.color as any}>
                  {childrenCount > 0 ? `${childrenCount} mục con` : `${productCount} sản phẩm`}
                </Badge>
              )}
            </Group>
            <Text weight={700} size="md" className="text-gray-900 dark:text-gray-100">{node.name}</Text>
          </div>
        </Group>
        
        <ActionIcon variant="light" color={styles.color as any} size="lg" radius="xl">
          {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </ActionIcon>
      </div>

      <Collapse in={isExpanded}>
        <div className="p-4 pt-0">
          <div className="pl-4 border-l-2 border-gray-100 dark:border-gray-700 space-y-1">
            {hasChildren(node) && node.children.map((child) => (
              <InventoryHierarchyNode 
                key={child.id} 
                node={child} 
                level={(level + 1) as 2 | 3} 
                warehouseId={warehouseId} 
              />
            ))}
            {hasProducts(node) && node.products.length > 0 ? (
               <div className="mt-4 space-y-3">
                 <Text size="xs" weight={800} color="dimmed" transform="uppercase" ml={4} mb={8}>Danh sách sản phẩm</Text>
                 {node.products.map((product) => (
                    <ProductStorageItem 
                      key={product.productId} 
                      product={product} 
                      warehouseId={warehouseId} 
                    />
                  ))}
               </div>
            ) : hasProducts(node) && (
              <Text size="xs" color="dimmed" align="center" py="md">Không tìm thấy sản phẩm trong mục này.</Text>
            )}
          </div>
        </div>
      </Collapse>
    </div>
  );
};

export default InventoryHierarchyNode;
