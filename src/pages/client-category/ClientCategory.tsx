import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import MiscUtils from 'utils/MiscUtils';
import { ClientError } from 'components';
import { ArrowsDownUp, ChartCandle, ChevronRight, Search, X } from 'tabler-icons-react';
import useTitle from 'hooks/use-title';
import { useQuery } from 'react-query';
import FetchUtils, { ErrorMessage } from 'utils/FetchUtils';
import ResourceURL from 'constants/ResourceURL';
import NotifyUtils from 'utils/NotifyUtils';
import { ClientCategoryResponse, ClientFilterResponse } from 'types';
import ClientCategorySkeleton from 'pages/client-category/ClientCategorySkeleton';
import ClientCategoryProducts from 'pages/client-category/ClientCategoryProducts';
import useClientCategoryStore from 'stores/use-client-category-store';
import { useDebouncedValue } from 'hooks/use-debounced-value';

function ClientCategory() {
  const { slug } = useParams();

  const {
    totalProducts,
    activePage,
    activePriceFilter,
    activeBrandFilter,
    activeSort,
    activeSearch,
    activeSaleable,
    updateActivePage,
    updateActiveSort,
    updateActiveSearch,
    updateActiveSaleable,
    updateActiveBrandFilter,
    updateActivePriceFilter,
    resetClientCategoryState,
  } = useClientCategoryStore();

  // Search state
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 400);
  useEffect(() => {
    if (debouncedSearchQuery !== activeSearch) {
      updateActivePage(1);
      updateActiveSearch(debouncedSearchQuery);
    }
  }, [activeSearch, debouncedSearchQuery, updateActivePage, updateActiveSearch]);

  // Filter state
  const [priceOptions, setPriceOptions] = useState<string[]>([]);
  const [brandOptions, setBrandOptions] = useState<string[]>([]);

  // Reset all state
  useEffect(() => {
    setSearchQuery(null);
    setPriceOptions([]);
    setBrandOptions([]);
    resetClientCategoryState();
  }, [resetClientCategoryState, slug]);

  // Fetch category
  const { categoryResponse, isLoadingCategoryResponse, isErrorCategoryResponse } = useGetCategoryApi(slug as string);
  const category = categoryResponse as ClientCategoryResponse;
  useTitle(category?.categoryName);

  // Fetch filter
  const { filterResponse, isLoadingFilterResponse, isErrorFilterResponse } = useGetFilterApi(slug as string);
  const filter = filterResponse as ClientFilterResponse;

  // Composition
  const isLoading = isLoadingCategoryResponse || isLoadingFilterResponse;
  const isError = isErrorCategoryResponse || isErrorFilterResponse;

  if (isLoading) {
    return <ClientCategorySkeleton/>;
  }

  if (isError) {
    return <ClientError/>;
  }

  const handlePriceOptionChips = (priceOptions: string[]) => {
    const expressions = [];

    for (const priceOption of priceOptions) {
      const priceOptionArray = priceOption.split('-');
      if (priceOptionArray[1] === 'max') {
        expressions.push(`variants.price=bt=(${priceOptionArray[0]},1000000000)`);
      } else {
        expressions.push(`variants.price=bt=(${priceOptionArray[0]},${priceOptionArray[1]})`);
      }
    }

    setPriceOptions(priceOptions);
    updateActivePriceFilter(expressions.length > 0 ? `(${expressions.join(',')})` : null);
  };

  const handleBrandChips = (brandIds: string[]) => {
    setBrandOptions(brandIds);
    updateActiveBrandFilter(brandIds.length > 0 ? `brand.id=in=(${brandIds.join(',')})` : null);
  };

  const disabledResetButton = activePage === 1
    && activeBrandFilter === null
    && activePriceFilter === null
    && activeSort === null
    && searchQuery === null
    && !activeSaleable;

  const handleResetButton = () => {
    resetClientCategoryState();
    setSearchQuery(null);
    setPriceOptions([]);
    setBrandOptions([]);
  };

  return (
    <main>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-12">

          <div className="p-6 rounded-md shadow-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col gap-4">
              <nav className="flex items-center gap-2 text-sm">
                <Link to="/" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Trang chủ
                </Link>
                {MiscUtils.makeCategoryBreadcrumbs(category).slice(0, -1).map(c => (
                  <React.Fragment key={c.categorySlug}>
                    <span className="text-gray-400">/</span>
                    <Link to={'/category/' + c.categorySlug} className="text-blue-600 dark:text-blue-400 hover:underline">
                      {c.categoryName}
                    </Link>
                  </React.Fragment>
                ))}
                <span className="text-gray-400">/</span>
                <span className="text-gray-600 dark:text-gray-400">
                  {category.categoryName}
                </span>
              </nav>

              <div className="flex items-baseline gap-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{category.categoryName}</h2>
                {category.categoryChildren.length > 0 && (
                  <>
                    <ChevronRight size={14} className="text-gray-400" />
                    <nav className="flex items-center gap-1 text-sm">
                      {category.categoryChildren.map((c, index) => (
                        <React.Fragment key={c.categorySlug}>
                          {index > 0 && <span className="text-gray-400">·</span>}
                          <Link to={'/category/' + c.categorySlug} className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                            {c.categoryName}
                          </Link>
                        </React.Fragment>
                      ))}
                    </nav>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-3 mb-8">
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ChartCandle size={20} />
                    <p className="font-medium text-gray-900 dark:text-gray-100">Bộ lọc</p>
                  </div>
                  <button
                    onClick={handleResetButton}
                    disabled={disabledResetButton}
                    className="px-2 py-1 text-xs flex items-center gap-1 text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/20 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <X size={10} />
                    Đặt mặc định
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  <p className="font-medium text-gray-900 dark:text-gray-100">Tìm kiếm</p>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder={'Tìm kiếm trong ' + category.categoryName}
                      value={searchQuery || ''}
                      onChange={(event) => setSearchQuery(event.currentTarget.value || null)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <p className="font-medium text-gray-900 dark:text-gray-100">Khoảng giá</p>
                  <div className="flex flex-wrap gap-2">
                    {MiscUtils.generatePriceOptions(filter.filterPriceQuartiles).map((priceOption, index) => {
                      const priceOptionValue = priceOption.join('-');
                      const isSelected = priceOptions.includes(priceOptionValue);
                      return (
                        <button
                          key={index}
                          onClick={() => {
                            const newOptions = isSelected
                              ? priceOptions.filter(opt => opt !== priceOptionValue)
                              : [...priceOptions, priceOptionValue];
                            handlePriceOptionChips(newOptions);
                          }}
                          className={`px-3 py-1 text-sm rounded-md transition-colors ${
                            isSelected
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          {MiscUtils.readablePriceOption(priceOption)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <p className="font-medium text-gray-900 dark:text-gray-100">Thương hiệu</p>
                  {filter.filterBrands.length > 0
                    ? (
                      <div className="flex flex-wrap gap-2">
                        {filter.filterBrands.map(brand => {
                          const brandIdStr = String(brand.brandId);
                          const isSelected = brandOptions.includes(brandIdStr);
                          return (
                            <button
                              key={brand.brandId}
                              onClick={() => {
                                const newOptions = isSelected
                                  ? brandOptions.filter(opt => opt !== brandIdStr)
                                  : [...brandOptions, brandIdStr];
                                handleBrandChips(newOptions);
                              }}
                              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                isSelected
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                              }`}
                            >
                              {brand.brandName}
                            </button>
                          );
                        })}
                      </div>
                    ) : <p className="text-sm italic text-gray-600 dark:text-gray-400">Không có tùy chọn</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <p className="font-medium text-gray-900 dark:text-gray-100">Khác</p>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeSaleable}
                      onChange={(event) => updateActiveSaleable(event.currentTarget.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Chỉ tính còn hàng</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="md:col-span-9">
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ArrowsDownUp size={20} />
                    <p className="font-medium text-gray-900 dark:text-gray-100 mr-2">Sắp xếp theo</p>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="sort"
                          value=""
                          checked={activeSort === null}
                          onChange={(e) => updateActiveSort((e.target.value as '' | 'lowest-price' | 'highest-price') || null)}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Mới nhất</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="sort"
                          value="lowest-price"
                          checked={activeSort === 'lowest-price'}
                          onChange={(e) => updateActiveSort((e.target.value as '' | 'lowest-price' | 'highest-price') || null)}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Giá thấp → cao</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="sort"
                          value="highest-price"
                          checked={activeSort === 'highest-price'}
                          onChange={(e) => updateActiveSort((e.target.value as '' | 'lowest-price' | 'highest-price') || null)}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Giá cao → thấp</span>
                      </label>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{totalProducts} sản phẩm</p>
                </div>

                <ClientCategoryProducts categorySlug={category.categorySlug}/>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

function useGetCategoryApi(categorySlug: string) {
  const {
    data: categoryResponse,
    isLoading: isLoadingCategoryResponse,
    isError: isErrorCategoryResponse,
  } = useQuery<ClientCategoryResponse, ErrorMessage>(
    ['client-api', 'categories', 'getCategory', categorySlug],
    () => FetchUtils.get(ResourceURL.CLIENT_CATEGORY + '/' + categorySlug),
    {
      onError: () => NotifyUtils.simpleFailed('Lấy dữ liệu không thành công'),
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  return { categoryResponse, isLoadingCategoryResponse, isErrorCategoryResponse };
}

function useGetFilterApi(categorySlug: string) {
  const {
    data: filterResponse,
    isLoading: isLoadingFilterResponse,
    isError: isErrorFilterResponse,
  } = useQuery<ClientFilterResponse, ErrorMessage>(
    ['client-api', 'filters', 'getFilterByCategorySlug', categorySlug],
    () => FetchUtils.get(ResourceURL.CLIENT_FILTER_CATEGORY, { slug: categorySlug }),
    {
      onError: () => NotifyUtils.simpleFailed('Lấy dữ liệu không thành công'),
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  return { filterResponse, isLoadingFilterResponse, isErrorFilterResponse };
}

export default ClientCategory;
