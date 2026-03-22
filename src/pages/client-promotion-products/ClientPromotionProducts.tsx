import React from 'react';
import { AlertTriangle, Marquee } from 'tabler-icons-react';
import { ClientProductCard } from 'components';
import { useQuery } from 'react-query';
import FetchUtils, { ErrorMessage, ListResponse } from 'utils/FetchUtils';
import { ClientListedProductResponse } from 'types';
import ResourceURL from 'constants/ResourceURL';
import NotifyUtils from 'utils/NotifyUtils';
import ApplicationConstants from 'constants/ApplicationConstants';
import useTitle from 'hooks/use-title';

function ClientPromotionProducts() {
  useTitle('Sản phẩm khuyến mại');

  const requestParams = {
    page: 1,
    size: 1000, // Lấy nhiều sản phẩm để lọc
    saleable: true,
  };

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

  const products = productResponses as ListResponse<ClientListedProductResponse>;

  // Lọc chỉ lấy sản phẩm có promotion
  const promotionProducts = products?.content?.filter(
    product => product.productPromotion !== null
  ) || [];

  let resultFragment;

  if (isLoadingProductResponses) {
    resultFragment = (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array(10).fill(0).map((_, index) => (
          <div key={index} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
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

  if (products && promotionProducts.length === 0) {
    resultFragment = (
      <div className="flex flex-col items-center gap-4 my-8 text-blue-600 dark:text-blue-400">
        <Marquee size={125} strokeWidth={1} />
        <p className="text-xl font-medium">Hiện tại không có sản phẩm khuyến mại</p>
      </div>
    );
  }

  if (products && promotionProducts.length > 0) {
    resultFragment = (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {promotionProducts.map((product) => (
          <div key={product.productId}>
            <ClientProductCard product={product} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-[#14372fe4] dark:text-gray-100">
              Sản phẩm khuyến mại
            </h1>
          </div>

          {resultFragment}
        </div>
      </div>
    </main>
  );
}

export default ClientPromotionProducts;

