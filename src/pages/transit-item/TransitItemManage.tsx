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
} from 'components';
import { Badge } from '@mantine/core';
import { TransitItemResponse } from 'models/TransitItem';
import { ListResponse } from 'utils/FetchUtils';
import PageConfigs from 'pages/PageConfigs';
import TransitItemConfigs from 'pages/transit-item/TransitItemConfigs';
import useResetManagePageState from 'hooks/use-reset-manage-page-state';
import useInitFilterPanelState from 'hooks/use-init-filter-panel-state';
import useGetAllApi from 'hooks/use-get-all-api';
import useAppStore from 'stores/use-app-store';
import DateUtils from 'utils/DateUtils';

function TransitItemManage() {
  useResetManagePageState();
  useInitFilterPanelState(TransitItemConfigs.properties);

  const {
    isLoading,
    data: listResponse = PageConfigs.initialListResponse as ListResponse<TransitItemResponse>,
  } = useGetAllApi<TransitItemResponse>(TransitItemConfigs.resourceUrl, TransitItemConfigs.resourceKey);

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

  const statusColorMap: Record<string, string> = {
    'IN_TRANSIT': 'blue',
    'SHIPPING': 'orange',
    'DELIVERED': 'green',
    'CANCELLED': 'red',
  };

  const showedPropertiesFragment = (entity: TransitItemResponse) => (
    <>
      <td>{entity.id}</td>
      <td className="text-sm">{entity.transitWarehouse?.name}</td>
      <td className="text-sm">
        {highlightText(entity.purchaseOrderVariant?.variant?.product?.name || '', searchToken)}
      </td>
      <td>
        <Badge color={statusColorMap[entity.status] || 'gray'}>
          {entity.status}
        </Badge>
      </td>
      <td>{DateUtils.isoDateToString(entity.receivedAt)}</td>
    </>
  );

  const entityDetailTableRowsFragment = (entity: TransitItemResponse) => (
    <>
      <tr>
        <td>{TransitItemConfigs.properties.id.label}</td>
        <td>{entity.id}</td>
      </tr>
      <tr>
        <td>{TransitItemConfigs.properties['transitWarehouse.name'].label}</td>
        <td>{entity.transitWarehouse?.name}</td>
      </tr>
      <tr>
        <td>{TransitItemConfigs.properties['purchaseOrderVariant.variant.product.name'].label}</td>
        <td>{entity.purchaseOrderVariant?.variant?.product?.name}</td>
      </tr>
      <tr>
        <td>{TransitItemConfigs.properties.status.label}</td>
        <td>
          <Badge color={statusColorMap[entity.status] || 'gray'}>
            {entity.status}
          </Badge>
        </td>
      </tr>
      <tr>
        <td>{TransitItemConfigs.properties.receivedAt.label}</td>
        <td>{DateUtils.isoDateToString(entity.receivedAt)}</td>
      </tr>
      <tr>
        <td>{TransitItemConfigs.properties.createdAt.label}</td>
        <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
      </tr>
    </>
  );

  return (
    <div className="flex flex-col gap-4">
      <ManageHeader>
        <ManageHeaderTitle
          titleLinks={TransitItemConfigs.manageTitleLinks}
          title={TransitItemConfigs.manageTitle}
        />
        <ManageHeaderButtons
          listResponse={listResponse}
          resourceUrl={TransitItemConfigs.resourceUrl}
          resourceKey={TransitItemConfigs.resourceKey}
        />
      </ManageHeader>

      <SearchPanel />
      <FilterPanel />

      <ManageMain
        listResponse={listResponse}
        isLoading={isLoading}
      >
        <ManageTable<TransitItemResponse>
          listResponse={listResponse}
          properties={TransitItemConfigs.properties}
          resourceUrl={TransitItemConfigs.resourceUrl}
          resourceKey={TransitItemConfigs.resourceKey}
          showedPropertiesFragment={showedPropertiesFragment}
          entityDetailTableRowsFragment={entityDetailTableRowsFragment}
        />
      </ManageMain>

      <ManagePagination listResponse={listResponse} />
    </div>
  );
}

export default TransitItemManage;
