import React from 'react';
import DateUtils from 'utils/DateUtils';

interface DefaultPropertyPanelProps {
  id?: string | number;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

function DefaultPropertyPanel({
  id = '__',
  createdAt = '__/__/____',
  updatedAt = '__/__/____',
  createdBy = '1',
  updatedBy = '1',
}: DefaultPropertyPanelProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm p-3">
      <div className="flex items-center gap-6">
        <div className="flex flex-col gap-1.5">
          <p className="text-sm text-gray-600 dark:text-gray-400">ID</p>
          <code className="px-2 py-1 text-sm font-mono bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded">
            {id}
          </code>
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="text-sm text-gray-600 dark:text-gray-400">Ngày tạo</p>
          <code className="px-2 py-1 text-sm font-mono bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded">
            {DateUtils.isoDateToString(createdAt)}
          </code>
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="text-sm text-gray-600 dark:text-gray-400">Ngày cập nhật</p>
          <code className="px-2 py-1 text-sm font-mono bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded">
            {DateUtils.isoDateToString(updatedAt)}
          </code>
        </div>
        {/* TODO: Triển khai createdBy và updatedBy */}
        {/*<div className="flex flex-col gap-1.5">*/}
        {/*  <p className="text-sm text-gray-600 dark:text-gray-400">Người tạo</p>*/}
        {/*  <code className="px-2 py-1 text-sm font-mono bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded">*/}
        {/*    {createdBy}*/}
        {/*  </code>*/}
        {/*</div>*/}
        {/*<div className="flex flex-col gap-1.5">*/}
        {/*  <p className="text-sm text-gray-600 dark:text-gray-400">Người cập nhật</p>*/}
        {/*  <code className="px-2 py-1 text-sm font-mono bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded">*/}
        {/*    {updatedBy}*/}
        {/*  </code>*/}
        {/*</div>*/}
      </div>
    </div>
  );
}

export default React.memo(DefaultPropertyPanel);
