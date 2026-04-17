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
import { RoleResponse } from 'models/Role';
import { ListResponse } from 'utils/FetchUtils';
import PageConfigs from 'pages/PageConfigs';
import RoleConfigs from 'pages/role/RoleConfigs';
import useResetManagePageState from 'hooks/use-reset-manage-page-state';
import useInitFilterPanelState from 'hooks/use-init-filter-panel-state';
import useGetAllApi from 'hooks/use-get-all-api';
import useAppStore from 'stores/use-app-store';

function RoleManage() {
  useResetManagePageState(RoleConfigs.resourceKey);
  useInitFilterPanelState(RoleConfigs.properties);

  const {
    isLoading,
    data: listResponse = PageConfigs.initialListResponse as ListResponse<RoleResponse>,
  } = useGetAllApi<RoleResponse>(RoleConfigs.resourceUrl, RoleConfigs.resourceKey);

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

  const showedPropertiesFragment = (entity: RoleResponse) => (
    <>
      <td>{entity.id}</td>
      <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
      <td>{DateUtils.isoDateToString(entity.updatedAt)}</td>
      <td className="text-sm">
        {highlightText(entity.code, searchToken)}
      </td>
      <td className="text-sm">
        {highlightText(entity.name, searchToken)}
      </td>
    
      <td>
        <div className="flex justify-center">
          <div className={`px-3 py-1 rounded-full text-xs font-bold ${entity.status === 1 ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-700'}`}>
            {entity.status === 1 ? 'BẬT' : 'TẮT'}
          </div>
        </div>
      </td>
    </>
  );

  const entityDetailTableRowsFragment = (entity: RoleResponse) => (
    <>
      <tr>
        <td>{RoleConfigs.properties.id.label}</td>
        <td>{entity.id}</td>
      </tr>
      <tr>
        <td>{RoleConfigs.properties.createdAt.label}</td>
        <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
      </tr>
      <tr>
        <td>{RoleConfigs.properties.updatedAt.label}</td>
        <td>{DateUtils.isoDateToString(entity.updatedAt)}</td>
      </tr>
      <tr>
        <td>{RoleConfigs.properties.code.label}</td>
        <td><code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm">{entity.code}</code></td>
      </tr>
      <tr>
        <td>{RoleConfigs.properties.name.label}</td>
        <td>{entity.name}</td>
      </tr>
      <tr>
        <td>{RoleConfigs.properties.status.label}</td>
        <td>
          <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${entity.status === 1 ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-700'}`}>
            {entity.status === 1 ? 'Đang hoạt động' : 'Đã khóa'}
          </div>
        </td>
      </tr>
    </>
  );

  return (
    <div className="flex flex-col gap-4">
      <ManageHeader>
        <ManageHeaderTitle
          titleLinks={RoleConfigs.manageTitleLinks}
          title={RoleConfigs.manageTitle}
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
          properties={RoleConfigs.properties}
          resourceUrl={RoleConfigs.resourceUrl}
          resourceKey={RoleConfigs.resourceKey}
          showedPropertiesFragment={showedPropertiesFragment}
          entityDetailTableRowsFragment={entityDetailTableRowsFragment}
          hideEdit={true}
          hideDelete={true}
        />
      </ManageMain>

      <ManagePagination listResponse={listResponse}/>
    </div>
  );
}

export default RoleManage;
