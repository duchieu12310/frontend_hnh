import React from 'react';
import { Link } from 'react-router-dom';
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
import { CategoryResponse } from 'models/Category';
import { ListResponse } from 'utils/FetchUtils';
import FilterUtils from 'utils/FilterUtils';
import PageConfigs from 'pages/PageConfigs';
import CategoryConfigs from 'pages/category/CategoryConfigs';
import useResetManagePageState from 'hooks/use-reset-manage-page-state';
import useInitFilterPanelState from 'hooks/use-init-filter-panel-state';
import useGetAllApi from 'hooks/use-get-all-api';
import useAppStore from 'stores/use-app-store';
import { FilePlus } from 'tabler-icons-react';

function CategoryManage() {
  useResetManagePageState();
  useInitFilterPanelState(CategoryConfigs.properties);

  const {
    activePage,
    activePageSize,
    activeFilter,
    searchToken,
  } = useAppStore();

  const activeFilterRSQL = FilterUtils.convertToFilterRSQL(activeFilter);
  const requestParams = {
    page: activePage,
    size: activePageSize,
    sort: FilterUtils.convertToSortRSQL(activeFilter),
    filter: activeFilterRSQL ? `${activeFilterRSQL};level==1` : 'level==1',
    search: searchToken,
  };

  const {
    isLoading,
    data: listResponse = PageConfigs.initialListResponse as ListResponse<CategoryResponse>,
  } = useGetAllApi<CategoryResponse>(CategoryConfigs.resourceUrl, CategoryConfigs.resourceKey, requestParams);

  const actionButtonsFragment = (entity: CategoryResponse) => {
    if (entity.level >= 3) {
      return null;
    }
    return (
      <Link
        to={`/admin/category/create?parentCategoryId=${entity.id}`}
        title="Thêm thể loại con"
        className="p-1.5 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded transition-colors inline-block"
      >
        <FilePlus size={16} />
      </Link>
    );
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

  const showedPropertiesFragment = (entity: CategoryResponse) => (
    <>
      <td>{entity.id}</td>
      <td className="text-sm">
        {highlightText(entity.name, searchToken)}
      </td>
      <td className="text-sm">
        {highlightText(entity.slug, searchToken)}
      </td>
      <td className="text-sm">
        {entity.level}
      </td>
      <td>{entity.parentCategory ? entity.parentCategory.name : <em>không có</em>}</td>
    
      <td><StatusToggle status={entity.status} entityId={entity.id} resourceUrl={CategoryConfigs.resourceUrl} resourceKey={CategoryConfigs.resourceKey} /></td></>
  );

  const entityDetailTableRowsFragment = (entity: CategoryResponse) => (
    <>
      <tr>
        <td>{CategoryConfigs.properties.id.label}</td>
        <td>{entity.id}</td>
      </tr>
      <tr>
        <td>{CategoryConfigs.properties.createdAt.label}</td>
        <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
      </tr>
      <tr>
        <td>{CategoryConfigs.properties.updatedAt.label}</td>
        <td>{DateUtils.isoDateToString(entity.updatedAt)}</td>
      </tr>
      <tr>
        <td>{CategoryConfigs.properties.name.label}</td>
        <td>{entity.name}</td>
      </tr>
      <tr>
        <td>{CategoryConfigs.properties.slug.label}</td>
        <td>{entity.slug}</td>
      </tr>
      <tr>
        <td>{CategoryConfigs.properties.level.label}</td>
        <td>{entity.level}</td>
      </tr>
      <tr>
        <td>{CategoryConfigs.properties['parentCategory.name'].label}</td>
        <td>{entity.parentCategory ? entity.parentCategory.name : <em>không có</em>}</td>
      </tr>
      <tr>
        <td>{CategoryConfigs.properties.status.label}</td>
        <td><StatusToggle status={entity.status} entityId={entity.id} resourceUrl={CategoryConfigs.resourceUrl} resourceKey={CategoryConfigs.resourceKey} /></td>
      </tr>
      <tr>
        <td>Thể loại con</td>
        <td>
          {entity.children && entity.children.length > 0 ? (
            <ul className="list-disc list-inside">
              {entity.children.map(child => <li key={child.id}>{child.name}</li>)}
            </ul>
          ) : <em>không có</em>}
        </td>
      </tr>
    </>
  );

  const entityDetailActionsFragment = (entity: CategoryResponse, handlers: { onClose: () => void, onDelete: (id: number) => void }) => (
    <>
      <Link
        to={`/admin/product?categoryId=${entity.id}`}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
        onClick={handlers.onClose}
      >
        Xem sản phẩm
      </Link>
      <button
        className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
        onClick={() => handlers.onDelete(entity.id)}
      >
        Xóa
      </button>
      <Link
        to={`/admin/category/update/${entity.id}`}
        className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-md transition-colors"
        onClick={handlers.onClose}
      >
        Sửa
      </Link>
      {entity.level < 3 && (
        <Link
          to={`/admin/category/create?parentCategoryId=${entity.id}`}
          className="px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-md transition-colors"
          onClick={handlers.onClose}
        >
          Thêm thể loại con
        </Link>
      )}
    </>
  );

  return (
    <div className="flex flex-col gap-4">
      <ManageHeader>
        <ManageHeaderTitle
          titleLinks={CategoryConfigs.manageTitleLinks}
          title={CategoryConfigs.manageTitle}
        />
        <ManageHeaderButtons
          listResponse={listResponse}
          resourceUrl={CategoryConfigs.resourceUrl}
          resourceKey={CategoryConfigs.resourceKey}
        />
      </ManageHeader>

      <SearchPanel />

      <FilterPanel />

      <ManageMain
        listResponse={listResponse}
        isLoading={isLoading}
      >
        <ManageTable
          listResponse={listResponse}
          properties={CategoryConfigs.properties}
          resourceUrl={CategoryConfigs.resourceUrl}
          resourceKey={CategoryConfigs.resourceKey}
          showedPropertiesFragment={showedPropertiesFragment}
          entityDetailTableRowsFragment={entityDetailTableRowsFragment}
          entityDetailActionsFragment={entityDetailActionsFragment}
          actionButtonsFragment={actionButtonsFragment}
          customViewEntityLink={(entity) => `/admin/category/detail/${entity.id}`}
        />
      </ManageMain>

      <ManagePagination listResponse={listResponse} />
    </div>
  );
}

export default CategoryManage;
