import React from 'react';
import { Link } from 'react-router-dom';
import { Edit, Eye, Trash } from 'tabler-icons-react';
import BaseResponse from 'models/BaseResponse';
import { EntityPropertySchema } from 'types';
import { ListResponse } from 'utils/FetchUtils';
import useManageTableViewModel from 'components/ManageTable/ManageTable.vm';

export interface ManageTableProps<T> {
  listResponse: ListResponse<T>;
  properties: EntityPropertySchema;
  resourceUrl: string;
  resourceKey: string;
  showedPropertiesFragment: (entity: T) => React.ReactNode;
  entityDetailTableRowsFragment: (entity: T) => React.ReactNode;
  entityDetailActionsFragment?: (entity: T, handlers: { onClose: () => void, onDelete: (id: number) => void }) => React.ReactNode;
  actionButtonsFragment?: (entity: T) => React.ReactNode;
  customViewEntityLink?: (entity: T) => string;
}

function ManageTable<T extends BaseResponse>(props: ManageTableProps<T>) {
  const {
    listResponse,
    selection,
    tableHeads,
    handleToggleAllRowsCheckbox,
    handleToggleRowCheckbox,
    handleViewEntityButton,
    handleDeleteEntityButton,
    ViewModal,
    DeleteModal,
  } = useManageTableViewModel<T>(props);

  const isAllSelected = selection.length === listResponse.content.length && listResponse.content.length > 0;
  const isIndeterminate = selection.length > 0 && selection.length !== listResponse.content.length;

  const entitiesTableHeadsFragment = (
    <tr className="divide-x divide-slate-500">
      <th style={{ width: 40 }} className="px-3 py-3">
        <input
          type="checkbox"
          onChange={handleToggleAllRowsCheckbox}
          checked={isAllSelected}
          ref={(input) => {
            if (input) input.indeterminate = isIndeterminate;
          }}
          className="w-4 h-4 text-blue-600 bg-slate-700/50 border-slate-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2"
        />
      </th>
      {tableHeads.map((item) => (
        <th key={item} className="px-3 py-3 text-center text-[12px] font-semibold text-white/90 uppercase tracking-wider">
          {item}
        </th>
      ))}
      <th style={{ width: 120 }} className="px-3 py-3 text-center text-[12px] font-semibold text-white/90 uppercase tracking-wider">
        Thao tác
      </th>
    </tr>
  );

  const entitiesTableRowsFragment = listResponse.content.map((entity) => {
    const selected = selection.includes(entity.id);

    return (
      <tr
        key={entity.id}
        className={`border-b border-gray-300 dark:border-gray-600 divide-x divide-gray-300 dark:divide-gray-600 transition-colors duration-200 ${
          selected
            ? 'bg-blue-50/50 dark:bg-blue-900/20'
            : 'bg-white dark:bg-gray-800 hover:bg-slate-50 dark:hover:bg-gray-700/50'
        }`}
      >
        <td className="px-3 py-4">
          <input
            type="checkbox"
            checked={selection.includes(entity.id)}
            onChange={() => handleToggleRowCheckbox(entity.id)}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
        </td>
        {props.showedPropertiesFragment(entity as T)}
        <td className="px-3 py-4">
          <div className="flex items-center justify-center gap-3">
            {props.customViewEntityLink ? (
              <Link
                to={props.customViewEntityLink(entity as T)}
                title="Xem"
                className="p-1.5 text-blue-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
              >
                <Eye size={18}/>
              </Link>
            ) : (
              <button
                onClick={() => handleViewEntityButton(entity.id)}
                title="Xem"
                className="p-1.5 text-blue-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
              >
                <Eye size={18}/>
              </button>
            )}
            <Link
              to={'update/' + entity.id}
              title="Cập nhật"
              className="p-1.5 text-orange-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-md transition-colors"
            >
              <Edit size={18}/>
            </Link>
            <button
              onClick={() => handleDeleteEntityButton(entity.id)}
              title="Xóa"
              className="p-1.5 text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
            >
              <Trash size={18}/>
            </button>
            {props.actionButtonsFragment && props.actionButtonsFragment(entity as T)}
          </div>
        </td>
      </tr>
    );
  });

  return (
    <>
      <div className="rounded-[12px] overflow-hidden bg-white dark:bg-gray-800 border border-[#e2e8f0] dark:border-gray-700" style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <table className="min-w-full">
          <thead className="bg-[#1e293b] text-center">
            {entitiesTableHeadsFragment}
          </thead>
          <tbody className="bg-white dark:bg-gray-800 text-center">
            {entitiesTableRowsFragment}
          </tbody>
        </table>
      </div>
      <ViewModal />
      <DeleteModal />
    </>
  );
}

export default ManageTable;
