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
import { CountResponse } from 'models/Count';
import { ListResponse } from 'utils/FetchUtils';
import PageConfigs from 'pages/PageConfigs';
import CountConfigs from 'pages/count/CountConfigs';
import useResetManagePageState from 'hooks/use-reset-manage-page-state';
import useInitFilterPanelState from 'hooks/use-init-filter-panel-state';
import useGetAllApi from 'hooks/use-get-all-api';
import useAppStore from 'stores/use-app-store';
import MiscUtils from 'utils/MiscUtils';

function CountManage() {
  useResetManagePageState();
  useInitFilterPanelState(CountConfigs.properties);

  const {
    isLoading,
    data: listResponse = PageConfigs.initialListResponse as ListResponse<CountResponse>,
  } = useGetAllApi<CountResponse>(CountConfigs.resourceUrl, CountConfigs.resourceKey);

  const { searchToken } = useAppStore();

  const countStatusBadgeFragment = (status: number) => {
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

  const showedPropertiesFragment = (entity: CountResponse) => (
    <>
      <td>{entity.id}</td>
      <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
      <td className="text-sm">
        {highlightText(entity.code, searchToken)}
      </td>
      <td className="text-right">
        {MiscUtils.formatPrice(entity.countVariants.length)} SKU
      </td>
      <td className="text-sm">
        {highlightText(entity.warehouse.name, searchToken)}
      </td>
      <td>{countStatusBadgeFragment(entity.status)}</td>
    </>
  );

  const entityDetailTableRowsFragment = (entity: CountResponse) => (
    <>
      <tr>
        <td>{CountConfigs.properties.id.label}</td>
        <td>{entity.id}</td>
      </tr>
      <tr>
        <td>{CountConfigs.properties.createdAt.label}</td>
        <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
      </tr>
      <tr>
        <td>{CountConfigs.properties.updatedAt.label}</td>
        <td>{DateUtils.isoDateToString(entity.updatedAt)}</td>
      </tr>
      <tr>
        <td>{CountConfigs.properties.code.label}</td>
        <td>{entity.code}</td>
      </tr>
      <tr>
        <td>{CountConfigs.properties['warehouse.name'].label}</td>
        <td>{entity.warehouse.name}</td>
      </tr>
      <tr>
        <td>{CountConfigs.properties.totalVariants.label}</td>
        <td>{MiscUtils.formatPrice(entity.countVariants.length)} SKU</td>
      </tr>
      <tr>
        <td>Ghi chú phiếu kiểm kho</td>
        <td className="max-w-[300px]">{entity.note}</td>
      </tr>
      <tr>
        <td>{CountConfigs.properties.status.label}</td>
        <td>{countStatusBadgeFragment(entity.status)}</td>
      </tr>
    </>
  );

  return (
    <div className="flex flex-col gap-4">
      <ManageHeader>
        <ManageHeaderTitle
          titleLinks={CountConfigs.manageTitleLinks}
          title={CountConfigs.manageTitle}
        />
        <ManageHeaderButtons
          listResponse={listResponse}
          resourceUrl={CountConfigs.resourceUrl}
          resourceKey={CountConfigs.resourceKey}
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
          properties={CountConfigs.properties}
          resourceUrl={CountConfigs.resourceUrl}
          resourceKey={CountConfigs.resourceKey}
          showedPropertiesFragment={showedPropertiesFragment}
          entityDetailTableRowsFragment={entityDetailTableRowsFragment}
        />
      </ManageMain>

      <ManagePagination listResponse={listResponse}/>
    </div>
  );
}

export default CountManage;
