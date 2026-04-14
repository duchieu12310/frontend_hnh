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
import { TransitWarehouseResponse } from 'models/TransitWarehouse';
import { ListResponse } from 'utils/FetchUtils';
import PageConfigs from 'pages/PageConfigs';
import TransitWarehouseConfigs from 'pages/transit-warehouse/TransitWarehouseConfigs';
import useResetManagePageState from 'hooks/use-reset-manage-page-state';
import useInitFilterPanelState from 'hooks/use-init-filter-panel-state';
import useGetAllApi from 'hooks/use-get-all-api';
import useAppStore from 'stores/use-app-store';
import DateUtils from 'utils/DateUtils';

function TransitWarehouseManage() {
  useResetManagePageState(TransitWarehouseConfigs.resourceKey);
  useInitFilterPanelState(TransitWarehouseConfigs.properties);

  const {
    isLoading,
    data: listResponse = PageConfigs.initialListResponse as ListResponse<TransitWarehouseResponse>,
  } = useGetAllApi<TransitWarehouseResponse>(TransitWarehouseConfigs.resourceUrl, TransitWarehouseConfigs.resourceKey);

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

  const showedPropertiesFragment = (entity: TransitWarehouseResponse) => (
    <>
      <td>{entity.id}</td>
      <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
      <td>{DateUtils.isoDateToString(entity.updatedAt)}</td>
      <td>{highlightText(entity.code, searchToken)}</td>
      <td>{highlightText(entity.name, searchToken)}</td>
      <td>{entity.mainWarehouse?.name}</td>
      <td className="text-sm">{entity.address?.line}</td>
    </>
  );

  const entityDetailTableRowsFragment = (entity: TransitWarehouseResponse) => (
    <>
      <tr>
        <td>{TransitWarehouseConfigs.properties.id.label}</td>
        <td>{entity.id}</td>
      </tr>
      <tr>
        <td>{TransitWarehouseConfigs.properties.createdAt.label}</td>
        <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
      </tr>
      <tr>
        <td>{TransitWarehouseConfigs.properties.updatedAt.label}</td>
        <td>{DateUtils.isoDateToString(entity.updatedAt)}</td>
      </tr>
      <tr>
        <td>{TransitWarehouseConfigs.properties.code.label}</td>
        <td>{entity.code}</td>
      </tr>
      <tr>
        <td>{TransitWarehouseConfigs.properties.name.label}</td>
        <td>{entity.name}</td>
      </tr>
      <tr>
        <td>{TransitWarehouseConfigs.properties['mainWarehouse.name'].label}</td>
        <td>{entity.mainWarehouse?.name}</td>
      </tr>
      <tr>
        <td>{TransitWarehouseConfigs.properties['address.line'].label}</td>
        <td>{entity.address?.line}</td>
      </tr>
    </>
  );

  return (
    <div className="flex flex-col gap-4">
      <ManageHeader>
        <ManageHeaderTitle
          titleLinks={TransitWarehouseConfigs.manageTitleLinks}
          title={TransitWarehouseConfigs.manageTitle}
        />
        <ManageHeaderButtons
          listResponse={listResponse}
          resourceUrl={TransitWarehouseConfigs.resourceUrl}
          resourceKey={TransitWarehouseConfigs.resourceKey}
        />
      </ManageHeader>

      <SearchPanel />
      <FilterPanel />

      <ManageMain
        listResponse={listResponse}
        isLoading={isLoading}
      >
        <ManageTable<TransitWarehouseResponse>
          listResponse={listResponse}
          properties={TransitWarehouseConfigs.properties}
          resourceUrl={TransitWarehouseConfigs.resourceUrl}
          resourceKey={TransitWarehouseConfigs.resourceKey}
          showedPropertiesFragment={showedPropertiesFragment}
          entityDetailTableRowsFragment={entityDetailTableRowsFragment}
        />
      </ManageMain>

      <ManagePagination listResponse={listResponse} />
    </div>
  );
}

export default TransitWarehouseManage;
