import React, { useRef } from 'react';
import {
  FilterPanelHeader,
  FilterPanelHeaderLeft,
  FilterPanelHeaderRight,
  FilterPanelMain,
  FilterPanelMainLeft,
  FilterPanelMainRight
} from 'components';
import useAppStore from 'stores/use-app-store';

function FilterPanel() {
  const { activeFilterPanel } = useAppStore();

  const filterNameInputRef = useRef<HTMLInputElement | null>(null);

  if (!activeFilterPanel) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm">
      <div className="flex flex-col gap-0">
        <FilterPanelHeader>
          <FilterPanelHeaderLeft
            filterNameInputRef={filterNameInputRef}
          />
          <FilterPanelHeaderRight
            filterNameInputRef={filterNameInputRef}
          />
        </FilterPanelHeader>

        <div className="border-t border-gray-200 dark:border-gray-700" />

        <FilterPanelMain>
          <FilterPanelMainLeft/>
          <FilterPanelMainRight/>
        </FilterPanelMain>
      </div>
    </div>
  );
}

export default React.memo(FilterPanel);
