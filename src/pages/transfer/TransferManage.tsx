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
import { TransferResponse } from 'models/Transfer';
import { ListResponse } from 'utils/FetchUtils';
import PageConfigs from 'pages/PageConfigs';
import TransferConfigs from 'pages/transfer/TransferConfigs';
import useResetManagePageState from 'hooks/use-reset-manage-page-state';
import useInitFilterPanelState from 'hooks/use-init-filter-panel-state';
import useGetAllApi from 'hooks/use-get-all-api';
import useAppStore from 'stores/use-app-store';
import MiscUtils from 'utils/MiscUtils';
import { ArrowNarrowRight } from 'tabler-icons-react';

function TransferManage() {
  useResetManagePageState(TransferConfigs.resourceKey);
  useInitFilterPanelState(TransferConfigs.properties);

  const {
    isLoading,
    data: listResponse = PageConfigs.initialListResponse as ListResponse<TransferResponse>,
  } = useGetAllApi<TransferResponse>(TransferConfigs.resourceUrl, TransferConfigs.resourceKey);

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

  const docketStatusBadgeFragment = (status: number) => {
    const isActive = status === 1;
    return (
      <div className="inline-flex cursor-default" title={isActive ? 'Bật (Có hiệu lực)' : 'Tắt (Vô hiệu lực)'}>
        <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${isActive ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${isActive ? 'translate-x-[18px]' : 'translate-x-[2px]'}`} />
        </div>
      </div>
    );
  };

  const showedPropertiesFragment = (entity: TransferResponse) => (
    <>
      <td>{entity.id}</td>
      <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
      <td className="text-sm">
        {highlightText(entity.code, searchToken)}
      </td>
      <td>{entity.exportDocket.warehouse.name}</td>
      <td><ArrowNarrowRight size={18} className="text-gray-400" /></td>
      <td>{entity.importDocket.warehouse.name}</td>
      <td>{docketStatusBadgeFragment(entity.importDocket.status)}</td>
    
      <td>{docketStatusBadgeFragment(entity.exportDocket.status)}</td></>
  );

  const entityDetailTableRowsFragment = (entity: TransferResponse) => (
    <>
      <tr>
        <td>{TransferConfigs.properties.id.label}</td>
        <td>{entity.id}</td>
      </tr>
      <tr>
        <td>{TransferConfigs.properties.createdAt.label}</td>
        <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
      </tr>
      <tr>
        <td>{TransferConfigs.properties.updatedAt.label}</td>
        <td>{DateUtils.isoDateToString(entity.updatedAt)}</td>
      </tr>
      <tr>
        <td>{TransferConfigs.properties.code.label}</td>
        <td>{entity.code}</td>
      </tr>
      <tr>
        <td>Mã phiếu xuất</td>
        <td>{entity.exportDocket.code}</td>
      </tr>
      <tr>
        <td>{TransferConfigs.properties['exportDocket.warehouse.name'].label}</td>
        <td>{entity.exportDocket.warehouse.name}</td>
      </tr>
      <tr>
        <td>{TransferConfigs.properties['exportDocket.status'].label}</td>
        <td>{docketStatusBadgeFragment(entity.exportDocket.status)}</td>
      </tr>
      <tr>
        <td>Mã phiếu nhập</td>
        <td>{entity.importDocket.code}</td>
      </tr>
      <tr>
        <td>{TransferConfigs.properties['importDocket.warehouse.name'].label}</td>
        <td>{entity.importDocket.warehouse.name}</td>
      </tr>
      <tr>
        <td>{TransferConfigs.properties['importDocket.status'].label}</td>
        <td>{docketStatusBadgeFragment(entity.importDocket.status)}</td>
      </tr>
      <tr>
        <td>Số mặt hàng</td>
        <td>{MiscUtils.formatPrice(entity.exportDocket.docketVariants.length)} SKU</td>
      </tr>
      <tr>
        <td>{TransferConfigs.properties.note.label}</td>
        <td className="max-w-[300px]">{entity.note}</td>
      </tr>
    </>
  );

  return (
    <div className="flex flex-col gap-4">
      <ManageHeader>
        <ManageHeaderTitle
          titleLinks={TransferConfigs.manageTitleLinks}
          title={TransferConfigs.manageTitle}
        />
        <ManageHeaderButtons
          listResponse={listResponse}
          resourceUrl={TransferConfigs.resourceUrl}
          resourceKey={TransferConfigs.resourceKey}
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
          properties={TransferConfigs.properties}
          resourceUrl={TransferConfigs.resourceUrl}
          resourceKey={TransferConfigs.resourceKey}
          showedPropertiesFragment={showedPropertiesFragment}
          entityDetailTableRowsFragment={entityDetailTableRowsFragment}
        />
      </ManageMain>

      <ManagePagination listResponse={listResponse}/>
    </div>
  );
}

export default TransferManage;
