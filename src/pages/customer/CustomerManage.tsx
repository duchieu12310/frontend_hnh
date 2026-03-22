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
import { CustomerResponse } from 'models/Customer';
import { ListResponse } from 'utils/FetchUtils';
import PageConfigs from 'pages/PageConfigs';
import CustomerConfigs from 'pages/customer/CustomerConfigs';
import useResetManagePageState from 'hooks/use-reset-manage-page-state';
import useInitFilterPanelState from 'hooks/use-init-filter-panel-state';
import useGetAllApi from 'hooks/use-get-all-api';
import useAppStore from 'stores/use-app-store';

function CustomerManage() {
  useResetManagePageState();
  useInitFilterPanelState(CustomerConfigs.properties);

  const {
    isLoading,
    data: listResponse = PageConfigs.initialListResponse as ListResponse<CustomerResponse>,
  } = useGetAllApi<CustomerResponse>(CustomerConfigs.resourceUrl, CustomerConfigs.resourceKey);

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

  const showedPropertiesFragment = (entity: CustomerResponse) => (
    <>
      <td>{entity.id}</td>
      <td className="text-sm">
        {highlightText(entity.user.fullname, searchToken)}
      </td>
      <td className="text-sm">
        {highlightText(entity.user.phone, searchToken)}
      </td>
      <td>
        <img src={entity.user.avatar || undefined} alt={entity.user.fullname} className="w-8 h-8 rounded-full object-cover" />
      </td>
      <td>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: entity.customerGroup.color }}></div>
          <span className="text-sm">{highlightText(entity.customerGroup.name, searchToken)}</span>
        </div>
      </td>
      <td>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: entity.customerStatus.color }}></div>
          <span className="text-sm">{highlightText(entity.customerStatus.name, searchToken)}</span>
        </div>
      </td>
      <td>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: entity.customerResource.color }}></div>
          <span className="text-sm">{highlightText(entity.customerResource.name, searchToken)}</span>
        </div>
      </td>
    </>
  );

  const entityDetailTableRowsFragment = (entity: CustomerResponse) => (
    <>
      <tr>
        <td>{CustomerConfigs.properties.id.label}</td>
        <td>{entity.id}</td>
      </tr>
      <tr>
        <td>{CustomerConfigs.properties.createdAt.label}</td>
        <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
      </tr>
      <tr>
        <td>{CustomerConfigs.properties.updatedAt.label}</td>
        <td>{DateUtils.isoDateToString(entity.updatedAt)}</td>
      </tr>
      <tr>
        <td>{CustomerConfigs.properties['user.username'].label}</td>
        <td>{entity.user.username}</td>
      </tr>
      <tr>
        <td>{CustomerConfigs.properties['user.fullname'].label}</td>
        <td>{entity.user.fullname}</td>
      </tr>
      <tr>
        <td>{CustomerConfigs.properties['user.email'].label}</td>
        <td>{entity.user.email}</td>
      </tr>
      <tr>
        <td>{CustomerConfigs.properties['user.phone'].label}</td>
        <td>{entity.user.phone}</td>
      </tr>
      <tr>
        <td>{CustomerConfigs.properties['user.gender'].label}</td>
        <td>{entity.user.gender === 'M' ? 'Nam' : 'Nữ'}</td>
      </tr>
      <tr>
        <td>{CustomerConfigs.properties['user.address.line'].label}</td>
        <td>{entity.user.address.line}</td>
      </tr>
      <tr>
        <td>{CustomerConfigs.properties['user.address.province.name'].label}</td>
        <td>{entity.user.address.province?.name}</td>
      </tr>
      <tr>
        <td>{CustomerConfigs.properties['user.address.province.code'].label}</td>
        <td>{entity.user.address.province?.code}</td>
      </tr>
      <tr>
        <td>{CustomerConfigs.properties['user.address.district.name'].label}</td>
        <td>{entity.user.address.district?.name}</td>
      </tr>
      <tr>
        <td>{CustomerConfigs.properties['user.address.district.code'].label}</td>
        <td>{entity.user.address.district?.code}</td>
      </tr>
      <tr>
        <td>{CustomerConfigs.properties['user.avatar'].label}</td>
        <td>
          <img src={entity.user.avatar || undefined} alt={entity.user.fullname} className="w-8 h-8 rounded-full object-cover" />
        </td>
      </tr>
      <tr>
        <td>{CustomerConfigs.properties['user.status'].label}</td>
        <td>{userStatusBadgeFragment(entity.user.status)}</td>
      </tr>
      <tr>
        <td>{CustomerConfigs.properties['user.roles'].label}</td>
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
        <td>{CustomerConfigs.properties['customerGroup.name'].label}</td>
        <td>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: entity.customerGroup.color }}></div>
            <span>{entity.customerGroup.name}</span>
          </div>
        </td>
      </tr>
      <tr>
        <td>{CustomerConfigs.properties['customerStatus.name'].label}</td>
        <td>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: entity.customerStatus.color }}></div>
            <span>{entity.customerStatus.name}</span>
          </div>
        </td>
      </tr>
      <tr>
        <td>{CustomerConfigs.properties['customerResource.name'].label}</td>
        <td>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: entity.customerResource.color }}></div>
            <span>{entity.customerResource.name}</span>
          </div>
        </td>
      </tr>
    </>
  );

  return (
    <div className="flex flex-col gap-4">
      <ManageHeader>
        <ManageHeaderTitle
          titleLinks={CustomerConfigs.manageTitleLinks}
          title={CustomerConfigs.manageTitle}
        />
        <ManageHeaderButtons
          listResponse={listResponse}
          resourceUrl={CustomerConfigs.resourceUrl}
          resourceKey={CustomerConfigs.resourceKey}
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
          properties={CustomerConfigs.properties}
          resourceUrl={CustomerConfigs.resourceUrl}
          resourceKey={CustomerConfigs.resourceKey}
          showedPropertiesFragment={showedPropertiesFragment}
          entityDetailTableRowsFragment={entityDetailTableRowsFragment}
        />
      </ManageMain>

      <ManagePagination listResponse={listResponse}/>
    </div>
  );
}

export default CustomerManage;
