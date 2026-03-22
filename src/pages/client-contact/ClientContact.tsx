import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Mail, Phone, MapPin, BrandFacebook, BrandTwitter } from 'tabler-icons-react';
import useTitle from 'hooks/use-title';

interface FAQItem {
  question: string;
  answer: string;
}

function ClientContact() {
  useTitle('/contact');

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqItems: FAQItem[] = [
    {
      question: 'Phương thức thanh toán và nhận hàng?',
      answer: 'Chúng tôi áp dụng chương trình gửi hàng đi toàn quốc, để đảm bảo hàng hóa khi gửi chúng tôi liên kết với đơn vị vận chuyển riêng. Phương thức nhận hàng kiểm tra và thanh toán cho nhân viên chuyển phát.'
    },
    {
      question: 'Quy trình khi đặt hàng xong tại website?',
      answer: 'Sau khi bạn để lại thông tin đặt hàng, cần tư vấn. Nhân viên chăm sóc khách hàng của chúng tôi sẽ liên hệ ngay với bạn sau giờ làm việc hành chính để xác nhận đơn hàng. Sau khi xác nhận thành công hàng sẽ được gửi đi ngay cho quý khách.'
    },
    {
      question: 'Thời gian giao hàng mất bao lâu?',
      answer: 'Thời gian giao hàng thường giao động từ 1-5 ngày tùy thuộc vị trí giao hàng của bạn.'
    },
    {
      question: 'Phí giao gửi hàng khi đặt hàng tại website thegioitradao.com',
      answer: 'Chúng tôi miễn phí giao gửi hàng toàn quốc cho đơn hàng từ 300.000 vnđ. Nếu tổng đơn hàng của quý khách thấp hơn thì mất thêm 30.000₫ cho một đơn hàng.'
    },
    {
      question: 'Khi để lại thông tin mua hàng, liệu thông tin cá nhân của tôi có được bảo vệ không?',
      answer: 'Mọi thông tin đặt hàng của quý khách cung cấp chúng tôi đảm bảo giữ bảo mật tuyệt đối.'
    },
    {
      question: 'Ở nước ngoài có đặt mua sản phẩm được không?',
      answer: 'Hiện tại, chúng tôi chỉ nhận giao gửi hàng toàn quốc, chưa có chính sách giao gửi hàng đi quốc tế.'
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Cột trái: THÔNG TIN */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="bg-red-700 dark:bg-red-800 px-6 py-4">
              <h2 className="text-xl font-bold text-white uppercase">THÔNG TIN</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <MapPin size={20} className="text-red-600 dark:text-red-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Đại diện pháp luật:</p>
                  <p className="text-sm text-gray-900 dark:text-gray-100">Nguyễn Đình Khánh</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <MapPin size={20} className="text-red-600 dark:text-red-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Địa chỉ:</p>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                  Số 2 Thuỵ Ứng , xã Đan Phượng , thành phố Hà Nội
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <Phone size={20} className="text-red-600 dark:text-red-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Điện thoại/Zalo:</p>
                  <p className="text-sm text-gray-900 dark:text-gray-100">0132.951.002</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <Mail size={20} className="text-red-600 dark:text-red-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Email:</p>
                  <a
                    href="mailto:lienhe@thathanhien.com"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    lienhe@thathanhien.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <BrandFacebook size={20} className="text-red-600 dark:text-red-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Trang Facebook:</p>
                  <a
                    href="https://www.facebook.com/thathanhiencom"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline break-all"
                  >
                    https://www.facebook.com/thathanhiencom
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <BrandTwitter size={20} className="text-red-600 dark:text-red-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Trang Twitter:</p>
                  <a
                    href="https://twitter.com/thathanhien"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline break-all"
                  >
                    https://twitter.com/thathanhien
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Cột phải: MỘT SỐ CÂU HỎI THƯỜNG GẶP */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="bg-red-700 dark:bg-red-800 px-6 py-4">
              <h2 className="text-xl font-bold text-white uppercase">MỘT SỐ CÂU HỎI THƯỜNG GẶP</h2>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Vui lòng đọc danh sách câu hỏi thường gặp trước khi gửi tin nhắn cho chúng tôi.
              </p>
              <div className="space-y-0">
                {faqItems.map((item, index) => (
                  <div key={index} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex-shrink-0">
                          {openIndex === index ? (
                            <ChevronUp size={20} className="text-green-600 dark:text-green-400" />
                          ) : (
                            <ChevronDown size={20} className="text-green-600 dark:text-green-400" />
                          )}
                        </div>
                        <span
                          className={`text-sm flex-1 ${
                            openIndex === index
                              ? 'text-red-700 dark:text-red-400 font-bold'
                              : index === 2
                              ? 'text-orange-600 dark:text-orange-400 font-medium'
                              : 'text-gray-900 dark:text-gray-100 font-medium'
                          }`}
                        >
                          {item.question}
                        </span>
                      </div>
                    </button>
                    {openIndex === index && (
                      <div className="px-4 pb-4 pl-11">
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientContact;

