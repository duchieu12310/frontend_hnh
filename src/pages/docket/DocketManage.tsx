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

  const highlightText = (text: string, highlight: string) => {
    if (!text) return '';
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

  const docketTypeBadgeFragment = (type: number) => {
    switch (type) {
    case 1:
      return <span className="px-2 py-1 text-xs font-medium bg-blue-500 text-white rounded">Nhập</span>;
    case 2:
      return <span className="px-2 py-1 text-xs font-medium bg-orange-500 text-white rounded">Xuất</span>;
    }
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
    
      <td><StatusToggle status={entity.status} entityId={entity.id} resourceUrl={DocketConfigs.resourceUrl} resourceKey={DocketConfigs.resourceKey} /></td></>
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
        <td><StatusToggle status={entity.status} entityId={entity.id} resourceUrl={DocketConfigs.resourceUrl} resourceKey={DocketConfigs.resourceKey} /></td>
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
