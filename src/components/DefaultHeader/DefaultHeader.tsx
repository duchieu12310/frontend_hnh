import React, { useState } from 'react';
import { Bell, Browser, Icon, Logout, Messages, MoonStars, Search, Sun, User, Menu, Leaf, ChevronLeft, ChevronRight } from 'tabler-icons-react';
import { Link } from 'react-router-dom';
import useAppStore from 'stores/use-app-store';
import NotifyUtils from 'utils/NotifyUtils';
import useAdminAuthStore from 'stores/use-admin-auth-store';
import { useColorScheme } from 'hooks/use-color-scheme';
import { useQuery } from 'react-query';
import FetchUtils, { ErrorMessage, ListResponse } from 'utils/FetchUtils';
import ResourceURL from 'constants/ResourceURL';
import { RoomResponse } from 'models/Room';

interface HeaderLink {
  link: string;
  label: string;
  icon: Icon;
  target?: string;
}

const headerLinks: HeaderLink[] = [
  {
    link: '/admin/account',
    label: 'Tài khoản',
    icon: User,
  },
  {
    link: '/admin/notification',
    label: 'Thông báo',
    icon: Bell,
  },
  {
    link: '/admin/chat',
    label: 'Tin nhắn',
    icon: Messages,
  },
  {
    link: '/',
    label: 'Website',
    icon: Browser,
    target: '_blank',
  },
];

export function DefaultHeader() {
  const { opened, toggleOpened, collapsed, toggleCollapsed } = useAppStore();
  const { colorScheme, toggleColorScheme } = useColorScheme();

  const { user, resetAdminAuthState } = useAdminAuthStore();

  const dark = colorScheme === 'dark';

  // Đếm số tin nhắn chưa đọc từ user
  const [unreadCount, setUnreadCount] = useState(0);

  const { data: roomResponses } = useQuery<ListResponse<RoomResponse>, ErrorMessage>(
    ['rooms', 'unread-count'],
    () => FetchUtils.getAllWithToken<RoomResponse>(ResourceURL.ROOM, { all: 1, sort: 'updatedAt,desc' }),
    {
      refetchInterval: 5000, // Refresh mỗi 5 giây
      onSuccess: (data) => {
        if (user && data?.content) {
          // Lấy thời gian admin đã xem các room từ localStorage
          const viewedRooms = JSON.parse(localStorage.getItem('admin_viewed_rooms') || '{}');
          
          // Đếm số room có tin nhắn chưa đọc từ user
          const count = data.content.filter(room => {
            // Nếu có lastMessage và lastMessage không phải từ admin
            if (!room.lastMessage || !room.lastMessage.user || room.lastMessage.user.id === user.id) {
              return false;
            }
            
            // Kiểm tra xem admin đã xem room này chưa
            const viewedAt = viewedRooms[room.id];
            if (!viewedAt) {
              // Chưa xem bao giờ -> có tin nhắn chưa đọc
              return true;
            }
            
            // So sánh thời gian lastMessage với thời gian admin xem
            const lastMessageTime = new Date(room.lastMessage.createdAt).getTime();
            const viewedTime = new Date(viewedAt).getTime();
            
            // Nếu lastMessage mới hơn thời gian admin xem -> có tin nhắn mới
            return lastMessageTime > viewedTime;
          }).length;
          
          setUnreadCount(count);
        } else {
          setUnreadCount(0);
        }
      },
      enabled: !!user, // Chỉ chạy khi có user
    }
  );

  const headerLinksFragment = headerLinks.map((headerLink) => {
    const isMessagesLink = headerLink.label === 'Tin nhắn';
    return (
      <Link
        key={headerLink.label}
        to={headerLink.link}
        target={headerLink.target}
        className="relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 no-underline hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-blue-50 dark:active:bg-blue-900/20 transition-all"
      >
        <headerLink.icon size={16} strokeWidth={1.5} />
        {headerLink.label}
        {isMessagesLink && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-500 rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </Link>
    );
  });

  const handleSignoutButton = () => {
    if (user) {
      resetAdminAuthState();
      toggleColorScheme('light');
      NotifyUtils.simpleSuccess('Đăng xuất thành công');
    }
  };

  return (
    <header className="h-14 px-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-50 shadow-sm">
      <div className="h-full flex items-center justify-between max-w-full">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleOpened}
            className="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Menu size={20} />
          </button>
          <button
            onClick={toggleCollapsed}
            className="hidden md:flex p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title={collapsed ? "Mở rộng menu" : "Thu gọn menu"}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
          <Link to="/admin" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30">
              <Leaf size={20} className="text-green-600 dark:text-green-400" strokeWidth={2} />
            </div>
            {!collapsed && (
              <span className="hidden md:block text-lg font-semibold text-gray-800 dark:text-gray-200">Fashion Hub</span>
            )}
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-1">
            {headerLinksFragment}
          </div>
          <div className="flex items-center gap-2">
            <button
              title="Tìm kiếm"
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
            >
              <Search size={18} strokeWidth={1.5}/>
            </button>
            <button
              onClick={() => toggleColorScheme()}
              title="Thay đổi chế độ màu"
              className={`p-2 border rounded-lg transition-all ${
                dark
                  ? 'border-yellow-300 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                  : 'border-blue-300 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20'
              }`}
            >
              {dark ? <Sun size={18} strokeWidth={1.5}/> : <MoonStars size={18} strokeWidth={1.5}/>}
            </button>
            <button
              onClick={handleSignoutButton}
              title="Đăng xuất"
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-red-600 dark:hover:text-red-400 transition-all"
            >
              <Logout size={18} strokeWidth={1.5}/>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
