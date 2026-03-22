import React, { useState } from 'react';
import { ProductPropertyItem, ProductResponse_VariantResponse } from 'models/Product';
import { CollectionWrapper } from 'types';
import MiscUtils from 'utils/MiscUtils';
import { Popover } from '@headlessui/react';

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
    if (status === 1) {
      return <span className="px-2 py-1 text-xs font-medium border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300">Có hiệu lực</span>;
    }

    return <span className="px-2 py-1 text-xs font-medium border border-red-300 dark:border-red-600 rounded text-red-700 dark:text-red-400">Vô hiệu lực</span>;
  };

  if (!variants || variants.length === 0) {
    return <em className="text-gray-400">không có</em>;
  }

  return (
    <Popover className="relative">
      <Popover.Button
        onClick={() => setOpened(!opened)}
        className="px-3 py-1 text-xs font-medium text-white bg-teal-600 hover:bg-teal-700 rounded transition-colors"
      >
        {variants.length + ' phiên bản'}
      </Popover.Button>

      <Popover.Panel className="absolute z-10 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Thông tin phiên bản</h3>
          <button
            onClick={() => setOpened(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            title="Đóng hộp thông tin phiên bản"
          >
            ×
          </button>
        </div>
        <div className="rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">#</th>
                {productProperties?.content?.map((property, index) => (
                  <th key={index} className="px-3 py-2 text-left text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    {property.name}
                  </th>
                ))}
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">SKU</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Giá vốn</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Giá bán</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {variants?.map((variant, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">{index + 1}</td>
                  {variant.properties?.content?.map((property, index) => (
                    <td key={index} className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">{property.value}</td>
                  ))}
                  <td className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">{variant.sku}</td>
                  <td className="px-3 py-2 text-sm text-right text-gray-700 dark:text-gray-300">{MiscUtils.formatPrice(variant.cost) + ' ₫'}</td>
                  <td className="px-3 py-2 text-sm text-right text-gray-700 dark:text-gray-300">{MiscUtils.formatPrice(variant.price) + ' ₫'}</td>
                  <td className="px-3 py-2 text-sm">{variantStatusBadgeFragment(variant.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Popover.Panel>
    </Popover>
  );
}

export default VariantTablePopover;
