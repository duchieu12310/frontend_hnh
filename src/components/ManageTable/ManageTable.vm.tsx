import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import useAppStore from 'stores/use-app-store';
import { EntityDetailTable } from 'components';
import BaseResponse from 'models/BaseResponse';
import { ManageTableProps } from 'components/ManageTable/ManageTable';
import useDeleteByIdApi from 'hooks/use-delete-by-id-api';

function useManageTableViewModel<T extends BaseResponse>({
  listResponse,
  properties,
  resourceUrl,
  resourceKey,
  entityDetailTableRowsFragment,
  entityDetailActionsFragment,
}: ManageTableProps<T>) {
  const [viewModalEntityId, setViewModalEntityId] = useState<number | null>(null);
  const [deleteModalEntityId, setDeleteModalEntityId] = useState<number | null>(null);

  const deleteByIdApi = useDeleteByIdApi(resourceUrl, resourceKey);

  const {
    selection, setSelection,
    activePage, setActivePage,
  } = useAppStore();

  const tableHeads = Object.values(properties)
    .flatMap((propertySpec) => propertySpec.isShowInTable ? propertySpec.label : []);

  const handleToggleAllRowsCheckbox = () => {
    setSelection((current) => {
      return current.length === listResponse.content.length ? [] : listResponse.content.map(entity => entity.id);
    });
  };

  const handleToggleRowCheckbox = (entityId: number) => {
    setSelection((current) => {
      return current.includes(entityId) ? current.filter(item => item !== entityId) : [...current, entityId];
    });
  };

  const handleViewEntityButton = (entityId: number) => {
    setViewModalEntityId(entityId);
  };

  const handleDeleteEntityButton = (entityId: number) => {
    setDeleteModalEntityId(entityId);
  };

  const handleConfirmedDeleteEntityButton = (entityId: number) => {
    deleteByIdApi.mutate(entityId, {
      onSuccess: () => {
        if (listResponse.content.length === 1) {
          setActivePage(activePage - 1 || 1);
        }
        setDeleteModalEntityId(null);
      },
    });
  };

  const ViewModal = () => (
    <Dialog open={viewModalEntityId !== null} onClose={() => setViewModalEntityId(null)} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-h-[90vh] overflow-auto">
          <Dialog.Title className="text-lg font-semibold mb-4">Thông tin chi tiết</Dialog.Title>
          {viewModalEntityId !== null && (
            <EntityDetailTable
              entityDetailTableRowsFragment={entityDetailTableRowsFragment}
              entityDetailActionsFragment={entityDetailActionsFragment}
              resourceUrl={resourceUrl}
              resourceKey={resourceKey}
              entityId={viewModalEntityId}
              onClose={() => setViewModalEntityId(null)}
              onDelete={(id: number) => {
                setViewModalEntityId(null);
                setDeleteModalEntityId(id);
              }}
            />
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );

  const DeleteModal = () => (
    <Dialog open={deleteModalEntityId !== null} onClose={() => setDeleteModalEntityId(null)} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-xs bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
          <Dialog.Title className="text-lg font-semibold mb-2">Xác nhận xóa</Dialog.Title>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Xóa phần tử có ID {deleteModalEntityId}?
          </p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setDeleteModalEntityId(null)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
            >
              Không xóa
            </button>
            <button
              onClick={() => deleteModalEntityId !== null && handleConfirmedDeleteEntityButton(deleteModalEntityId)}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
            >
              Xóa
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );

  return {
    listResponse,
    selection,
    tableHeads,
    handleToggleAllRowsCheckbox,
    handleToggleRowCheckbox,
    handleViewEntityButton,
    handleDeleteEntityButton,
    ViewModal,
    DeleteModal,
  };
}

export default useManageTableViewModel;
