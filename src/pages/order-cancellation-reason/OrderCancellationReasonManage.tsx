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
import { OrderCancellationReasonResponse } from 'models/OrderCancellationReason';
import { ListResponse } from 'utils/FetchUtils';
import PageConfigs from 'pages/PageConfigs';
import OrderCancellationReasonConfigs from 'pages/order-cancellation-reason/OrderCancellationReasonConfigs';
import useResetManagePageState from 'hooks/use-reset-manage-page-state';
import useInitFilterPanelState from 'hooks/use-init-filter-panel-state';
import useGetAllApi from 'hooks/use-get-all-api';
import useAppStore from 'stores/use-app-store';

function OrderCancellationReasonManage() {
  useResetManagePageState();
  useInitFilterPanelState(OrderCancellationReasonConfigs.properties);

  const {
    isLoading,
    data: listResponse = PageConfigs.initialListResponse as ListResponse<OrderCancellationReasonResponse>,
  } = useGetAllApi<OrderCancellationReasonResponse>(OrderCancellationReasonConfigs.resourceUrl, OrderCancellationReasonConfigs.resourceKey);

  const { searchToken } = useAppStore();

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

  const showedPropertiesFragment = (entity: OrderCancellationReasonResponse) => (
    <>
      <td>{entity.id}</td>
      <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
      <td>{DateUtils.isoDateToString(entity.updatedAt)}</td>
      <td className="text-sm">
        {highlightText(entity.name, searchToken)}
      </td>
    
      <td><StatusToggle status={entity.status} entityId={entity.id} resourceUrl={OrderCancellationReasonConfigs.resourceUrl} resourceKey={OrderCancellationReasonConfigs.resourceKey} /></td></>
  );

  const entityDetailTableRowsFragment = (entity: OrderCancellationReasonResponse) => (
    <>
      <tr>
        <td>{OrderCancellationReasonConfigs.properties.id.label}</td>
        <td>{entity.id}</td>
      </tr>
      <tr>
        <td>{OrderCancellationReasonConfigs.properties.createdAt.label}</td>
        <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
      </tr>
      <tr>
        <td>{OrderCancellationReasonConfigs.properties.updatedAt.label}</td>
        <td>{DateUtils.isoDateToString(entity.updatedAt)}</td>
      </tr>
      <tr>
        <td>{OrderCancellationReasonConfigs.properties.name.label}</td>
        <td>{entity.name}</td>
      </tr>
      <tr>
        <td>{OrderCancellationReasonConfigs.properties.note.label}</td>
        <td className="max-w-[300px]">{entity.note}</td>
      </tr>
      <tr>
        <td>{OrderCancellationReasonConfigs.properties.status.label}</td>
        <td><StatusToggle status={entity.status} entityId={entity.id} resourceUrl={OrderCancellationReasonConfigs.resourceUrl} resourceKey={OrderCancellationReasonConfigs.resourceKey} /></td>
      </tr>
    </>
  );

  return (
    <div className="flex flex-col gap-4">
      <ManageHeader>
        <ManageHeaderTitle
          titleLinks={OrderCancellationReasonConfigs.manageTitleLinks}
          title={OrderCancellationReasonConfigs.manageTitle}
        />
        <ManageHeaderButtons
          listResponse={listResponse}
          resourceUrl={OrderCancellationReasonConfigs.resourceUrl}
          resourceKey={OrderCancellationReasonConfigs.resourceKey}
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
          properties={OrderCancellationReasonConfigs.properties}
          resourceUrl={OrderCancellationReasonConfigs.resourceUrl}
          resourceKey={OrderCancellationReasonConfigs.resourceKey}
          showedPropertiesFragment={showedPropertiesFragment}
          entityDetailTableRowsFragment={entityDetailTableRowsFragment}
        />
      </ManageMain>

      <ManagePagination listResponse={listResponse}/>
    </div>
  );
}

export default OrderCancellationReasonManage;
