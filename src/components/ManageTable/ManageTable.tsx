import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Edit, Eye, Trash } from 'tabler-icons-react';
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
  renderExpandedRow?: (entity: T) => React.ReactNode;
  hideEdit?: boolean | ((entity: T) => boolean);
  hideDelete?: boolean | ((entity: T) => boolean);
}

function ManageTable<T extends BaseResponse>(props: ManageTableProps<T>) {
  const { hideEdit, hideDelete } = props;

  const shouldHideEdit = (entity: T) => {
    if (typeof hideEdit === 'function') return hideEdit(entity);
    return !!hideEdit;
  };

  const shouldHideDelete = (entity: T) => {
    if (typeof hideDelete === 'function') return hideDelete(entity);
    return !!hideDelete;
  };

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

  const [expandedRowIds, setExpandedRowIds] = React.useState<Set<number>>(new Set());

  const toggleRowExpansion = (id: number) => {
    setExpandedRowIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

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
      {props.renderExpandedRow && <th style={{ width: 40 }}></th>}
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
    const isExpanded = expandedRowIds.has(entity.id);

    return (
      <React.Fragment key={entity.id}>
        <tr
          className={`border-b border-gray-300 dark:border-gray-600 divide-x divide-gray-300 dark:divide-gray-600 transition-colors duration-200 ${
            selected
              ? 'bg-blue-50/50 dark:bg-blue-900/20'
              : isExpanded
              ? 'bg-slate-50 dark:bg-slate-800'
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
          {props.renderExpandedRow && (
            <td className="px-2">
              <button
                onClick={() => toggleRowExpansion(entity.id)}
                className={`p-1 rounded-full transition-transform duration-200 ${isExpanded ? 'rotate-90 bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
              >
                <ChevronRight size={16} />
              </button>
            </td>
          )}
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
              {!shouldHideEdit(entity as T) && (
                <Link
                  to={'update/' + entity.id}
                  title="Cập nhật"
                  className="p-1.5 text-orange-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-md transition-colors"
                >
                  <Edit size={18}/>
                </Link>
              )}
              {!shouldHideDelete(entity as T) && (
                <button
                  onClick={() => handleDeleteEntityButton(entity.id)}
                  title="Xóa"
                  className="p-1.5 text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                >
                  <Trash size={18}/>
                </button>
              )}
              {props.actionButtonsFragment && props.actionButtonsFragment(entity as T)}
            </div>
          </td>
        </tr>
        {isExpanded && props.renderExpandedRow && (
          <tr>
            <td colSpan={tableHeads.length + 3} className="px-8 py-4 bg-slate-50/50 dark:bg-slate-800/50 border-b border-gray-200 shadow-inner">
               {props.renderExpandedRow(entity as T)}
            </td>
          </tr>
        )}
      </React.Fragment>
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
