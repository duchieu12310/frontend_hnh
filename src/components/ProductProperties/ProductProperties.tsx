import React from 'react';
import { CollectionWrapper, SelectOption } from 'types';
import { ProductPropertyItem } from 'models/Product';
import { ProductPropertyRow } from 'components';

interface ProductPropertiesProps {
  productProperties: CollectionWrapper<ProductPropertyItem> | null;
  setProductProperties: (productProperties: CollectionWrapper<ProductPropertyItem> | null) => void;
  productPropertySelectList: SelectOption[];
  setProductPropertySelectList: React.Dispatch<React.SetStateAction<SelectOption[]>>;
}

function ProductProperties({
  productProperties,
  setProductProperties,
  productPropertySelectList,
  setProductPropertySelectList,
}: ProductPropertiesProps) {
  const isDisabledCreateProductPropertyButton = productProperties?.content.length === productPropertySelectList.length;

  const handleCreateProductPropertyButton = () => {
    let currentProductPropertyItems: ProductPropertyItem[] = [];

    if (productProperties && productProperties.content.length < productPropertySelectList.length) {
      currentProductPropertyItems = [...productProperties.content];
    }

    currentProductPropertyItems.push({ id: 0, name: '', code: '', value: [] });
    setProductProperties(new CollectionWrapper(currentProductPropertyItems));
  };

  const productPropertiesFragment = productProperties?.content.map((productProperty, index) => (
    <ProductPropertyRow
      key={index}
      productProperty={productProperty}
      index={index}
      productProperties={productProperties}
      setProductProperties={setProductProperties}
      productPropertySelectList={productPropertySelectList}
      setProductPropertySelectList={setProductPropertySelectList}
    />
  ));

  return (
    <div className="flex flex-col gap-3">
      {productPropertiesFragment}
      <button
        type="button"
        onClick={handleCreateProductPropertyButton}
        disabled={isDisabledCreateProductPropertyButton}
        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Thêm thuộc tính sản phẩm
      </button>
    </div>
  );
}

export default ProductProperties;
