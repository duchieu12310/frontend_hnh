import React, { useState, useMemo } from 'react';
import { Select, Button, Badge, Group, Stack, Text, Divider, SimpleGrid } from '@mantine/core';
import { CategoryResponse } from 'models/Category';
import { Plus, X, Folder, Folders, Box } from 'tabler-icons-react';

interface CategoryCascadingSelectorProps {
  categories: CategoryResponse[];
  selectedId: number | null;
  onChange: (id: number | null) => void;
  label?: string;
}

const CategoryCascadingSelector: React.FC<CategoryCascadingSelectorProps> = ({
  categories,
  selectedId,
  onChange,
  label = 'Thể loại',
}) => {
  // We need to initialize the cascading levels based on the selectedId
  const [level1Id, setLevel1Id] = React.useState<string | null>(null);
  const [level2Id, setLevel2Id] = React.useState<string | null>(null);
  const [level3Id, setLevel3Id] = React.useState<string | null>(null);

  // Initialize levels when selectedId is provided (e.g., on edit)
  React.useEffect(() => {
    if (selectedId) {
      const category = categories.find(c => c.id === selectedId);
      if (category) {
        if (category.level === 3) {
          setLevel3Id(String(category.id));
          setLevel2Id(category.parentCategory ? String(category.parentCategory.id) : null);
          const parent = categories.find(c => c.id === category.parentCategory?.id);
          setLevel1Id(parent?.parentCategory ? String(parent.parentCategory.id) : null);
        } else if (category.level === 2) {
          setLevel2Id(String(category.id));
          setLevel1Id(category.parentCategory ? String(category.parentCategory.id) : null);
          setLevel3Id(null);
        } else if (category.level === 1) {
          setLevel1Id(String(category.id));
          setLevel2Id(null);
          setLevel3Id(null);
        }
      }
    } else {
      setLevel1Id(null);
      setLevel2Id(null);
      setLevel3Id(null);
    }
  }, [selectedId, categories.length]); // Only re-run if selectedId or categories list changes

  // Filter categories by level
  const level1Options = useMemo(() => 
    categories
      .filter(c => c.level === 1)
      .map(c => ({ value: String(c.id), label: c.name })),
    [categories]
  );

  const level2Options = useMemo(() => {
    if (!level1Id) return [];
    return categories
      .filter(c => c.level === 2 && c.parentCategory?.id === Number(level1Id))
      .map(c => ({ value: String(c.id), label: c.name }));
  }, [categories, level1Id]);

  const level3Options = useMemo(() => {
    if (!level2Id) return [];
    return categories
      .filter(c => c.level === 3 && c.parentCategory?.id === Number(level2Id))
      .map(c => ({ value: String(c.id), label: c.name }));
  }, [categories, level2Id]);

  const handleLevel1Change = (val: string | null) => {
    setLevel1Id(val);
    setLevel2Id(null);
    setLevel3Id(null);
    onChange(val ? Number(val) : null);
  };

  const handleLevel2Change = (val: string | null) => {
    setLevel2Id(val);
    setLevel3Id(null);
    onChange(val ? Number(val) : (level1Id ? Number(level1Id) : null));
  };

  const handleLevel3Change = (val: string | null) => {
    setLevel3Id(val);
    onChange(val ? Number(val) : (level2Id ? Number(level2Id) : (level1Id ? Number(level1Id) : null)));
  };

  return (
    <Stack spacing="xs">
      <Text size="sm" weight={500}>{label}</Text>
      
      <SimpleGrid cols={2} spacing="sm" breakpoints={[{ maxWidth: 'xs', cols: 1 }]}>
        <Select
          label="Cấp 1"
          placeholder="Chọn cấp 1"
          data={level1Options}
          value={level1Id}
          icon={<Folders size={14} />}
          onChange={handleLevel1Change}
          searchable
          clearable
        />
        <Select
          label="Cấp 2"
          placeholder="Chọn cấp 2"
          data={level2Options}
          value={level2Id}
          icon={<Folder size={14} />}
          onChange={handleLevel2Change}
          disabled={!level1Id || level2Options.length === 0}
          searchable
          clearable
        />
        <Select
          label="Cấp 3"
          placeholder="Chọn cấp 3"
          data={level3Options}
          value={level3Id}
          icon={<Box size={14} />}
          onChange={handleLevel3Change}
          disabled={!level2Id || level3Options.length === 0}
          searchable
          clearable
        />
        <div className="flex items-end pb-0.5">
          {selectedId ? (
            <div className="flex items-center gap-2 h-9 px-3 rounded bg-blue-50 border border-blue-200 w-full">
              <Box size={14} className="text-blue-600" />
              <Text size="xs" color="blue" weight={500} lineClamp={1}>
                Đã chọn ID: {selectedId}
              </Text>
            </div>
          ) : (
            <div className="flex items-center h-9 px-3 rounded bg-gray-50 border border-dashed border-gray-300 w-full">
              <Text size="xs" color="dimmed">Chưa chọn thể loại</Text>
            </div>
          )}
        </div>
      </SimpleGrid>
      <Divider mt="xs" />
    </Stack>
  );
};

export default CategoryCascadingSelector;
