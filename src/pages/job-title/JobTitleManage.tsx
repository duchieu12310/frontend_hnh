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
import { JobTitleResponse } from 'models/JobTitle';
import { ListResponse } from 'utils/FetchUtils';
import PageConfigs from 'pages/PageConfigs';
import JobTitleConfigs from 'pages/job-title/JobTitleConfigs';
import useResetManagePageState from 'hooks/use-reset-manage-page-state';
import useInitFilterPanelState from 'hooks/use-init-filter-panel-state';
import useGetAllApi from 'hooks/use-get-all-api';
import useAppStore from 'stores/use-app-store';

function JobTitleManage() {
  useResetManagePageState();
  useInitFilterPanelState(JobTitleConfigs.properties);

  const {
    isLoading,
    data: listResponse = PageConfigs.initialListResponse as ListResponse<JobTitleResponse>,
  } = useGetAllApi<JobTitleResponse>(JobTitleConfigs.resourceUrl, JobTitleConfigs.resourceKey);

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

  const showedPropertiesFragment = (entity: JobTitleResponse) => (
    <>
      <td>{entity.id}</td>
      <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
      <td>{DateUtils.isoDateToString(entity.updatedAt)}</td>
      <td className="text-sm">
        {highlightText(entity.name, searchToken)}
      </td>
    
      <td><StatusToggle status={entity.status} entityId={entity.id} resourceUrl={JobTitleConfigs.resourceUrl} resourceKey={JobTitleConfigs.resourceKey} /></td></>
  );

  const entityDetailTableRowsFragment = (entity: JobTitleResponse) => (
    <>
      <tr>
        <td>{JobTitleConfigs.properties.id.label}</td>
        <td>{entity.id}</td>
      </tr>
      <tr>
        <td>{JobTitleConfigs.properties.createdAt.label}</td>
        <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
      </tr>
      <tr>
        <td>{JobTitleConfigs.properties.updatedAt.label}</td>
        <td>{DateUtils.isoDateToString(entity.updatedAt)}</td>
      </tr>
      <tr>
        <td>{JobTitleConfigs.properties.name.label}</td>
        <td>{entity.name}</td>
      </tr>
      <tr>
        <td>{JobTitleConfigs.properties.status.label}</td>
        <td><StatusToggle status={entity.status} entityId={entity.id} resourceUrl={JobTitleConfigs.resourceUrl} resourceKey={JobTitleConfigs.resourceKey} /></td>
      </tr>
    </>
  );

  return (
    <div className="flex flex-col gap-4">
      <ManageHeader>
        <ManageHeaderTitle
          titleLinks={JobTitleConfigs.manageTitleLinks}
          title={JobTitleConfigs.manageTitle}
        />
        <ManageHeaderButtons
          listResponse={listResponse}
          resourceUrl={JobTitleConfigs.resourceUrl}
          resourceKey={JobTitleConfigs.resourceKey}
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
          properties={JobTitleConfigs.properties}
          resourceUrl={JobTitleConfigs.resourceUrl}
          resourceKey={JobTitleConfigs.resourceKey}
          showedPropertiesFragment={showedPropertiesFragment}
          entityDetailTableRowsFragment={entityDetailTableRowsFragment}
        />
      </ManageMain>

      <ManagePagination listResponse={listResponse}/>
    </div>
  );
}

export default JobTitleManage;
