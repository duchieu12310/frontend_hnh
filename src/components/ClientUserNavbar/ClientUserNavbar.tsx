import { Link, useLocation } from 'react-router-dom';
import React from 'react';
import { Alarm, Award, Bell, FileBarcode, Heart, Icon, MessageCircle, Star, User } from 'tabler-icons-react';

function ClientUserNavbar() {
  const location = useLocation();

  const navButton = (name: string, path: string, Icon: Icon, childPaths?: string[]) => {
    const isActive = location.pathname === path || childPaths?.some(p => location.pathname.startsWith(p));
    
    return (
      <Link
        to={path}
        className={`w-full px-3 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors ${
          isActive
            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
        }`}
      >
        <Icon size={18} strokeWidth={1.5} />
        {name}
      </Link>
    );
  };

  return (
    <div className="flex flex-col gap-1.5">
      {navButton('Tài khoản', '/user', User)}
      {navButton('Thông báo', '/user/notification', Bell)}
      {navButton('Quản lý đơn hàng', '/order', FileBarcode, ['/order/detail'])}
      {navButton('Đánh giá sách', '/user/review', Star)}
      {navButton('Sách yêu thích', '/user/wishlist', Heart)}
      {/* TODO: TẠM THỜI COMMENT - FLOW ĐIỂM THƯỞNG */}
      {/* {navButton('Điểm thưởng', '/user/reward', Award)} */}
      {/* {navButton('Đặt trước sách', '/user/preorder', Alarm)} */}
      {navButton('Yêu cầu tư vấn', '/user/chat', MessageCircle)}
    </div>
  );
}

export default ClientUserNavbar;
