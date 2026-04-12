import React, { useEffect, useState, useMemo } from 'react';
import { FlattenedInventoryRow, InventoryUpdateDto } from 'models/InventoryHierarchy';
import { useMutation, useQueryClient } from 'react-query';
import FetchUtils from 'utils/FetchUtils';
import ResourceURL from 'constants/ResourceURL';
import NotifyUtils from 'utils/NotifyUtils';
import { Loader, NumberInput, Group, Text, Badge, Tooltip, Stack, Center, ActionIcon } from '@mantine/core';
import { useDebouncedValue } from 'hooks/use-debounced-value';
import { ChartLine, Hash, Minus, Plus } from 'tabler-icons-react';
import InventoryConfigs from '../InventoryConfigs';

interface Props {
  row: FlattenedInventoryRow;
  warehouseId: number;
  isFirstL1?: boolean;
  isFirstL2?: boolean;
  isFirstL3?: boolean;
  isFirstProduct?: boolean;
}

const InventoryTableRow: React.FC<Props> = ({
  row,
  warehouseId,
  isFirstL1 = true,
  isFirstL2 = true,
  isFirstL3 = true,
  isFirstProduct = true,
}) => {
  const queryClient = useQueryClient();
  const [adjustment, setAdjustment] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  // Optimistic derived values - CLAMPED TO 0
  const displayedQuantity = Math.max(0, row.quantityInLocation + adjustment);
  const displayedTotal = Math.max(0, row.totalVariantQuantity + adjustment);
  
  // Status colors
  const statusColor = adjustment > 0 ? 'teal' : adjustment < 0 ? 'red' : 'blue';

  const mutation = useMutation(
    (data: InventoryUpdateDto) => FetchUtils.post<InventoryUpdateDto, any>(ResourceURL.PRODUCT_INVENTORY_AUTO_SAVE, data),
    {
      onSuccess: () => {
        setIsSaving(false);
        setAdjustment(0); // AUTO RESET TO 0
        queryClient.invalidateQueries(InventoryConfigs.productInventoryHierarchyResourceKey);
      },
      onError: (error: any) => {
        setIsSaving(false);
        NotifyUtils.simpleFailed(`Lỗi khi cập nhật SKU: ${row.sku}. ${error.message || ''}`);
      }
    }
  );

  const debouncedAdjustment = useDebouncedValue(adjustment, 1200);

  useEffect(() => {
    if (debouncedAdjustment !== 0) {
      const finalNewQuantity = Math.max(0, row.quantityInLocation + debouncedAdjustment);
      setIsSaving(true);
      mutation.mutate({
        warehouseId,
        variantId: row.variantId,
        storageLocationId: row.storageLocationId,
        newQuantity: finalNewQuantity
      });
    }
  }, [debouncedAdjustment]);

  // Handle properties robustly
  const propertyString = useMemo(() => {
    if (!row.properties) return 'Mặc định';
    try {
      const parsed = JSON.parse(row.properties);
      if (parsed && typeof parsed === 'object') {
        return Object.entries(parsed)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ');
      }
      return 'Mặc định';
    } catch (e) {
      return 'Mặc định';
    }
  }, [row.properties]);

  return (
    <tr className="hover:bg-gray-50/80 transition-colors group">
      <td className="px-4 py-2.5 border-b border-r border-gray-100 dark:border-gray-800">
        {isFirstL1 && <Text sx={{ fontSize: 12 }} weight={700} color="dimmed" className="uppercase tracking-tight">{row.l1Name}</Text>}
      </td>
      <td className="px-4 py-2.5 border-b border-r border-gray-100 dark:border-gray-800">
        {isFirstL2 && <Text sx={{ fontSize: 12 }} weight={600} color="dimmed">{row.l2Name}</Text>}
      </td>
      <td className="px-4 py-2.5 border-b border-r border-gray-100 dark:border-gray-800">
        {isFirstL3 && <Text sx={{ fontSize: 12 }} weight={500} color="dimmed">{row.l3Name}</Text>}
      </td>
      <td className="px-4 py-2.5 border-b border-r border-gray-100 dark:border-gray-800">
        {isFirstProduct && (
          <Tooltip label={`Mã SP: ${row.productCode}`} position="top" withArrow radius="md">
            <Text sx={{ fontSize: 13 }} weight={700} className="text-gray-900 dark:text-gray-100 leading-tight">
              {row.productName}
            </Text>
          </Tooltip>
        )}
      </td>
      <td className="px-4 py-2.5 border-b border-r border-gray-100 dark:border-gray-800">
        <Stack spacing={0}>
          <Text sx={{ fontSize: 11 }} weight={800} color="blue" className="tracking-wider uppercase">{row.sku}</Text>
          <Text sx={{ fontSize: 11 }} color="dimmed" weight={500}>{propertyString}</Text>
        </Stack>
      </td>
      
      {/* COLUMN 1: ORIGINAL STOCK (PAST) */}
      <td className="px-4 py-2.5 border-b border-r border-gray-100 dark:border-gray-800 bg-gray-50/30">
         <Center>
            <Text sx={{ fontSize: 13 }} weight={800} color="dimmed">
                {row.quantityInLocation}
            </Text>
         </Center>
      </td>

      {/* COLUMN 2: ADJUSTMENT (+/-) - REFINED CONTROL */}
      <td className="px-4 py-2.5 border-b border-r border-gray-100 dark:border-gray-800">
         <Center>
            <Group spacing={0} className="bg-gray-100/50 p-0.5 rounded-lg border border-gray-200/50" noWrap>
                <ActionIcon 
                    size="sm" 
                    variant="transparent" 
                    onClick={() => setAdjustment(prev => prev - 1)}
                    className="hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                    <Minus size={14} strokeWidth={3} />
                </ActionIcon>
                
                <NumberInput 
                    size="xs" 
                    variant="unstyled"
                    placeholder="0"
                    value={adjustment === 0 ? undefined : adjustment} 
                    onChange={(val) => setAdjustment(val || 0)} 
                    className="w-14"
                    styles={{ 
                        input: { 
                            fontWeight: 900, 
                            textAlign: 'center', 
                            fontSize: '13px',
                            minHeight: '28px'
                        } 
                    }}
                />

                <ActionIcon 
                    size="sm" 
                    variant="transparent" 
                    onClick={() => setAdjustment(prev => prev + 1)}
                    className="hover:bg-teal-50 hover:text-teal-600 transition-colors"
                >
                    <Plus size={14} strokeWidth={3} />
                </ActionIcon>
            </Group>
         </Center>
      </td>

      {/* COLUMN 3: CURRENT TOTAL (NEW) - SOLID BADGE */}
      <td className="px-4 py-2.5 border-b border-r border-gray-100 dark:border-gray-800">
        <Center>
          <Tooltip label="Lượng tồn kho sau điều chỉnh" position="top" withArrow radius="md">
            <Badge 
               variant="filled" 
               color="blue.7"
               radius="md" 
               size="lg" 
               className="shadow-sm"
               sx={{ 
                 fontWeight: 900,
                 fontSize: '13px',
                 height: 28,
                 minWidth: 46,
                 transition: 'all 0.2s',
                 backgroundColor: adjustment !== 0 ? (adjustment > 0 ? '#0d9488' : '#e11d48') : '#1d4ed8',
                 transform: adjustment !== 0 ? 'scale(1.05)' : 'scale(1)',
               }}
            >
              {displayedQuantity}
            </Badge>
          </Tooltip>
        </Center>
      </td>

      {/* COLUMN 4: GLOBAL SYSTEM TOTAL */}
      <td className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-800 text-center">
        <Center>
            <Group spacing={4}>
                <ChartLine size={13} className="text-gray-300" strokeWidth={3} />
                <Text sx={{ fontSize: 13 }} weight={800} color="gray.6">
                    {displayedTotal}
                </Text>
            </Group>
        </Center>
      </td>

      <td className="px-2 py-2.5 border-b border-gray-100 dark:border-gray-800 text-center w-12 bg-gray-50/20">
        <Center>
          {isSaving ? <Loader size="xs" color="blue" /> : <Hash size={14} className="text-gray-200" />}
        </Center>
      </td>
    </tr>
  );
};

export default InventoryTableRow;
