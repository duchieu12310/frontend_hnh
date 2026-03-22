import React, { Dispatch, SetStateAction, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { ClientCategoryResponse, CollectionWrapper } from 'types';
import FetchUtils, { ErrorMessage } from 'utils/FetchUtils';
import ResourceURL from 'constants/ResourceURL';
import NotifyUtils from 'utils/NotifyUtils';
import { AlertTriangle } from 'tabler-icons-react';

function CategoryMenu({ setOpenedCategoryMenu }: { setOpenedCategoryMenu: Dispatch<SetStateAction<boolean>> }) {
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
      <div className="flex flex-col gap-3 p-4">
        {Array(5).fill(0).map((_, index) => (
          <div key={index} className="h-12 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
        ))}
      </div>
    );
  }

  if (isErrorCategoryResponses) {
    return (
      <div className="flex flex-col items-center gap-4 my-8 text-pink-600 dark:text-pink-400">
        <AlertTriangle size={125} strokeWidth={1}/>
        <p className="text-xl font-medium">Đã có lỗi xảy ra</p>
      </div>
    );
  }

  const handleAnchor = (path: string) => {
    setOpenedCategoryMenu(false);
    setTimeout(() => navigate(path), 200);
  };

  return (
    <div className="w-full flex bg-white dark:bg-gray-900 rounded-b-md shadow-lg" style={{ minHeight: '400px' }}>
      {/* Tab buttons - Vertical */}
      <div className="flex flex-col py-4 px-2 border-r border-gray-200 dark:border-gray-700 w-[260px] flex-shrink-0 gap-1 bg-white dark:bg-gray-900">
        <h3 className="text-gray-500 dark:text-gray-400 font-bold text-lg mb-2 pl-4 uppercase">Danh mục sản phẩm</h3>
        {categoryResponses?.content.map((firstCategory, index) => {
          const isActive = activeTab === index;
          
          return (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`px-4 py-2 rounded text-[15px] font-bold transition-all flex items-center text-left ${
                isActive
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-red-600 dark:hover:text-red-500'
              }`}
            >
              <span className="flex-1 line-clamp-2">{firstCategory.categoryName}</span>
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="flex-1 p-6 overflow-auto bg-white dark:bg-gray-900" style={{ maxHeight: '600px' }}>
        {categoryResponses?.content.map((firstCategory, index) => {
          if (activeTab !== index) return null;
          
          return (
            <div key={index} className="flex flex-col">
              {/* Tiêu đề góc trên cùng bên phải */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-5 h-5 flex items-center justify-center bg-red-600 rounded-[3px] flex-shrink-0">
                  <div className="w-2.5 h-2.5 bg-white rounded-sm"></div>
                </div>
                <Link
                  to={'/category/' + firstCategory.categorySlug}
                  onClick={() => handleAnchor('/category/' + firstCategory.categorySlug)}
                  className="text-2xl font-bold text-gray-900 dark:text-gray-100 hover:text-red-600 transition-colors"
                >
                  {firstCategory.categoryName}
                </Link>
              </div>
              
              {/* Lưới Level 2 & 3 */}
              <div className="overflow-auto" style={{ maxHeight: '500px' }}>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-8">
                  {firstCategory.categoryChildren.map((secondCategory, secondIndex) => (
                    <div key={secondIndex} className="flex flex-col gap-3">
                      <Link
                        to={'/category/' + secondCategory.categorySlug}
                        onClick={() => handleAnchor('/category/' + secondCategory.categorySlug)}
                        className="font-bold text-gray-800 dark:text-gray-200 uppercase text-[15px] hover:text-red-600 transition-colors"
                      >
                        {secondCategory.categoryName}
                      </Link>
                      <div className="flex flex-col gap-2">
                        {secondCategory.categoryChildren.map((thirdCategory, thirdIndex) => (
                          <Link
                            key={thirdIndex}
                            to={'/category/' + thirdCategory.categorySlug}
                            onClick={() => handleAnchor('/category/' + thirdCategory.categorySlug)}
                            className="text-[14px] text-gray-600 dark:text-gray-400 hover:text-red-600 transition-colors truncate block"
                          >
                            {thirdCategory.categoryName}
                          </Link>
                        ))}
                        <Link
                          to={'/category/' + secondCategory.categorySlug}
                          onClick={() => handleAnchor('/category/' + secondCategory.categorySlug)}
                          className="text-[14px] text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 font-medium mt-1"
                        >
                          Xem tất cả
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CategoryMenu;
