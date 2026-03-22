import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash } from 'tabler-icons-react';
import { ListResponse } from 'utils/FetchUtils';
import useManageHeaderButtonsViewModel from 'components/ManageHeaderButtons/ManageHeaderButtons.vm';

export interface ManageHeaderButtonsProps {
  listResponse: ListResponse;
  resourceUrl: string;
  resourceKey: string;
}

function ManageHeaderButtons(props: ManageHeaderButtonsProps) {
  const { handleDeleteBatchEntitiesButton, DeleteModal } = useManageHeaderButtonsViewModel(props);

  return (
    <>
      <div className="flex items-center gap-2">
        <Link
          to="create"
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
        >
          <Plus size={18} />
          Thêm mới
        </Link>
        <button
          onClick={handleDeleteBatchEntitiesButton}
          className="px-4 py-2 border border-red-300 dark:border-red-600 rounded-md text-sm font-medium text-red-700 dark:text-red-400 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
        >
          <Trash size={18} />
          Xóa hàng loạt
        </button>
      </div>
      <DeleteModal />
    </>
  );
}

export default React.memo(ManageHeaderButtons);
