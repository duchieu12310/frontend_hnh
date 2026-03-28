import React from 'react';
import { ClientProductCard } from 'components';
import ApplicationConstants from 'constants/ApplicationConstants';
import { useQuery } from 'react-query';
import FetchUtils, { ErrorMessage, ListResponse } from 'utils/FetchUtils';
import { ClientListedProductResponse } from 'types';
import ResourceURL from 'constants/ResourceURL';
import NotifyUtils from 'utils/NotifyUtils';
import { AlertTriangle, Marquee } from 'tabler-icons-react';
import useClientCategoryStore from 'stores/use-client-category-store';

interface ClientCategoryProductsProps {
  categorySlug: string;
}

function ClientCategoryProducts({ categorySlug }: ClientCategoryProductsProps) {
  const { activePage, activeSearch, updateActivePage } = useClientCategoryStore();

  const {
    productResponses,
    isLoadingProductResponses,
    isErrorProductResponses,
  } = useGetAllCategoryProductsApi(categorySlug);
  const products = productResponses as ListResponse<ClientListedProductResponse>;

  if (isLoadingProductResponses) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {Array(6).fill(0).map((_, index) => (
          <div key={index} className="rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse h-64"/>
        ))}
      </div>
    );
  }

  if (isErrorProductResponses) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-pink-600 dark:text-pink-400">
        <AlertTriangle size={80} strokeWidth={1}/>
        <p className="text-xl font-medium">Đã có lỗi xảy ra</p>
      </div>
    );
  }

  if (products.totalElements === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-blue-600 dark:text-blue-400">
        <Marquee size={80} strokeWidth={1}/>
        <p className="text-xl font-medium">Không có sản phẩm</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {products.content.map((product, index) => (
          <div key={index}>
            <ClientProductCard product={product} search={activeSearch || ''}/>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center gap-1">
          <button
            onClick={() => activePage > 1 && updateActivePage(activePage - 1)}
            disabled={activePage <= 1}
            className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ‹
          </button>
          {Array.from({ length: products.totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => page !== activePage && updateActivePage(page)}
              className={`px-3 py-1 rounded border text-sm transition-colors ${
                page === activePage
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => activePage < products.totalPages && updateActivePage(activePage + 1)}
            disabled={activePage >= products.totalPages}
            className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ›
          </button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-medium">Trang {activePage}</span>
          <span> / {products.totalPages}</span>
        </p>
      </div>
    </>
  );
}

function useGetAllCategoryProductsApi(categorySlug: string) {
  const {
    totalProducts,
    activePage,
    activeSort,
    activeSearch,
    activeSaleable,
    activeBrandFilter,
    activePriceFilter,
    updateTotalProducts,
  } = useClientCategoryStore();

  const requestParams = {
    page: activePage,
    size: ApplicationConstants.DEFAULT_CLIENT_CATEGORY_PAGE_SIZE,
    filter: [activeBrandFilter, activePriceFilter].filter(Boolean).join(';') || undefined,
    sort: activeSort,
    search: activeSearch,
    saleable: activeSaleable,
  };

  const {
    data: productResponses,
    isLoading: isLoadingProductResponses,
    isError: isErrorProductResponses,
  } = useQuery<ListResponse<ClientListedProductResponse>, ErrorMessage>(
    ['client-api', 'products', 'getProductsByCategory', categorySlug, requestParams],
    () => FetchUtils.get(ResourceURL.CLIENT_PRODUCT_BY_CATEGORY(categorySlug), requestParams),
    {
      onSuccess: (productResponses) =>
        (totalProducts !== productResponses.totalElements) && updateTotalProducts(productResponses.totalElements),
      onError: () => NotifyUtils.simpleFailed('Lấy dữ liệu không thành công'),
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  return { productResponses, isLoadingProductResponses, isErrorProductResponses };
}

export default ClientCategoryProducts;
