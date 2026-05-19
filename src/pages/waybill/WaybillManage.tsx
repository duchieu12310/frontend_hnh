import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import {

  EntityDetailTable,
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
import { WaybillResponse } from 'models/Waybill';
import { ListResponse } from 'utils/FetchUtils';
import PageConfigs from 'pages/PageConfigs';
import WaybillConfigs from './WaybillConfigs_v2';
import useResetManagePageState from 'hooks/use-reset-manage-page-state';
import useInitFilterPanelState from 'hooks/use-init-filter-panel-state';
import useGetAllApi from 'hooks/use-get-all-api';
import useAppStore from 'stores/use-app-store';
import MiscUtils from 'utils/MiscUtils';
import OrderConfigs from 'pages/order/OrderConfigs';
import FilterUtils from 'utils/FilterUtils';

function WaybillManage() {
  useResetManagePageState(WaybillConfigs.resourceKey);
  useInitFilterPanelState(WaybillConfigs.properties);

  const { activePage, activePageSize, activeFilter, searchToken, setActivePage } = useAppStore();
  const [quickFilter, setQuickFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const activeFilterRSQL = FilterUtils.convertToFilterRSQL(activeFilter);

  let customFilter = '';
  if (quickFilter === 'active') {
    customFilter = 'status==1';
  } else if (quickFilter === 'inactive') {
    customFilter = 'status!=1';
  }

  const requestParams = {
    page: activePage,
    size: activePageSize,
    sort: FilterUtils.convertToSortRSQL(activeFilter),
    filter: activeFilterRSQL ? (customFilter ? `${activeFilterRSQL};${customFilter}` : activeFilterRSQL) : customFilter,
    search: searchToken,
  };

  const {
    isLoading,
    data: listResponse = PageConfigs.initialListResponse as ListResponse<WaybillResponse>,
  } = useGetAllApi<WaybillResponse>(WaybillConfigs.resourceUrl, WaybillConfigs.resourceKey, requestParams);

  const handleQuickFilterChange = (filter: 'all' | 'active' | 'inactive') => {
    setQuickFilter(filter);
    setActivePage(1);
  };

  const [viewOrderModalId, setViewOrderModalId] = useState<number | null>(null);

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

  const showedPropertiesFragment = (entity: WaybillResponse) => {
    const PaymentMethodIcon = PageConfigs.paymentMethodIconMap[entity.order.paymentMethodType];

    return (
      <>
        <td>{entity.id}</td>
        <td>
          <span className="text-sm font-mono">
            {highlightText(entity.code, searchToken)}
          </span>
        </td>
        <td>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => setViewOrderModalId(entity.order.id)}
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-mono text-left"
            >
              {highlightText(entity.order.code, searchToken)}
            </button>
            <PaymentMethodIcon size={16} className="text-gray-400" />
          </div>
        </td>
        <td>{DateUtils.isoDateToString(entity.shippingDate, 'DD/MM/YYYY')}</td>
        <td>{DateUtils.isoDateToString(entity.expectedDeliveryTime, 'DD/MM/YYYY')}</td>
        <td className="text-right">{MiscUtils.formatPrice(entity.codAmount) + ' ₫'}</td>
        <td className="text-right">{MiscUtils.formatPrice(entity.shippingFee) + ' ₫'}</td>
        <td>
          <div className="flex flex-col gap-0">
            <p className="text-xs">Khối lượng: <b>{entity.weight}</b> (gram)</p>
            <p className="text-xs">Chiều dài: <b>{entity.length}</b> (cm)</p>
            <p className="text-xs">Chiều rộng: <b>{entity.width}</b> (cm)</p>
            <p className="text-xs">Chiều cao: <b>{entity.height}</b> (cm)</p>
          </div>
        </td>
        <td>
          <div className="flex flex-col gap-1.5 min-w-[200px] max-w-[250px] max-h-[140px] overflow-y-auto pr-1 text-left">
            {entity.order?.orderVariants?.map((ov, index) => (
              <div key={index} className="flex flex-col gap-0.5 p-1.5 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 shadow-sm">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-2" title={ov.variant.product.name}>{ov.variant.product.name}</span>
                {ov.variant.properties?.content && ov.variant.properties.content.length > 0 && (
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {ov.variant.properties.content.map(p => p.value).join(' | ')}
                  </span>
                )}
                <div className="flex justify-between items-center mt-0.5 pt-1 border-t border-slate-100 dark:border-slate-700/50">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400">SL Đặt: <strong className="text-blue-600 dark:text-blue-400 text-xs">{ov.quantity}</strong></span>
                  <span className="text-[10px] text-slate-600 dark:text-slate-400">Tồn Kho: <strong className="text-slate-800 dark:text-slate-200 text-xs">{ov.variant.quantity ?? 0}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </td>
        <td>{entity.fromWarehouse?.name}</td>
        <td><StatusToggle status={entity.status} entityId={entity.id} resourceUrl={WaybillConfigs.resourceUrl} resourceKey={WaybillConfigs.resourceKey} /></td></>
    );
  };

  const entityDetailTableRowsFragment = (entity: WaybillResponse) => (
    <>
      <tr>
        <td>{WaybillConfigs.properties.id.label}</td>
        <td>{entity.id}</td>
      </tr>
      <tr>
        <td>{WaybillConfigs.properties.createdAt.label}</td>
        <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
      </tr>
      <tr>
        <td>{WaybillConfigs.properties.updatedAt.label}</td>
        <td>{DateUtils.isoDateToString(entity.updatedAt)}</td>
      </tr>
      <tr>
        <td>{WaybillConfigs.properties.code.label}</td>
        <td>{entity.code}</td>
      </tr>
      <tr>
        <td>{WaybillConfigs.properties['order.code'].label}</td>
        <td>{entity.order.code}</td>
      </tr>
      <tr>
        <td>{WaybillConfigs.properties.shippingDate.label}</td>
        <td>{DateUtils.isoDateToString(entity.shippingDate, 'DD/MM/YYYY')}</td>
      </tr>
      <tr>
        <td>{WaybillConfigs.properties.expectedDeliveryTime.label}</td>
        <td>{DateUtils.isoDateToString(entity.expectedDeliveryTime, 'DD/MM/YYYY')}</td>
      </tr>
      <tr>
        <td>{WaybillConfigs.properties.status.label}</td>
        <td><StatusToggle status={entity.status} entityId={entity.id} resourceUrl={WaybillConfigs.resourceUrl} resourceKey={WaybillConfigs.resourceKey} /></td>
      </tr>
      <tr>
        <td>{WaybillConfigs.properties.codAmount.label}</td>
        <td>{MiscUtils.formatPrice(entity.codAmount) + ' ₫'}</td>
      </tr>
      <tr>
        <td>{WaybillConfigs.properties.shippingFee.label}</td>
        <td>{MiscUtils.formatPrice(entity.shippingFee) + ' ₫'}</td>
      </tr>
      <tr>
        <td>{WaybillConfigs.properties.size.label}</td>
        <td>
          <div className="flex flex-col gap-0">
            <p className="text-xs">Khối lượng: <b>{entity.weight}</b> (gram)</p>
            <p className="text-xs">Chiều dài: <b>{entity.length}</b> (cm)</p>
            <p className="text-xs">Chiều rộng: <b>{entity.width}</b> (cm)</p>
            <p className="text-xs">Chiều cao: <b>{entity.height}</b> (cm)</p>
          </div>
        </td>
      </tr>
      <tr>
        <td>Kho lấy hàng</td>
        <td>{entity.fromWarehouse?.name}</td>
      </tr>
      <tr>
        <td>Người vận chuyển</td>
        <td>{entity.shipper?.fullname || 'Chưa phân công'}</td>
      </tr>
      <tr>
        <td>Ghi chú vận đơn</td>
        <td className="max-w-[300px]">{entity.note}</td>
      </tr>
      <tr>
        <td>Người trả phí dịch vụ GHN</td>
        <td>{WaybillConfigs.ghnPaymentTypeIdMap[entity.ghnPaymentTypeId]}</td>
      </tr>
      <tr>
        <td>Ghi chú cho dịch vụ GHN</td>
        <td>{WaybillConfigs.ghnRequiredNoteMap[entity.ghnRequiredNote]}</td>
      </tr>
    </>
  );

  return (
    <div className="flex flex-col gap-4">
      <ManageHeader>
        <ManageHeaderTitle
          titleLinks={WaybillConfigs.manageTitleLinks}
          title={WaybillConfigs.manageTitle}
        />
        <ManageHeaderButtons
          listResponse={listResponse}
          resourceUrl={WaybillConfigs.resourceUrl}
          resourceKey={WaybillConfigs.resourceKey}
        />
      </ManageHeader>

      <SearchPanel/>

      {/* Quick Filters */}
      <div className="flex items-center gap-2 bg-slate-100/50 dark:bg-slate-800/40 p-1.5 rounded-xl w-fit border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
        <button
          onClick={() => handleQuickFilterChange('all')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
            quickFilter === 'all'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Tất cả vận đơn
        </button>
        <button
          onClick={() => handleQuickFilterChange('active')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
            quickFilter === 'active'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400'
          }`}
        >
          Vận đơn đang bật
        </button>
        <button
          onClick={() => handleQuickFilterChange('inactive')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
            quickFilter === 'inactive'
              ? 'bg-red-500 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400'
          }`}
        >
          Vận đơn đang tắt
        </button>
      </div>

      <FilterPanel/>

      <ManageMain
        listResponse={listResponse}
        isLoading={isLoading}
      >
        <ManageTable
          listResponse={listResponse}
          properties={WaybillConfigs.properties}
          resourceUrl={WaybillConfigs.resourceUrl}
          resourceKey={WaybillConfigs.resourceKey}
          showedPropertiesFragment={showedPropertiesFragment}
          entityDetailTableRowsFragment={entityDetailTableRowsFragment}
        />
      </ManageMain>

      <ManagePagination listResponse={listResponse}/>

      {/* View Order Modal */}
      {viewOrderModalId !== null && (
        <Dialog open={true} onClose={() => setViewOrderModalId(null)} className="relative z-50">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-h-[90vh] overflow-auto">
              <Dialog.Title className="text-lg font-semibold mb-4">Thông tin đơn hàng</Dialog.Title>
              <EntityDetailTable
                entityDetailTableRowsFragment={OrderConfigs.entityDetailTableRowsFragment}
                resourceUrl={OrderConfigs.resourceUrl}
                resourceKey={OrderConfigs.resourceKey}
                entityId={viewOrderModalId}
              />
            </Dialog.Panel>
          </div>
        </Dialog>
      )}
    </div>
  );
}

export default WaybillManage;
