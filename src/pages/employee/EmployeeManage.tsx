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
import { EmployeeResponse } from 'models/Employee';
import { ListResponse } from 'utils/FetchUtils';
import PageConfigs from 'pages/PageConfigs';
import EmployeeConfigs from 'pages/employee/EmployeeConfigs';
import useResetManagePageState from 'hooks/use-reset-manage-page-state';
import useInitFilterPanelState from 'hooks/use-init-filter-panel-state';
import useGetAllApi from 'hooks/use-get-all-api';
import useAppStore from 'stores/use-app-store';

function EmployeeManage() {
  useResetManagePageState();
  useInitFilterPanelState(EmployeeConfigs.properties);

  const {
    isLoading,
    data: listResponse = PageConfigs.initialListResponse as ListResponse<EmployeeResponse>,
  } = useGetAllApi<EmployeeResponse>(EmployeeConfigs.resourceUrl, EmployeeConfigs.resourceKey);

  const { searchToken } = useAppStore();

  const userStatusBadgeFragment = (status: number) => {
    if (status === 1) {
      return <span className="px-2 py-1 text-xs font-medium border border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-400 rounded">Đã kích hoạt</span>;
    }

    return <span className="px-2 py-1 text-xs font-medium border border-red-300 dark:border-red-600 text-red-700 dark:text-red-400 rounded">Chưa kích hoạt</span>;
  };

  const officeStatusBadgeFragment = (status: number) => {
    if (status === 1) {
      return <span className="px-2 py-1 text-xs font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded">Đang hoạt động</span>;
    }

    if (status === 2) {
      return <span className="px-2 py-1 text-xs font-medium border border-teal-300 dark:border-teal-600 text-teal-700 dark:text-teal-400 rounded">Ít hoạt động</span>;
    }

    return <span className="px-2 py-1 text-xs font-medium border border-red-300 dark:border-red-600 text-red-700 dark:text-red-400 rounded">Không hoạt động</span>;
  };

  const departmentStatusBadgeFragment = (status: number) => {
    if (status === 1) {
      return <span className="px-2 py-1 text-xs font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded">Đang hoạt động</span>;
    }

    if (status === 2) {
      return <span className="px-2 py-1 text-xs font-medium border border-teal-300 dark:border-teal-600 text-teal-700 dark:text-teal-400 rounded">Ít hoạt động</span>;
    }

    return <span className="px-2 py-1 text-xs font-medium border border-red-300 dark:border-red-600 text-red-700 dark:text-red-400 rounded">Không hoạt động</span>;
  };

  const jobTypeStatusBadgeFragment = (status: number) => {
    if (status === 1) {
      return <span className="px-2 py-1 text-xs font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded">Có hiệu lực</span>;
    }

    return <span className="px-2 py-1 text-xs font-medium border border-red-300 dark:border-red-600 text-red-700 dark:text-red-400 rounded">Vô hiệu lực</span>;
  };

  const jobLevelStatusBadgeFragment = (status: number) => {
    if (status === 1) {
      return <span className="px-2 py-1 text-xs font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded">Có hiệu lực</span>;
    }

    return <span className="px-2 py-1 text-xs font-medium border border-red-300 dark:border-red-600 text-red-700 dark:text-red-400 rounded">Vô hiệu lực</span>;
  };

  const jobTitleStatusBadgeFragment = (status: number) => {
    if (status === 1) {
      return <span className="px-2 py-1 text-xs font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded">Có hiệu lực</span>;
    }

    return <span className="px-2 py-1 text-xs font-medium border border-red-300 dark:border-red-600 text-red-700 dark:text-red-400 rounded">Vô hiệu lực</span>;
  };

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

  const showedPropertiesFragment = (entity: EmployeeResponse) => (
    <>
      <td>{entity.id}</td>
      <td className="text-sm">
        {highlightText(entity.user.fullname, searchToken)}
      </td>
      <td>
        <img src={entity.user.avatar || undefined} alt={entity.user.fullname} className="w-8 h-8 rounded-full object-cover" />
      </td>
      <td className="text-sm">
        {highlightText(entity.office.name, searchToken)}
      </td>
      <td className="text-sm">
        {highlightText(entity.department.name, searchToken)}
      </td>
      <td className="text-sm">
        {highlightText(entity.jobType.name, searchToken)}
      </td>
      <td className="text-sm">
        {highlightText(entity.jobLevel.name, searchToken)}
      </td>
      <td className="text-sm">
        {highlightText(entity.jobTitle.name, searchToken)}
      </td>
    </>
  );

  const entityDetailTableRowsFragment = (entity: EmployeeResponse) => (
    <>
      <tr>
        <td>{EmployeeConfigs.properties.id.label}</td>
        <td>{entity.id}</td>
      </tr>
      <tr>
        <td>{EmployeeConfigs.properties.createdAt.label}</td>
        <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
      </tr>
      <tr>
        <td>{EmployeeConfigs.properties.updatedAt.label}</td>
        <td>{DateUtils.isoDateToString(entity.updatedAt)}</td>
      </tr>
      <tr>
        <td>{EmployeeConfigs.properties['user.username'].label}</td>
        <td>{entity.user.username}</td>
      </tr>
      <tr>
        <td>{EmployeeConfigs.properties['user.fullname'].label}</td>
        <td>{entity.user.fullname}</td>
      </tr>
      <tr>
        <td>{EmployeeConfigs.properties['user.email'].label}</td>
        <td>{entity.user.email}</td>
      </tr>
      <tr>
        <td>{EmployeeConfigs.properties['user.phone'].label}</td>
        <td>{entity.user.phone}</td>
      </tr>
      <tr>
        <td>{EmployeeConfigs.properties['user.gender'].label}</td>
        <td>{entity.user.gender === 'M' ? 'Nam' : 'Nữ'}</td>
      </tr>
      <tr>
        <td>{EmployeeConfigs.properties['user.address.line'].label}</td>
        <td>{entity.user.address.line}</td>
      </tr>
      <tr>
        <td>{EmployeeConfigs.properties['user.address.province.name'].label}</td>
        <td>{entity.user.address.province?.name}</td>
      </tr>
      <tr>
        <td>{EmployeeConfigs.properties['user.address.province.code'].label}</td>
        <td>{entity.user.address.province?.code}</td>
      </tr>
      <tr>
        <td>{EmployeeConfigs.properties['user.address.district.name'].label}</td>
        <td>{entity.user.address.district?.name}</td>
      </tr>
      <tr>
        <td>{EmployeeConfigs.properties['user.address.district.code'].label}</td>
        <td>{entity.user.address.district?.code}</td>
      </tr>
      <tr>
        <td>{EmployeeConfigs.properties['user.avatar'].label}</td>
        <td>
          <img src={entity.user.avatar || undefined} alt={entity.user.fullname} className="w-8 h-8 rounded-full object-cover" />
        </td>
      </tr>
      <tr>
        <td>{EmployeeConfigs.properties['user.status'].label}</td>
        <td>{userStatusBadgeFragment(entity.user.status)}</td>
      </tr>
      <tr>
        <td>{EmployeeConfigs.properties['user.roles'].label}</td>
        <td>
          <div className="flex flex-col gap-1 items-start">
            {entity.user.roles.map((role, index) => (
              <span key={index} className="px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>
                {role.name}
              </span>
            ))}
          </div>
        </td>
      </tr>
      <tr>
        <td>{EmployeeConfigs.properties['office.name'].label}</td>
        <td>{entity.office.name}</td>
      </tr>
      <tr>
        <td>{EmployeeConfigs.properties['office.address.line'].label}</td>
        <td>{entity.office.address.line}</td>
      </tr>
      <tr>
        <td>{EmployeeConfigs.properties['office.address.province.name'].label}</td>
        <td>{entity.office.address.province?.name}</td>
      </tr>
      <tr>
        <td>{EmployeeConfigs.properties['office.address.province.code'].label}</td>
        <td>{entity.office.address.province?.code}</td>
      </tr>
      <tr>
        <td>{EmployeeConfigs.properties['office.address.district.name'].label}</td>
        <td>{entity.office.address.district?.name}</td>
      </tr>
      <tr>
        <td>{EmployeeConfigs.properties['office.address.district.code'].label}</td>
        <td>{entity.office.address.district?.code}</td>
      </tr>
      <tr>
        <td>{EmployeeConfigs.properties['office.status'].label}</td>
        <td>{officeStatusBadgeFragment(entity.office.status)}</td>
      </tr>
      <tr>
        <td>{EmployeeConfigs.properties['department.name'].label}</td>
        <td>{entity.department.name}</td>
      </tr>
      <tr>
        <td>{EmployeeConfigs.properties['department.status'].label}</td>
        <td>{departmentStatusBadgeFragment(entity.department.status)}</td>
      </tr>
      <tr>
        <td>{EmployeeConfigs.properties['jobType.name'].label}</td>
        <td>{entity.jobType.name}</td>
      </tr>
      <tr>
        <td>{EmployeeConfigs.properties['jobType.status'].label}</td>
        <td>{jobTypeStatusBadgeFragment(entity.jobType.status)}</td>
      </tr>
      <tr>
        <td>{EmployeeConfigs.properties['jobLevel.name'].label}</td>
        <td>{entity.jobLevel.name}</td>
      </tr>
      <tr>
        <td>{EmployeeConfigs.properties['jobLevel.status'].label}</td>
        <td>{jobLevelStatusBadgeFragment(entity.jobLevel.status)}</td>
      </tr>
      <tr>
        <td>{EmployeeConfigs.properties['jobTitle.name'].label}</td>
        <td>{entity.jobTitle.name}</td>
      </tr>
      <tr>
        <td>{EmployeeConfigs.properties['jobTitle.status'].label}</td>
        <td>{jobTitleStatusBadgeFragment(entity.jobTitle.status)}</td>
      </tr>
    </>
  );

  return (
    <div className="flex flex-col gap-4">
      <ManageHeader>
        <ManageHeaderTitle
          titleLinks={EmployeeConfigs.manageTitleLinks}
          title={EmployeeConfigs.manageTitle}
        />
        <ManageHeaderButtons
          listResponse={listResponse}
          resourceUrl={EmployeeConfigs.resourceUrl}
          resourceKey={EmployeeConfigs.resourceKey}
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
          properties={EmployeeConfigs.properties}
          resourceUrl={EmployeeConfigs.resourceUrl}
          resourceKey={EmployeeConfigs.resourceKey}
          showedPropertiesFragment={showedPropertiesFragment}
          entityDetailTableRowsFragment={entityDetailTableRowsFragment}
        />
      </ManageMain>

      <ManagePagination listResponse={listResponse}/>
    </div>
  );
}

export default EmployeeManage;
