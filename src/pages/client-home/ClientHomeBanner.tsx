import React from 'react';
import { Car, HeartHandshake, Stars } from 'tabler-icons-react';
import { ClientCarousel } from 'components';

function ClientHomeBanner() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
      {/* Banner Carousel Section */}
      <div className="lg:col-span-8">
        <div className="relative rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:shadow-3xl">
          <ClientCarousel>
            <div className="relative">
              <img
                src='https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop'
                alt='Bộ sưu tập Giày Thể Thao'
                className="w-full h-[400px] lg:h-[450px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            <div className="relative">
              <img
                src='https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200&auto=format&fit=crop'
                alt='Giày Sneaker Năng Động'
                className="w-full h-[400px] lg:h-[450px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            <div className="relative">
              <img
                src='https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1200&auto=format&fit=crop'
                alt='Giày Tây Thanh Lịch'
                className="w-full h-[400px] lg:h-[450px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </ClientCarousel>
        </div>
      </div>

      {/* Service Cards Section */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        {/* Free Shipping Card */}
        <div className="group relative bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-900/20 dark:via-teal-900/20 dark:to-cyan-900/20 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-emerald-100 dark:border-emerald-800/30">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200/30 dark:bg-emerald-800/20 rounded-full blur-2xl -z-0"></div>
          <div className="relative z-10 flex items-start gap-4">
            <div className="flex-shrink-0 p-3 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Car size={32} className="text-white" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                Miễn phí vận chuyển
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                100% đơn hàng đều được miễn phí vận chuyển khi thanh toán trước.
              </p>
            </div>
          </div>
        </div>

        {/* Warranty Card */}
        <div className="group relative bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-yellow-900/20 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-amber-100 dark:border-amber-800/30">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/30 dark:bg-amber-800/20 rounded-full blur-2xl -z-0"></div>
          <div className="relative z-10 flex items-start gap-4">
            <div className="flex-shrink-0 p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Stars size={32} className="text-white" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
                Bảo hành tận tâm
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                Bất kể giấy tờ thế nào, công ty luôn cam kết sẽ hỗ trợ khách hàng tới cùng.
              </p>
            </div>
          </div>
        </div>

        {/* Exchange/Refund Card */}
        <div className="group relative bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 dark:from-rose-900/20 dark:via-pink-900/20 dark:to-red-900/20 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-rose-100 dark:border-rose-800/30">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-200/30 dark:bg-rose-800/20 rounded-full blur-2xl -z-0"></div>
          <div className="relative z-10 flex items-start gap-4">
            <div className="flex-shrink-0 p-3 bg-gradient-to-br from-rose-400 to-pink-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <HeartHandshake size={32} className="text-white" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-rose-700 dark:group-hover:text-rose-300 transition-colors">
                Đổi trả 1-1 hoặc hoàn tiền
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                Nếu phát sinh lỗi hoặc bạn cảm thấy sản phẩm chưa đáp ứng được nhu cầu.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientHomeBanner;
