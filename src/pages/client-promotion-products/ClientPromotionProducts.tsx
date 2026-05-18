import React, { useState, useEffect } from 'react';
import { Grid, Pagination, Group } from '@mantine/core';
import { AlertTriangle, Marquee } from 'tabler-icons-react';
import { ClientProductCard } from 'components';
import { useQuery } from 'react-query';
import FetchUtils, { ErrorMessage, ListResponse } from 'utils/FetchUtils';
import { ClientListedProductResponse } from 'types';
import ResourceURL from 'constants/ResourceURL';
import NotifyUtils from 'utils/NotifyUtils';
import useTitle from 'hooks/use-title';

function ClientPromotionProducts() {
  useTitle('Sản phẩm khuyến mại');
  const [activeTab, setActiveTab] = useState<'active' | 'upcoming'>('active');
  const [upcomingTimeFilter, setUpcomingTimeFilter] = useState<'all' | 'today_tomorrow' | 'next_3_days' | 'this_week' | 'custom'>('all');
  const [customDate, setCustomDate] = useState<string>('');
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc'>('default');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showCategories, setShowCategories] = useState<boolean>(true);
  const [selectedL1, setSelectedL1] = useState<string | null>(null);
  const [selectedL2, setSelectedL2] = useState<string | null>(null);
  const [selectedL3, setSelectedL3] = useState<string | null>(null);

  const itemsPerPage = 10;

  const activeSlug = selectedL3 || selectedL2 || selectedL1;

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, activeSlug, upcomingTimeFilter, customDate, onlyInStock, sortBy]);

  const requestParams = {
    page: 1,
    size: 1000, // Lấy nhiều sản phẩm để lọc
  };

  // Fetch all products
  const {
    data: productResponses,
    isLoading: isLoadingProductResponses,
    isError: isErrorProductResponses,
  } = useQuery<ListResponse<ClientListedProductResponse>, ErrorMessage>(
    ['client-api', 'products', 'getAllProducts', requestParams],
    () => FetchUtils.get(ResourceURL.CLIENT_PRODUCT, requestParams),
    {
      onError: () => NotifyUtils.simpleFailed('Lấy dữ liệu không thành công'),
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  // Fetch all categories for filter
  const { data: categoryResponses } = useQuery<any, ErrorMessage>(
    ['client-api', 'categories'],
    () => FetchUtils.get(ResourceURL.CLIENT_CATEGORY),
    {
      refetchOnWindowFocus: false,
    }
  );

  const products = productResponses as ListResponse<ClientListedProductResponse>;
  const categories = categoryResponses?.content || [];

  // Helper date formatter
  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const getIsWithinRange = (dateStr?: string, daysLimit?: number) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const now = new Date();
    const targetTime = date.getTime();
    
    if (daysLimit !== undefined) {
      const limitDate = new Date();
      limitDate.setDate(limitDate.getDate() + daysLimit);
      limitDate.setHours(23, 59, 59, 999);
      return targetTime <= limitDate.getTime();
    }
    return true;
  };

  const getProductActivePrice = (p: ClientListedProductResponse) => {
    const originalPrice = p.productPriceRange?.[0] || 0;
    if (activeTab === 'active' && p.productPromotion) {
      return originalPrice * (1 - (p.productPromotion.promotionPercent || 0) / 100);
    }
    if (activeTab === 'upcoming' && p.productUpcomingPromotion) {
      return originalPrice * (1 - (p.productUpcomingPromotion.promotionPercent || 0) / 100);
    }
    return originalPrice;
  };

  // Lọc chỉ lấy sản phẩm có promotion tương ứng với tab
  const activePromotionProducts = products?.content?.filter(p => p.productPromotion !== null) || [];
  const upcomingPromotionProducts = products?.content?.filter(p => p.productUpcomingPromotion !== null && p.productUpcomingPromotion !== undefined) || [];

  const currentProductsList = activeTab === 'active' ? activePromotionProducts : upcomingPromotionProducts;

  // Tìm tất cả các slug con/cháu recursively của một category bất kỳ dựa vào slug
  const getValidSlugsForFilter = (slug: string): Set<string> => {
    const validSlugs = new Set<string>();
    validSlugs.add(slug);

    // Tìm trong L1
    const l1 = categories.find((cat: any) => cat.categorySlug === slug);
    if (l1) {
      l1.categoryChildren?.forEach((l2: any) => {
        validSlugs.add(l2.categorySlug);
        l2.categoryChildren?.forEach((l3: any) => {
          validSlugs.add(l3.categorySlug);
        });
      });
      return validSlugs;
    }

    // Tìm trong L2
    for (const cat of categories) {
      const l2 = cat.categoryChildren?.find((child: any) => child.categorySlug === slug);
      if (l2) {
        l2.categoryChildren?.forEach((l3: any) => {
          validSlugs.add(l3.categorySlug);
        });
        return validSlugs;
      }
    }

    return validSlugs;
  };

  // Lọc theo danh mục đã chọn (bao gồm tất cả danh mục con và cháu), thời gian, và còn hàng
  const filteredProducts = currentProductsList
    .filter(p => {
      // 1. Lọc theo danh mục
      if (activeSlug) {
        const validSlugs = getValidSlugsForFilter(activeSlug);
        if (!p.productCategories?.some(cat => validSlugs.has(cat.categorySlug))) {
          return false;
        }
      }

      // 2. Lọc theo thời gian (chỉ áp dụng cho tab upcoming)
      if (activeTab === 'upcoming' && p.productUpcomingPromotion) {
        const startDate = p.productUpcomingPromotion.startDate;
        if (upcomingTimeFilter === 'today_tomorrow') {
          if (!getIsWithinRange(startDate, 1)) return false;
        } else if (upcomingTimeFilter === 'next_3_days') {
          if (!getIsWithinRange(startDate, 3)) return false;
        } else if (upcomingTimeFilter === 'this_week') {
          if (!getIsWithinRange(startDate, 7)) return false;
        } else if (upcomingTimeFilter === 'custom' && customDate) {
          const targetDate = new Date(startDate);
          const selectedDate = new Date(customDate);
          if (!(targetDate.getFullYear() === selectedDate.getFullYear() &&
                targetDate.getMonth() === selectedDate.getMonth() &&
                targetDate.getDate() === selectedDate.getDate())) {
            return false;
          }
        }
      }

      // 3. Lọc còn hàng
      if (onlyInStock) {
        const totalQty = p.productVariants?.reduce((sum, v) => sum + (v.quantity || 0), 0) || 0;
        const isSaleable = p.productSaleable || totalQty > 0;
        if (!isSaleable) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price_asc') {
        return getProductActivePrice(a) - getProductActivePrice(b);
      }
      if (sortBy === 'price_desc') {
        return getProductActivePrice(b) - getProductActivePrice(a);
      }
      return 0; // mặc định
    });

  let resultFragment;

  if (isLoadingProductResponses) {
    resultFragment = (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Array(6).fill(0).map((_, index) => (
          <div key={index} className="h-80 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (isErrorProductResponses) {
    resultFragment = (
      <div className="flex flex-col items-center gap-4 my-8 text-pink-600 dark:text-pink-400">
        <AlertTriangle size={125} strokeWidth={1} />
        <p className="text-xl font-medium">Đã có lỗi xảy ra</p>
      </div>
    );
  }

  if (products && filteredProducts.length === 0) {
    resultFragment = (
      <div className="flex flex-col items-center gap-4 my-8 text-blue-600 dark:text-blue-400">
        <Marquee size={125} strokeWidth={1} />
        <p className="text-xl font-medium text-center">
          Hiện tại không có sản phẩm nào {activeTab === 'active' ? 'đang khuyến mại' : 'chuẩn bị khuyến mại'} trong danh mục này
        </p>
      </div>
    );
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  if (products && filteredProducts.length > 0) {
    resultFragment = (
      <div>
        <Grid>
          {paginatedProducts.map((product) => (
            <Grid.Col key={product.productId} span={6} sm={6} md={4}>
              <ClientProductCard product={product} />
            </Grid.Col>
          ))}
        </Grid>

        {/* Pagination Controls using Mantine */}
        {totalPages > 1 && (
          <Group position="center" mt="xl">
            <Pagination
              page={currentPage}
              onChange={setCurrentPage}
              total={totalPages}
            />
          </Group>
        )}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col gap-6">
          {/* Header Title Block */}
          <div className="flex flex-col gap-2 border-b border-gray-150 dark:border-gray-800 pb-5">
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
              <span className="h-6 w-2 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500"></span>
              Cửa Hàng Khuyến Mãi
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Khám phá sách hay với những ưu đãi đặc quyền hấp dẫn nhất dành cho bạn!
            </p>
          </div>

          {/* Responsive 2-Column Layout */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* LEFT COLUMN: Sidebar (25% width on desktop, full width on mobile) */}
            <div 
              className="w-full lg:w-1/4 flex flex-col gap-5 shrink-0 lg:sticky lg:top-24 lg:h-[calc(100vh-120px)] lg:overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800"
              style={{ scrollbarWidth: 'thin' }}
            >
              
              {/* Card 1: Tab Status Switcher */}
              <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm flex flex-col gap-3">
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Trạng thái sale</span>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setActiveTab('active');
                      setSelectedL1(null);
                      setSelectedL2(null);
                      setSelectedL3(null);
                    }}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-xs transition-all duration-300 transform hover:scale-[1.01] ${
                      activeTab === 'active'
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/20'
                        : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-800/20 hover:border-pink-500'
                    }`}
                  >
                    <span>🔥 Đang Diễn Ra</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${activeTab === 'active' ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400'}`}>
                      {activePromotionProducts.length}
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('upcoming');
                      setSelectedL1(null);
                      setSelectedL2(null);
                      setSelectedL3(null);
                    }}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-xs transition-all duration-300 transform hover:scale-[1.01] ${
                      activeTab === 'upcoming'
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20'
                        : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-800/20 hover:border-purple-600'
                    }`}
                  >
                    <span>⏳ Sắp Diễn Ra</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${activeTab === 'upcoming' ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400'}`}>
                      {upcomingPromotionProducts.length}
                    </span>
                  </button>
                </div>
              </div>

              {/* Card 2: Upcoming Time Filters (Only shows when activeTab === 'upcoming') */}
              {activeTab === 'upcoming' && (
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Lọc theo thời gian
                  </span>
                  <div className="flex flex-col gap-2">
                    {[
                      { key: 'all', label: 'Tất cả' },
                      { key: 'today_tomorrow', label: 'Hôm nay & Mai' },
                      { key: 'next_3_days', label: '3 ngày tới' },
                      { key: 'this_week', label: 'Tuần này' }
                    ].map(opt => (
                      <button
                        key={opt.key}
                        onClick={() => {
                          setUpcomingTimeFilter(opt.key as any);
                          setCustomDate('');
                        }}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all duration-300 transform hover:scale-[1.01] ${
                          upcomingTimeFilter === opt.key
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm'
                            : 'bg-gray-50 dark:bg-gray-700/60 text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-800/10 hover:border-purple-400'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                    {/* Custom Date Input */}
                    <div className={`flex flex-col gap-1.5 px-3 py-2.5 rounded-xl border transition-all duration-300 ${
                      upcomingTimeFilter === 'custom'
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-transparent'
                        : 'bg-gray-50 dark:bg-gray-700/60 text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-800/10 hover:border-purple-400'
                    }`}>
                      <span className={`text-[9px] font-bold ${upcomingTimeFilter === 'custom' ? 'text-purple-100' : 'text-gray-400'}`}>Chọn ngày cụ thể:</span>
                      <input
                        type="date"
                        value={customDate}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCustomDate(val);
                          if (val) {
                            setUpcomingTimeFilter('custom');
                          } else {
                            setUpcomingTimeFilter('all');
                          }
                        }}
                        className="bg-transparent text-xs font-bold focus:outline-none cursor-pointer text-current [color-scheme:light_dark] w-full"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Card 3: Stock Switcher & Sorting */}
              <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm flex flex-col gap-4">
                {/* Stock Switcher */}
                <div className="flex flex-col gap-2.5 pb-3 border-b border-gray-100 dark:border-gray-700/50">
                  <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Trạng thái sách</span>
                  <label className="relative flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={onlyInStock}
                      onChange={(e) => setOnlyInStock(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:height-4 after:w-4 after:h-4 after:transition-all dark:border-gray-600 peer-checked:bg-gradient-to-r peer-checked:from-pink-500 peer-checked:to-purple-600"></div>
                    <span className="ml-3 text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Chỉ sách còn hàng
                    </span>
                  </label>
                </div>

                {/* Price Sorting */}
                <div className="flex flex-col gap-2.5">
                  <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"></path>
                    </svg>
                    Sắp xếp theo giá
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {[
                      { key: 'default', label: 'Mặc định' },
                      { key: 'price_asc', label: 'Giá: Thấp → Cao' },
                      { key: 'price_desc', label: 'Giá: Cao → Thấp' }
                    ].map(opt => (
                      <button
                        key={opt.key}
                        onClick={() => setSortBy(opt.key as any)}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all duration-300 transform hover:scale-[1.01] ${
                          sortBy === opt.key
                            ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-sm'
                            : 'bg-gray-50 dark:bg-gray-700/60 text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-800/10 hover:border-pink-500'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card 4: Category Hierarchy Tree */}
              {categories.length > 0 && (
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm flex flex-col gap-3">
                  <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700/50 pb-2.5">
                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="h-3 w-1 rounded-full bg-gradient-to-t from-pink-500 to-purple-500"></span>
                      Danh mục sách
                    </span>
                    {(selectedL1 || selectedL2 || selectedL3) && (
                      <button
                        onClick={() => {
                          setSelectedL1(null);
                          setSelectedL2(null);
                          setSelectedL3(null);
                        }}
                        className="text-[10px] font-bold text-pink-600 hover:text-pink-700 transition-colors"
                      >
                        Đặt lại
                      </button>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-1.5 pr-1">
                    <button
                      onClick={() => {
                        setSelectedL1(null);
                        setSelectedL2(null);
                        setSelectedL3(null);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl font-semibold text-xs transition-all duration-300 ${
                        selectedL1 === null
                          ? 'bg-pink-50 dark:bg-pink-950/30 text-pink-600 dark:text-pink-400'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      📁 Tất cả sách
                    </button>
                    {categories.map((cat: any) => (
                      <div key={cat.categorySlug} className="flex flex-col">
                        <button
                          onClick={() => {
                            setSelectedL1(cat.categorySlug);
                            setSelectedL2(null);
                            setSelectedL3(null);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl font-semibold text-xs transition-all duration-300 ${
                            selectedL1 === cat.categorySlug
                              ? 'bg-pink-50 dark:bg-pink-950/30 text-pink-600 dark:text-pink-400'
                              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                          }`}
                        >
                          📚 {cat.categoryName}
                        </button>
                        
                        {selectedL1 === cat.categorySlug && cat.categoryChildren && cat.categoryChildren.length > 0 && (
                          <div className="pl-4 flex flex-col gap-1 mt-1 border-l border-pink-500/20 ml-3.5 py-1">
                            <button
                              onClick={() => {
                                setSelectedL2(null);
                                setSelectedL3(null);
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-lg font-medium text-[11px] transition-all duration-300 ${
                                selectedL2 === null
                                  ? 'bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400'
                                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-750'
                              }`}
                            >
                              Tất cả {cat.categoryName}
                            </button>
                            {cat.categoryChildren.map((l2: any) => (
                              <div key={l2.categorySlug} className="flex flex-col">
                                <button
                                  onClick={() => {
                                    setSelectedL2(l2.categorySlug);
                                    setSelectedL3(null);
                                  }}
                                  className={`w-full text-left px-2.5 py-1.5 rounded-lg font-medium text-[11px] transition-all duration-300 ${
                                    selectedL2 === l2.categorySlug
                                      ? 'bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400'
                                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-750'
                                  }`}
                                >
                                  └─ {l2.categoryName}
                                </button>
                                
                                {selectedL1 === cat.categorySlug && selectedL2 === l2.categorySlug && l2.categoryChildren && l2.categoryChildren.length > 0 && (
                                  <div className="pl-3 flex flex-col gap-1 mt-1 border-l border-purple-500/20 ml-2.5 py-0.5">
                                    <button
                                      onClick={() => {
                                        setSelectedL3(null);
                                      }}
                                      className={`w-full text-left px-2 py-1 rounded-md font-medium text-[10px] transition-all duration-300 ${
                                        selectedL3 === null
                                          ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400'
                                          : 'text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-750'
                                      }`}
                                    >
                                      Tất cả {l2.categoryName}
                                    </button>
                                    {l2.categoryChildren.map((l3: any) => (
                                      <button
                                        key={l3.categorySlug}
                                        onClick={() => {
                                          setSelectedL3(l3.categorySlug);
                                        }}
                                        className={`w-full text-left px-2 py-1 rounded-md font-medium text-[10px] transition-all duration-300 ${
                                          selectedL3 === l3.categorySlug
                                            ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400'
                                            : 'text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-750'
                                        }`}
                                      >
                                        └─ {l3.categoryName}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Active Filters Bar + Product Grid (75% width on desktop) */}
            <div className="flex-1 flex flex-col gap-6">
              {/* Active Filters Summary Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-gray-800 px-5 py-3 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-550 dark:bg-gray-700 px-3 py-1 rounded-lg">
                    📊 Tìm thấy: <span className="text-pink-600 font-extrabold">{filteredProducts.length}</span> sản phẩm
                  </span>
                  
                  {activeSlug && (
                    <span className="text-[10px] font-bold text-pink-600 bg-pink-50 dark:bg-pink-950/30 px-3 py-1 rounded-lg flex items-center gap-1">
                      📁 Danh mục: {activeSlug}
                      <button 
                        onClick={() => {
                          setSelectedL1(null);
                          setSelectedL2(null);
                          setSelectedL3(null);
                        }}
                        className="hover:text-pink-800 ml-1 text-xs font-bold"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  
                  {upcomingTimeFilter !== 'all' && activeTab === 'upcoming' && (
                    <span className="text-[10px] font-bold text-purple-600 bg-purple-50 dark:bg-purple-950/30 px-3 py-1 rounded-lg flex items-center gap-1">
                      📅 Thời gian: {upcomingTimeFilter === 'custom' ? customDate : (upcomingTimeFilter === 'today_tomorrow' ? 'Hôm nay & Mai' : upcomingTimeFilter === 'next_3_days' ? '3 ngày tới' : 'Tuần này')}
                      <button 
                        onClick={() => {
                          setUpcomingTimeFilter('all');
                          setCustomDate('');
                        }}
                        className="hover:text-purple-800 ml-1 text-xs font-bold"
                      >
                        ×
                      </button>
                    </span>
                  )}
                </div>
              </div>

              {/* Main Book Grid Container */}
              {resultFragment}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

export default ClientPromotionProducts;
