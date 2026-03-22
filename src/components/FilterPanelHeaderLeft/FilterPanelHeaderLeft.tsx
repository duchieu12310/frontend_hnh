import React from 'react';
import { Filter } from 'tabler-icons-react';

interface FilterPanelHeaderLeftProps {
  filterNameInputRef: React.MutableRefObject<HTMLInputElement | null>;
}

function FilterPanelHeaderLeft({
  filterNameInputRef,
}: FilterPanelHeaderLeftProps) {

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-[250px]">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Filter size={14} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Bộ lọc ..."
          ref={filterNameInputRef}
          className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Ngày tạo: <code className="px-1.5 py-0.5 text-xs font-mono bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded">__/__/____</code>
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Ngày sửa: <code className="px-1.5 py-0.5 text-xs font-mono bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded">__/__/____</code>
      </p>
    </div>
  );
}

export default React.memo(FilterPanelHeaderLeft);
