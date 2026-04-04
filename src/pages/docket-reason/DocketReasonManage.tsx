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
import { DocketReasonResponse } from 'models/DocketReason';
import { ListResponse } from 'utils/FetchUtils';
import PageConfigs from 'pages/PageConfigs';
import DocketReasonConfigs from 'pages/docket-reason/DocketReasonConfigs';
import useResetManagePageState from 'hooks/use-reset-manage-page-state';
import useInitFilterPanelState from 'hooks/use-init-filter-panel-state';
import useGetAllApi from 'hooks/use-get-all-api';
import useAppStore from 'stores/use-app-store';

function DocketReasonManage() {
  useResetManagePageState();
  useInitFilterPanelState(DocketReasonConfigs.properties);

  const {
    isLoading,
    data: listResponse = PageConfigs.initialListResponse as ListResponse<DocketReasonResponse>,
  } = useGetAllApi<DocketReasonResponse>(DocketReasonConfigs.resourceUrl, DocketReasonConfigs.resourceKey);

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

  const showedPropertiesFragment = (entity: DocketReasonResponse) => (
    <>
      <td>{entity.id}</td>
      <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
      <td>{DateUtils.isoDateToString(entity.updatedAt)}</td>
      <td className="text-sm">
        {highlightText(entity.name, searchToken)}
      </td>
    
      <td><StatusToggle status={entity.status} entityId={entity.id} resourceUrl={DocketReasonConfigs.resourceUrl} resourceKey={DocketReasonConfigs.resourceKey} /></td></>
  );

  const entityDetailTableRowsFragment = (entity: DocketReasonResponse) => (
    <>
      <tr>
        <td>{DocketReasonConfigs.properties.id.label}</td>
        <td>{entity.id}</td>
      </tr>
      <tr>
        <td>{DocketReasonConfigs.properties.createdAt.label}</td>
        <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
      </tr>
      <tr>
        <td>{DocketReasonConfigs.properties.updatedAt.label}</td>
        <td>{DateUtils.isoDateToString(entity.updatedAt)}</td>
      </tr>
      <tr>
        <td>{DocketReasonConfigs.properties.name.label}</td>
        <td>{entity.name}</td>
      </tr>
      <tr>
        <td>{DocketReasonConfigs.properties.status.label}</td>
        <td><StatusToggle status={entity.status} entityId={entity.id} resourceUrl={DocketReasonConfigs.resourceUrl} resourceKey={DocketReasonConfigs.resourceKey} /></td>
      </tr>
    </>
  );

  return (
    <div className="flex flex-col gap-4">
      <ManageHeader>
        <ManageHeaderTitle
          titleLinks={DocketReasonConfigs.manageTitleLinks}
          title={DocketReasonConfigs.manageTitle}
        />
        <ManageHeaderButtons
          listResponse={listResponse}
          resourceUrl={DocketReasonConfigs.resourceUrl}
          resourceKey={DocketReasonConfigs.resourceKey}
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
          properties={DocketReasonConfigs.properties}
          resourceUrl={DocketReasonConfigs.resourceUrl}
          resourceKey={DocketReasonConfigs.resourceKey}
          showedPropertiesFragment={showedPropertiesFragment}
          entityDetailTableRowsFragment={entityDetailTableRowsFragment}
        />
      </ManageMain>

      <ManagePagination listResponse={listResponse}/>
    </div>
  );
}

export default DocketReasonManage;
