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
import { UserResponse } from 'models/User';
import { ListResponse } from 'utils/FetchUtils';
import PageConfigs from 'pages/PageConfigs';
import UserConfigs from 'pages/user/UserConfigs';
import useResetManagePageState from 'hooks/use-reset-manage-page-state';
import useInitFilterPanelState from 'hooks/use-init-filter-panel-state';
import useGetAllApi from 'hooks/use-get-all-api';
import useAppStore from 'stores/use-app-store';

function UserManage() {
  useResetManagePageState();
  useInitFilterPanelState(UserConfigs.properties);

  const {
    isLoading,
    data: listResponse = PageConfigs.initialListResponse as ListResponse<UserResponse>,
  } = useGetAllApi<UserResponse>(UserConfigs.resourceUrl, UserConfigs.resourceKey);

  const { searchToken } = useAppStore();

  const userStatusBadgeFragment = (status: number) => {
    if (status === 1) {
      return <span className="px-2 py-1 text-xs font-medium border border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-400 rounded">Đã kích hoạt</span>;
    }

    return <span className="px-2 py-1 text-xs font-medium border border-red-300 dark:border-red-600 text-red-700 dark:text-red-400 rounded">Chưa kích hoạt</span>;
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

  const showedPropertiesFragment = (entity: UserResponse) => (
    <>
      <td>{entity.id}</td>
      <td className="text-sm">
        {highlightText(entity.username, searchToken)}
      </td>
      <td className="text-sm">
        {highlightText(entity.fullname, searchToken)}
      </td>
      <td className="text-sm">
        {highlightText(entity.phone, searchToken)}
      </td>
      <td>{entity.gender === 'M' ? 'Nam' : 'Nữ'}</td>
      <td>
        <img src={entity.avatar || undefined} alt={entity.fullname} className="w-8 h-8 rounded-full object-cover" />
      </td>
      <td>{userStatusBadgeFragment(entity.status)}</td>
      <td>
        <div className="flex flex-col gap-1 items-start">
          {entity.roles.map((role, index) => (
            <span key={index} className="px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>
              {role.name}
            </span>
          ))}
        </div>
      </td>
    </>
  );

  const entityDetailTableRowsFragment = (entity: UserResponse) => (
    <>
      <tr>
        <td>{UserConfigs.properties.id.label}</td>
        <td>{entity.id}</td>
      </tr>
      <tr>
        <td>{UserConfigs.properties.createdAt.label}</td>
        <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
      </tr>
      <tr>
        <td>{UserConfigs.properties.updatedAt.label}</td>
        <td>{DateUtils.isoDateToString(entity.updatedAt)}</td>
      </tr>
      <tr>
        <td>{UserConfigs.properties.username.label}</td>
        <td>{entity.username}</td>
      </tr>
      <tr>
        <td>{UserConfigs.properties.fullname.label}</td>
        <td>{entity.fullname}</td>
      </tr>
      <tr>
        <td>{UserConfigs.properties.email.label}</td>
        <td>{entity.email}</td>
      </tr>
      <tr>
        <td>{UserConfigs.properties.phone.label}</td>
        <td>{entity.phone}</td>
      </tr>
      <tr>
        <td>{UserConfigs.properties.gender.label}</td>
        <td>{entity.gender === 'M' ? 'Nam' : 'Nữ'}</td>
      </tr>
      <tr>
        <td>{UserConfigs.properties['address.line'].label}</td>
        <td>{entity.address.line}</td>
      </tr>
      <tr>
        <td>{UserConfigs.properties['address.province.name'].label}</td>
        <td>{entity.address.province?.name}</td>
      </tr>
      <tr>
        <td>{UserConfigs.properties['address.province.code'].label}</td>
        <td>{entity.address.province?.code}</td>
      </tr>
      <tr>
        <td>{UserConfigs.properties['address.district.name'].label}</td>
        <td>{entity.address.district?.name}</td>
      </tr>
      <tr>
        <td>{UserConfigs.properties['address.district.code'].label}</td>
        <td>{entity.address.district?.code}</td>
      </tr>
      <tr>
        <td>{UserConfigs.properties.avatar.label}</td>
        <td>
          <img src={entity.avatar || undefined} alt={entity.fullname} className="w-8 h-8 rounded-full object-cover" />
        </td>
      </tr>
      <tr>
        <td>{UserConfigs.properties.status.label}</td>
        <td>{userStatusBadgeFragment(entity.status)}</td>
      </tr>
      <tr>
        <td>{UserConfigs.properties.roles.label}</td>
        <td>
          <div className="flex flex-col gap-1 items-start">
            {entity.roles.map((role, index) => (
              <span key={index} className="px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>
                {role.name}
              </span>
            ))}
          </div>
        </td>
      </tr>
    </>
  );

  return (
    <div className="flex flex-col gap-4">
      <ManageHeader>
        <ManageHeaderTitle
          titleLinks={UserConfigs.manageTitleLinks}
          title={UserConfigs.manageTitle}
        />
        <ManageHeaderButtons
          listResponse={listResponse}
          resourceUrl={UserConfigs.resourceUrl}
          resourceKey={UserConfigs.resourceKey}
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
          properties={UserConfigs.properties}
          resourceUrl={UserConfigs.resourceUrl}
          resourceKey={UserConfigs.resourceKey}
          showedPropertiesFragment={showedPropertiesFragment}
          entityDetailTableRowsFragment={entityDetailTableRowsFragment}
        />
      </ManageMain>

      <ManagePagination listResponse={listResponse}/>
    </div>
  );
}

export default UserManage;
