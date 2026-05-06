import React from 'react';
import {
  ManageHeader,
  ManageHeaderTitle,
  ManageMain,
  ManagePagination,
  ManageTable,
  SearchPanel,
} from 'components';
import { UserResponse } from 'models/User';
import FetchUtils, { ErrorMessage, ListResponse } from 'utils/FetchUtils';
import PageConfigs from 'pages/PageConfigs';
import UserConfigs from 'pages/user/UserConfigs';
import useResetManagePageState from 'hooks/use-reset-manage-page-state';
import useGetAllApi from 'hooks/use-get-all-api';
import useAppStore from 'stores/use-app-store';
import { useMutation, useQueryClient } from 'react-query';
import ResourceURL from 'constants/ResourceURL';
import NotifyUtils from 'utils/NotifyUtils';
import ManagerPath from 'constants/ManagerPath';
import DateUtils from 'utils/DateUtils';

function PartnerApproval() {
  useResetManagePageState('partner-approval');
  
  // Chúng ta sẽ filter cứng status == -1
  const {
    isLoading,
    data: listResponse = PageConfigs.initialListResponse as ListResponse<UserResponse>,
  } = useGetAllApi<UserResponse>(UserConfigs.resourceUrl, 'partner-approval', {
    filter: 'status==-1',
    all: 1
  });

  const queryClient = useQueryClient();
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

  const { mutate: approveUser } = useMutation<void, ErrorMessage, number>(
    (id) => FetchUtils.putWithToken(ResourceURL.ADMIN_APPROVE_USER(id), {}),
    {
      onSuccess: () => {
        NotifyUtils.simpleSuccess('Đã phê duyệt người dùng');
        queryClient.invalidateQueries('partner-approval');
        queryClient.invalidateQueries(UserConfigs.resourceKey);
      },
      onError: (err) => NotifyUtils.simpleFailed(err.message),
    }
  );

  const { mutate: rejectUser } = useMutation<void, ErrorMessage, { id: number, reason: string }>(
    (data) => FetchUtils.putWithToken(ResourceURL.ADMIN_REJECT_USER(data.id), { reason: data.reason }),
    {
      onSuccess: () => {
        NotifyUtils.simpleSuccess('Đã từ chối và xóa tài khoản người dùng');
        queryClient.invalidateQueries('partner-approval');
        queryClient.invalidateQueries(UserConfigs.resourceKey);
      },
      onError: (err) => NotifyUtils.simpleFailed(err.message),
    }
  );

  const handleApprove = (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn phê duyệt đối tác này?')) {
      approveUser(id);
    }
  };

  const handleReject = (id: number) => {
    const reason = window.prompt('Nhập lý do từ chối (Tài khoản sẽ bị xóa):', 'Thông tin không hợp lệ');
    if (reason !== null) {
      rejectUser({ id, reason });
    }
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
      <td>
        <div className="flex flex-col gap-1 items-start">
          {entity.roles.map((role, index) => (
            <span key={index} className="px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded flex items-center gap-1">
              {role.name}
            </span>
          ))}
        </div>
      </td>
      <td>
        <div className="flex gap-2">
          <button
            onClick={() => handleApprove(entity.id)}
            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded shadow-md transition-all transform hover:scale-105"
          >
            Duyệt
          </button>
          <button
            onClick={() => handleReject(entity.id)}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded shadow-md transition-all transform hover:scale-105"
          >
            Từ chối
          </button>
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
        <td>Địa chỉ</td>
        <td>{entity.address.line}, {entity.address.ward?.name}, {entity.address.district?.name}, {entity.address.province?.name}</td>
      </tr>
    </>
  );

  return (
    <div className="flex flex-col gap-4">
      <ManageHeader>
        <ManageHeaderTitle
          titleLinks={[
            { link: ManagerPath.USER, label: 'Quản lý người dùng' },
            { link: ManagerPath.PARTNER_APPROVAL, label: 'Phê duyệt đối tác' }
          ]}
          title="Danh sách đối tác chờ phê duyệt"
        />
      </ManageHeader>

      <SearchPanel />

      <ManageMain
        listResponse={listResponse}
        isLoading={isLoading}
      >
        <ManageTable
          listResponse={listResponse}
          properties={UserConfigs.properties}
          resourceUrl={UserConfigs.resourceUrl}
          resourceKey="partner-approval"
          showedPropertiesFragment={showedPropertiesFragment}
          entityDetailTableRowsFragment={entityDetailTableRowsFragment}
        />
      </ManageMain>

      <ManagePagination listResponse={listResponse}/>
    </div>
  );
}

export default PartnerApproval;
