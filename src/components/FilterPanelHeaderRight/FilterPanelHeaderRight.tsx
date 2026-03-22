import React from 'react';
import { FilterOff } from 'tabler-icons-react';
import useFilterPanelHeaderRightViewModel from 'components/FilterPanelHeaderRight/FilterPanelHeaderRight.vm';

export interface FilterPanelHeaderRightProps {
  filterNameInputRef: React.MutableRefObject<HTMLInputElement | null>;
}

function FilterPanelHeaderRight(props: FilterPanelHeaderRightProps) {
  const {
    handleCancelCreateFilterButton,
    handleCreateFilterButton,
  } = useFilterPanelHeaderRightViewModel(props);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleCancelCreateFilterButton}
        title="Hủy tạo bộ lọc"
        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
      >
        <FilterOff size={18} />
      </button>
      <button
        onClick={handleCreateFilterButton}
        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
      >
        Tạo bộ lọc
      </button>
    </div>
  );
}

export default React.memo(FilterPanelHeaderRight);
