import React, { useState } from 'react';
import { Popover, Text, Group, Stack } from '@mantine/core';
import { ProductPropertyItem, ProductResponse_VariantResponse } from 'models/Product';
import { CollectionWrapper } from 'types';
import MiscUtils from 'utils/MiscUtils';

interface VariantTablePopoverProps {
  variants: ProductResponse_VariantResponse[],
  productProperties: CollectionWrapper<ProductPropertyItem> | null,
}

function VariantTablePopover({
  variants,
  productProperties,
}: VariantTablePopoverProps) {
  const [opened, setOpened] = useState(false);

  const variantStatusBadgeFragment = (status: number) => {
    const isActive = status === 1;
    return (
      <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
    );
  };

  if (!variants || variants.length === 0) {
    return <em className="text-gray-400 text-xs">không có</em>;
  }

  return (
    <Popover
      opened={opened}
      onClose={() => setOpened(false)}
      position="bottom"
      placement="center"
      withArrow
      shadow="md"
      withinPortal={true}
      width={450}
      target={
        <button
          onClick={() => setOpened((o) => !o)}
          className="text-[13px] font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 border-b border-dashed border-slate-400 hover:border-blue-500 transition-colors bg-transparent border-t-0 border-l-0 border-r-0 pb-0.5 cursor-pointer ml-auto mr-auto block"
        >
          {variants.length + ' phiên bản'}
        </button>
      }
    >
      <Stack spacing="xs">
        <Group position="apart">
          <Text size="sm" weight={700} color="dimmed" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Thông tin chi tiết phiên bản
          </Text>
          <button
            onClick={() => setOpened(false)}
            className="text-gray-400 hover:text-gray-600 border-none bg-transparent cursor-pointer text-lg"
          >
            ×
          </button>
        </Group>

        <div className="rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-3 py-2 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">#</th>
                {productProperties?.content?.map((property, index) => (
                  <th key={index} className="px-3 py-2 text-left text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    {property.name}
                  </th>
                ))}
                <th className="px-3 py-2 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">SKU</th>
                <th className="px-3 py-2 text-right text-[10px] font-bold text-gray-400 uppercase tracking-wider">Giá bán</th>
                <th className="px-3 py-2 text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider">T.Hái</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
              {variants?.map((variant, index) => (
                <tr key={index} className="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors">
                  <td className="px-3 py-2 text-xs text-gray-400">{index + 1}</td>
                  {variant.properties?.content?.map((property, index) => (
                    <td key={index} className="px-3 py-2 text-xs text-gray-700 dark:text-gray-300">{property.value}</td>
                  ))}
                  <td className="px-3 py-2 text-xs font-mono text-gray-500 dark:text-gray-400">{variant.sku}</td>
                  <td className="px-3 py-2 text-xs font-bold text-right text-blue-600 dark:text-blue-400">{MiscUtils.formatPrice(variant.price)}</td>
                  <td className="px-3 py-2 text-center">
                    <div className={`inline-block w-2 h-2 rounded-full ${variant.status === 1 ? 'bg-green-500' : 'bg-gray-300'}`} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Stack>
    </Popover>
  );
}

export default VariantTablePopover;
