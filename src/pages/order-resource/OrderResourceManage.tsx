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
import { OrderResourceResponse } from 'models/OrderResource';
import { ListResponse } from 'utils/FetchUtils';
import PageConfigs from 'pages/PageConfigs';
import OrderResourceConfigs from 'pages/order-resource/OrderResourceConfigs';
import useResetManagePageState from 'hooks/use-reset-manage-page-state';
import useInitFilterPanelState from 'hooks/use-init-filter-panel-state';
import useGetAllApi from 'hooks/use-get-all-api';
import useAppStore from 'stores/use-app-store';

function OrderResourceManage() {
  useResetManagePageState(OrderResourceConfigs.resourceKey);
  useInitFilterPanelState(OrderResourceConfigs.properties);

  const {
    isLoading,
    data: listResponse = PageConfigs.initialListResponse as ListResponse<OrderResourceResponse>,
  } = useGetAllApi<OrderResourceResponse>(OrderResourceConfigs.resourceUrl, OrderResourceConfigs.resourceKey);

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

  const showedPropertiesFragment = (entity: OrderResourceResponse) => (
    <>
      <td>{entity.id}</td>
      <td className="text-sm">
        {highlightText(entity.code, searchToken)}
      </td>
      <td className="text-sm">
        {highlightText(entity.name, searchToken)}
      </td>
      <td>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: entity.color }}></div>
          <code className="text-xs bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded">{entity.color.toLowerCase()}</code>
        </div>
      </td>
      <td>
        {entity.customerResource && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: entity.customerResource.color }}></div>
            <span className="text-sm">{highlightText(entity.customerResource.name, searchToken)}</span>
          </div>
        )}
      </td>
    
      <td><StatusToggle status={entity.status} entityId={entity.id} resourceUrl={OrderResourceConfigs.resourceUrl} resourceKey={OrderResourceConfigs.resourceKey} /></td></>
  );

  const entityDetailTableRowsFragment = (entity: OrderResourceResponse) => (
    <>
      <tr>
        <td>{OrderResourceConfigs.properties.id.label}</td>
        <td>{entity.id}</td>
      </tr>
      <tr>
        <td>{OrderResourceConfigs.properties.createdAt.label}</td>
        <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
      </tr>
      <tr>
        <td>{OrderResourceConfigs.properties.updatedAt.label}</td>
        <td>{DateUtils.isoDateToString(entity.updatedAt)}</td>
      </tr>
      <tr>
        <td>{OrderResourceConfigs.properties.code.label}</td>
        <td>{entity.code}</td>
      </tr>
      <tr>
        <td>{OrderResourceConfigs.properties.name.label}</td>
        <td>{entity.name}</td>
      </tr>
      <tr>
        <td>{OrderResourceConfigs.properties.color.label}</td>
        <td>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: entity.color }}></div>
            <code className="text-xs bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded">{entity.color.toLowerCase()}</code>
          </div>
        </td>
      </tr>
      <tr>
        <td>{OrderResourceConfigs.properties['customerResource.name'].label}</td>
        <td>
          {entity.customerResource && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: entity.customerResource.color }}></div>
              <span>{entity.customerResource.name}</span>
            </div>
          )}
        </td>
      </tr>
      <tr>
        <td>{OrderResourceConfigs.properties.status.label}</td>
        <td><StatusToggle status={entity.status} entityId={entity.id} resourceUrl={OrderResourceConfigs.resourceUrl} resourceKey={OrderResourceConfigs.resourceKey} /></td>
      </tr>
    </>
  );

  return (
    <div className="flex flex-col gap-4">
      <ManageHeader>
        <ManageHeaderTitle
          titleLinks={OrderResourceConfigs.manageTitleLinks}
          title={OrderResourceConfigs.manageTitle}
        />
        <ManageHeaderButtons
          listResponse={listResponse}
          resourceUrl={OrderResourceConfigs.resourceUrl}
          resourceKey={OrderResourceConfigs.resourceKey}
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
          properties={OrderResourceConfigs.properties}
          resourceUrl={OrderResourceConfigs.resourceUrl}
          resourceKey={OrderResourceConfigs.resourceKey}
          showedPropertiesFragment={showedPropertiesFragment}
          entityDetailTableRowsFragment={entityDetailTableRowsFragment}
        />
      </ManageMain>

      <ManagePagination listResponse={listResponse}/>
    </div>
  );
}

export default OrderResourceManage;
