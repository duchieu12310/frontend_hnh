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
  VariantTablePopover,
  StatusToggle,
} from 'components';
import DateUtils from 'utils/DateUtils';
import { ProductResponse } from 'models/Product';
import { ListResponse } from 'utils/FetchUtils';
import PageConfigs from 'pages/PageConfigs';
import ProductConfigs from 'pages/product/ProductConfigs';
import useResetManagePageState from 'hooks/use-reset-manage-page-state';
import useInitFilterPanelState from 'hooks/use-init-filter-panel-state';
import useGetAllApi from 'hooks/use-get-all-api';
import useAppStore from 'stores/use-app-store';
import { QuestionMark } from 'tabler-icons-react';
import { useColorScheme } from 'hooks/use-color-scheme';
import { useNavigate, useSearchParams } from 'react-router-dom';
import FilterUtils from 'utils/FilterUtils';

function ProductManage() {
  const { colorScheme } = useColorScheme();
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('categoryId');
  const navigate = useNavigate();

  useResetManagePageState(ProductConfigs.resourceKey);
  useInitFilterPanelState(ProductConfigs.properties);

  const { searchToken, activePage, activePageSize, activeFilter } = useAppStore();

  const activeFilterRSQL = FilterUtils.convertToFilterRSQL(activeFilter);
  const defaultFilter = categoryId ? `category.id==${categoryId}` : '';

  const requestParams = {
    page: activePage,
    size: activePageSize,
    sort: FilterUtils.convertToSortRSQL(activeFilter),
    filter: activeFilterRSQL ? (defaultFilter ? `${activeFilterRSQL};${defaultFilter}` : activeFilterRSQL) : defaultFilter,
    search: searchToken,
  };

  const {
    isLoading,
    data: listResponse = PageConfigs.initialListResponse as ListResponse<ProductResponse>,
  } = useGetAllApi<ProductResponse>(ProductConfigs.resourceUrl, ProductConfigs.resourceKey, requestParams);

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

  const showedPropertiesFragment = (entity: ProductResponse) => {
    const thumbnailImage = entity.images.find((image) => image.isThumbnail);

    return (
      <>
        <td>{entity.id}</td>
        <td className="text-sm">
          {highlightText(entity.name, searchToken)}
        </td>
        <td className="text-sm">
          {highlightText(entity.code, searchToken)}
        </td>
        <td>
          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center border border-gray-200 dark:border-gray-600 shadow-sm">
            {thumbnailImage?.path ? (
              <img src={thumbnailImage.path} alt={entity.name} className="w-full h-full object-cover" />
            ) : (
              <QuestionMark size={30} className="text-gray-400" />
            )}
          </div>
        </td>
        <td className="text-sm">
          {highlightText(entity.category?.name || '', searchToken)}
        </td>
        <td>
          <div className="flex flex-wrap gap-1.5 items-center">
            {entity.tags
              .sort((a, b) => a.name.localeCompare(b.name))
              .slice(0, 2)
              .map((tag, index) => (
                <span
                  key={index}
                  className="px-2.5 py-0.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md border border-slate-200 dark:border-slate-700"
                >
                  {tag.name}
                </span>
              ))}
            {entity.tags.length > 2 && (
              <span className="px-2.5 py-0.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md border border-slate-200 dark:border-slate-700">
                +{entity.tags.length - 2}
              </span>
            )}
          </div>
        </td>
        <td>
          <VariantTablePopover variants={entity.variants} productProperties={entity.properties}/>
        </td>
      
        <td><StatusToggle status={entity.status} entityId={entity.id} resourceUrl={ProductConfigs.resourceUrl} resourceKey={ProductConfigs.resourceKey} /></td></>
    );
  };

  const entityDetailTableRowsFragment = (entity: ProductResponse) => {
    const thumbnailImage = entity.images.find((image) => image.isThumbnail);

    return (
      <>
        <tr>
          <td>{ProductConfigs.properties.id.label}</td>
          <td>{entity.id}</td>
        </tr>
        <tr>
          <td>{ProductConfigs.properties.createdAt.label}</td>
          <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
        </tr>
        <tr>
          <td>{ProductConfigs.properties.updatedAt.label}</td>
          <td>{DateUtils.isoDateToString(entity.updatedAt)}</td>
        </tr>
        <tr>
          <td>{ProductConfigs.properties.name.label}</td>
          <td>{entity.name}</td>
        </tr>
        <tr>
          <td>{ProductConfigs.properties.code.label}</td>
          <td>{entity.code}</td>
        </tr>
        <tr>
          <td>{ProductConfigs.properties.slug.label}</td>
          <td>{entity.slug}</td>
        </tr>
        <tr>
          <td>{ProductConfigs.properties.shortDescription.label}</td>
          <td className="max-w-[300px]">{entity.shortDescription}</td>
        </tr>
        <tr>
          <td>{ProductConfigs.properties.description.label}</td>
          <td className="max-w-[300px]">{entity.description}</td>
        </tr>
        <tr>
          <td>{ProductConfigs.properties.thumbnail.label}</td>
          <td>
            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center border border-gray-200 dark:border-gray-600 shadow-sm">
              {thumbnailImage?.path ? (
                <img src={thumbnailImage.path} alt={entity.name} className="w-full h-full object-cover" />
              ) : (
                <QuestionMark size={30} className="text-gray-400" />
              )}
            </div>
          </td>
        </tr>
        <tr>
          <td>{ProductConfigs.properties.images.label}</td>
          <td className="max-w-[300px]">
            <div className="flex flex-wrap gap-2">
              {entity.images.filter((image) => !image.isEliminated).map((image) => (
                <div
                  key={image.name}
                  className={`relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center shadow-sm ${
                    image.isThumbnail ? 'ring-2 ring-teal-500 dark:ring-teal-400' : 'border border-gray-200 dark:border-gray-600'
                  }`}
                >
                  {image.path ? (
                    <img src={image.path} alt={image.name} className="w-full h-full object-cover" />
                  ) : (
                    <QuestionMark size={30} className="text-gray-400" />
                  )}
                </div>
              ))}
            </div>
          </td>
        </tr>
        <tr>
          <td>{ProductConfigs.properties.status.label}</td>
          <td><StatusToggle status={entity.status} entityId={entity.id} resourceUrl={ProductConfigs.resourceUrl} resourceKey={ProductConfigs.resourceKey} /></td>
        </tr>
        <tr>
          <td>{ProductConfigs.properties['category.name'].label}</td>
          <td>{entity.category?.name}</td>
        </tr>
        <tr>
          <td>{ProductConfigs.properties['brand.name'].label}</td>
          <td>{entity.brand?.name}</td>
        </tr>
        <tr>
          <td>{ProductConfigs.properties['supplier.displayName'].label}</td>
          <td>{entity.supplier?.displayName}</td>
        </tr>
        <tr>
          <td>{ProductConfigs.properties['unit.name'].label}</td>
          <td>{entity.unit?.name}</td>
        </tr>
        <tr>
          <td>{ProductConfigs.properties.tags.label}</td>
          <td className="max-w-[300px]">
            <div className="flex flex-wrap gap-1.5 items-center">
              {entity.tags
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((tag, index) => (
                  <span
                    key={index}
                    className="px-2.5 py-0.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md border border-slate-200 dark:border-slate-700"
                  >
                    {tag.name}
                  </span>
                ))}
            </div>
          </td>
        </tr>
        <tr>
          <td>{ProductConfigs.properties.specifications.label}</td>
          <td className="max-w-[300px]">
            {entity.specifications && (
              <div className="grid grid-cols-2 gap-2">
                <div className="font-semibold">Thông số</div>
                <div className="font-semibold">Giá trị</div>
                {entity.specifications.content?.map((specification, index) => (
                  <React.Fragment key={index}>
                    <div>{specification.name}</div>
                    <div>{specification.value}</div>
                  </React.Fragment>
                ))}
              </div>
            )}
          </td>
        </tr>
        <tr>
          <td>{ProductConfigs.properties.properties.label}</td>
          <td className="max-w-[300px]">
            {entity.properties && (
              <div className="grid grid-cols-2 gap-2">
                <div className="font-semibold">Thuộc tính</div>
                <div className="font-semibold">Giá trị</div>
                {entity.properties.content?.map((property, index) => (
                  <React.Fragment key={index}>
                    <div>{property.name}</div>
                    <div>
                      <div className="flex flex-wrap gap-1">
                        {property.value?.map((value, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs font-medium border border-teal-300 dark:border-teal-600 text-teal-700 dark:text-teal-400 rounded"
                          >
                            {value}
                          </span>
                        ))}
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            )}
          </td>
        </tr>
        <tr>
          <td>{ProductConfigs.properties.variants.label}</td>
          <td>{entity.variants.length === 0 ? <em>không có</em> : entity.variants.length + ' phiên bản'}</td>
        </tr>
        <tr>
          <td>{ProductConfigs.properties.weight.label}</td>
          <td>{entity.weight ? entity.weight + ' g' : ''}</td>
        </tr>
        <tr>
          <td>{ProductConfigs.properties['guarantee.name'].label}</td>
          <td>{entity.guarantee?.name}</td>
        </tr>
      </>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <ManageHeader>
        <ManageHeaderTitle
          titleLinks={ProductConfigs.manageTitleLinks}
          title={ProductConfigs.manageTitle}
        />
        <div className="flex items-center gap-2">
          {categoryId && (
            <button
              onClick={() => navigate('/admin/product')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-md font-medium text-sm transition-colors shadow-sm"
            >
              Hiển thị tất cả sản phẩm
            </button>
          )}
          <ManageHeaderButtons
            listResponse={listResponse}
            resourceUrl={ProductConfigs.resourceUrl}
            resourceKey={ProductConfigs.resourceKey}
          />
        </div>
      </ManageHeader>

      <SearchPanel/>

      <FilterPanel/>

      <ManageMain
        listResponse={listResponse}
        isLoading={isLoading}
      >
        <ManageTable
          listResponse={listResponse}
          properties={ProductConfigs.properties}
          resourceUrl={ProductConfigs.resourceUrl}
          resourceKey={ProductConfigs.resourceKey}
          showedPropertiesFragment={showedPropertiesFragment}
          entityDetailTableRowsFragment={entityDetailTableRowsFragment}
        />
      </ManageMain>

      <ManagePagination listResponse={listResponse}/>
    </div>
  );
}

export default ProductManage;
