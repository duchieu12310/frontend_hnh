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
import { SupplierResponse } from 'models/Supplier';
import { ListResponse } from 'utils/FetchUtils';
import PageConfigs from 'pages/PageConfigs';
import SupplierConfigs from 'pages/supplier/SupplierConfigs';
import useResetManagePageState from 'hooks/use-reset-manage-page-state';
import useInitFilterPanelState from 'hooks/use-init-filter-panel-state';
import useGetAllApi from 'hooks/use-get-all-api';
import useAppStore from 'stores/use-app-store';

function SupplierManage() {
  useResetManagePageState();
  useInitFilterPanelState(SupplierConfigs.properties);

  const {
    isLoading,
    data: listResponse = PageConfigs.initialListResponse as ListResponse<SupplierResponse>,
  } = useGetAllApi<SupplierResponse>(SupplierConfigs.resourceUrl, SupplierConfigs.resourceKey);

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

  const showedPropertiesFragment = (entity: SupplierResponse) => (
    <>
      <td>{entity.id}</td>
      <td className="text-sm">
        {highlightText(entity.displayName, searchToken)}
      </td>
      <td className="text-sm">
        {highlightText(entity.code, searchToken)}
      </td>
      <td className="text-sm">
        {highlightText(entity.contactFullname || '', searchToken)}
      </td>
      <td className="text-sm">
        {highlightText(entity.contactPhone || '', searchToken)}
      </td>
      <td className="text-sm">
        {highlightText(entity.companyName || '', searchToken)}
      </td>
    
      <td><StatusToggle status={entity.status} entityId={entity.id} resourceUrl={SupplierConfigs.resourceUrl} resourceKey={SupplierConfigs.resourceKey} /></td></>
  );

  const entityDetailTableRowsFragment = (entity: SupplierResponse) => (
    <>
      <tr>
        <td>{SupplierConfigs.properties.id.label}</td>
        <td>{entity.id}</td>
      </tr>
      <tr>
        <td>{SupplierConfigs.properties.createdAt.label}</td>
        <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
      </tr>
      <tr>
        <td>{SupplierConfigs.properties.updatedAt.label}</td>
        <td>{DateUtils.isoDateToString(entity.updatedAt)}</td>
      </tr>
      <tr>
        <td>{SupplierConfigs.properties.displayName.label}</td>
        <td>{entity.displayName}</td>
      </tr>
      <tr>
        <td>{SupplierConfigs.properties.code.label}</td>
        <td>{entity.code}</td>
      </tr>
      <tr>
        <td>{SupplierConfigs.properties.contactFullname.label}</td>
        <td>{entity.contactFullname}</td>
      </tr>
      <tr>
        <td>{SupplierConfigs.properties.contactEmail.label}</td>
        <td>{entity.contactEmail}</td>
      </tr>
      <tr>
        <td>{SupplierConfigs.properties.contactPhone.label}</td>
        <td>{entity.contactPhone}</td>
      </tr>
      <tr>
        <td>{SupplierConfigs.properties.companyName.label}</td>
        <td>{entity.companyName}</td>
      </tr>
      <tr>
        <td>{SupplierConfigs.properties.taxCode.label}</td>
        <td>{entity.taxCode}</td>
      </tr>
      <tr>
        <td>{SupplierConfigs.properties.email.label}</td>
        <td>{entity.email}</td>
      </tr>
      <tr>
        <td>{SupplierConfigs.properties.phone.label}</td>
        <td>{entity.phone}</td>
      </tr>
      <tr>
        <td>{SupplierConfigs.properties.fax.label}</td>
        <td>{entity.fax}</td>
      </tr>
      <tr>
        <td>{SupplierConfigs.properties.website.label}</td>
        <td>{entity.website}</td>
      </tr>
      <tr>
        <td>{SupplierConfigs.properties['address.line'].label}</td>
        <td>{entity.address?.line}</td>
      </tr>
      <tr>
        <td>{SupplierConfigs.properties['address.province.name'].label}</td>
        <td>{entity.address?.province?.name}</td>
      </tr>
      <tr>
        <td>{SupplierConfigs.properties['address.district.name'].label}</td>
        <td>{entity.address?.district?.name}</td>
      </tr>
      <tr>
        <td>{SupplierConfigs.properties.description.label}</td>
        <td className="max-w-[300px]">{entity.description}</td>
      </tr>
      <tr>
        <td>{SupplierConfigs.properties.note.label}</td>
        <td className="max-w-[300px]">{entity.note}</td>
      </tr>
      <tr>
        <td>{SupplierConfigs.properties.status.label}</td>
        <td><StatusToggle status={entity.status} entityId={entity.id} resourceUrl={SupplierConfigs.resourceUrl} resourceKey={SupplierConfigs.resourceKey} /></td>
      </tr>
    </>
  );

  return (
    <div className="flex flex-col gap-4">
      <ManageHeader>
        <ManageHeaderTitle
          titleLinks={SupplierConfigs.manageTitleLinks}
          title={SupplierConfigs.manageTitle}
        />
        <ManageHeaderButtons
          listResponse={listResponse}
          resourceUrl={SupplierConfigs.resourceUrl}
          resourceKey={SupplierConfigs.resourceKey}
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
          properties={SupplierConfigs.properties}
          resourceUrl={SupplierConfigs.resourceUrl}
          resourceKey={SupplierConfigs.resourceKey}
          showedPropertiesFragment={showedPropertiesFragment}
          entityDetailTableRowsFragment={entityDetailTableRowsFragment}
        />
      </ManageMain>

      <ManagePagination listResponse={listResponse}/>
    </div>
  );
}

export default SupplierManage;
