import React from 'react';
import { FilterCriteriaRow } from 'components';
import useFilterPanelMainRightViewModel from 'components/FilterPanelMainRight/FilterPanelMainRight.vm';

function FilterPanelMainRight() {
  const {
    filterCriteriaList,
    isDisabledCreateFilterCriteriaButton,
    handleCreateFilterCriteriaButton,
  } = useFilterPanelMainRightViewModel();

  const filterCriteriaListFragment = filterCriteriaList.map((filterCriteria, index) => (
    <FilterCriteriaRow
      key={index}
      filterCriteria={filterCriteria}
      index={index}
    />
  ));

  return (
    <div className="col-span-3">
      <div className="flex flex-col gap-3">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          Lọc
        </h3>
        {filterCriteriaListFragment}
        <button
          onClick={handleCreateFilterCriteriaButton}
          disabled={isDisabledCreateFilterCriteriaButton}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Thêm tiêu chí lọc
        </button>
      </div>
    </div>
  );
}

export default React.memo(FilterPanelMainRight);
