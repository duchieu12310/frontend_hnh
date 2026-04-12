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
import { StorageLocationResponse } from 'models/StorageLocation';
import { ListResponse } from 'utils/FetchUtils';
import PageConfigs from 'pages/PageConfigs';
import StorageLocationConfigs from 'pages/storage-location/StorageLocationConfigs';
import useResetManagePageState from 'hooks/use-reset-manage-page-state';
import useInitFilterPanelState from 'hooks/use-init-filter-panel-state';
import useGetAllApi from 'hooks/use-get-all-api';
import useAppStore from 'stores/use-app-store';
import DateUtils from 'utils/DateUtils';

function StorageLocationManage() {
  useResetManagePageState();
  useInitFilterPanelState(StorageLocationConfigs.properties);

  const {
    isLoading,
    data: listResponse = PageConfigs.initialListResponse as ListResponse<StorageLocationResponse>,
  } = useGetAllApi<StorageLocationResponse>(StorageLocationConfigs.resourceUrl, StorageLocationConfigs.resourceKey);

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

  const showedPropertiesFragment = (entity: StorageLocationResponse) => (
    <>
      <td>{entity.id}</td>
      <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
      <td>{DateUtils.isoDateToString(entity.updatedAt)}</td>
      <td>{highlightText(entity.aisle, searchToken)}</td>
      <td>{highlightText(entity.shelf, searchToken)}</td>
      <td>{highlightText(entity.bin, searchToken)}</td>
      <td className="text-sm">{entity.warehouseName}</td>
    </>
  );

  const entityDetailTableRowsFragment = (entity: StorageLocationResponse) => (
    <>
      <tr>
        <td>{StorageLocationConfigs.properties.id.label}</td>
        <td>{entity.id}</td>
      </tr>
      <tr>
        <td>{StorageLocationConfigs.properties.createdAt.label}</td>
        <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
      </tr>
      <tr>
        <td>{StorageLocationConfigs.properties.updatedAt.label}</td>
        <td>{DateUtils.isoDateToString(entity.updatedAt)}</td>
      </tr>
      <tr>
        <td>{StorageLocationConfigs.properties.aisle.label}</td>
        <td>{entity.aisle}</td>
      </tr>
      <tr>
        <td>{StorageLocationConfigs.properties.shelf.label}</td>
        <td>{entity.shelf}</td>
      </tr>
      <tr>
        <td>{StorageLocationConfigs.properties.bin.label}</td>
        <td>{entity.bin}</td>
      </tr>
      <tr>
        <td>{StorageLocationConfigs.properties['warehouse.name'].label}</td>
        <td>{entity.warehouseName}</td>
      </tr>
    </>
  );

  return (
    <div className="flex flex-col gap-4">
      <ManageHeader>
        <ManageHeaderTitle
          titleLinks={StorageLocationConfigs.manageTitleLinks}
          title={StorageLocationConfigs.manageTitle}
        />
        <ManageHeaderButtons
          listResponse={listResponse}
          resourceUrl={StorageLocationConfigs.resourceUrl}
          resourceKey={StorageLocationConfigs.resourceKey}
        />
      </ManageHeader>

      <SearchPanel />
      <FilterPanel />

      <ManageMain
        listResponse={listResponse}
        isLoading={isLoading}
      >
        <ManageTable<StorageLocationResponse>
          listResponse={listResponse}
          properties={StorageLocationConfigs.properties}
          resourceUrl={StorageLocationConfigs.resourceUrl}
          resourceKey={StorageLocationConfigs.resourceKey}
          showedPropertiesFragment={showedPropertiesFragment}
          entityDetailTableRowsFragment={entityDetailTableRowsFragment}
        />
      </ManageMain>

      <ManagePagination listResponse={listResponse} />
    </div>
  );
}

export default StorageLocationManage;
