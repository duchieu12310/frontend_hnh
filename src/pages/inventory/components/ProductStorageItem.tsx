import React, { useState } from 'react';
import { ProductStorageNode } from 'models/InventoryHierarchy';
import VariantInventoryEditable from './VariantInventoryEditable';
import { ChevronDown, ChevronRight, Package, MapPin, ListSearch } from 'tabler-icons-react';
import { Group, Text, Box, Badge, ActionIcon, Collapse, Paper, Stack } from '@mantine/core';

interface Props {
  product: ProductStorageNode;
  warehouseId: number;
}

const ProductStorageItem: React.FC<Props> = ({ product, warehouseId }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Paper 
      radius="xl" 
      withBorder 
      className="shadow-md border-gray-100 dark:border-gray-800 transition-all hover:shadow-lg bg-white/50 dark:bg-gray-800/50"
    >
      <div 
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Group spacing="md">
          <Box className="p-3 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-2xl shadow-sm">
            <Package size={22} strokeWidth={2.5} />
          </Box>
          <Stack spacing={0}>
            <Text size="sm" weight={800} color="blue" transform="uppercase" sx={{ letterSpacing: '0.05em' }}>Sản phẩm</Text>
            <Text weight={700} size="md" className="text-gray-900 dark:text-gray-100">{product.productName}</Text>
            <Text size="xs" color="dimmed" font-family="mono" weight={600} className="tracking-wider">{product.productCode}</Text>
          </Stack>
        </Group>
        
        <div className="flex items-center gap-6">
          {/* Location Badges on the right */}
          <Group spacing="xs" className="hidden sm:flex">
             <div className="flex flex-col items-center px-4 py-1.5 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-100 dark:border-amber-800">
               <Text size="xs" weight={900} transform="uppercase" color="amber" sx={{ opacity: 0.6 }}>Dãy (Aisle)</Text>
               <Text size="sm" weight={800} color="amber">{product.aisle || '—'}</Text>
             </div>
             <div className="flex flex-col items-center px-4 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800">
               <Text size="xs" weight={900} transform="uppercase" color="emerald" sx={{ opacity: 0.6 }}>Kệ (Shelf)</Text>
               <Text size="sm" weight={800} color="emerald">{product.shelf || '—'}</Text>
             </div>
             <div className="flex flex-col items-center px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800">
               <Text size="xs" weight={900} transform="uppercase" color="indigo" sx={{ opacity: 0.6 }}>Ô (Bin)</Text>
               <Text size="sm" weight={800} color="indigo">{product.bin || '—'}</Text>
             </div>
          </Group>

          <Badge variant="light" color="gray" size="sm" radius="md">
            {product.variants.length} SKU
          </Badge>

          <ActionIcon color="blue" variant="transparent" radius="xl" size="lg">
            {isExpanded ? <ChevronDown size={22} strokeWidth={2.5} /> : <ChevronRight size={22} strokeWidth={2.5} />}
          </ActionIcon>
        </div>
      </div>

      <Collapse in={isExpanded}>
        <div className="px-4 pb-4">
          <div className="bg-gray-50/50 dark:bg-gray-900/30 rounded-[28px] border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="p-4 bg-gray-50/80 dark:bg-gray-800/80 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
               <ListSearch size={18} className="text-gray-400" strokeWidth={2.5} />
               <Text size="xs" weight={800} color="dimmed" transform="uppercase" sx={{ letterSpacing: '0.05em' }}>Chi tiết biến thể tại vị trí này</Text>
            </div>
            
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/40 dark:bg-gray-800/40">
                  <th className="px-6 py-3 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800">SKU / Phân loại</th>
                  <th className="px-4 py-3 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800">Vị trí (A-S-B)</th>
                  <th className="px-4 py-3 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800 text-center">Tồn tại ô</th>
                  <th className="px-4 py-3 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800 text-center">Tổng tồn</th>
                  <th className="px-2 py-3 border-b border-gray-100 dark:border-gray-800 w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {product.variants.map((variant) => (
                  <VariantInventoryEditable 
                    key={`${product.productId}-${product.storageLocationId}-${variant.variantId}`} 
                    variant={variant} 
                    productId={product.productId}
                    warehouseId={warehouseId}
                    storageLocationId={product.storageLocationId}
                    aisle={product.aisle}
                    shelf={product.shelf}
                    bin={product.bin}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Collapse>
    </Paper>
  );
};

export default ProductStorageItem;
