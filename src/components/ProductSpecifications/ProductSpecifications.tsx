import React from 'react';
import { CollectionWrapper, SelectOption } from 'types';
import { SpecificationItem } from 'models/Product';
import { ProductSpecificationRow } from 'components';

interface ProductSpecificationsProps {
  specifications: CollectionWrapper<SpecificationItem> | null;
  setSpecifications: (specifications: CollectionWrapper<SpecificationItem> | null) => void;
  specificationSelectList: SelectOption[];
  setSpecificationSelectList: React.Dispatch<React.SetStateAction<SelectOption[]>>;
}

function ProductSpecifications({
  specifications,
  setSpecifications,
  specificationSelectList,
  setSpecificationSelectList,
}: ProductSpecificationsProps) {
  const isDisabledCreateProductSpecificationButton = specifications?.content.length === specificationSelectList.length;

  const handleCreateProductSpecificationButton = () => {
    let currentSpecificationItems: SpecificationItem[] = [];

    if (specifications && specifications.content.length < specificationSelectList.length) {
      currentSpecificationItems = [...specifications.content];
    }

    currentSpecificationItems.push({ id: 0, name: '', code: '', value: '' });
    setSpecifications(new CollectionWrapper(currentSpecificationItems));
  };

  const productSpecificationsFragment = specifications?.content.map((specification, index) => (
    <ProductSpecificationRow
      key={index}
      specification={specification}
      index={index}
      specifications={specifications}
      setSpecifications={setSpecifications}
      specificationSelectList={specificationSelectList}
      setSpecificationSelectList={setSpecificationSelectList}
    />
  ));

  return (
    <div className="flex flex-col gap-3">
      {productSpecificationsFragment}
      <button
        type="button"
        onClick={handleCreateProductSpecificationButton}
        disabled={isDisabledCreateProductSpecificationButton}
        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Thêm thông số sản phẩm
      </button>
    </div>
  );
}

export default ProductSpecifications;
