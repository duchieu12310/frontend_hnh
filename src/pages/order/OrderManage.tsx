import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FilterPanel,
  ManageHeader,
  ManageHeaderButtons,
  ManageHeaderTitle,
  ManageMain,
  ManagePagination,
  ManageTable,
  SearchPanel,
  StatusToggle
} from 'components';
import DateUtils from 'utils/DateUtils';
import { OrderResponse } from 'models/Order';
import { ListResponse } from 'utils/FetchUtils';
import PageConfigs from 'pages/PageConfigs';
import OrderConfigs from 'pages/order/OrderConfigs';
import useResetManagePageState from 'hooks/use-reset-manage-page-state';
import useInitFilterPanelState from 'hooks/use-init-filter-panel-state';
import useGetAllApi from 'hooks/use-get-all-api';
import useAppStore from 'stores/use-app-store';
import MiscUtils from 'utils/MiscUtils';
import { Clipboard, Plus } from 'tabler-icons-react';
import NotifyUtils from 'utils/NotifyUtils';
import ManagerPath from 'constants/ManagerPath';
import FilterUtils from 'utils/FilterUtils';

function OrderManage() {
  useResetManagePageState(OrderConfigs.resourceKey);
  useInitFilterPanelState(OrderConfigs.properties);

  const { activePage, activePageSize, activeFilter, searchToken, setActivePage } = useAppStore();
  const [quickFilter, setQuickFilter] = useState<'all' | 'undelivered' | 'delivered'>('all');

  const activeFilterRSQL = FilterUtils.convertToFilterRSQL(activeFilter);

  let customFilter = '';
  if (quickFilter === 'undelivered') {
    customFilter = 'status!=4;status!=5';
  } else if (quickFilter === 'delivered') {
    customFilter = 'status==4';
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
    data: listResponse = PageConfigs.initialListResponse as ListResponse<OrderResponse>,
  } = useGetAllApi<OrderResponse>(OrderConfigs.resourceUrl, OrderConfigs.resourceKey, requestParams);

  const handleQuickFilterChange = (filter: 'all' | 'undelivered' | 'delivered') => {
    setQuickFilter(filter);
    setActivePage(1);
  };



  const highlightText = (text: string, highlight: string, className?: string) => {
    if (!highlight) return <span className={className}>{text}</span>;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <span className={className}>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <mark key={i} className="bg-blue-200 dark:bg-blue-800">{part}</mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  const showedPropertiesFragment = (entity: OrderResponse) => {
    const PaymentMethodIcon = PageConfigs.paymentMethodIconMap[entity.paymentMethodType];

    return (
      <>
        <td>{entity.id}</td>
        <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
        <td>
          <div className="flex items-center gap-2">
            {highlightText(entity.code, searchToken, 'text-sm font-mono')}
            <button
              onClick={() => {
                void navigator.clipboard.writeText(entity.code);
                NotifyUtils.simple(`Đã sao chép mã đơn hàng ${entity.code}`);
              }}
              className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
              title="Sao chép mã đơn hàng này"
            >
              <Clipboard size={15} strokeWidth={1.5}/>
            </button>
          </div>
        </td>
        <td>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: entity.orderResource.color }}></div>
            {highlightText(entity.orderResource.name, searchToken, 'text-sm')}
          </div>
        </td>
        <td>
          <div className="flex flex-col gap-0">
            {highlightText(entity.user.fullname, searchToken, 'text-sm')}
            <span className="text-xs text-gray-500 dark:text-gray-400">{highlightText(entity.user.username, searchToken, '')}</span>
          </div>
        </td>
        <td>
          <div className="flex flex-col gap-0">
            {highlightText(entity.toName, searchToken, 'text-sm')}
            <span className="text-xs">{highlightText(entity.toPhone, searchToken, '')}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{highlightText(entity.toAddress, searchToken, '')}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{highlightText([entity.toWardName, entity.toDistrictName].join(', '), searchToken, '')}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{highlightText(entity.toProvinceName, searchToken, '')}</span>
          </div>
        </td>
        <td>
          <div className="flex flex-col gap-1.5 min-w-[200px] max-w-[250px] max-h-[140px] overflow-y-auto pr-1 text-left">
            {entity.orderVariants?.map((ov, index) => (
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
        <td className="text-right">
          <div className="flex flex-col items-end gap-1">
            <p className="font-medium text-sm">{MiscUtils.formatPrice(entity.totalPay) + ' ₫'}</p>
            <PaymentMethodIcon size={16} className="text-gray-400" />
          </div>
        </td>
        <td>
          {(entity as any).waybill || (entity as any).orderWaybill || entity.status === 2 || entity.status === 3 || entity.status === 4 ? (
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              Đã vận đơn
            </span>
          ) : entity.status === 1 ? (
            <Link
              to={ManagerPath.WAYBILL + '/create?orderId=' + entity.id}
              className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors inline-block"
              title="Tạo vận đơn"
            >
              <Plus size={20} />
            </Link>
          ) : (
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">—</span>
          )}
        </td>
      
        <td>
          <div className="flex flex-col gap-1 items-start">
            {OrderConfigs.orderStatusBadgeFragment(entity.status)}
            {OrderConfigs.orderPaymentStatusBadgeFragment(entity.paymentStatus)}
          </div>
        </td></>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <ManageHeader>
        <ManageHeaderTitle
          titleLinks={OrderConfigs.manageTitleLinks}
          title={OrderConfigs.manageTitle}
        />
        <ManageHeaderButtons
          listResponse={listResponse}
          resourceUrl={OrderConfigs.resourceUrl}
          resourceKey={OrderConfigs.resourceKey}
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
          Tất cả đơn hàng
        </button>
        <button
          onClick={() => handleQuickFilterChange('undelivered')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
            quickFilter === 'undelivered'
              ? 'bg-amber-500 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400'
          }`}
        >
          Đơn hàng chưa giao
        </button>
        <button
          onClick={() => handleQuickFilterChange('delivered')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
            quickFilter === 'delivered'
              ? 'bg-green-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400'
          }`}
        >
          Đã giao hàng
        </button>
      </div>

      <FilterPanel/>

      <ManageMain
        listResponse={listResponse}
        isLoading={isLoading}
      >
        <ManageTable
          listResponse={listResponse}
          properties={OrderConfigs.properties}
          resourceUrl={OrderConfigs.resourceUrl}
          resourceKey={OrderConfigs.resourceKey}
          showedPropertiesFragment={showedPropertiesFragment}
          entityDetailTableRowsFragment={OrderConfigs.entityDetailTableRowsFragment}
          hideEdit={true}
        />
      </ManageMain>

      <ManagePagination listResponse={listResponse}/>
    </div>
  );
}

export default OrderManage;
