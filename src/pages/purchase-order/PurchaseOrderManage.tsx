import React from 'react';
import {
  FilterPanel,
  ManageHeader,
  ManageHeaderButtons,
  ManageHeaderTitle,
  ManageMain,
  ManagePagination,
  ManageTable,
  SearchPanel
} from 'components';
import DateUtils from 'utils/DateUtils';
import { PurchaseOrderResponse } from 'models/PurchaseOrder';
import { ListResponse } from 'utils/FetchUtils';
import PageConfigs from 'pages/PageConfigs';
import PurchaseOrderConfigs from 'pages/purchase-order/PurchaseOrderConfigs';
import useResetManagePageState from 'hooks/use-reset-manage-page-state';
import useInitFilterPanelState from 'hooks/use-init-filter-panel-state';
import useGetAllApi from 'hooks/use-get-all-api';
import useAppStore from 'stores/use-app-store';
import MiscUtils from 'utils/MiscUtils';
import { Plus } from 'tabler-icons-react';

function PurchaseOrderManage() {
  useResetManagePageState();
  useInitFilterPanelState(PurchaseOrderConfigs.properties);

  const {
    isLoading,
    data: listResponse = PageConfigs.initialListResponse as ListResponse<PurchaseOrderResponse>,
  } = useGetAllApi<PurchaseOrderResponse>(PurchaseOrderConfigs.resourceUrl, PurchaseOrderConfigs.resourceKey);

  const { searchToken } = useAppStore();

  const purchaseOrderStatusBadgeFragment = (status: number) => {
    switch (status) {
    case 1:
      return <span className="px-2 py-1 text-xs font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded">Đơn hàng mới</span>;
    case 2:
      return <span className="px-2 py-1 text-xs font-medium border border-yellow-300 dark:border-yellow-600 text-yellow-700 dark:text-yellow-400 rounded">Đang chờ duyệt</span>;
    case 3:
      return <span className="px-2 py-1 text-xs font-medium border border-violet-300 dark:border-violet-600 text-violet-700 dark:text-violet-400 rounded">Đã duyệt</span>;
    case 4:
      return <span className="px-2 py-1 text-xs font-medium border border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-400 rounded">Đang xử lý</span>;
    case 5:
      return <span className="px-2 py-1 text-xs font-medium border border-green-300 dark:border-green-600 text-green-700 dark:text-green-400 rounded">Hoàn thành</span>;
    case 6:
      return <span className="px-2 py-1 text-xs font-medium border border-orange-300 dark:border-orange-600 text-orange-700 dark:text-orange-400 rounded">Không duyệt</span>;
    case 7:
      return <span className="px-2 py-1 text-xs font-medium border border-red-300 dark:border-red-600 text-red-700 dark:text-red-400 rounded">Hủy bỏ</span>;
    }
  };

  const highlightText = (text: string, highlight: string) => {
    if (!highlight) return text;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <mark key={i} className="bg-blue-200 dark:bg-blue-800">{part}</mark>
      ) : (
        part
      )
    );
  };

  const showedPropertiesFragment = (entity: PurchaseOrderResponse) => (
    <>
      <td>{entity.id}</td>
      <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
      <td className="text-sm">
        {highlightText(entity.code, searchToken)}
      </td>
      <td className="text-sm">
        {highlightText(entity.supplier.displayName, searchToken)}
      </td>
      <td>
        <div className="flex flex-col gap-0">
          <span className="text-sm">{highlightText(entity.destination.address.line || '', searchToken)}</span>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {[entity.destination.address.district?.name, entity.destination.address.province?.name]
              .filter(Boolean)
              .join(', ')}
          </p>
        </div>
      </td>
      <td className="text-right">
        {MiscUtils.formatPrice(entity.totalAmount) + ' ₫'}
      </td>
      <td>
        <button
          className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
          title="Tạo phiếu nhập kho"
        >
          <Plus size={20} />
        </button>
      </td>
      <td>{purchaseOrderStatusBadgeFragment(entity.status)}</td>
    </>
  );

  const entityDetailTableRowsFragment = (entity: PurchaseOrderResponse) => (
    <>
      <tr>
        <td>{PurchaseOrderConfigs.properties.id.label}</td>
        <td>{entity.id}</td>
      </tr>
      <tr>
        <td>{PurchaseOrderConfigs.properties.createdAt.label}</td>
        <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
      </tr>
      <tr>
        <td>{PurchaseOrderConfigs.properties.updatedAt.label}</td>
        <td>{DateUtils.isoDateToString(entity.updatedAt)}</td>
      </tr>
      <tr>
        <td>{PurchaseOrderConfigs.properties.code.label}</td>
        <td>{entity.code}</td>
      </tr>
      <tr>
        <td>{PurchaseOrderConfigs.properties['supplier.displayName'].label}</td>
        <td>{entity.supplier.displayName}</td>
      </tr>
      <tr>
        <td>{PurchaseOrderConfigs.properties['destination.address.line'].label}</td>
        <td>
          <div className="flex flex-col gap-0">
            <p className="text-sm">{entity.destination.address.line}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {[entity.destination.address.district?.name, entity.destination.address.province?.name]
                .filter(Boolean)
                .join(', ')}
            </p>
          </div>
        </td>
      </tr>
      <tr>
        <td>Người liên hệ điểm nhập hàng</td>
        <td>
          <div className="flex flex-col gap-0">
            {[entity.destination.contactFullname, entity.destination.contactPhone, entity.destination.contactEmail]
              .filter(Boolean)
              .map((item, index) => <p key={index} className="text-sm">{item}</p>)}
          </div>
        </td>
      </tr>
      <tr>
        <td>{PurchaseOrderConfigs.properties.totalAmount.label}</td>
        <td>{MiscUtils.formatPrice(entity.totalAmount) + ' ₫'}</td>
      </tr>
      <tr>
        <td>{PurchaseOrderConfigs.properties.note.label}</td>
        <td className="max-w-[300px]">{entity.note}</td>
      </tr>
      <tr>
        <td>{PurchaseOrderConfigs.properties.status.label}</td>
        <td>{purchaseOrderStatusBadgeFragment(entity.status)}</td>
      </tr>
    </>
  );

  return (
    <div className="flex flex-col gap-4">
      <ManageHeader>
        <ManageHeaderTitle
          titleLinks={PurchaseOrderConfigs.manageTitleLinks}
          title={PurchaseOrderConfigs.manageTitle}
        />
        <ManageHeaderButtons
          listResponse={listResponse}
          resourceUrl={PurchaseOrderConfigs.resourceUrl}
          resourceKey={PurchaseOrderConfigs.resourceKey}
        />
      </ManageHeader>

      <SearchPanel/>

      <FilterPanel/>

      <ManageMain
        listResponse={listResponse}
        isLoading={isLoading}
      >
        <ManageTable
          listResponse={listResponse}
          properties={PurchaseOrderConfigs.properties}
          resourceUrl={PurchaseOrderConfigs.resourceUrl}
          resourceKey={PurchaseOrderConfigs.resourceKey}
          showedPropertiesFragment={showedPropertiesFragment}
          entityDetailTableRowsFragment={entityDetailTableRowsFragment}
        />
      </ManageMain>

      <ManagePagination listResponse={listResponse}/>
    </div>
  );
}

export default PurchaseOrderManage;
