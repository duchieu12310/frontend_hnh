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
import { DestinationResponse } from 'models/Destination';
import { ListResponse } from 'utils/FetchUtils';
import PageConfigs from 'pages/PageConfigs';
import DestinationConfigs from 'pages/destination/DestinationConfigs';
import useResetManagePageState from 'hooks/use-reset-manage-page-state';
import useInitFilterPanelState from 'hooks/use-init-filter-panel-state';
import useGetAllApi from 'hooks/use-get-all-api';
import useAppStore from 'stores/use-app-store';

function DestinationManage() {
  useResetManagePageState();
  useInitFilterPanelState(DestinationConfigs.properties);

  const {
    isLoading,
    data: listResponse = PageConfigs.initialListResponse as ListResponse<DestinationResponse>,
  } = useGetAllApi<DestinationResponse>(DestinationConfigs.resourceUrl, DestinationConfigs.resourceKey);

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

  const showedPropertiesFragment = (entity: DestinationResponse) => (
    <>
      <td>{entity.id}</td>
      <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
      <td>{DateUtils.isoDateToString(entity.updatedAt)}</td>
      <td className="text-sm">
        {highlightText(entity.address.line || '', searchToken)}
      </td>
      <td className="text-sm">
        {highlightText(entity.address.province?.name || '', searchToken)}
      </td>
      <td className="text-sm">
        {highlightText(entity.address.district?.name || '', searchToken)}
      </td>
    
      <td><StatusToggle status={entity.status} entityId={entity.id} resourceUrl={DestinationConfigs.resourceUrl} resourceKey={DestinationConfigs.resourceKey} /></td></>
  );

  const entityDetailTableRowsFragment = (entity: DestinationResponse) => (
    <>
      <tr>
        <td>{DestinationConfigs.properties.id.label}</td>
        <td>{entity.id}</td>
      </tr>
      <tr>
        <td>{DestinationConfigs.properties.createdAt.label}</td>
        <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
      </tr>
      <tr>
        <td>{DestinationConfigs.properties.updatedAt.label}</td>
        <td>{DateUtils.isoDateToString(entity.updatedAt)}</td>
      </tr>
      <tr>
        <td>{DestinationConfigs.properties.contactFullname.label}</td>
        <td>{entity.contactFullname}</td>
      </tr>
      <tr>
        <td>{DestinationConfigs.properties.contactEmail.label}</td>
        <td>{entity.contactEmail}</td>
      </tr>
      <tr>
        <td>{DestinationConfigs.properties.contactPhone.label}</td>
        <td>{entity.contactPhone}</td>
      </tr>
      <tr>
        <td>{DestinationConfigs.properties['address.line'].label}</td>
        <td>{entity.address.line}</td>
      </tr>
      <tr>
        <td>{DestinationConfigs.properties['address.province.name'].label}</td>
        <td>{entity.address.province?.name}</td>
      </tr>
      <tr>
        <td>{DestinationConfigs.properties['address.district.name'].label}</td>
        <td>{entity.address.district?.name}</td>
      </tr>
      <tr>
        <td>{DestinationConfigs.properties.status.label}</td>
        <td><StatusToggle status={entity.status} entityId={entity.id} resourceUrl={DestinationConfigs.resourceUrl} resourceKey={DestinationConfigs.resourceKey} /></td>
      </tr>
    </>
  );

  return (
    <div className="flex flex-col gap-4">
      <ManageHeader>
        <ManageHeaderTitle
          titleLinks={DestinationConfigs.manageTitleLinks}
          title={DestinationConfigs.manageTitle}
        />
        <ManageHeaderButtons
          listResponse={listResponse}
          resourceUrl={DestinationConfigs.resourceUrl}
          resourceKey={DestinationConfigs.resourceKey}
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
          properties={DestinationConfigs.properties}
          resourceUrl={DestinationConfigs.resourceUrl}
          resourceKey={DestinationConfigs.resourceKey}
          showedPropertiesFragment={showedPropertiesFragment}
          entityDetailTableRowsFragment={entityDetailTableRowsFragment}
        />
      </ManageMain>

      <ManagePagination listResponse={listResponse}/>
    </div>
  );
}

export default DestinationManage;
