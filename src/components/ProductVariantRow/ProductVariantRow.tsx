import React from 'react';
import { VariantRequest } from 'models/Variant';
import produce from 'immer';
import { CollectionWrapper } from 'types';
import { ProductPropertyItem } from 'models/Product';

interface ProductVariantRowProps {
  variant: VariantRequest;
  index: number;
  variants: VariantRequest[];
  setVariants: (variants: VariantRequest[]) => void;
  selectedVariantIndexes: number[];
  setSelectedVariantIndexes: React.Dispatch<React.SetStateAction<number[]>>;
  isNewable?: boolean; // For ProductUpdate
  productProperties?: CollectionWrapper<ProductPropertyItem> | null;
}

function ProductVariantRow({
  variant,
  index,
  variants,
  setVariants,
  selectedVariantIndexes,
  setSelectedVariantIndexes,
  isNewable,
  productProperties,
}: ProductVariantRowProps) {

  const handleVariantCheckbox = (index: number) => {
    setSelectedVariantIndexes(indexes => indexes.includes(index) ? indexes.filter(i => i !== index) : [...indexes, index]);
  };

  const handleVariantSkuInput = (sku: string, index: number) => {
    setVariants(produce(variants, draft => {
      draft[index].sku = sku;
    }));
  };

  const handleVariantCostInput = (cost: number, index: number) => {
    setVariants(produce(variants, draft => {
      draft[index].cost = cost;
    }));
  };

  const handleVariantPriceInput = (price: number, index: number) => {
    setVariants(produce(variants, draft => {
      draft[index].price = price;
    }));
  };

  const handleVariantQuantityInput = (quantity: number, index: number) => {
    setVariants(produce(variants, draft => {
      draft[index].quantity = quantity;
    }));
  };

  const isSelected = selectedVariantIndexes.includes(index);
  const isDisabled = !isSelected;

  return (
    <tr className={`border-b border-gray-200 dark:border-gray-700 ${
      isNewable
        ? 'bg-yellow-50 dark:bg-yellow-900/10'
        : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
    }`}>
      <td className="px-3 py-2 whitespace-nowrap">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => handleVariantCheckbox(index)}
          disabled={isSelected && selectedVariantIndexes.length === 1}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
      </td>
      <td className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
        {variant.properties ? variant.properties.content.map(p => p.value).join(' ⋅ ') : <em>mặc định</em>}
      </td>
      <td className="px-3 py-2 min-w-[120px]">
        <input
          type="text"
          placeholder="Nhập SKU"
          value={variant.sku}
          onChange={(e) => handleVariantSkuInput(e.target.value, index)}
          disabled={isDisabled}
          className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </td>
      <td className="px-3 py-2 min-w-[120px]">
        <div className="relative">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">₫</span>
          <input
             type="number"
             placeholder="Nhập giá vốn"
             value={variant.cost || ''}
             onChange={(e) => handleVariantCostInput(Number(e.target.value) || 0, index)}
             disabled={isDisabled}
             min={0}
             step={100}
             className="w-full pl-6 pr-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </td>
      <td className="px-3 py-2 min-w-[120px]">
        <div className="relative">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">₫</span>
          <input
            type="number"
            placeholder="Nhập giá bán"
            value={variant.price || ''}
            onChange={(e) => handleVariantPriceInput(Number(e.target.value) || 0, index)}
            disabled={isDisabled}
            min={0}
            step={100}
            className="w-full pl-6 pr-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </td>
      <td className="px-3 py-2 text-right">
      </td>
    </tr>
  );
}

export default ProductVariantRow;
