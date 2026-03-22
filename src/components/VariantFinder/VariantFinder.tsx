import React, { useState } from 'react';
import { Check, Search } from 'tabler-icons-react';
import { useDebouncedValue } from 'hooks/use-debounced-value';
import { useElementSize } from 'hooks/use-element-size';
import { Popover } from '@headlessui/react';
import useGetAllApi from 'hooks/use-get-all-api';
import { VariantResponse } from 'models/Variant';
import ResourceURL from 'constants/ResourceURL';

interface VariantResultProps {
  variant: VariantResponse;
  keyword: string;
  disabled: boolean;
}

function VariantResult({ variant, keyword, disabled }: VariantResultProps) {
  const highlightText = (text: string, keyword: string) => {
    if (!keyword) return text;
    const parts = text.split(new RegExp(`(${keyword})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === keyword.toLowerCase() ? (
        <mark key={i} className="bg-blue-200 dark:bg-blue-800">{part}</mark>
      ) : (
        part
      )
    );
  };

  return (
    <div
      className={`flex items-center justify-between px-3 py-1.5 rounded-md ${
        disabled ? 'opacity-50' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
    >
      <div className="flex flex-col gap-1">
        <p className="text-sm text-gray-900 dark:text-gray-100">
          {highlightText(variant.product.name, keyword)}
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          {variant.properties && variant.properties.content.map(property => (
            <span key={property.code} className="text-xs text-blue-600 dark:text-blue-400">
              {property.name}: {property.value}
            </span>
          ))}
          <span className="text-xs text-gray-400">
            SKU: {highlightText(variant.sku, keyword)}
          </span>
        </div>
      </div>
      {disabled && (
        <div className="flex items-center gap-1">
          <div className="p-1 bg-green-100 dark:bg-green-900/20 rounded-full">
            <Check size={12} className="text-green-600 dark:text-green-400" />
          </div>
          <span className="text-xs font-medium text-green-600 dark:text-green-400">Đã thêm</span>
        </div>
      )}
    </div>
  );
}

interface VariantFinderProps {
  selectedVariants: VariantResponse[];
  onClickItem: (variant: VariantResponse) => void;
  errorSearchInput: React.ReactNode;
}

function VariantFinder({ selectedVariants, onClickItem, errorSearchInput }: VariantFinderProps) {
  const { ref: refBox, width: widthBox } = useElementSize();

  const [popoverOpened, setPopoverOpened] = useState(false);
  const [keyword, setKeyword] = useState('');

  const debouncedKeyword = useDebouncedValue(keyword, 400);

  const { data: variants, isFetching } = useGetAllApi<VariantResponse>(
    ResourceURL.VARIANT,
    'variants',
    { size: 7, search: debouncedKeyword }
  );

  const selectedVariantIds = selectedVariants.map(variant => variant.id);

  return (
    <div ref={refBox as React.RefObject<HTMLDivElement>} className="w-full">
      <Popover className="relative">
        {({ open, close }) => (
          <>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Thêm mặt hàng
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={14} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Nhập tên, mã sản phẩm hay SKU để tìm..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onFocus={() => setPopoverOpened(true)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {isFetching && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  </div>
                )}
              </div>
              {errorSearchInput && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errorSearchInput}</p>
              )}
            </div>
            {open && (
              <Popover.Panel
                static
                className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-auto"
                style={{ width: widthBox }}
              >
                <div className="p-1">
                  {(!variants || variants.totalElements === 0) ? (
                    <p className="text-sm text-gray-400 italic p-3">Không có kết quả</p>
                  ) : (
                    variants.content.map(variant => {
                      const isDisabled = selectedVariantIds.includes(variant.id);
                      return (
                        <button
                          key={variant.sku}
                          onClick={() => {
                            if (!isDisabled) {
                              onClickItem(variant);
                              setPopoverOpened(false);
                              close();
                            }
                          }}
                          disabled={isDisabled}
                          className="w-full text-left"
                        >
                          <VariantResult
                            variant={variant}
                            keyword={debouncedKeyword}
                            disabled={isDisabled}
                          />
                        </button>
                      );
                    })
                  )}
                </div>
              </Popover.Panel>
            )}
          </>
        )}
      </Popover>
    </div>
  );
}

export default VariantFinder;
