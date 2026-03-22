import React from 'react';
import { AlertTriangle, Marquee } from 'tabler-icons-react';
import { ClientProductCard } from 'components';
import { useQuery } from 'react-query';
import FetchUtils, { ErrorMessage, ListResponse } from 'utils/FetchUtils';
import { ClientListedProductResponse } from 'types';
import ResourceURL from 'constants/ResourceURL';
import NotifyUtils from 'utils/NotifyUtils';

function ClientHomeSlowSellingProducts() {

  const requestParams = { size: 12, slowSelling: true, saleable: true };

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

  let resultFragment;

  if (isLoadingProductResponses) {
    resultFragment = (
      <div className="flex flex-col gap-4">
        {Array(5).fill(0).map((_, index) => (
          <div key={index} className="h-12 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
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

  if (products && products.totalElements === 0) {
    resultFragment = (
      <div className="flex flex-col items-center gap-4 my-8 text-blue-600 dark:text-blue-400">
        <Marquee size={125} strokeWidth={1} />
        <p className="text-xl font-medium">Không có sản phẩm</p>
      </div>
    );
  }

  if (products && products.totalElements > 0) {
    resultFragment = (
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {products.content.map((product, index) => (
          <div key={index}>
            <ClientProductCard product={product} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#14372fe4]">
          Sách bán chạy
        </h2>
      </div>

      {resultFragment}
    </div>
  );
}

export default ClientHomeSlowSellingProducts;

