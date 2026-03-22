import React, { useState } from 'react';
import { ClientUserNavbar } from 'components';
import ApplicationConstants from 'constants/ApplicationConstants';
import { useQuery } from 'react-query';
import FetchUtils, { ErrorMessage, ListResponse } from 'utils/FetchUtils';
import { ClientSimpleOrderResponse } from 'types';
import ResourceURL from 'constants/ResourceURL';
import NotifyUtils from 'utils/NotifyUtils';
import useTitle from 'hooks/use-title';
import { AlertTriangle, Marquee } from 'tabler-icons-react';
import DateUtils from 'utils/DateUtils';
import { Link } from 'react-router-dom';
import MiscUtils from 'utils/MiscUtils';

function ClientOrder() {
  useTitle();

  const [activePage, setActivePage] = useState(1);

  const {
    orderResponses,
    isLoadingOrderResponses,
    isErrorOrderResponses,
  } = useGetAllOrdersApi(activePage);
  const orders = orderResponses as ListResponse<ClientSimpleOrderResponse>;

  let ordersContentFragment;

  if (isLoadingOrderResponses) {
    ordersContentFragment = (
      <div className="flex flex-col gap-4">
        {Array(5).fill(0).map((_, index) => (
          <div key={index} className="h-12 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
        ))}
      </div>
    );
  }

  if (isErrorOrderResponses) {
    ordersContentFragment = (
      <div className="flex flex-col items-center gap-4 my-8 text-pink-600 dark:text-pink-400">
        <AlertTriangle size={125} strokeWidth={1} />
        <p className="text-xl font-medium">Đã có lỗi xảy ra</p>
      </div>
    );
  }

  if (orders && orders.totalElements === 0) {
    ordersContentFragment = (
      <div className="flex flex-col items-center gap-4 my-8 text-blue-600 dark:text-blue-400">
        <Marquee size={125} strokeWidth={1} />
        <p className="text-xl font-medium">Chưa có đơn hàng nào</p>
      </div>
    );
  }

  if (orders && orders.totalElements > 0) {
    const renderPaginationButtons = () => {
      const buttons = [];
      const maxButtons = 7;
      let startPage = Math.max(1, activePage - Math.floor(maxButtons / 2));
      let endPage = Math.min(orders.totalPages, startPage + maxButtons - 1);
      
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

      if (endPage < orders.totalPages) {
        if (endPage < orders.totalPages - 1) {
          buttons.push(<span key="ellipsis2" className="px-2 text-gray-500">...</span>);
        }
        buttons.push(
          <button
            key="last"
            onClick={() => setActivePage(orders.totalPages)}
            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {orders.totalPages}
          </button>
        );
      }

      return buttons;
    };

    ordersContentFragment = (
      <>
        <div className="flex flex-col gap-2">
          {orders.content.map(order => <ClientOrderCard key={order.orderId} order={order} />)}
        </div>

        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-2">
            {renderPaginationButtons()}
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-medium">Trang {activePage}</span>
            <span> / {orders.totalPages}</span>
          </p>
        </div>
      </>
    );
  }

  return (
    <main>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-3">
            <ClientUserNavbar />
          </div>

          <div className="md:col-span-9">
            <div className="p-6 rounded-md shadow-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col gap-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Đơn hàng của tôi
                </h2>

                {ordersContentFragment}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function ClientOrderCard({ order }: { order: ClientSimpleOrderResponse }) {
  const orderStatusBadgeFragment = (status: number) => {
    switch (status) {
    case 1:
      return <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">Đơn hàng mới</span>;
    case 2:
      return <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded">Đang xử lý</span>;
    case 3:
      return <span className="px-2 py-1 text-xs font-medium bg-violet-100 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 rounded">Đang giao hàng</span>;
    case 4:
      return <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded">Đã giao hàng</span>;
    case 5:
      return <span className="px-2 py-1 text-xs font-medium bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded">Hủy bỏ</span>;
    }
  };

  const orderPaymentStatusBadgeFragment = (paymentStatus: number) => {
    switch (paymentStatus) {
    case 1:
      return <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">Chưa thanh toán</span>;
    case 2:
      return <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded">Đã thanh toán</span>;
    }
  };

  return (
    <div className="p-4 rounded-md bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <p className="font-medium text-gray-900 dark:text-gray-100">Mã đơn hàng: {order.orderCode}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Ngày tạo: {DateUtils.isoDateToString(order.orderCreatedAt, 'DD/MM/YYYY')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {orderStatusBadgeFragment(order.orderStatus)}
            {orderPaymentStatusBadgeFragment(order.orderPaymentStatus)}
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-600"></div>

        {order.orderItems.map(orderItem => (
          <div key={orderItem.orderItemVariant.variantId} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                className="rounded-md w-[55px] h-[55px] object-cover"
                src={orderItem.orderItemVariant.variantProduct.productThumbnail || undefined}
                alt={orderItem.orderItemVariant.variantProduct.productName}
              />
              <div className="flex flex-col gap-2">
                <Link
                  to={'/product/' + orderItem.orderItemVariant.variantProduct.productSlug}
                  className="font-medium text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {orderItem.orderItemVariant.variantProduct.productName}
                </Link>
                {orderItem.orderItemVariant.variantProperties && (
                  <div className="flex flex-col gap-1">
                    {orderItem.orderItemVariant.variantProperties.content.map(variantProperty => (
                      <p key={variantProperty.id} className="text-xs text-gray-600 dark:text-gray-400">
                        {variantProperty.name}: {variantProperty.value}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-900 dark:text-gray-100">{MiscUtils.formatPrice(orderItem.orderItemPrice) + '\u00A0₫'}</p>
              <p className="text-lg font-mono text-blue-600 dark:text-blue-400">
                ×{orderItem.orderItemQuantity}
              </p>
            </div>
          </div>
        ))}

        <div className="border-t border-gray-200 dark:border-gray-600"></div>

        <div className="flex items-center justify-between">
          <Link
            to={'/order/detail/' + order.orderCode}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Xem chi tiết
          </Link>
          <div className="flex items-center gap-1">
            <p className="text-sm text-gray-700 dark:text-gray-300">Tổng tiền: </p>
            <p className="font-medium text-lg text-gray-900 dark:text-gray-100">{MiscUtils.formatPrice(order.orderTotalPay) + '\u00A0₫'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function useGetAllOrdersApi(activePage: number) {
  const requestParams = {
    page: activePage,
    size: ApplicationConstants.DEFAULT_CLIENT_ORDER_PAGE_SIZE,
  };

  const {
    data: orderResponses,
    isLoading: isLoadingOrderResponses,
    isError: isErrorOrderResponses,
  } = useQuery<ListResponse<ClientSimpleOrderResponse>, ErrorMessage>(
    ['client-api', 'orders', 'getAllOrders', requestParams],
    () => FetchUtils.getWithToken(ResourceURL.CLIENT_ORDER, requestParams),
    {
      onError: () => NotifyUtils.simpleFailed('Lấy dữ liệu không thành công'),
      keepPreviousData: true,
    }
  );

  return { orderResponses, isLoadingOrderResponses, isErrorOrderResponses };
}

export default ClientOrder;
