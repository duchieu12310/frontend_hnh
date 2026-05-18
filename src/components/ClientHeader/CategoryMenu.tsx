import React, { Dispatch, SetStateAction, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { ClientCategoryResponse, CollectionWrapper } from 'types';
import FetchUtils, { ErrorMessage } from 'utils/FetchUtils';
import ResourceURL from 'constants/ResourceURL';
import NotifyUtils from 'utils/NotifyUtils';
import { AlertTriangle, ChevronRight, LayoutGrid } from 'tabler-icons-react';

function CategoryMenu({ setOpenedCategoryMenu }: { setOpenedCategoryMenu: (opened: boolean) => void }) {
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();

  const {
    data: categoryResponses,
    isLoading: isLoadingCategoryResponses,
    isError: isErrorCategoryResponses,
  } = useQuery<CollectionWrapper<ClientCategoryResponse>, ErrorMessage>(
    ['client-api', 'categories', 'getAllCategories'],
    () => FetchUtils.get(ResourceURL.CLIENT_CATEGORY),
    {
      onError: () => NotifyUtils.simpleFailed('Lấy dữ liệu không thành công'),
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  if (isLoadingCategoryResponses) {
    return (
      <div className="flex w-full bg-white dark:bg-gray-900 rounded-2xl overflow-hidden" style={{ minHeight: '450px' }}>
        <div className="w-[240px] border-r border-gray-100 dark:border-gray-800 p-4 space-y-3">
           {Array(6).fill(0).map((_, i) => (
             <div key={i} className="h-10 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
           ))}
        </div>
        <div className="flex-1 p-8 grid grid-cols-3 gap-8">
           {Array(6).fill(0).map((_, i) => (
             <div key={i} className="space-y-3">
               <div className="h-6 w-32 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
               <div className="h-20 bg-gray-50 dark:bg-gray-800/50 rounded animate-pulse" />
             </div>
           ))}
        </div>
      </div>
    );
  }

  if (isErrorCategoryResponses) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-red-500">
        <AlertTriangle size={64} strokeWidth={1.5} />
        <p className="mt-4 font-semibold text-lg">Không thể tải danh mục</p>
      </div>
    );
  }

  const handleAnchor = (path: string) => {
    setOpenedCategoryMenu(false);
    navigate(path);
  };

  const activeCategory = categoryResponses?.content[activeTab];

  return (
    <div className="flex w-full bg-white dark:bg-gray-900 shadow-2xl transition-all duration-300 ease-in-out border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden" style={{ minHeight: '480px' }}>
      
      {/* Sidebar - Tabs */}
      <div className="w-[260px] flex-shrink-0 bg-gray-50/50 dark:bg-gray-900/50 border-r border-gray-100 dark:border-gray-800 flex flex-col p-3">
        <div className="px-4 py-3 mb-2 flex items-center gap-2">
          <LayoutGrid size={20} className="text-gray-400" />
          <span className="text-[12px] font-black uppercase tracking-[2px] text-gray-400">Khám phá</span>
        </div>
        
        <div className="space-y-1">
          {categoryResponses?.content.map((cat, index) => {
            const isActive = activeTab === index;
            return (
              <button
                key={cat.categoryId || index}
                onMouseEnter={() => setActiveTab(index)}
                onClick={() => handleAnchor('/category/' + cat.categorySlug)}
                className={`w-full px-4 py-3 rounded-xl text-[14px] font-bold flex items-center justify-between transition-all duration-200 group ${
                  isActive 
                    ? 'bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm ring-1 ring-gray-200 dark:ring-gray-700' 
                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-black dark:hover:text-gray-200'
                }`}
              >
                <span className="truncate">{cat.categoryName}</span>
                <ChevronRight 
                  size={16} 
                  className={`transition-transform duration-300 ${isActive ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`} 
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 overflow-y-auto bg-white dark:bg-gray-900" style={{ maxHeight: '650px' }}>
        {activeCategory && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Header Area */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50 dark:border-gray-800">
              <div className="flex items-center gap-4">
                <div className="w-1.5 h-8 bg-red-600 rounded-full" />
                <h2 className="text-3xl font-black text-black dark:text-white tracking-tight leading-none">
                  {activeCategory.categoryName}
                </h2>
              </div>
              <Link
                to={'/category/' + activeCategory.categorySlug}
                onClick={() => handleAnchor('/category/' + activeCategory.categorySlug)}
                className="text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 px-4 py-2 rounded-full transition-colors flex items-center gap-1 group"
              >
                Tất cả {activeCategory.categoryName}
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Sub-categories Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-12">
              {activeCategory.categoryChildren.map((second, sIdx) => (
                <div key={second.categoryId || sIdx} className="flex flex-col group/col">
                  {/* Level 2 Title */}
                  <Link
                    to={'/category/' + second.categorySlug}
                    onClick={() => handleAnchor('/category/' + second.categorySlug)}
                    className="text-[15px] font-black text-black dark:text-white uppercase tracking-wider mb-4 hover:text-red-600 transition-colors block border-b-2 border-transparent group-hover/col:border-red-600/20 pb-1"
                  >
                    {second.categoryName}
                  </Link>
                  
                  {/* Level 3 List */}
                  <div className="flex flex-col space-y-2.5">
                    {second.categoryChildren.slice(0, 6).map((third, tIdx) => (
                      <Link
                        key={third.categoryId || tIdx}
                        to={'/category/' + third.categorySlug}
                        onClick={() => handleAnchor('/category/' + third.categorySlug)}
                        className="text-[14px] text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors leading-relaxed"
                      >
                        {third.categoryName}
                      </Link>
                    ))}
                    
                    {/* View All Link */}
                    <Link
                      to={'/category/' + second.categorySlug}
                      onClick={() => handleAnchor('/category/' + second.categorySlug)}
                      className="inline-flex items-center gap-1.5 text-[13px] font-bold text-gray-400 hover:text-red-600 transition-colors pt-2 group/all"
                    >
                      <span className="border-b border-gray-200 dark:border-gray-800 group-hover/all:border-red-600/30">
                        {second.categoryChildren.length > 6 ? `Xem tất cả (${second.categoryChildren.length})` : 'Xem thêm'}
                      </span>
                      <ChevronRight size={14} className="group-hover/all:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryMenu;
