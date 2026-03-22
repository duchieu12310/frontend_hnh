import React from 'react';
import { VariantResponse } from 'models/Variant';
import { PurchaseOrderVariantRequest } from 'models/PurchaseOrderVariant';
import MiscUtils from 'utils/MiscUtils';
import { Trash } from 'tabler-icons-react';
import { DocketVariantRequest } from 'models/DocketVariant';
import { OrderVariantRequest } from 'models/OrderVariant';
import { CountVariantRequest } from 'models/CountVariant';

export enum EntityType {
  PURCHASE_ORDER,
  DOCKET,
  TRANSFER,
  ORDER,
  COUNT,
}

interface VariantTableProps {
  type: EntityType;
  variants: VariantResponse[];
  variantRequests: Array<PurchaseOrderVariantRequest | DocketVariantRequest | OrderVariantRequest | CountVariantRequest>;
  handleDeleteVariantButton: (index: number) => void;
  handleQuantityInput?: (quantity: number, index: number) => void;
  handleActualInventoryInput?: (actualInventory: number, index: number) => void;
}

function VariantTable({
  type,
  variants,
  variantRequests,
  handleDeleteVariantButton,
  handleQuantityInput,
  handleActualInventoryInput,
}: VariantTableProps) {
  const deltaVariantInventoryFragment = (delta: number) => {
    const result = MiscUtils.formatterPrice(String(Math.abs(delta)));
    if (delta > 0) {
      return <span className="text-green-600 dark:text-green-400">+{result}</span>;
    } else if (delta < 0) {
      return <span className="text-red-600 dark:text-red-400">-{result}</span>;
    }
    return <span className="text-blue-600 dark:text-blue-400">{result}</span>;
  };

  return (
    <div className="rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">STT</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Mặt hàng</th>
            {type === EntityType.PURCHASE_ORDER && <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Giá vốn</th>}
            {type === EntityType.ORDER && <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Giá bán</th>}
            {type !== EntityType.COUNT && <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Số lượng</th>}
            {type === EntityType.COUNT && <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tồn kho</th>}
            {type === EntityType.COUNT && <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Kiểm thực tế</th>}
            {type === EntityType.COUNT && <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Chênh lệch</th>}
            {[EntityType.PURCHASE_ORDER, EntityType.ORDER].includes(type) &&
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Thành tiền</th>}
            <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Thao tác</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {variants.map((variant, index) => (
            <tr key={variant.id} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="px-3 py-2 text-center text-sm text-gray-700 dark:text-gray-300">{index + 1}</td>
              <td className="px-3 py-2">
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {variant.product.name}
                  </p>
                  <div className="flex items-center gap-1 flex-wrap">
                    {variant.properties && variant.properties.content.map(property => (
                      <React.Fragment key={property.code}>
                        <span className="text-xs text-blue-600 dark:text-blue-400" title={property.name}>
                          {property.value}
                        </span>
                        <span className="text-xs text-gray-400">⋅</span>
                      </React.Fragment>
                    ))}
                    <span className="text-xs text-gray-400">
                      SKU: {variant.sku}
                    </span>
                  </div>
                </div>
              </td>
              {type === EntityType.PURCHASE_ORDER && (
                <td className="px-3 py-2 text-right text-sm text-gray-700 dark:text-gray-300">
                  {MiscUtils.formatPrice(variant.cost) + ' ₫'}
                </td>
              )}
              {type === EntityType.ORDER && (
                <td className="px-3 py-2 text-right text-sm text-gray-700 dark:text-gray-300">
                  {MiscUtils.formatPrice(variant.price) + ' ₫'}
                </td>
              )}
              {type !== EntityType.COUNT && handleQuantityInput && (
                <td className="px-3 py-2">
                  <div className="flex items-center justify-center">
                    <input
                      type="number"
                      placeholder="--"
                      value={(variantRequests[index] as PurchaseOrderVariantRequest | DocketVariantRequest | OrderVariantRequest).quantity || ''}
                      onChange={(e) => handleQuantityInput(Number(e.target.value) || 1, index)}
                      min={1}
                      max={1_000_000}
                      className="w-24 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </td>
              )}
              {type === EntityType.COUNT && handleActualInventoryInput && (
                <>
                  <td className="px-3 py-2 text-center text-sm text-gray-700 dark:text-gray-300">
                    {(variantRequests[index] as CountVariantRequest).inventory}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-center">
                      <input
                        type="number"
                        placeholder="--"
                        value={(variantRequests[index] as CountVariantRequest).actualInventory || ''}
                        onChange={(e) => handleActualInventoryInput(Number(e.target.value) || 0, index)}
                        min={0}
                        max={1_000_000}
                        className="w-24 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </td>
                  <td className="px-3 py-2 text-center text-sm">
                    {deltaVariantInventoryFragment((variantRequests[index] as CountVariantRequest).actualInventory
                      - (variantRequests[index] as CountVariantRequest).inventory)}
                  </td>
                </>
              )}
              {[EntityType.PURCHASE_ORDER, EntityType.ORDER].includes(type) && (
                <td className="px-3 py-2 text-right text-sm text-gray-700 dark:text-gray-300">
                  {MiscUtils.formatPrice(
                    (variantRequests[index] as PurchaseOrderVariantRequest | OrderVariantRequest).amount) + ' ₫'}
                </td>
              )}
              <td className="px-3 py-2">
                <div className="flex items-center justify-center">
                  <button
                    onClick={() => handleDeleteVariantButton(index)}
                    title="Xóa mặt hàng này"
                    className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                  >
                    <Trash size={16}/>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default VariantTable;
