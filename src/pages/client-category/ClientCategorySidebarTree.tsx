import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { ClientCategoryResponse, CollectionWrapper } from 'types';
import FetchUtils, { ErrorMessage } from 'utils/FetchUtils';
import ResourceURL from 'constants/ResourceURL';

interface ClientCategorySidebarTreeProps {
  currentSlug: string;
}

const L3_LIMIT = 8;

export default function ClientCategorySidebarTree({ currentSlug }: ClientCategorySidebarTreeProps) {
  const navigate = useNavigate();
  // expandedL2: set các slug L2 đã bấm "Xem thêm"
  const [expandedL2, setExpandedL2] = useState<Set<string>>(new Set());

  // Trạng thái hiển thị toàn bộ L1
  const [showAllL1, setShowAllL1] = useState(false);
  
  // Tự động thu gọn lại (ẩn hiển thị toàn bộ L1) khi người dùng đổi danh mục
  useEffect(() => {
    setShowAllL1(false);
  }, [currentSlug]);

  const { data: categoryResponses, isLoading } = useQuery<CollectionWrapper<ClientCategoryResponse>, ErrorMessage>(
    ['client-api', 'categories', 'getAllCategories'],
    () => FetchUtils.get(ResourceURL.CLIENT_CATEGORY),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  if (isLoading || !categoryResponses) {
    return (
      <div className="flex flex-col gap-2">
        {Array(5).fill(0).map((_, i) => (
          <div key={i} className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  const toggleExpand = (slug: string, e: React.MouseEvent) => {
    e.preventDefault();
    setExpandedL2(prev => {
      const next = new Set(prev);
      next.has(slug) ? next.delete(slug) : next.add(slug);
      return next;
    });
  };

  // Tìm L1 đang active dựa vào currentSlug
  const activeL1 = categoryResponses.content?.find((l1) =>
    l1.categorySlug === currentSlug ||
    l1.categoryChildren?.some((l2) =>
        l2.categorySlug === currentSlug ||
        l2.categoryChildren?.some((l3) => l3.categorySlug === currentSlug)
    )
  );

  // 1. Khi All Category (showAllL1 = true hoặc đang ở trang chủ không có L1 nào) -> Hiện tất cả L1.
  // 2. Khi Click 1 Danh mục L1 (activeL1 = true, showAllL1 = false) -> CHỈ hiển thị 1 L1 duy nhất đó!
  const l1ListToRender = (activeL1 && !showAllL1) ? [activeL1] : categoryResponses.content;

  return (
    <div className="flex flex-col text-[14px]">
      <button 
        onClick={() => setShowAllL1(!showAllL1)} 
        className={`text-left hover:text-orange-500 mb-2 font-medium transition-colors ${showAllL1 || !activeL1 ? 'text-orange-500' : 'text-gray-600 dark:text-gray-300'}`}
      >
        All Category
      </button>
      
      {(l1ListToRender || []).map((l1) => {
        const isL1Active = activeL1?.categorySlug === l1.categorySlug;
        // Chỉ hiện L2 khi L1 này là active VÀ người dùng CHƯA bấm All Category
        const shouldShowL2 = isL1Active && !showAllL1;
        
        // Tìm L2 đang active (nếu user click vào L2 HOẶC click vào L3 thuộc L2 đó)
        let activeL2 = null;
        if (shouldShowL2) {
          activeL2 = (l1.categoryChildren || []).find(l2 => 
            l2.categorySlug === currentSlug || 
            l2.categoryChildren?.some(l3 => l3.categorySlug === currentSlug)
          );
        }

        // Nếu có activeL2 thì CHỈ hiển thị L2 đó. Nếu không (click L1) thì hiển thị tất cả L2.
        const l2ListToRender = activeL2 ? [activeL2] : (l1.categoryChildren || []);

        return (
        <div key={l1.categorySlug} className={`mb-2 ml-2`}>
          {/* L1 */}
          <Link
            to={'/category/' + l1.categorySlug}
            className={`block ${!shouldShowL2 ? 'mb-1' : 'mb-2'} ${currentSlug === l1.categorySlug ? 'text-orange-500 font-medium' : 'text-gray-600 hover:text-orange-500 dark:text-gray-400 dark:hover:text-orange-500'}`}
          >
            {l1.categoryName}
          </Link>
          
          {/* L2 */}
          {shouldShowL2 && (
            <div className="ml-3 flex flex-col gap-1.5">
              {(l2ListToRender || []).map((l2) => {
                // Check if THIS l2 or one of its l3 is the current active category
                const isL2Active = currentSlug === l2.categorySlug;
                const hasActiveL3 = l2.categoryChildren?.some(l3 => l3.categorySlug === currentSlug);
                
                // In screenshot "Truyện Cổ Tích" is orange and L3s are shown.
                // Nếu click thẳng vào Cấp 1 (!activeL2) thì tự động hiển thị toàn bộ L3.
                // Nếu click Cấp 2 hoặc 3, thì chỉ hiển thị L3 của L2 đang active.
                const shouldShowL3 = isL2Active || hasActiveL3 || !activeL2;
                
                const isExpanded = expandedL2.has(l2.categorySlug);
                const children = l2.categoryChildren;
                const visibleChildren = isExpanded ? children : children.slice(0, L3_LIMIT);
                const hasMore = children.length > L3_LIMIT;

                return (
                  <div key={l2.categorySlug} className="flex flex-col">
                    {/* L2 Link */}
                    <Link
                      to={'/category/' + l2.categorySlug}
                      className={`${(isL2Active || hasActiveL3) ? 'text-orange-500 font-medium' : 'text-gray-600 hover:text-orange-500'} transition-colors`}
                    >
                      {l2.categoryName}
                    </Link>

                    {/* L3 */}
                    {shouldShowL3 && (
                      <div className="ml-3 mt-1.5 flex flex-col gap-1.5">
                        {visibleChildren.map((l3) => (
                          <Link
                            key={l3.categorySlug}
                            to={'/category/' + l3.categorySlug}
                            className={`text-[14px] ${currentSlug === l3.categorySlug ? 'text-orange-500 font-medium' : 'text-gray-600 hover:text-orange-500'}`}
                          >
                            {l3.categoryName}
                          </Link>
                        ))}

                        {hasMore && (
                          <button
                            onClick={(e) => toggleExpand(l2.categorySlug, e)}
                            className="text-left text-[14px] font-semibold text-orange-500 hover:text-orange-600 mt-0.5"
                          >
                            {isExpanded ? 'Thu gọn ∧' : 'Xem Thêm ∨'}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )})}
    </div>
  );
}
