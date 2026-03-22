import React from 'react';
import { ListResponse } from 'utils/FetchUtils';
import { Marquee } from 'tabler-icons-react';

interface ManageMainProps {
  listResponse: ListResponse;
  isLoading: boolean;
  children: React.ReactNode;
}

function ManageMain({
  listResponse,
  isLoading,
  children,
}: ManageMainProps) {

  let manageMainInnerFragment = (
    <div className="overflow-auto">
      {children}
    </div>
  );

  if (listResponse.totalElements === 0) {
    manageMainInnerFragment = (
      <div className="flex items-center justify-center h-full">
        {!isLoading && (
          <div className="flex flex-col items-center gap-6 my-6 text-blue-600 dark:text-blue-400">
            <Marquee size={75} strokeWidth={1}/>
            <p className="text-lg font-medium">Không có nội dung</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-md shadow-sm relative"
      style={{
        height: listResponse.totalElements === 0 ? 250 : 'auto',
      }}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
      {manageMainInnerFragment}
    </div>
  );
}

export default React.memo(ManageMain);
