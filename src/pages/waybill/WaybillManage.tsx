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

function WaybillManage() {
  useResetManagePageState(WaybillConfigs.resourceKey);
  useInitFilterPanelState(WaybillConfigs.properties);

  const {
    isLoading,
    data: listResponse = PageConfigs.initialListResponse as ListResponse<WaybillResponse>,
  } = useGetAllApi<WaybillResponse>(WaybillConfigs.resourceUrl, WaybillConfigs.resourceKey);

  const { searchToken } = useAppStore();

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
