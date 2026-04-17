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
  const promotionProducts = products?.content?.filter(p => p.productPromotion !== null) || [];

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
          {/* Banner Section */}
          <div className="relative rounded-2xl overflow-hidden shadow-xl border border-pink-100 dark:border-pink-900/30">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-90"></div>
            <div className="absolute inset-0 mix-blend-overlay opacity-20 bg-cover bg-center" style={{ backgroundImage: "url('/images/auth/books_bg.png')" }}></div>
            <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-white max-w-2xl">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-md">
                  Cửa Hàng Khuyến Mãi
                </h1>
                <p className="text-lg md:text-xl text-pink-50 opacity-95 leading-relaxed max-w-xl drop-shadow-sm">
                  Khám phá những tựa sách tuyệt vời với mức giá vô cùng hấp dẫn. Đừng bỏ lỡ cơ hội sở hữu sách hay với ưu đãi đặc biệt!
                </p>
              </div>
              <div className="hidden lg:flex flex-col gap-3">
                 <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-xl px-6 py-3 flex items-center gap-4 shadow-lg transform transition-all hover:scale-105">
                  <div className="bg-white text-pink-600 px-3 py-1 rounded-lg font-bold text-lg">-50%</div>
                  <span className="text-white font-medium text-lg tracking-wide">Siêu Sale Cuối Tuần</span>
                </div>
                 <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-xl px-6 py-3 flex items-center gap-4 shadow-lg transform transition-all hover:scale-105">
                  <div className="bg-white text-purple-600 px-3 py-1 rounded-lg font-bold text-lg">Freeship</div>
                  <span className="text-white font-medium text-lg tracking-wide">Đơn từ 200K</span>
                </div>
              </div>
            </div>
          </div>

          {resultFragment}
        </div>
      </div>
    </main>
  );
}

export default ClientPromotionProducts;

