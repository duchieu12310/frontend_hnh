import React, { useState } from 'react';
import { Check, Search, Trash } from 'tabler-icons-react';
import { useDebouncedValue } from 'hooks/use-debounced-value';
import { useElementSize } from 'hooks/use-element-size';
import useGetAllApi from 'hooks/use-get-all-api';
import BaseResponse from 'models/BaseResponse';

interface EntityFinderProps<T> {
  selections: T[];
  onClickItem: (entityResponse: T) => void;
  onDeleteItem: (entityResponse: T) => void;
  options: {
    resourceUrl: string;
    resourceKey: string;
    resultListSize: number;
    resultFragment: (entityResponse: T) => React.ReactNode;
    inputLabel: string;
    inputPlaceholder?: string;
    selectedFragment: (entityResponse: T) => React.ReactNode;
    deleteButtonTitle?: string;
  },
  errorSearchInput: React.ReactNode;
}

function EntityFinder<T extends BaseResponse>({
  selections,
  onClickItem,
  onDeleteItem,
  errorSearchInput,
  options,
}: EntityFinderProps<T>) {
  const { ref: refBox, width: widthBox } = useElementSize();

  const [popoverOpened, setPopoverOpened] = useState(false);
  const [keyword, setKeyword] = useState('');

  const debouncedKeyword = useDebouncedValue(keyword, 400);

  const { data: entityResponses, isFetching } = useGetAllApi<T>(
    options.resourceUrl,
    options.resourceKey,
    { size: options.resultListSize, search: debouncedKeyword }
  );

  const selectionIds = selections.map(selection => selection.id);

  return (
    <div className="flex flex-col gap-3">
      <div ref={refBox as React.RefObject<HTMLDivElement>} className="w-full relative">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {options.inputLabel}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={14} className="text-gray-400" />
            </div>
            <input
              type="text"
              required
              placeholder={options.inputPlaceholder || '--'}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onFocus={() => setPopoverOpened(true)}
              onBlur={(e) => {
                // Delay để cho phép click vào item trước khi đóng
                setTimeout(() => setPopoverOpened(false), 200);
              }}
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
        {popoverOpened && (
          <div
            className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-auto"
            style={{ width: widthBox }}
          >
            <div className="p-1">
              {(!entityResponses || entityResponses.totalElements === 0) ? (
                <p className="text-sm text-gray-400 italic p-3">Không có kết quả</p>
              ) : (
                entityResponses.content.map(entityResponse => {
                  const isDisabled = selectionIds.includes(entityResponse.id);
                  return (
                    <button
                      key={entityResponse.id}
                      onClick={() => {
                        if (!isDisabled) {
                          onClickItem(entityResponse);
                          setPopoverOpened(false);
                          setKeyword('');
                        }
                      }}
                      onMouseDown={(e) => e.preventDefault()}
                      disabled={isDisabled}
                      className="w-full text-left"
                    >
                      <div
                        className={`flex items-center justify-between px-3 py-1.5 rounded-md ${
                          isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer'
                        }`}
                      >
                        {options.resultFragment(entityResponse)}
                        {isDisabled && (
                          <div className="flex items-center gap-1">
                            <div className="p-1 bg-green-100 dark:bg-green-900/20 rounded-full">
                              <Check size={12} className="text-green-600 dark:text-green-400" />
                            </div>
                            <span className="text-xs font-medium text-green-600 dark:text-green-400">Đã thêm</span>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {selections.length > 0 && (
        <div className="flex flex-col gap-2">
          {selections.map(selectedEntityResponse => (
            <div
              key={selectedEntityResponse.id}
              className="flex items-center justify-between p-3 rounded-md bg-gray-50 dark:bg-gray-700"
            >
              {options.selectedFragment(selectedEntityResponse)}
              <button
                onClick={() => onDeleteItem(selectedEntityResponse)}
                title={options.deleteButtonTitle}
                className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
              >
                <Trash size={16}/>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EntityFinder;
