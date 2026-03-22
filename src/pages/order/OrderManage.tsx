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
import DocketConfigs from 'pages/docket/DocketConfigs';

function OrderManage() {
  useResetManagePageState();
  useInitFilterPanelState(OrderConfigs.properties);

  const {
    isLoading,
    data: listResponse = PageConfigs.initialListResponse as ListResponse<OrderResponse>,
  } = useGetAllApi<OrderResponse>(OrderConfigs.resourceUrl, OrderConfigs.resourceKey);

  const { searchToken } = useAppStore();

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
        <td className="text-right">
          <div className="flex flex-col items-end gap-1">
            <p className="font-medium text-sm">{MiscUtils.formatPrice(entity.totalPay) + ' ₫'}</p>
            <PaymentMethodIcon size={16} className="text-gray-400" />
          </div>
        </td>
        <td>
          <a
            href={DocketConfigs.managerPath + '/create'}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors inline-block"
            title="Tạo phiếu xuất kho"
          >
            <Plus size={20} />
          </a>
        </td>
        <td>
          <div className="flex flex-col gap-1 items-start">
            {OrderConfigs.orderStatusBadgeFragment(entity.status)}
            {OrderConfigs.orderPaymentStatusBadgeFragment(entity.paymentStatus)}
          </div>
        </td>
      </>
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
        />
      </ManageMain>

      <ManagePagination listResponse={listResponse}/>
    </div>
  );
}

export default OrderManage;
