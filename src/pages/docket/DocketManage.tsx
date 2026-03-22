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
import { DocketResponse } from 'models/Docket';
import { ListResponse } from 'utils/FetchUtils';
import PageConfigs from 'pages/PageConfigs';
import DocketConfigs from 'pages/docket/DocketConfigs';
import useResetManagePageState from 'hooks/use-reset-manage-page-state';
import useInitFilterPanelState from 'hooks/use-init-filter-panel-state';
import useGetAllApi from 'hooks/use-get-all-api';
import useAppStore from 'stores/use-app-store';
import MiscUtils from 'utils/MiscUtils';

function DocketManage() {
  useResetManagePageState();
  useInitFilterPanelState(DocketConfigs.properties);

  const {
    isLoading,
    data: listResponse = PageConfigs.initialListResponse as ListResponse<DocketResponse>,
  } = useGetAllApi<DocketResponse>(DocketConfigs.resourceUrl, DocketConfigs.resourceKey);

  const { searchToken } = useAppStore();

  const docketTypeBadgeFragment = (type: number) => {
    switch (type) {
    case 1:
      return <span className="px-2 py-1 text-xs font-medium bg-blue-500 text-white rounded">Nhập</span>;
    case 2:
      return <span className="px-2 py-1 text-xs font-medium bg-orange-500 text-white rounded">Xuất</span>;
    }
  };

  const docketStatusBadgeFragment = (status: number) => {
    switch (status) {
    case 1:
      return <span className="px-2 py-1 text-xs font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded">Mới</span>;
    case 2:
      return <span className="px-2 py-1 text-xs font-medium border border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-400 rounded">Đang xử lý</span>;
    case 3:
      return <span className="px-2 py-1 text-xs font-medium border border-green-300 dark:border-green-600 text-green-700 dark:text-green-400 rounded">Hoàn thành</span>;
    case 4:
      return <span className="px-2 py-1 text-xs font-medium border border-red-300 dark:border-red-600 text-red-700 dark:text-red-400 rounded">Hủy bỏ</span>;
    }
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

  const showedPropertiesFragment = (entity: DocketResponse) => (
    <>
      <td>{entity.id}</td>
      <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
      <td>{docketTypeBadgeFragment(entity.type)}</td>
      <td className="text-sm">
        {highlightText(entity.code, searchToken)}
      </td>
      <td className="text-right">
        {MiscUtils.formatPrice(entity.docketVariants.length)} SKU
      </td>
      <td className="text-sm">
        {highlightText(entity.reason.name, searchToken)}
      </td>
      <td className="text-sm">
        {highlightText(entity.warehouse.name, searchToken)}
      </td>
      <td>{docketStatusBadgeFragment(entity.status)}</td>
    </>
  );

  const entityDetailTableRowsFragment = (entity: DocketResponse) => (
    <>
      <tr>
        <td>{DocketConfigs.properties.id.label}</td>
        <td>{entity.id}</td>
      </tr>
      <tr>
        <td>{DocketConfigs.properties.createdAt.label}</td>
        <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
      </tr>
      <tr>
        <td>{DocketConfigs.properties.updatedAt.label}</td>
        <td>{DateUtils.isoDateToString(entity.updatedAt)}</td>
      </tr>
      <tr>
        <td>{DocketConfigs.properties.type.label}</td>
        <td>{docketTypeBadgeFragment(entity.type)}</td>
      </tr>
      <tr>
        <td>{DocketConfigs.properties.code.label}</td>
        <td>{entity.code}</td>
      </tr>
      <tr>
        <td>{DocketConfigs.properties.totalVariants.label}</td>
        <td>{MiscUtils.formatPrice(entity.docketVariants.length)} SKU</td>
      </tr>
      <tr>
        <td>{DocketConfigs.properties['reason.name'].label}</td>
        <td>{entity.reason.name}</td>
      </tr>
      <tr>
        <td>{DocketConfigs.properties['warehouse.name'].label}</td>
        <td>{entity.warehouse.name}</td>
      </tr>
      <tr>
        <td>Mã đơn mua hàng</td>
        <td>{entity.purchaseOrder?.code}</td>
      </tr>
      <tr>
        <td>Mã đơn hàng</td>
        <td>{entity.order?.code}</td>
      </tr>
      <tr>
        <td>{DocketConfigs.properties.note.label}</td>
        <td className="max-w-[300px]">{entity.note}</td>
      </tr>
      <tr>
        <td>{DocketConfigs.properties.status.label}</td>
        <td>{docketStatusBadgeFragment(entity.status)}</td>
      </tr>
    </>
  );

  return (
    <div className="flex flex-col gap-4">
      <ManageHeader>
        <ManageHeaderTitle
          titleLinks={DocketConfigs.manageTitleLinks}
          title={DocketConfigs.manageTitle}
        />
        <ManageHeaderButtons
          listResponse={listResponse}
          resourceUrl={DocketConfigs.resourceUrl}
          resourceKey={DocketConfigs.resourceKey}
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
          properties={DocketConfigs.properties}
          resourceUrl={DocketConfigs.resourceUrl}
          resourceKey={DocketConfigs.resourceKey}
          showedPropertiesFragment={showedPropertiesFragment}
          entityDetailTableRowsFragment={entityDetailTableRowsFragment}
        />
      </ManageMain>

      <ManagePagination listResponse={listResponse}/>
    </div>
  );
}

export default DocketManage;
