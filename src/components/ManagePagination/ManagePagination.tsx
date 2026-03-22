import React from 'react';
import useManagePaginationViewModel from 'components/ManagePagination/ManagePagination.vm';
import PageConfigs from 'pages/PageConfigs';
import { ListResponse } from 'utils/FetchUtils';

interface ManagePaginationProps {
  listResponse: ListResponse;
}

function ManagePagination({
  listResponse,
}: ManagePaginationProps) {
  const {
    activePage,
    activePageSize,
    handlePaginationButton,
    handlePageSizeSelect,
  } = useManagePaginationViewModel();

  const pageSizeSelectList = PageConfigs.initialPageSizeSelectList.map((pageSize) =>
    (Number(pageSize.value) > listResponse.totalElements) ? { ...pageSize, disabled: true } : pageSize
  );

  if (listResponse.totalElements === 0) {
    return null;
  }

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 7;
    let startPage = Math.max(1, activePage - Math.floor(maxButtons / 2));
    let endPage = Math.min(listResponse.totalPages, startPage + maxButtons - 1);
    
    if (endPage - startPage < maxButtons - 1) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    if (startPage > 1) {
      buttons.push(
        <button
          key="first"
          onClick={() => handlePaginationButton(1)}
          className="px-3 py-1 text-sm border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          1
        </button>
      );
      if (startPage > 2) {
        buttons.push(<span key="ellipsis1" className="px-2">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePaginationButton(i)}
          className={`px-3 py-1 text-sm border rounded ${
            i === activePage
              ? 'bg-blue-600 text-white border-blue-600'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          {i}
        </button>
      );
    }

    if (endPage < listResponse.totalPages) {
      if (endPage < listResponse.totalPages - 1) {
        buttons.push(<span key="ellipsis2" className="px-2">...</span>);
      }
      buttons.push(
        <button
          key="last"
          onClick={() => handlePaginationButton(listResponse.totalPages)}
          className="px-3 py-1 text-sm border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {listResponse.totalPages}
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-sm">
        <span className="font-medium">Trang {activePage}</span>
        <span> / {listResponse.totalPages} </span>
        <span className="text-gray-500 dark:text-gray-400 text-sm">
          ({listResponse.totalElements})
        </span>
      </p>
      <div className="flex items-center gap-2">
        {renderPaginationButtons()}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm">Số hàng trên trang</span>
        <select
          value={String(activePageSize)}
          onChange={(e) => handlePageSizeSelect(e.target.value)}
          className="w-18 px-2 py-1 text-sm border rounded bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
        >
          {pageSizeSelectList.map((item) => (
            <option key={item.value} value={item.value} disabled={item.disabled}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default React.memo(ManagePagination);
