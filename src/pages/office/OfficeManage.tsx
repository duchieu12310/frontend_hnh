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
import { OfficeResponse } from 'models/Office';
import { ListResponse } from 'utils/FetchUtils';
import PageConfigs from 'pages/PageConfigs';
import OfficeConfigs from 'pages/office/OfficeConfigs';
import useResetManagePageState from 'hooks/use-reset-manage-page-state';
import useInitFilterPanelState from 'hooks/use-init-filter-panel-state';
import useGetAllApi from 'hooks/use-get-all-api';
import useAppStore from 'stores/use-app-store';

function OfficeManage() {
  useResetManagePageState();
  useInitFilterPanelState(OfficeConfigs.properties);

  const {
    isLoading,
    data: listResponse = PageConfigs.initialListResponse as ListResponse<OfficeResponse>,
  } = useGetAllApi<OfficeResponse>(OfficeConfigs.resourceUrl, OfficeConfigs.resourceKey);

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

  const showedPropertiesFragment = (entity: OfficeResponse) => (
    <>
      <td>{entity.id}</td>
      <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
      <td>{DateUtils.isoDateToString(entity.updatedAt)}</td>
      <td className="text-sm">
        {highlightText(entity.name, searchToken)}
      </td>
      <td className="text-sm">
        {highlightText(entity.address.line || '', searchToken)}
      </td>
      <td className="text-sm">
        {highlightText(entity.address.province?.name || '', searchToken)}
      </td>
    
      <td><StatusToggle status={entity.status} entityId={entity.id} resourceUrl={OfficeConfigs.resourceUrl} resourceKey={OfficeConfigs.resourceKey} /></td></>
  );

  const entityDetailTableRowsFragment = (entity: OfficeResponse) => (
    <>
      <tr>
        <td>{OfficeConfigs.properties.id.label}</td>
        <td>{entity.id}</td>
      </tr>
      <tr>
        <td>{OfficeConfigs.properties.createdAt.label}</td>
        <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
      </tr>
      <tr>
        <td>{OfficeConfigs.properties.updatedAt.label}</td>
        <td>{DateUtils.isoDateToString(entity.updatedAt)}</td>
      </tr>
      <tr>
        <td>{OfficeConfigs.properties.name.label}</td>
        <td>{entity.name}</td>
      </tr>
      <tr>
        <td>{OfficeConfigs.properties['address.line'].label}</td>
        <td>{entity.address.line}</td>
      </tr>
      <tr>
        <td>{OfficeConfigs.properties['address.province.name'].label}</td>
        <td>{entity.address.province?.name}</td>
      </tr>
      <tr>
        <td>{OfficeConfigs.properties['address.province.code'].label}</td>
        <td>{entity.address.province?.code}</td>
      </tr>
      <tr>
        <td>{OfficeConfigs.properties['address.district.name'].label}</td>
        <td>{entity.address.district?.name}</td>
      </tr>
      <tr>
        <td>{OfficeConfigs.properties['address.district.code'].label}</td>
        <td>{entity.address.district?.code}</td>
      </tr>
      <tr>
        <td>{OfficeConfigs.properties.status.label}</td>
        <td><StatusToggle status={entity.status} entityId={entity.id} resourceUrl={OfficeConfigs.resourceUrl} resourceKey={OfficeConfigs.resourceKey} /></td>
      </tr>
    </>
  );

  return (
    <div className="flex flex-col gap-4">
      <ManageHeader>
        <ManageHeaderTitle
          titleLinks={OfficeConfigs.manageTitleLinks}
          title={OfficeConfigs.manageTitle}
        />
        <ManageHeaderButtons
          listResponse={listResponse}
          resourceUrl={OfficeConfigs.resourceUrl}
          resourceKey={OfficeConfigs.resourceKey}
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
          properties={OfficeConfigs.properties}
          resourceUrl={OfficeConfigs.resourceUrl}
          resourceKey={OfficeConfigs.resourceKey}
          showedPropertiesFragment={showedPropertiesFragment}
          entityDetailTableRowsFragment={entityDetailTableRowsFragment}
        />
      </ManageMain>

      <ManagePagination listResponse={listResponse}/>
    </div>
  );
}

export default OfficeManage;
