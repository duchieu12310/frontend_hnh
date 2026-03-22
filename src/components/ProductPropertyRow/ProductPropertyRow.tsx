import { ProductPropertyItem } from 'models/Product';
import { AB, DragDrop, Keyboard, PlaystationX } from 'tabler-icons-react';
import React, { useState } from 'react';
import { CollectionWrapper, SelectOption } from 'types';
import produce from 'immer';

interface ProductPropertyRowProps {
  productProperty: ProductPropertyItem;
  index: number;
  productProperties: CollectionWrapper<ProductPropertyItem>;
  setProductProperties: (productProperties: CollectionWrapper<ProductPropertyItem> | null) => void;
  productPropertySelectList: SelectOption[];
  setProductPropertySelectList: React.Dispatch<React.SetStateAction<SelectOption[]>>;
}

function ProductPropertyRow({
  productProperty,
  index,
  productProperties,
  setProductProperties,
  productPropertySelectList,
  setProductPropertySelectList,
}: ProductPropertyRowProps) {
  const isDisabledProductPropertyValueInput = productProperty.id === 0;

  const handleProductPropertySelect = (productPropertyInfos: string | null, productPropertyIndex: number) => {
    const productProperty: ProductPropertyItem = { id: 0, name: '', code: '', value: [] };

    if (productPropertyInfos) {
      const parsedProductPropertyInfos = JSON.parse(productPropertyInfos);
      productProperty.id = parsedProductPropertyInfos.id;
      productProperty.name = parsedProductPropertyInfos.name;
      productProperty.code = parsedProductPropertyInfos.code;
    }

    const currentProductProperties = new CollectionWrapper(productProperties.content
      .map((item, index) => (index === productPropertyIndex) ? productProperty : item));
    setProductProperties(currentProductProperties);

    const currentProductPropertiesIds = currentProductProperties.content.map(item => item.id);

    setProductPropertySelectList(productPropertySelectList.map((option) => {
      if (option.disabled === true && !currentProductPropertiesIds.includes(JSON.parse(option.value).id)) {
        return { value: option.value, label: option.label };
      }
      if (option.value === productPropertyInfos) {
        return { ...option, disabled: true };
      }
      return option;
    }));
  };

  const handleCreateProductPropertyValueInput = (productPropertyValue: string, productPropertyIndex: number) => {
    const currentProductProperties = new CollectionWrapper(produce(productProperties.content, draft => {
      draft[productPropertyIndex].value.push(productPropertyValue);
    }));
    setProductProperties(currentProductProperties);
  };

  const handleProductPropertyValueInput = (productPropertyValues: string[], productPropertyIndex: number) => {
    const currentProductProperties = new CollectionWrapper(produce(productProperties.content, draft => {
      draft[productPropertyIndex].value = productPropertyValues;
    }));
    setProductProperties(currentProductProperties);
  };

  const handleDeleteProductPropertyButton = (productPropertyIndex: number) => {
    const currentProductProperties = new CollectionWrapper(productProperties.content
      .filter((_, index) => index !== productPropertyIndex));
    setProductProperties(currentProductProperties.totalElements !== 0 ? currentProductProperties : null);

    setProductPropertySelectList(productPropertySelectList.map((option) => {
      if (option.disabled === true && JSON.parse(option.value).id === productProperties.content[productPropertyIndex].id) {
        return { value: option.value, label: option.label };
      }
      return option;
    }));
  };

  const [inputValue, setInputValue] = useState('');

  React.useEffect(() => {
    // Sync with productProperty.value
  }, [productProperty.value]);

  const handleMultiSelectKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      e.preventDefault();
      handleCreateProductPropertyValueInput(inputValue.trim(), index);
      setInputValue('');
    }
  };

  return (
    <div className="flex items-center gap-2 flex-nowrap justify-between">
      <button
        type="button"
        title="Di chuyển thuộc tính sản phẩm"
        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
      >
        <DragDrop size={18} />
      </button>
      <select
        value={JSON.stringify({ id: productProperty.id, name: productProperty.name, code: productProperty.code })}
        onChange={(e) => handleProductPropertySelect(e.target.value || null, index)}
        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Chọn thuộc tính</option>
        {productPropertySelectList.map((option) => (
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
          placeholder="Nhập giá trị (Enter để thêm)"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleMultiSelectKeyDown}
          disabled={isDisabledProductPropertyValueInput}
          className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {productProperty.value.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {productProperty.value.map((val, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded"
              >
                {val}
                <button
                  type="button"
                  onClick={() => {
                    const newValues = productProperty.value.filter((_, i) => i !== idx);
                    handleProductPropertyValueInput(newValues, index);
                  }}
                  className="hover:text-blue-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={() => handleDeleteProductPropertyButton(index)}
        title="Xóa thuộc tính"
        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
      >
        <PlaystationX size={18} />
      </button>
    </div>
  );
}

export default ProductPropertyRow;
