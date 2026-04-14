import React, { useEffect, useRef, useState } from 'react';
import { Menu as HeadlessMenu, Popover as HeadlessPopover } from '@headlessui/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from 'react-query';
import {
  Bell,
  FileBarcode,
  Fingerprint,
  Heart,
  List,
  Login,
  Logout,
  Moon,
  Search,
  ShoppingCart,
  Star,
  Sun,
  User,
  UserCircle,
} from 'tabler-icons-react';

// Components & Utils (Giữ nguyên import của bạn)
import { ElectroLogo } from 'components';
import CategoryMenu from 'components/ClientHeader/CategoryMenu';
import useAuthStore from 'stores/use-auth-store';
import useClientSiteStore from 'stores/use-client-site-store';
import { useColorScheme } from 'hooks/use-color-scheme';
import FetchUtils, { ErrorMessage } from 'utils/FetchUtils';
import ResourceURL from 'constants/ResourceURL';
import MiscUtils from 'utils/MiscUtils';
import NotifyUtils from 'utils/NotifyUtils';
import { ClientCartResponse, Empty } from 'types';
import { NotificationResponse, EventInitiationResponse } from 'models/Notification';

function ClientHeader() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const { user, resetAuthState } = useAuthStore();
  const { pathname } = useLocation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const { newNotifications } = useClientSiteStore();
  const [disabledNotificationIndicator, setDisabledNotificationIndicator] = useState(true);

  // Lấy dữ liệu giỏ hàng
  const { data: cartResponse } = useQuery<ClientCartResponse | Empty, ErrorMessage>(
    ['client-api', 'carts', 'getCart'],
    () => FetchUtils.getWithToken(ResourceURL.CLIENT_CART),
    { enabled: !!user, keepPreviousData: true, staleTime: 0 }
  );

  const { data: categoryResponses } = useQuery<any, ErrorMessage>(
    ['client-api', 'categories', 'getAllCategories'],
    () => FetchUtils.get(ResourceURL.CLIENT_CATEGORY),
    { refetchOnWindowFocus: false, keepPreviousData: true }
  );


  useNotificationEvents();

  return (
    <header className="sticky top-0 z-[100] w-full border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Left: Logo */}
          <Link to="/" className="flex-shrink-0 transition-transform hover:scale-105">
            <ElectroLogo className="h-8 w-auto" />
          </Link>

          {/* Center: Navigation (Nike Style) */}
          <nav className="hidden lg:flex items-center space-x-1">
            <NavLink to="/promotion-products">Khuyến Mãi</NavLink>
            <NavLink to="/search">Cửa Hàng</NavLink>

            {categoryResponses?.content.slice(0, 3).map((cat: any) => (
              <NavLink key={cat.categorySlug} to={`/category/${cat.categorySlug}`}>
                {cat.categoryName}
              </NavLink>
            ))}

            <HeadlessPopover className="relative">
              {({ open }) => {
                const isInCategoryPage = pathname.startsWith('/category/');
                const isMainCategory = categoryResponses?.content.slice(0, 3).some((cat: any) => pathname === `/category/${cat.categorySlug}`);
                const isActive = (isInCategoryPage && !isMainCategory) || open;

                return (
                  <>
                    <HeadlessPopover.Button
                      className={`px-4 py-2 text-sm transition-all rounded-full flex items-center gap-1 outline-none ${isActive
                          ? 'font-bold text-black dark:text-white bg-gray-100 dark:bg-gray-800'
                          : 'font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                    >
                      <List size={20} className={isActive ? 'stroke-[3px]' : ''} />
                      <span>Danh mục</span>
                    </HeadlessPopover.Button>

                    <HeadlessPopover.Panel className="absolute left-1/2 -translate-x-1/2 mt-3 w-screen max-w-xs sm:max-w-3xl px-4 z-[110]">
                      <div className="overflow-hidden rounded-2xl shadow-2xl ring-1 ring-black ring-opacity-5 bg-white dark:bg-gray-800 p-2">
                        <CategoryMenu setOpenedCategoryMenu={() => { }} />
                      </div>
                    </HeadlessPopover.Panel>
                  </>
                );
              }}
            </HeadlessPopover>
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-1 sm:gap-2">

            {/* Search Bar - Chuyên nghiệp hơn với nút tìm kiếm */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (search.trim()) navigate('/search?q=' + search.trim());
              }}
              className="relative hidden md:flex items-center group"
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Tìm sách..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="block w-40 lg:w-64 pl-10 pr-12 py-2 border-none bg-gray-100 dark:bg-gray-800 rounded-full text-sm placeholder-gray-500 focus:ring-2 focus:ring-black dark:focus:ring-white focus:bg-white dark:focus:bg-gray-700 transition-all duration-300"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-3 bg-black dark:bg-white text-white dark:text-black rounded-full text-[12px] font-bold hover:opacity-80 transition-opacity active:scale-95"
                >
                  Tìm
                </button>
              </div>
            </form>

            {/* Wishlist */}
            <IconButton to="/user/wishlist">
              <Heart size={24} strokeWidth={1.5} />
            </IconButton>

            {/* Cart */}
            <IconButton to="/cart" className="relative">
              <ShoppingCart size={24} strokeWidth={1.5} />
              {cartResponse && 'cartItems' in cartResponse && cartResponse.cartItems.length > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-black dark:bg-white text-[10px] font-bold text-white dark:text-black">
                  {cartResponse.cartItems.length}
                </span>
              )}
            </IconButton>

            {/* Profile Menu */}
            <HeadlessMenu as="div" className="relative ml-1">
              <HeadlessMenu.Button className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors outline-none">
                <UserCircle size={24} strokeWidth={1.5} className="text-gray-700 dark:text-gray-200" />
              </HeadlessMenu.Button>
              <HeadlessMenu.Items className="absolute right-0 mt-3 w-56 origin-top-right divide-y divide-gray-100 dark:divide-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none z-[120] overflow-hidden">
                <div className="px-1 py-1">
                  {user ? (
                    <>
                      <MenuLink to="/user" icon={<User size={16} />} label="Tài khoản" />
                      <MenuLink to="/user/review" icon={<Star size={16} />} label="Đánh giá" />
                      <MenuLink to="/order" icon={<FileBarcode size={16} />} label="Đơn hàng" />

                      <div className="p-2">
                        <div className="flex items-center justify-between p-1 bg-gray-50 dark:bg-gray-900 rounded-lg">
                          <ThemeToggle active={colorScheme === 'light'} onClick={() => toggleColorScheme('light')} icon={<Sun size={14} />} label="Sáng" />
                          <ThemeToggle active={colorScheme === 'dark'} onClick={() => toggleColorScheme('dark')} icon={<Moon size={14} />} label="Tối" />
                        </div>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => { resetAuthState(); NotifyUtils.simpleSuccess('Đã đăng xuất'); }}
                          className="group flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Logout size={16} />
                          Đăng xuất
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <MenuLink to="/signin" icon={<Login size={16} />} label="Đăng nhập" />
                      <MenuLink to="/signup" icon={<Fingerprint size={16} />} label="Đăng ký" />
                    </>
                  )}
                </div>
              </HeadlessMenu.Items>
            </HeadlessMenu>
          </div>
        </div>
      </div>
    </header>
  );
}

// --- Sub-Components để code sạch hơn ---

const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
  const { pathname } = useLocation();
  const isActive = pathname === to;

  return (
    <Link
      to={to}
      className={`px-4 py-2 text-sm transition-all relative group ${isActive
          ? 'font-bold text-black dark:text-white'
          : 'font-medium text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white'
        }`}
    >
      {children}
      <span className={`absolute bottom-0 h-0.5 bg-black dark:bg-white transition-all ${isActive
          ? 'left-0 w-full'
          : 'left-1/2 w-0 group-hover:w-full group-hover:left-0'
        }`} />
    </Link>
  );
};

const IconButton = ({ to, children, className = "" }: any) => (
  <Link
    to={to}
    className={`p-2 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${className}`}
  >
    {children}
  </Link>
);

const MenuLink = ({ to, icon, label }: any) => (
  <HeadlessMenu.Item>
    {({ active }) => (
      <Link
        to={to}
        className={`${active ? 'bg-gray-100 dark:bg-gray-700 text-black dark:text-white' : 'text-gray-700 dark:text-gray-300'} group flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors`}
      >
        {icon}
        {label}
      </Link>
    )}
  </HeadlessMenu.Item>
);

const ThemeToggle = ({ active, onClick, icon, label }: any) => (
  <button
    onClick={onClick}
    className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-[11px] font-medium rounded-md transition-all ${active ? 'bg-white dark:bg-gray-800 shadow-sm text-black dark:text-white' : 'text-gray-500 hover:text-gray-700'
      }`}
  >
    {icon}
    {label}
  </button>
);

// --- Giữ nguyên logic Notification ---
function useNotificationEvents() {
  const { user } = useAuthStore();
  const eventSourceRef = useRef<EventSource | null>(null);
  const { pushNewNotification } = useClientSiteStore();

  useQuery<EventInitiationResponse, ErrorMessage>(
    ['client-api', 'notifications/init-events'],
    () => FetchUtils.getWithToken(ResourceURL.CLIENT_NOTIFICATION_INIT_EVENTS),
    {
      onSuccess: (response) => {
        const eventSource = new EventSource(`${ResourceURL.CLIENT_NOTIFICATION_EVENTS}?eventSourceUuid=${response.eventSourceUuid}`);
        eventSource.onmessage = (e) => pushNewNotification(JSON.parse(e.data));
        eventSourceRef.current = eventSource;
      },
      enabled: !!user,
    }
  );
  useEffect(() => () => eventSourceRef.current?.close(), []);
}

export default React.memo(ClientHeader);