import React from 'react';
import {

  FilterPanel,
  ManageHeader,
  ManageHeaderButtons,
  ManageHeaderTitle,
  ManageMain,
  ManagePagination,
  ManageTable,
  SearchPanel,
  StatusToggle,
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

  const highlightText = (text: string, highlight: string) => {
    if (!text) return '';
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
    
      <td><StatusToggle status={entity.status} entityId={entity.id} resourceUrl={PurchaseOrderConfigs.resourceUrl} resourceKey={PurchaseOrderConfigs.resourceKey} /></td></>
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
        <td><StatusToggle status={entity.status} entityId={entity.id} resourceUrl={PurchaseOrderConfigs.resourceUrl} resourceKey={PurchaseOrderConfigs.resourceKey} /></td>
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
