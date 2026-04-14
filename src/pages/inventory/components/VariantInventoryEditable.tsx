import React, { useEffect, useState, useMemo } from 'react';
import { VariantInventoryDto, InventoryUpdateDto } from 'models/InventoryHierarchy';
import { useMutation } from 'react-query';
import FetchUtils from 'utils/FetchUtils';
import ResourceURL from 'constants/ResourceURL';
import NotifyUtils from 'utils/NotifyUtils';
import { Loader, TextInput, NumberInput, Group, Text, Badge, Tooltip, Stack, Center } from '@mantine/core';
import { useDebouncedValue } from 'hooks/use-debounced-value';
import { ChartLine, Hash } from 'tabler-icons-react';

interface Props {
  variant: VariantInventoryDto;
  productId: number;
  warehouseId: number;
  storageLocationId: number;
  aisle: string;
  shelf: string;
  bin: string;
}

const VariantInventoryEditable: React.FC<Props> = ({
  variant,
  warehouseId,
  storageLocationId,
  aisle,
  shelf,
  bin,
}) => {
  const [quantity, setQuantity] = useState(variant.quantityInLocation || 0);
  const [isSaving, setIsSaving] = useState(false);

  // Memoize data for Auto-save (v2 API)
  const currentData = useMemo((): InventoryUpdateDto => ({
    warehouseId,
    variantId: variant.variantId,
    storageLocationId,
    newQuantity: quantity,
  }), [warehouseId, variant.variantId, storageLocationId, quantity]);

  const debouncedData = useDebouncedValue(currentData, 1200);

  const mutation = useMutation(
    (data: InventoryUpdateDto) => FetchUtils.postWithToken<InventoryUpdateDto, any>(ResourceURL.PRODUCT_INVENTORY_AUTO_SAVE, data),
    {
      onSuccess: () => {
        setIsSaving(false);
      },
      onError: (error: any) => {
        setIsSaving(false);
        NotifyUtils.simpleFailed(`Lỗi khi cập nhật SKU: ${variant.sku}. ${error.message || ''}`);
      }
    }
  );

  useEffect(() => {
    // Only trigger mutation if the quantity has actually changed from the initial location value
    const hasChanged = debouncedData.newQuantity !== variant.quantityInLocation;

    if (hasChanged) {
      setIsSaving(true);
      mutation.mutate(debouncedData);
    }
  }, [debouncedData, variant.quantityInLocation]);

  // Safe JSON Parsing for properties - Fixes "Cannot convert undefined or null to object"
  const properties = useMemo(() => {
    if (!variant.properties) return {};
    try {
      const parsed = JSON.parse(variant.properties);
      return (parsed && typeof parsed === 'object') ? parsed : {};
    } catch (e) {
      return {};
    }
  }, [variant.properties]);

  const propertyString = useMemo(() => 
    Object.entries(properties)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', '), 
  [properties]);

  return (
    <tr className="group hover:bg-white dark:hover:bg-gray-800 transition-colors">
      <td className="px-6 py-4">
        <Stack spacing={2}>
           <Text size="xs" font-family="mono" weight={800} color="blue" className="tracking-widest">{variant.sku}</Text>
           <Text size="xs" color="dimmed" weight={500}>{propertyString || 'Mặc định'}</Text>
        </Stack>
      </td>
      <td className="px-4 py-4">
        <Group spacing={4} noWrap>
           <Badge variant="outline" color="gray" size="xs" radius="sm" styles={{ inner: { fontWeight: 800 } }}>{aisle || '—'}</Badge>
           <Text size="xs" color="dimmed">-</Text>
           <Badge variant="outline" color="gray" size="xs" radius="sm" styles={{ inner: { fontWeight: 800 } }}>{shelf || '—'}</Badge>
           <Text size="xs" color="dimmed">-</Text>
           <Badge variant="outline" color="gray" size="xs" radius="sm" styles={{ inner: { fontWeight: 800 } }}>{bin || '—'}</Badge>
        </Group>
      </td>
      <td className="px-4 py-4">
         <Center>
           <NumberInput 
             size="xs" 
             value={quantity} 
             onChange={(val) => setQuantity(val || 0)} 
             className="w-24" 
             radius="md"
             min={0}
             styles={{ input: { fontWeight: 900, textAlign: 'center', backgroundColor: '#fdfdfd' } }}
           />
         </Center>
      </td>
      <td className="px-4 py-4">
        <Center>
          <Tooltip label="Tổng tồn kho toàn hệ thống" position="top" withArrow radius="md">
            <Badge 
               variant="light" 
               color="gray" 
               radius="lg" 
               size="lg" 
               leftSection={<ChartLine size={12} strokeWidth={3} />}
               styles={{ root: { backgroundColor: '#f0f0f0' }, inner: { fontWeight: 900, color: '#444' } }}
            >
              {variant.totalVariantQuantity}
            </Badge>
          </Tooltip>
        </Center>
      </td>
      <td className="px-2 py-4 text-center w-12 h-10">
        <Center>
          {isSaving ? <Loader size="xs" color="blue" /> : <Hash size={16} className="text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity" />}
        </Center>
      </td>
    </tr>
  );
};

export default VariantInventoryEditable;
