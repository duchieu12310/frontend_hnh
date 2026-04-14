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
import { PromotionResponse } from 'models/Promotion';
import { ListResponse } from 'utils/FetchUtils';
import PageConfigs from 'pages/PageConfigs';
import PromotionConfigs from 'pages/promotion/PromotionConfigs';
import useResetManagePageState from 'hooks/use-reset-manage-page-state';
import useInitFilterPanelState from 'hooks/use-init-filter-panel-state';
import useGetAllApi from 'hooks/use-get-all-api';
import useAppStore from 'stores/use-app-store';

function PromotionManage() {
  useResetManagePageState(PromotionConfigs.resourceKey);
  useInitFilterPanelState(PromotionConfigs.properties);

  const {
    isLoading,
    data: listResponse = PageConfigs.initialListResponse as ListResponse<PromotionResponse>,
  } = useGetAllApi<PromotionResponse>(PromotionConfigs.resourceUrl, PromotionConfigs.resourceKey);

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

  const showedPropertiesFragment = (entity: PromotionResponse) => (
    <>
      <td>{entity.id}</td>
      <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
      <td className="text-sm">
        {highlightText(entity.name, searchToken)}
      </td>
      <td>{DateUtils.isoDateToString(entity.startDate)}</td>
      <td>{DateUtils.isoDateToString(entity.endDate)}</td>
      <td>{entity.percent}%</td>
      <td>{entity.products.length} sản phẩm</td>
    
      <td><StatusToggle status={entity.status} entityId={entity.id} resourceUrl={PromotionConfigs.resourceUrl} resourceKey={PromotionConfigs.resourceKey} /></td></>
  );

  const entityDetailTableRowsFragment = (entity: PromotionResponse) => (
    <>
      <tr>
        <td>{PromotionConfigs.properties.id.label}</td>
        <td>{entity.id}</td>
      </tr>
      <tr>
        <td>{PromotionConfigs.properties.createdAt.label}</td>
        <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
      </tr>
      <tr>
        <td>{PromotionConfigs.properties.updatedAt.label}</td>
        <td>{DateUtils.isoDateToString(entity.updatedAt)}</td>
      </tr>
      <tr>
        <td>{PromotionConfigs.properties.name.label}</td>
        <td>{entity.name}</td>
      </tr>
      <tr>
        <td>{PromotionConfigs.properties.startDate.label}</td>
        <td>{DateUtils.isoDateToString(entity.startDate)}</td>
      </tr>
      <tr>
        <td>{PromotionConfigs.properties.endDate.label}</td>
        <td>{DateUtils.isoDateToString(entity.endDate)}</td>
      </tr>
      <tr>
        <td>{PromotionConfigs.properties.percent.label}</td>
        <td>{entity.percent}%</td>
      </tr>
      <tr>
        <td>{PromotionConfigs.properties.status.label}</td>
        <td><StatusToggle status={entity.status} entityId={entity.id} resourceUrl={PromotionConfigs.resourceUrl} resourceKey={PromotionConfigs.resourceKey} /></td>
      </tr>
      <tr>
        <td>{PromotionConfigs.properties.numberOfProducts.label}</td>
        <td>{entity.products.length} sản phẩm</td>
      </tr>
    </>
  );

  return (
    <div className="flex flex-col gap-4">
      <ManageHeader>
        <ManageHeaderTitle
          titleLinks={PromotionConfigs.manageTitleLinks}
          title={PromotionConfigs.manageTitle}
        />
        <ManageHeaderButtons
          listResponse={listResponse}
          resourceUrl={PromotionConfigs.resourceUrl}
          resourceKey={PromotionConfigs.resourceKey}
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
          properties={PromotionConfigs.properties}
          resourceUrl={PromotionConfigs.resourceUrl}
          resourceKey={PromotionConfigs.resourceKey}
          showedPropertiesFragment={showedPropertiesFragment}
          entityDetailTableRowsFragment={entityDetailTableRowsFragment}
        />
      </ManageMain>

      <ManagePagination listResponse={listResponse}/>
    </div>
  );
}

export default PromotionManage;
