import React, { useEffect } from 'react';
import { VariantRequest } from 'models/Variant';
import { CollectionWrapper } from 'types';
import { ProductPropertyItem } from 'models/Product';
import MiscUtils from 'utils/MiscUtils';
import { ProductVariantRow } from 'components';

interface ProductVariantsProps {
  variants: VariantRequest[];
  setVariants: (variants: VariantRequest[]) => void;
  productProperties: CollectionWrapper<ProductPropertyItem> | null;
  setProductProperties: (productProperties: CollectionWrapper<ProductPropertyItem> | null) => void;
  selectedVariantIndexes: number[];
  setSelectedVariantIndexes: React.Dispatch<React.SetStateAction<number[]>>;
}

function ProductVariants({
  variants,
  setVariants,
  productProperties,
  setProductProperties,
  selectedVariantIndexes,
  setSelectedVariantIndexes,
}: ProductVariantsProps) {

  useEffect(() => {
    if (variants.length === 0) {
      const defaultVariant: VariantRequest = { sku: '', cost: 0, price: 0, quantity: 0, properties: null, status: 1 };
      setVariants([defaultVariant]);
      setSelectedVariantIndexes([0]);
    }
  }, []);

  const handleAddVariant = () => {
    const defaultVariant: VariantRequest = { sku: '', cost: 0, price: 0, quantity: 0, properties: null, status: 1 };
    setVariants([...variants, defaultVariant]);
    setSelectedVariantIndexes([...selectedVariantIndexes, variants.length]);
  };

  return (
    <div className="rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">#</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Phiên bản</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">SKU</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Giá vốn</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Giá bán</th>
            <th className="px-3 py-2"></th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {variants.map((variant, index) => (
            <ProductVariantRow
              key={index}
              variant={variant}
              index={index}
              variants={variants}
              setVariants={setVariants}
              selectedVariantIndexes={selectedVariantIndexes}
              setSelectedVariantIndexes={setSelectedVariantIndexes}
              productProperties={productProperties}
            />
          ))}
        </tbody>
      </table>
      <div className="p-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={handleAddVariant}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          + Thêm phiên bản
        </button>
      </div>
    </div>
  );
}

export default ProductVariants;
