import React from 'react';
import { SortCriteriaRow } from 'components';
import useFilterPanelMainLeftViewModel from 'components/FilterPanelMainLeft/FilterPanelMainLeft.vm';

function FilterPanelMainLeft() {
  const {
    sortCriteriaList,
    isDisabledCreateSortCriteriaButton,
    handleCreateSortCriteriaButton,
  } = useFilterPanelMainLeftViewModel();

  const sortCriteriaListFragment = sortCriteriaList.map((sortCriteria, index) => (
    <SortCriteriaRow
      key={index}
      sortCriteria={sortCriteria}
      index={index}
    />
  ));

  return (
    <div className="col-span-1">
      <div className="flex flex-col gap-3">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          Sắp xếp
        </h3>
        {sortCriteriaListFragment}
        <button
          onClick={handleCreateSortCriteriaButton}
          disabled={isDisabledCreateSortCriteriaButton}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Thêm tiêu chí sắp xếp
        </button>
      </div>
    </div>
  );
}

export default React.memo(FilterPanelMainLeft);
