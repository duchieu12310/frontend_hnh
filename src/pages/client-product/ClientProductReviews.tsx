import { AlertCircle, AlertTriangle, Edit, Messages } from 'tabler-icons-react';
import DateUtils from 'utils/DateUtils';
import { ReviewStarGroup } from 'components';
import React, { useState } from 'react';
import ApplicationConstants from 'constants/ApplicationConstants';
import { useQuery } from 'react-query';
import FetchUtils, { ErrorMessage, ListResponse } from 'utils/FetchUtils';
import { ClientSimpleReviewResponse } from 'types';
import ResourceURL from 'constants/ResourceURL';
import NotifyUtils from 'utils/NotifyUtils';

interface ClientProductReviewsProps {
  productSlug: string;
}

function ClientProductReviews({ productSlug }: ClientProductReviewsProps) {
  const [activePage, setActivePage] = useState(1);

  const {
    reviewResponses,
    isLoadingReviewResponses,
    isErrorReviewResponses,
  } = useGetAllReviewsByProduct(productSlug, activePage);
  const reviews = reviewResponses as ListResponse<ClientSimpleReviewResponse>;

  let reviewsContentFragment;

  if (isLoadingReviewResponses) {
    reviewsContentFragment = (
      <div className="flex flex-col gap-4">
        {Array(5).fill(0).map((_, index) => (
          <div key={index} className="h-12 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
        ))}
      </div>
    );
  }

  if (isErrorReviewResponses) {
    reviewsContentFragment = (
      <div className="flex flex-col items-center gap-4 my-8 text-pink-600 dark:text-pink-400">
        <AlertTriangle size={125} strokeWidth={1} />
        <p className="text-xl font-medium">Đã có lỗi xảy ra</p>
      </div>
    );
  }

  if (reviews && reviews.totalElements === 0) {
    reviewsContentFragment = (
      <div className="p-4 rounded-md bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800">
        <div className="flex items-start gap-3">
          <AlertCircle size={16} className="text-cyan-600 dark:text-cyan-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-cyan-900 dark:text-cyan-100">Thông báo</p>
            <p className="text-sm text-cyan-800 dark:text-cyan-200 mt-1">Sách hiện không có đánh giá nào</p>
          </div>
        </div>
      </div>
    );
  }

  if (reviews && reviews.totalElements > 0) {
    const renderPaginationButtons = () => {
      const buttons = [];
      const maxButtons = 7;
      let startPage = Math.max(1, activePage - Math.floor(maxButtons / 2));
      let endPage = Math.min(reviews.totalPages, startPage + maxButtons - 1);
      
      if (endPage - startPage < maxButtons - 1) {
        startPage = Math.max(1, endPage - maxButtons + 1);
      }

      if (startPage > 1) {
        buttons.push(
          <button
            key="first"
            onClick={() => setActivePage(1)}
            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            1
          </button>
        );
        if (startPage > 2) {
          buttons.push(<span key="ellipsis1" className="px-2 text-gray-500">...</span>);
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => setActivePage(i)}
            className={`px-3 py-1 text-sm border rounded transition-colors ${
              i === activePage
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {i}
          </button>
        );
      }

      if (endPage < reviews.totalPages) {
        if (endPage < reviews.totalPages - 1) {
          buttons.push(<span key="ellipsis2" className="px-2 text-gray-500">...</span>);
        }
        buttons.push(
          <button
            key="last"
            onClick={() => setActivePage(reviews.totalPages)}
            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {reviews.totalPages}
          </button>
        );
      }

      return buttons;
    };

    reviewsContentFragment = (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          {reviews.content.map(review => (
            <div key={review.reviewId} className="p-6 rounded-md shadow-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-md bg-cyan-100 dark:bg-cyan-900/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 font-medium text-sm">
                      {review.reviewUser.userFullname.charAt(0)}
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{review.reviewUser.userFullname}</p>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{DateUtils.isoDateToString(review.reviewCreatedAt)}</p>
                  <ReviewStarGroup ratingScore={review.reviewRatingScore} />
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{review.reviewContent}</p>
                {review.reviewReply && (
                  <div className="bg-gray-100 dark:bg-gray-700/50 rounded-md p-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <Messages size={14} className="text-gray-600 dark:text-gray-400" />
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Phản hồi từ cửa hàng</p>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{review.reviewReply}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            {renderPaginationButtons()}
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-medium">Trang {activePage}</span>
            <span> / {reviews.totalPages}</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Edit size={24} />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Đánh giá sản phẩm</h2>
        </div>
        {reviews && reviews.totalElements > 0 &&
          <span className="px-3 py-1 text-sm font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded">{reviews.totalElements}</span>}
      </div>

      {reviewsContentFragment}
    </div>
  );
}

function useGetAllReviewsByProduct(productSlug: string, activePage: number) {
  const requestParams = {
    page: activePage,
    size: ApplicationConstants.DEFAULT_CLIENT_PRODUCT_REVIEW_PAGE_SIZE,
    filter: 'status==2',
  };

  const {
    data: reviewResponses,
    isLoading: isLoadingReviewResponses,
    isError: isErrorReviewResponses,
  } = useQuery<ListResponse<ClientSimpleReviewResponse>, ErrorMessage>(
    ['client-api', 'reviews/products', 'getAllReviewsByProduct', productSlug, requestParams],
    () => FetchUtils.get(ResourceURL.CLIENT_REVIEW_PRODUCT + '/' + productSlug, requestParams),
    {
      onError: () => NotifyUtils.simpleFailed('Lấy dữ liệu không thành công'),
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  return { reviewResponses, isLoadingReviewResponses, isErrorReviewResponses };
}

export default ClientProductReviews;
