const titles: Record<string, string> = {
  '/': 'Trang chủ',
  '/all-categories': 'Tất cả thể loại',
  '/category/:slug': 'Thể loại',
  '/signin': 'Đăng nhập',
  '/user': 'Tài khoản',
  '/user/setting': 'Thông tin cá nhân',
  '/user/setting/personal': 'Cập nhật thông tin cá nhân',
  '/user/setting/phone': 'Cập nhật số điện thoại',
  '/user/setting/email': 'Cập nhật email',
  '/user/setting/password': 'Đổi mật khẩu',
  '/user/wishlist': 'Sách yêu thích',
  '/user/preorder': 'Đặt trước sách',
  '/user/review': 'Đánh giá sách',
  '/user/notification': 'Thông báo',
  '/cart': 'Giỏ hàng',
  '/order': 'Đơn hàng',
  '/order/detail/:code': 'Chi tiết đơn hàng',
  '/user/chat': 'Yêu cầu tư vấn',
  '/payment/success': 'Thanh toán thành công',
  '/payment/cancel': 'Hủy thanh toán',
  '/user/reward': 'Điểm thưởng',
  '/signup': 'Đăng ký',
  '/forgot': 'Yêu cầu cấp lại mật khẩu',
  '/contact': 'Liên hệ',
  '/lien-he': 'Liên hệ',

  '/admin': 'Admin',
};

const handler = {
  get: function (target: typeof titles, name: string) {
    return Object.prototype.hasOwnProperty.call(target, name) ? target[name] + ' – ThatAnNhien' : 'ThatAnNhien';
  },
};

const Titles = new Proxy(titles, handler);

export default Titles;
