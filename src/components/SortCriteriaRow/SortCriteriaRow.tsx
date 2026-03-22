import React from 'react';
import { AB, ArrowsDownUp, DragDrop, PlaystationX } from 'tabler-icons-react';
import FilterUtils, { SortCriteria } from 'utils/FilterUtils';
import useSortCriteriaRowViewModel from 'components/SortCriteriaRow/SortCriteriaRow.vm';

interface SortCriteriaRowProps {
  sortCriteria: SortCriteria;
  index: number;
}

function SortCriteriaRow({
  sortCriteria,
  index,
}: SortCriteriaRowProps) {
  const {
    sortPropertySelectList,
    handleSortPropertySelect,
    handleSortOrderSelect,
    handleDeleteSortCriteriaButton,
  } = useSortCriteriaRowViewModel();

  return (
    <div className="flex items-center gap-2 flex-nowrap justify-between">
      <button
        type="button"
        title="Di chuyển tiêu chí sắp xếp"
        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
      >
        <DragDrop size={18} />
      </button>
      <div className="flex-1 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <AB size={14} className="text-gray-400" />
        </div>
        <select
          value={sortCriteria.property || ''}
          onChange={(e) => handleSortPropertySelect(e.target.value || null, index)}
          className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Chọn thuộc tính</option>
          {sortPropertySelectList.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <ArrowsDownUp size={14} className="text-gray-400" />
        </div>
        <select
          value={sortCriteria.order || ''}
          onChange={(e) => handleSortOrderSelect(e.target.value || null, index)}
          className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Chọn thứ tự sắp xếp</option>
          {FilterUtils.sortOrderSelectList.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <button
        type="button"
        onClick={() => handleDeleteSortCriteriaButton(index)}
        title="Xóa tiêu chí sắp xếp"
        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
      >
        <PlaystationX size={18} />
      </button>
    </div>
  );
}

export default SortCriteriaRow;
