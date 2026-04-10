import React from 'react';
import {
  BrandFacebook,
  BrandInstagram,
  BrandLinkedin,
  BrandPinterest,
  BrandTwitter,
  BrandYoutube
} from 'tabler-icons-react';
import { Link } from 'react-router-dom';

function ClientFooter() {

  return (
    <footer className="mt-12 pt-12 pb-12 bg-black dark:bg-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Cột 1: Giới thiệu */}
          <div className="col-span-1">
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-bold text-white mb-3 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-gradient-to-r after:from-amber-400 after:to-orange-400 after:rounded-sm">
                GIỚI THIỆU
              </h3>
              <div className="flex flex-col gap-3">
                <p className="text-sm text-gray-300 leading-relaxed">
                  Hiếu Bookstore là điểm đến lý tưởng cho những người yêu sách, 
                  nơi hội tụ những tác phẩm văn học, kinh tế và kỹ năng sống tinh hoa nhất.
                </p>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Mua sắm tại <a href="/" className="text-amber-400 font-semibold hover:underline">hieubookstore.com</a>. Chúng tôi cam kết sách chính hãng, giao hàng nhanh chóng, 
                  và dịch vụ hỗ trợ tận tâm nhất cho cộng đồng mọt sách.
                </p>
              </div>
            </div>
          </div>

          {/* Cột 2: Danh mục sản phẩm */}
          <div className="col-span-1">
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-bold text-white mb-3 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-gradient-to-r after:from-amber-400 after:to-orange-400 after:rounded-sm">
                DANH MỤC SÁCH
              </h3>
              <div className="flex flex-col gap-2">
                <Link to="/category/van-hoc-trong-nuoc" className="text-sm text-gray-300 no-underline transition-all duration-200 hover:text-amber-400 hover:translate-x-1 hover:font-medium">
                  Văn học trong nước
                </Link>
                <Link to="/category/van-hoc-nuoc-ngoai" className="text-sm text-gray-300 no-underline transition-all duration-200 hover:text-amber-400 hover:translate-x-1 hover:font-medium">
                  Văn học nước ngoài
                </Link>
                <Link to="/category/kinh-te" className="text-sm text-gray-300 no-underline transition-all duration-200 hover:text-amber-400 hover:translate-x-1 hover:font-medium">
                  Kinh tế - Khởi nghiệp
                </Link>
                <Link to="/category/ky-nang-song" className="text-sm text-gray-300 no-underline transition-all duration-200 hover:text-amber-400 hover:translate-x-1 hover:font-medium">
                  Kỹ năng sống
                </Link>
                <Link to="/category/thieu-nhi" className="text-sm text-gray-300 no-underline transition-all duration-200 hover:text-amber-400 hover:translate-x-1 hover:font-medium">
                  Sách thiếu nhi
                </Link>
                <Link to="/category/ngoai-ngu" className="text-sm text-gray-300 no-underline transition-all duration-200 hover:text-amber-400 hover:translate-x-1 hover:font-medium">
                  Sách ngoại ngữ
                </Link>
              </div>
            </div>
          </div>

          {/* Cột 3: Quy định & Chính sách */}
          <div className="col-span-1">
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-bold text-white mb-3 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-gradient-to-r after:from-blue-400 after:to-cyan-400 after:rounded-sm">
                QUY ĐỊNH & CHÍNH SÁCH
              </h3>
              <div className="flex flex-col gap-2">
                <Link to="/" className="text-sm text-white no-underline transition-all duration-200 hover:text-blue-400 hover:translate-x-1 hover:font-medium">
                  Điều khoản và quy định chung
                </Link>
                <Link to="/" className="text-sm text-white no-underline transition-all duration-200 hover:text-blue-400 hover:translate-x-1 hover:font-medium">
                  Chính sách bảo mật thông tin
                </Link>
                <Link to="/" className="text-sm text-white no-underline transition-all duration-200 hover:text-blue-400 hover:translate-x-1 hover:font-medium">
                  Phương thức thanh toán
                </Link>
                <Link to="/" className="text-sm text-white no-underline transition-all duration-200 hover:text-blue-400 hover:translate-x-1 hover:font-medium">
                  Chính sách vận chuyển và kiểm hàng
                </Link>
                <Link to="/" className="text-sm text-white no-underline transition-all duration-200 hover:text-blue-400 hover:translate-x-1 hover:font-medium">
                  Chính sách bảo hành và đổi trả
                </Link>
              </div>
            </div>
          </div>

          {/* Cột 4: Về chúng tôi */}
          <div className="col-span-1">
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-bold text-white mb-3 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-gradient-to-r after:from-blue-400 after:to-cyan-400 after:rounded-sm">
                VỀ CHÚNG TÔI
              </h3>
              <div className="flex flex-col gap-3">
                <p className="text-base font-bold text-white mb-2">HIẾU BOOKSTORE</p>
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-gray-300 leading-relaxed">
                    <strong>Địa chỉ:</strong> đường nhổn , hà nội
                  </p>
                  <a 
                    href="https://maps.google.com/?q=số+nhà+13+đường+nhổn,+hà+nội" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-amber-400 font-medium underline"
                  >
                    (Chỉ đường)
                  </a>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    <strong>Email:</strong> <a href="mailto:lienhe@hieubookstore.com" className="text-amber-400">lienhe@hieubookstore.com</a>
                  </p>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    <strong>Điện thoại/Zalo:</strong> <span className="text-amber-400 font-semibold">0354188764</span>
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <button 
                    type="button"
                    className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5 hover:scale-110 hover:bg-[#166FE5]"
                  >
                    <BrandFacebook strokeWidth={1.5} size={20}/>
                  </button>
                  <button 
                    type="button"
                    className="w-10 h-10 rounded-full text-white flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5 hover:scale-110"
                    style={{ background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)' }}
                  >
                    <BrandInstagram strokeWidth={1.5} size={20}/>
                  </button>
                  <button 
                    type="button"
                    className="w-10 h-10 rounded-full bg-[#1DA1F2] text-white flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5 hover:scale-110 hover:bg-[#1a91da]"
                  >
                    <BrandTwitter strokeWidth={1.5} size={20}/>
                  </button>
                  <button 
                    type="button"
                    className="w-10 h-10 rounded-full bg-[#BD081C] text-white flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5 hover:scale-110 hover:bg-[#a00716]"
                  >
                    <BrandPinterest strokeWidth={1.5} size={20}/>
                  </button>
                  <button 
                    type="button"
                    className="w-10 h-10 rounded-full bg-[#0077B5] text-white flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5 hover:scale-110 hover:bg-[#006399]"
                  >
                    <BrandLinkedin strokeWidth={1.5} size={20}/>
                  </button>
                  <button 
                    type="button"
                    className="w-10 h-10 rounded-full bg-[#FF0000] text-white flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5 hover:scale-110 hover:bg-[#e60000]"
                  >
                    <BrandYoutube strokeWidth={1.5} size={20}/>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-6 pb-4 flex justify-center items-center gap-4">
          <div className="flex-1 h-px bg-white/20 max-w-[200px]" />
          <p className="text-sm font-medium text-gray-400 text-center whitespace-nowrap">
            Bản quyền 2025 © FashionHub.com
          </p>
          <div className="flex-1 h-px bg-white/20 max-w-[200px]" />
        </div>
      </div>
    </footer>
  );
}

export default React.memo(ClientFooter);
