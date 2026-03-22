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
import { AddressResponse } from 'models/Address';
import { ListResponse } from 'utils/FetchUtils';
import PageConfigs from 'pages/PageConfigs';
import AddressConfigs from 'pages/address/AddressConfigs';
import useResetManagePageState from 'hooks/use-reset-manage-page-state';
import useInitFilterPanelState from 'hooks/use-init-filter-panel-state';
import useGetAllApi from 'hooks/use-get-all-api';
import useAppStore from 'stores/use-app-store';

function AddressManage() {
  useResetManagePageState();
  useInitFilterPanelState(AddressConfigs.properties);

  const {
    isLoading,
    data: listResponse = PageConfigs.initialListResponse as ListResponse<AddressResponse>,
  } = useGetAllApi<AddressResponse>(AddressConfigs.resourceUrl, AddressConfigs.resourceKey);

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

  const showedPropertiesFragment = (entity: AddressResponse) => (
    <>
      <td>{entity.id}</td>
      <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
      <td>{DateUtils.isoDateToString(entity.updatedAt)}</td>
      <td className="text-sm">
        {highlightText(entity.line || '', searchToken)}
      </td>
      <td className="text-sm">
        {highlightText(entity.province?.name || '', searchToken)}
      </td>
      <td className="text-sm">
        {highlightText(entity.district?.name || '', searchToken)}
      </td>
    </>
  );

  const entityDetailTableRowsFragment = (entity: AddressResponse) => (
    <>
      <tr>
        <td>{AddressConfigs.properties.id.label}</td>
        <td>{entity.id}</td>
      </tr>
      <tr>
        <td>{AddressConfigs.properties.createdAt.label}</td>
        <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
      </tr>
      <tr>
        <td>{AddressConfigs.properties.updatedAt.label}</td>
        <td>{DateUtils.isoDateToString(entity.updatedAt)}</td>
      </tr>
      <tr>
        <td>{AddressConfigs.properties.line.label}</td>
        <td>{entity.line}</td>
      </tr>
      <tr>
        <td>{AddressConfigs.properties['province.name'].label}</td>
        <td>{entity.province?.name}</td>
      </tr>
      <tr>
        <td>{AddressConfigs.properties['province.code'].label}</td>
        <td>{entity.province?.code}</td>
      </tr>
      <tr>
        <td>{AddressConfigs.properties['district.name'].label}</td>
        <td>{entity.district?.name}</td>
      </tr>
      <tr>
        <td>{AddressConfigs.properties['district.code'].label}</td>
        <td>{entity.district?.code}</td>
      </tr>
    </>
  );

  return (
    <div className="flex flex-col gap-4">
      <ManageHeader>
        <ManageHeaderTitle
          titleLinks={AddressConfigs.manageTitleLinks}
          title={AddressConfigs.manageTitle}
        />
        <ManageHeaderButtons
          listResponse={listResponse}
          resourceUrl={AddressConfigs.resourceUrl}
          resourceKey={AddressConfigs.resourceKey}
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
          properties={AddressConfigs.properties}
          resourceUrl={AddressConfigs.resourceUrl}
          resourceKey={AddressConfigs.resourceKey}
          showedPropertiesFragment={showedPropertiesFragment}
          entityDetailTableRowsFragment={entityDetailTableRowsFragment}
        />
      </ManageMain>

      <ManagePagination listResponse={listResponse}/>
    </div>
  );
}

export default AddressManage;
