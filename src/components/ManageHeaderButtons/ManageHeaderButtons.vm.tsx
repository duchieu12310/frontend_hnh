import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import NotifyUtils from 'utils/NotifyUtils';
import useAppStore from 'stores/use-app-store';
import { ManageHeaderButtonsProps } from 'components/ManageHeaderButtons/ManageHeaderButtons';
import useDeleteByIdsApi from 'hooks/use-delete-by-ids-api';

function useManageHeaderButtonsViewModel({
  listResponse,
  resourceUrl,
  resourceKey,
}: ManageHeaderButtonsProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const deleteByIdsApi = useDeleteByIdsApi(resourceUrl, resourceKey);

  const {
    selection, setSelection,
    activePage, setActivePage,
  } = useAppStore();

  const handleDeleteBatchEntitiesButton = () => {
    if (selection.length > 0) {
      setIsDeleteModalOpen(true);
    } else {
      NotifyUtils.simple('Vui lòng chọn ít nhất một phần tử để xóa');
    }
  };

  const handleConfirmedDeleteBatchEntitiesButton = (entityIds: number[]) => {
    if (entityIds.length > 0) {
      deleteByIdsApi.mutate(entityIds, {
        onSuccess: () => {
          if (listResponse.content.length === selection.length) {
            setActivePage(activePage - 1 || 1);
          }
          setSelection([]);
          setIsDeleteModalOpen(false);
        },
      });
    }
  };

  const DeleteModal = () => (
    <Dialog open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-xs bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
          <Dialog.Title className="text-lg font-semibold mb-2">Xác nhận xóa</Dialog.Title>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Xóa (các) phần tử có ID {selection.join(', ')}?
          </p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
            >
              Không xóa
            </button>
            <button
              onClick={() => handleConfirmedDeleteBatchEntitiesButton(selection)}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
            >
              Xóa
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );

  return { handleDeleteBatchEntitiesButton, DeleteModal };
}

export default useManageHeaderButtonsViewModel;
