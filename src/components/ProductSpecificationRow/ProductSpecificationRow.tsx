import { AB, DragDrop, Keyboard, PlaystationX } from 'tabler-icons-react';
import React from 'react';
import { CollectionWrapper, SelectOption } from 'types';
import { SpecificationItem } from 'models/Product';
import produce from 'immer';

interface ProductSpecificationRowProps {
  specification: SpecificationItem;
  index: number;
  specifications: CollectionWrapper<SpecificationItem>;
  setSpecifications: (specifications: CollectionWrapper<SpecificationItem> | null) => void;
  specificationSelectList: SelectOption[];
  setSpecificationSelectList: React.Dispatch<React.SetStateAction<SelectOption[]>>;
}

function ProductSpecificationRow({
  specification,
  index,
  specifications,
  setSpecifications,
  specificationSelectList,
  setSpecificationSelectList,
}: ProductSpecificationRowProps) {
  const isDisabledProductSpecificationValueInput = specification.id === 0;

  const handleProductSpecificationSelect = (specificationInfos: string | null, specificationIndex: number) => {
    const specification: SpecificationItem = { id: 0, name: '', code: '', value: '' };

    if (specificationInfos) {
      const parsedSpecificationInfos = JSON.parse(specificationInfos);
      specification.id = parsedSpecificationInfos.id;
      specification.name = parsedSpecificationInfos.name;
      specification.code = parsedSpecificationInfos.code;
    }

    const currentSpecifications = new CollectionWrapper(specifications.content
      .map((item, index) => (index === specificationIndex) ? specification : item));
    setSpecifications(currentSpecifications);

    const currentSpecificationsIds = currentSpecifications.content.map(item => item.id);

    setSpecificationSelectList(specificationSelectList.map((option) => {
      if (option.disabled === true && !currentSpecificationsIds.includes(JSON.parse(option.value).id)) {
        return { value: option.value, label: option.label };
      }
      if (option.value === specificationInfos) {
        return { ...option, disabled: true };
      }
      return option;
    }));
  };

  const handleProductSpecificationValueInput = (specificationValue: string, specificationIndex: number) => {
    const currentSpecifications = new CollectionWrapper(produce(specifications.content, draft => {
      draft[specificationIndex].value = specificationValue;
    }));
    setSpecifications(currentSpecifications);
  };

  const handleDeleteProductSpecificationButton = (specificationIndex: number) => {
    const currentSpecifications = new CollectionWrapper(specifications.content
      .filter((_, index) => index !== specificationIndex));
    setSpecifications(currentSpecifications.totalElements !== 0 ? currentSpecifications : null);

    setSpecificationSelectList(specificationSelectList.map((option) => {
      if (option.disabled === true && JSON.parse(option.value).id === specifications.content[specificationIndex].id) {
        return { value: option.value, label: option.label };
      }
      return option;
    }));
  };

  return (
    <div className="flex items-center gap-2 flex-nowrap justify-between">
      <button
        type="button"
        title="Di chuyển thông số sản phẩm"
        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
      >
        <DragDrop size={18} />
      </button>
      <select
        value={JSON.stringify({ id: specification.id, name: specification.name, code: specification.code })}
        onChange={(e) => handleProductSpecificationSelect(e.target.value || null, index)}
        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Chọn thông số</option>
        {specificationSelectList.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="flex-1 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Keyboard size={14} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Nhập giá trị"
          value={specification.value}
          onChange={(e) => handleProductSpecificationValueInput(e.target.value, index)}
          disabled={isDisabledProductSpecificationValueInput}
          className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <button
        type="button"
        onClick={() => handleDeleteProductSpecificationButton(index)}
        title="Xóa thông số"
        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
      >
        <PlaystationX size={18} />
      </button>
    </div>
  );
}

export default ProductSpecificationRow;
