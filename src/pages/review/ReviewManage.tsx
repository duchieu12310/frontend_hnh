import React, { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import useResetManagePageState from 'hooks/use-reset-manage-page-state';
import { ManageHeader, ManageHeaderTitle, ManageMain, ManagePagination, ReviewStarGroup } from 'components';
import ReviewConfigs from 'pages/review/ReviewConfigs';
import useGetAllApi from 'hooks/use-get-all-api';
import { ReviewRequest, ReviewResponse } from 'models/Review';
import PageConfigs from 'pages/PageConfigs';
import { ListResponse } from 'utils/FetchUtils';
import { Box, Check, Clock, Message2, Search, Star, Trash, User } from 'tabler-icons-react';
import DateUtils from 'utils/DateUtils';
import useAppStore from 'stores/use-app-store';
import { useDebouncedValue } from 'hooks/use-debounced-value';
import useDeleteByIdApi from 'hooks/use-delete-by-id-api';
import useUpdateApi from 'hooks/use-update-api';
import { useColorScheme } from 'hooks/use-color-scheme';

function ReviewManage() {
  useResetManagePageState();

  const { colorScheme } = useColorScheme();

  const {
    isLoading,
    data: listResponse = PageConfigs.initialListResponse as ListResponse<ReviewResponse>,
  } = useGetAllApi<ReviewResponse>(ReviewConfigs.resourceUrl, ReviewConfigs.resourceKey);

  const deleteByIdApi = useDeleteByIdApi(ReviewConfigs.resourceUrl, ReviewConfigs.resourceKey);

  const { searchToken } = useAppStore();

  const [deleteModalEntityId, setDeleteModalEntityId] = useState<number | null>(null);
  const [checkModalReview, setCheckModalReview] = useState<ReviewResponse | null>(null);
  const [replyModalReview, setReplyModalReview] = useState<ReviewResponse | null>(null);

  const handleDeleteEntityButton = (entityId: number) => {
    setDeleteModalEntityId(entityId);
  };

  const handleCheckReviewButton = (review: ReviewResponse) => {
    setCheckModalReview(review);
  };

  const handleReplyReviewButton = (review: ReviewResponse) => {
    setReplyModalReview(review);
  };

  const reviewStatusBadgeFragment = (status: number) => {
    switch (status) {
    case 1:
      return <span className="px-2 py-1 text-xs font-medium bg-gray-500 text-white rounded">Chưa duyệt</span>;
    case 2:
      return <span className="px-2 py-1 text-xs font-medium bg-teal-500 text-white rounded">Đã duyệt</span>;
    case 3:
      return <span className="px-2 py-1 text-xs font-medium bg-pink-500 text-white rounded">Không duyệt</span>;
    }
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

  const entitiesTableHeadsFragment = (
    <tr>
      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">ID</th>
      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Ngày tạo</th>
      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Người dùng</th>
      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Sản phẩm</th>
      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Số sao</th>
      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Tóm lược nội dung</th>
      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Có phản hồi?</th>
      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Trạng thái</th>
      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase" style={{ width: 120 }}>Thao tác</th>
    </tr>
  );

  const entitiesTableRowsFragment = listResponse.content.map((entity) => (
    <tr key={entity.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
      <td className="px-4 py-2">{entity.id}</td>
      <td className="px-4 py-2">{DateUtils.isoDateToString(entity.createdAt)}</td>
      <td className="px-4 py-2">
        <div className="flex flex-col gap-0">
          <span className="text-sm">{highlightText(entity.user.fullname, searchToken)}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{highlightText(entity.user.username, searchToken)}</span>
        </div>
      </td>
      <td className="px-4 py-2">
        <a href={'/product/' + entity.product.slug} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
          {highlightText(entity.product.name, searchToken)}
        </a>
      </td>
      <td className="px-4 py-2">
        <ReviewStarGroup ratingScore={entity.ratingScore}/>
      </td>
      <td className="px-4 py-2 max-w-[300px]">
        {highlightText(entity.content.length > 120 ? entity.content.substring(0, 120).concat('...') : entity.content, searchToken)}
      </td>
      <td className="px-4 py-2">{entity.reply && <Check size={16} className="text-teal-500" />}</td>
      <td className="px-4 py-2">{reviewStatusBadgeFragment(entity.status)}</td>
      <td className="px-4 py-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleCheckReviewButton(entity)}
            className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
            title="Xem xét"
          >
            <Search size={16}/>
          </button>
          <button
            onClick={() => handleReplyReviewButton(entity)}
            disabled={entity.status === 1}
            className="p-1 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Phản hồi"
          >
            <Message2 size={16}/>
          </button>
          <button
            onClick={() => handleDeleteEntityButton(entity.id)}
            className="p-1 text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/20 rounded transition-colors"
            title="Xóa"
          >
            <Trash size={16}/>
          </button>
        </div>
      </td>
    </tr>
  ));

  return (
    <div className="flex flex-col gap-4">
      <ManageHeader>
        <ManageHeaderTitle
          titleLinks={ReviewConfigs.manageTitleLinks}
          title={ReviewConfigs.manageTitle}
        />
      </ManageHeader>

      <ReviewSearchPanel/>

      <ManageMain
        listResponse={listResponse}
        isLoading={isLoading}
      >
        <div className="overflow-x-auto rounded-md border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              {entitiesTableHeadsFragment}
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {entitiesTableRowsFragment}
            </tbody>
          </table>
        </div>
      </ManageMain>

      <ManagePagination listResponse={listResponse}/>

      {/* Delete Modal */}
      <Dialog open={deleteModalEntityId !== null} onClose={() => setDeleteModalEntityId(null)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-xs bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
            <Dialog.Title className="text-lg font-semibold mb-2">Xác nhận xóa</Dialog.Title>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Xóa phần tử có ID {deleteModalEntityId}?
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setDeleteModalEntityId(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
              >
                Không xóa
              </button>
              <button
                onClick={() => {
                  if (deleteModalEntityId !== null) {
                    deleteByIdApi.mutate(deleteModalEntityId);
                    setDeleteModalEntityId(null);
                  }
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
              >
                Xóa
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Check Review Modal */}
      {checkModalReview && (
        <CheckReviewModal review={checkModalReview} onClose={() => setCheckModalReview(null)} />
      )}

      {/* Reply Review Modal */}
      {replyModalReview && (
        <ReplyReviewModal review={replyModalReview} onClose={() => setReplyModalReview(null)} />
      )}
    </div>
  );
}

function ReviewSearchPanel() {
  const { setSearchToken } = useAppStore();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 400);

  useEffect(() => setSearchToken(debouncedSearch), [debouncedSearch, setSearchToken]);

  return (
    <div className="p-2 rounded-md shadow-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={14} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Từ khóa"
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );
}

function CheckReviewModal({ review, onClose }: { review: ReviewResponse, onClose: () => void }) {
  const updateReviewApi = useUpdateApi<ReviewRequest, ReviewResponse>(ReviewConfigs.resourceUrl, ReviewConfigs.resourceKey, review.id);

  const handleCheckReviewButton = () => {
    const requestBody: ReviewRequest = {
      userId: review.user.id,
      productId: review.product.id,
      ratingScore: review.ratingScore,
      content: review.content,
      reply: review.reply,
      status: 2,
    };
    updateReviewApi.mutate(requestBody);
    onClose();
  };

  const handleUncheckReviewButton = () => {
    const requestBody: ReviewRequest = {
      userId: review.user.id,
      productId: review.product.id,
      ratingScore: review.ratingScore,
      content: review.content,
      reply: review.reply,
      status: 3,
    };
    updateReviewApi.mutate(requestBody);
    onClose();
  };

  return (
    <Dialog open={true} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-h-[90vh] overflow-auto">
          <Dialog.Title className="text-lg font-semibold mb-4">Xem xét Đánh giá ID {review.id}</Dialog.Title>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                  <Clock size={16} className="text-gray-600 dark:text-gray-300" />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">{DateUtils.isoDateToString(review.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                  <User size={16} className="text-gray-600 dark:text-gray-300" />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">{review.user.fullname}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                  <Box size={16} className="text-gray-600 dark:text-gray-300" />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">{review.product.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                  <Star size={16} className="text-gray-600 dark:text-gray-300" />
                </div>
                <ReviewStarGroup ratingScore={review.ratingScore}/>
              </div>
            </div>
            <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 py-2 text-sm italic text-gray-700 dark:text-gray-300">
              {review.content}
            </blockquote>
            <div className="flex gap-2 justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Đóng
              </button>
              <button
                onClick={handleCheckReviewButton}
                disabled={review.status === 2}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Duyệt
              </button>
              <button
                onClick={handleUncheckReviewButton}
                disabled={review.status === 3}
                className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Không duyệt
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

function ReplyReviewModal({ review, onClose }: { review: ReviewResponse, onClose: () => void }) {
  const [reply, setReply] = useState(review.reply || '');

  const updateReviewApi = useUpdateApi<ReviewRequest, ReviewResponse>(ReviewConfigs.resourceUrl, ReviewConfigs.resourceKey, review.id);

  const handleReplyReviewButton = () => {
    const requestBody: ReviewRequest = {
      userId: review.user.id,
      productId: review.product.id,
      ratingScore: review.ratingScore,
      content: review.content,
      reply: reply.trim() || null,
      status: review.status,
    };
    updateReviewApi.mutate(requestBody);
    onClose();
  };

  return (
    <Dialog open={true} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-h-[90vh] overflow-auto">
          <Dialog.Title className="text-lg font-semibold mb-4">Phản hồi Đánh giá ID {review.id}</Dialog.Title>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                  <Clock size={16} className="text-gray-600 dark:text-gray-300" />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">{DateUtils.isoDateToString(review.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                  <User size={16} className="text-gray-600 dark:text-gray-300" />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">{review.user.fullname}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                  <Box size={16} className="text-gray-600 dark:text-gray-300" />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">{review.product.name}</span>
              </div>
            </div>
            <textarea
              autoFocus
              placeholder="Nhập nội dung phản hồi"
              rows={4}
              value={reply}
              onChange={(event) => setReply(event.currentTarget.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Đóng
              </button>
              <button
                onClick={handleReplyReviewButton}
                disabled={(!review.reply && reply.length === 0) || (!!review.reply && review.reply === reply)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {!review.reply ? 'Thêm phản hồi' : (reply.length === 0 ? 'Xóa phản hồi' : 'Sửa phản hồi')}
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export default ReviewManage;
