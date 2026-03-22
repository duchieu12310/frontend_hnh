import React from 'react';
import { AdjustmentsHorizontal, Edit, Eraser, Filter, Search } from 'tabler-icons-react';
import useSearchPanelViewModel from 'components/SearchPanel/SearchPanel.vm';

function SearchPanel() {
  const {
    searchInputRef,
    filterSelectList,
    activeFilterId,
    handleSearchInput,
    handleFilterSelect,
    handleAddFilterButton,
    handleResetButton,
    handleSearchButton,
  } = useSearchPanelViewModel();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm p-3">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="relative w-[250px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={14} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Từ khóa"
              ref={searchInputRef}
              onKeyDown={handleSearchInput}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <AdjustmentsHorizontal size={14} className="text-gray-400" />
            </div>
            <select
              value={activeFilterId || ''}
              onChange={(e) => handleFilterSelect(e.target.value || null)}
              className="pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Chọn bộ lọc</option>
              {filterSelectList.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <button
            title="Sửa bộ lọc"
            className="p-2 text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded transition-colors"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={handleAddFilterButton}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors flex items-center gap-2"
          >
            <Filter size={18} />
            Thêm bộ lọc
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetButton}
            title="Đặt mặc định"
            className="p-2 text-white bg-red-600 hover:bg-red-700 rounded transition-colors"
          >
            <Eraser size={18} />
          </button>
          <button
            onClick={handleSearchButton}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Tìm kiếm
          </button>
        </div>
      </div>
    </div>
  );
}

export default React.memo(SearchPanel);
