import React, { useState } from 'react';
import { Group, Select, ActionIcon, Stack, Button, Paper, Text, Box, Tooltip, MultiSelect } from '@mantine/core';
import { Plus, Trash, ChevronRight } from 'tabler-icons-react';
import { SelectOption } from 'types';

export interface SelectionNode {
  id: string; // Temporary ID for React keys
  type: 'L1' | 'L2' | 'L3' | 'Product';
  value: string | string[] | null;
  children: SelectionNode[];
}

interface WarehouseSelectionTreeProps {
  nodes: SelectionNode[];
  onNodesChange: (nodes: SelectionNode[]) => void;
  metadata: {
    l1Options: SelectOption[];
    l2Options: (parentId: string | null) => SelectOption[];
    l3Options: (parentId: string | null) => SelectOption[];
    productOptions: (parentId: string | null) => SelectOption[];
  };
}

const SelectionRow: React.FC<{
  node: SelectionNode;
  options: SelectOption[];
  onUpdate: (val: string | string[] | null) => void;
  onRemove: () => void;
  onAddSubCategory?: () => void;
  onAddProduct?: () => void;
}> = ({ node, options, onUpdate, onRemove, onAddSubCategory, onAddProduct }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Group 
      spacing="xs" 
      align="center" 
      onMouseEnter={() => setHovered(true)} 
      onMouseLeave={() => setHovered(false)}
      sx={{ minHeight: 42 }}
    >
        {node.type === 'Product' ? (
          <MultiSelect
            placeholder="Chọn các sản phẩm..."
            value={Array.isArray(node.value) ? node.value : []}
            onChange={onUpdate as any}
            data={options}
            sx={{ flex: 1, maxWidth: 500 }}
            searchable
            clearable
            size="sm"
            nothingFound="Không tìm thấy mục nào"
          />
        ) : (
          <Select
            placeholder="Vui lòng chọn..."
            value={node.value as string}
            onChange={onUpdate as any}
            data={options}
            sx={{ flex: 1, maxWidth: 350 }}
            searchable
            clearable
            size="sm"
            nothingFound="Không tìm thấy mục nào"
          />
        )}
        
        <Group spacing={4} sx={{ opacity: hovered ? 1 : 0, transition: 'opacity 0.2s ease', visibility: hovered ? 'visible' : 'hidden' }}>
          {onAddSubCategory && (
            <Tooltip label="Thêm danh mục con" withArrow position="top">
              <ActionIcon 
                color="blue" 
                variant="light" 
                radius="xl" 
                size="md"
                onClick={onAddSubCategory}
              >
                <Plus size={16} />
              </ActionIcon>
            </Tooltip>
          )}

          {onAddProduct && (
            <Tooltip label="Thêm sản phẩm" withArrow position="top">
              <ActionIcon 
                color="orange" 
                variant="light" 
                radius="xl" 
                size="md"
                onClick={onAddProduct}
              >
                <ChevronRight size={16} />
              </ActionIcon>
            </Tooltip>
          )}

          <Tooltip label="Xóa dòng này" withArrow position="top">
            <ActionIcon 
              color="red" 
              variant="light" 
              radius="xl" 
              size="md"
              onClick={onRemove}
            >
              <Trash size={16} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>
  );
};

const WarehouseSelectionTree: React.FC<WarehouseSelectionTreeProps> = ({ nodes, onNodesChange, metadata }) => {
  const addL1 = () => {
    onNodesChange([
      ...nodes,
      { id: Math.random().toString(36).substr(2, 9), type: 'L1', value: null, children: [] }
    ]);
  };

  const updateNode = (path: number[], newNode: SelectionNode) => {
    const newNodes = [...nodes];
    let current: any = { children: newNodes };
    path.forEach((index) => {
      current = current.children[index];
    });
    Object.assign(current, newNode);
    onNodesChange(newNodes);
  };

  const removeNode = (path: number[]) => {
    const newNodes = [...nodes];
    if (path.length === 1) {
      newNodes.splice(path[0], 1);
    } else {
      let current: any = { children: newNodes };
      path.slice(0, -1).forEach((index) => {
        current = current.children[index];
      });
      current.children.splice(path[path.length - 1], 1);
    }
    onNodesChange(newNodes);
  };

  const addChild = (path: number[], type: SelectionNode['type']) => {
    const newNodes = [...nodes];
    let current: any = { children: newNodes };
    path.forEach((index) => {
      current = current.children[index];
    });
    
    current.children.push({
      id: Math.random().toString(36).substr(2, 9),
      type,
      value: type === 'Product' ? [] : null,
      children: []
    });
    onNodesChange(newNodes);
  };

  const renderRecursive = (node: SelectionNode, path: number[], parentOptions: SelectOption[]): JSX.Element => {
    const options = parentOptions;
    const canAddChild = node.type !== 'Product';
    const childLabel = node.type === 'L1' ? 'Cấp 2' : node.type === 'L2' ? 'Cấp 3' : 'Sản phẩm';

    return (
      <Box key={node.id} sx={(theme) => ({
        borderLeft: node.type !== 'L1' ? `1px dashed ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[4]}` : 'none',
        marginLeft: node.type !== 'L1' ? 18 : 0,
        paddingLeft: node.type !== 'L1' ? 24 : 0,
        position: 'relative',
        '&::before': node.type !== 'L1' ? {
           content: '""',
           position: 'absolute',
           left: 0,
           top: 21,
           width: 20,
           height: 1,
           borderTop: `1px dashed ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[4]}`,
        } : {},
      })}>
        <SelectionRow 
          node={node}
          options={options}
          onUpdate={(val) => {
             const newNode = { ...node, value: val };
             updateNode(path, newNode);
          }}
          onRemove={() => removeNode(path)}
          onAddSubCategory={node.type !== 'L3' && node.type !== 'Product' ? () => {
             const nextType: SelectionNode['type'] = node.type === 'L1' ? 'L2' : 'L3';
             addChild(path, nextType);
          } : undefined}
          onAddProduct={node.type !== 'Product' ? () => {
             addChild(path, 'Product');
          } : undefined}
        />
        
        <Stack spacing={8} mt="xs" sx={(theme) => ({
          backgroundColor: node.type === 'L1' ? (theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0]) : 'transparent',
          borderRadius: theme.radius.md,
          padding: node.children.length > 0 && node.type === 'L1' ? '8px 12px 12px 12px' : 0,
          border: node.children.length > 0 && node.type === 'L1' ? `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}` : 'none',
        })}>
          {node.children.map((child, index) => {
            const parentValue = node.value as string;
            const childOptions = child.type === 'L2' ? metadata.l2Options(parentValue) : 
                               child.type === 'L3' ? metadata.l3Options(parentValue) : 
                               metadata.productOptions(parentValue);
            return renderRecursive(child, [...path, index], childOptions);
          })}
        </Stack>
      </Box>
    );
  };

  return (
    <Paper withBorder p="md" radius="md" sx={(theme) => ({
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.white,
        minHeight: 200,
    })}>
      <Stack spacing="lg">
        <Group position="apart">
          <Group spacing="xs">
            < ChevronRight size={18} color="gray" />
            <Text weight={700} size="xs" color="dimmed" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
              Thể loại sách & Sản phẩm cho phép
            </Text>
          </Group>
          <Button 
            size="xs" 
            variant="light" 
            leftIcon={<Plus size={14}/>}
            onClick={addL1}
            radius="xl"
          >
            Thêm Danh mục Cấp 1
          </Button>
        </Group>
        
        {nodes.length === 0 ? (
          <Box py="xl" sx={{ textAlign: 'center', opacity: 0.5 }}>
            <Paper p="lg" sx={(theme) => ({ backgroundColor: theme.colors.gray[0], borderStyle: 'dashed', borderWidth: 1, borderType: 'solid', borderColor: theme.colors.gray[3] })}>
                <Text size="sm" color="dimmed">Chưa có giới hạn lựa chọn.</Text>
                <Text size="xs" color="dimmed">Mặc định: Kho cho phép nhập **TẤT CẢ** các loại sách.</Text>
            </Paper>
          </Box>
        ) : (
          <Stack spacing="md">
            {nodes.map((node, index) => renderRecursive(node, [index], metadata.l1Options))}
          </Stack>
        )}
      </Stack>
    </Paper>
  );
};

export default WarehouseSelectionTree;
