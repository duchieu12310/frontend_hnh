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
    <tr>
      <th style={{ width: 40 }}>
        <input
          type="checkbox"
          onChange={handleToggleAllRowsCheckbox}
          checked={isAllSelected}
          ref={(input) => {
            if (input) input.indeterminate = isIndeterminate;
          }}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
      </th>
      {tableHeads.map((item) => (
        <th key={item} className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {item}
        </th>
      ))}
      <th style={{ width: 120 }} className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        Thao tác
      </th>
    </tr>
  );

  const entitiesTableRowsFragment = listResponse.content.map((entity) => {
    const selected = selection.includes(entity.id);

    return (
      <tr
        key={entity.id}
        className={`border-b border-gray-200 dark:border-gray-700 ${
          selected
            ? 'bg-blue-50 dark:bg-blue-900/20'
            : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
        }`}
      >
        <td className="px-3 py-2">
          <input
            type="checkbox"
            checked={selection.includes(entity.id)}
            onChange={() => handleToggleRowCheckbox(entity.id)}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
        </td>
        {props.showedPropertiesFragment(entity as T)}
        <td className="px-3 py-2">
          <div className="flex items-center gap-2">
            {props.customViewEntityLink ? (
              <Link
                to={props.customViewEntityLink(entity as T)}
                title="Xem"
                className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
              >
                <Eye size={16}/>
              </Link>
            ) : (
              <button
                onClick={() => handleViewEntityButton(entity.id)}
                title="Xem"
                className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
              >
                <Eye size={16}/>
              </button>
            )}
            <Link
              to={'update/' + entity.id}
              title="Cập nhật"
              className="p-1.5 text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded transition-colors"
            >
              <Edit size={16}/>
            </Link>
            <button
              onClick={() => handleDeleteEntityButton(entity.id)}
              title="Xóa"
              className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
            >
              <Trash size={16}/>
            </button>
            {props.actionButtonsFragment && props.actionButtonsFragment(entity as T)}
          </div>
        </td>
      </tr>
    );
  });

  return (
    <>
      <div className="rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            {entitiesTableHeadsFragment}
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
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
