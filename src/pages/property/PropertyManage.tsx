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
import { PropertyResponse } from 'models/Property';
import { ListResponse } from 'utils/FetchUtils';
import PageConfigs from 'pages/PageConfigs';
import PropertyConfigs from 'pages/property/PropertyConfigs';
import useResetManagePageState from 'hooks/use-reset-manage-page-state';
import useInitFilterPanelState from 'hooks/use-init-filter-panel-state';
import useGetAllApi from 'hooks/use-get-all-api';
import useAppStore from 'stores/use-app-store';

function PropertyManage() {
  useResetManagePageState();
  useInitFilterPanelState(PropertyConfigs.properties);

  const {
    isLoading,
    data: listResponse = PageConfigs.initialListResponse as ListResponse<PropertyResponse>,
  } = useGetAllApi<PropertyResponse>(PropertyConfigs.resourceUrl, PropertyConfigs.resourceKey);

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

  const showedPropertiesFragment = (entity: PropertyResponse) => (
    <>
      <td>{entity.id}</td>
      <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
      <td>{DateUtils.isoDateToString(entity.updatedAt)}</td>
      <td className="text-sm">
        {highlightText(entity.name, searchToken)}
      </td>
      <td className="text-sm">
        {highlightText(entity.code, searchToken)}
      </td>
    
      <td><StatusToggle status={entity.status} entityId={entity.id} resourceUrl={PropertyConfigs.resourceUrl} resourceKey={PropertyConfigs.resourceKey} /></td></>
  );

  const entityDetailTableRowsFragment = (entity: PropertyResponse) => (
    <>
      <tr>
        <td>{PropertyConfigs.properties.id.label}</td>
        <td>{entity.id}</td>
      </tr>
      <tr>
        <td>{PropertyConfigs.properties.createdAt.label}</td>
        <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
      </tr>
      <tr>
        <td>{PropertyConfigs.properties.updatedAt.label}</td>
        <td>{DateUtils.isoDateToString(entity.updatedAt)}</td>
      </tr>
      <tr>
        <td>{PropertyConfigs.properties.name.label}</td>
        <td>{entity.name}</td>
      </tr>
      <tr>
        <td>{PropertyConfigs.properties.code.label}</td>
        <td>{entity.code}</td>
      </tr>
      <tr>
        <td>{PropertyConfigs.properties.description.label}</td>
        <td className="max-w-[300px]">{entity.description}</td>
      </tr>
      <tr>
        <td>{PropertyConfigs.properties.status.label}</td>
        <td><StatusToggle status={entity.status} entityId={entity.id} resourceUrl={PropertyConfigs.resourceUrl} resourceKey={PropertyConfigs.resourceKey} /></td>
      </tr>
    </>
  );

  return (
    <div className="flex flex-col gap-4">
      <ManageHeader>
        <ManageHeaderTitle
          titleLinks={PropertyConfigs.manageTitleLinks}
          title={PropertyConfigs.manageTitle}
        />
        <ManageHeaderButtons
          listResponse={listResponse}
          resourceUrl={PropertyConfigs.resourceUrl}
          resourceKey={PropertyConfigs.resourceKey}
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
          properties={PropertyConfigs.properties}
          resourceUrl={PropertyConfigs.resourceUrl}
          resourceKey={PropertyConfigs.resourceKey}
          showedPropertiesFragment={showedPropertiesFragment}
          entityDetailTableRowsFragment={entityDetailTableRowsFragment}
        />
      </ManageMain>

      <ManagePagination listResponse={listResponse}/>
    </div>
  );
}

export default PropertyManage;
