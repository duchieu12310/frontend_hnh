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
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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

  // Live Search Data
  const { data: searchResults, isLoading: isSearching } = useQuery<any, ErrorMessage>(
    ['client-api', 'search', search],
    () => FetchUtils.get(ResourceURL.CLIENT_SEARCH, { query: search }),
    { 
      enabled: search.length > 1 && showResults,
      keepPreviousData: true,
      staleTime: 30000 
    }
  );

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useNotificationEvents();

  return (
    <header className="sticky top-0 z-[100] w-full border-b border-gray-100/50 dark:border-gray-800/50 bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-8">

          {/* Left: Logo */}
          <Link to="/" className="flex-shrink-0 transition-transform duration-300 hover:scale-105 active:scale-95">
            <ElectroLogo className="h-9 w-auto" />
          </Link>

          {/* Center: Navigation - Hidden when searching for more space */}
          <nav className={`transition-all duration-500 ${showResults ? 'max-w-0 opacity-0 pointer-events-none overflow-hidden' : 'max-w-4xl opacity-100'} hidden lg:flex items-center bg-gray-100/50 dark:bg-gray-800/50 p-1 rounded-full border border-gray-200/20 dark:border-gray-700/20`}>
            <NavLink to="/promotion-products">Khuyến Mãi</NavLink>
            <NavLink to="/search">Cửa Hàng</NavLink>

            {categoryResponses?.content.slice(0, 2).map((cat: any) => (
              <NavLink key={cat.categorySlug} to={`/category/${cat.categorySlug}`}>
                {cat.categoryName}
              </NavLink>
            ))}

            <HeadlessPopover className="relative">
              {({ open, close }) => {
                const isInCategoryPage = pathname.startsWith('/category/');
                const isMainCategory = categoryResponses?.content.slice(0, 2).some((cat: any) => pathname === `/category/${cat.categorySlug}`);
                const isActive = (isInCategoryPage && !isMainCategory) || open;

                return (
                  <>
                    <HeadlessPopover.Button
                      className={`px-5 py-2 text-sm transition-all rounded-full flex items-center gap-2 outline-none whitespace-nowrap ${isActive
                          ? 'font-bold text-white bg-black dark:text-black dark:bg-white shadow-lg shadow-black/10 dark:shadow-white/5'
                          : 'font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'
                        }`}
                    >
                      <List size={18} className={isActive ? 'stroke-[2.5px]' : ''} />
                      <span>Danh mục</span>
                    </HeadlessPopover.Button>

                    <HeadlessPopover.Panel className="absolute left-1/2 -translate-x-1/2 mt-4 w-screen max-w-xs sm:max-w-6xl px-4 z-[110] transition-all duration-300">
                      <div className="overflow-hidden rounded-3xl shadow-2xl ring-1 ring-black/5 bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl p-4 border border-gray-100 dark:border-gray-800">
                        <CategoryMenu setOpenedCategoryMenu={() => close()} />
                      </div>
                    </HeadlessPopover.Panel>
                  </>
                );
              }}
            </HeadlessPopover>
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 lg:gap-4 flex-1 justify-end">

            {/* Expandable Search Bar */}
            <div className={`relative hidden md:flex transition-all duration-500 ease-in-out ${showResults ? 'flex-1 max-w-[900px]' : 'max-w-xl'} group`}>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (search.trim()) {
                    navigate('/search?q=' + search.trim());
                    setShowResults(false);
                  }
                }}
                className="w-full"
              >
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search 
                      size={18} 
                      className="text-gray-400 group-focus-within:text-blue-500 group-focus-within:scale-110 transition-all duration-300" 
                    />
                  </div>
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Tìm tên sách, tác giả, ISBN..."
                    value={search}
                    onFocus={() => setShowResults(true)}
                    onBlur={() => setTimeout(() => setShowResults(false), 200)}
                    onChange={(e) => setSearch(e.target.value)}
                    className="block w-full pl-11 pr-16 py-2.5 border border-transparent bg-gray-100 dark:bg-gray-800/80 rounded-2xl text-sm placeholder-gray-400 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/20 focus:bg-white dark:focus:bg-gray-700 transition-all duration-500 shadow-sm"
                  />
                  
                  {/* Search Actions */}
                  <div className="absolute right-1.5 top-1.5 bottom-1.5 flex items-center gap-1.5">
                    {search && (
                      <button
                        type="button"
                        onClick={() => setSearch('')}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                    <button
                      type="submit"
                      className="ml-1 px-4 py-1.5 bg-blue-600 dark:bg-blue-500 text-white rounded-xl text-xs font-bold hover:bg-blue-700 dark:hover:bg-blue-400 transition-all active:scale-95 shadow-md shadow-blue-500/20"
                    >
                      Tìm
                    </button>
                  </div>
                </div>
              </form>

              {/* Live Search Results Dropdown */}
              {showResults && search.length > 1 && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden z-[110] animate-in fade-in slide-in-from-top-2 duration-300">
                  {isSearching ? (
                    <div className="p-8 flex flex-col items-center gap-3">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <p className="text-xs text-gray-500 font-medium">Đang tìm kiếm sách...</p>
                    </div>
                  ) : (searchResults?.products?.length > 0 || searchResults?.categories?.length > 0 || searchResults?.brands?.length > 0) ? (
                    <div className="py-2 max-h-[70vh] overflow-y-auto">
                      {/* Products Section */}
                      {searchResults.products?.length > 0 && (
                        <div className="mb-4">
                          <p className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50 dark:bg-gray-800/50">Sách phù hợp</p>
                          {searchResults.products.map((product: any) => (
                            <Link
                              key={product.productId}
                              to={`/product/${product.productSlug}`}
                              className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                              onClick={() => setShowResults(false)}
                            >
                              <img 
                                src={product.productThumbnail || 'https://via.placeholder.com/150'} 
                                alt={product.productName}
                                className="w-12 h-16 object-cover rounded-lg shadow-sm"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{product.productName}</p>
                                <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                                  {MiscUtils.formatPrice(product.productPriceRange[0])}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* Categories Section */}
                      {searchResults.categories?.length > 0 && (
                        <div className="mb-4">
                          <p className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50 dark:bg-gray-800/50">Thể loại</p>
                          <div className="flex flex-wrap gap-2 p-3">
                            {searchResults.categories.map((cat: any) => (
                              <Link
                                key={cat.categorySlug}
                                to={`/category/${cat.categorySlug}`}
                                onClick={() => setShowResults(false)}
                                className="px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 rounded-full transition-colors"
                              >
                                {cat.categoryName}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Brands/Authors Section */}
                      {searchResults.brands?.length > 0 && (
                        <div className="mb-2">
                          <p className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50 dark:bg-gray-800/50">Tác giả & Nhà xuất bản</p>
                          {searchResults.brands.map((brand: any) => (
                            <Link
                              key={brand.brandId}
                              to={`/search?brand=${brand.brandName}`}
                              className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
                              onClick={() => setShowResults(false)}
                            >
                              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <User size={16} />
                              </div>
                              {brand.brandName}
                            </Link>
                          ))}
                        </div>
                      )}

                      <button
                        onClick={() => {
                          navigate('/search?q=' + search);
                          setShowResults(false);
                        }}
                        className="w-full py-4 text-sm font-bold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors border-t border-gray-50 dark:border-gray-800 sticky bottom-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md"
                      >
                        Xem tất cả kết quả cho "{search}"
                      </button>
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-sm text-gray-500">Không tìm thấy kết quả phù hợp</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-1">
              {/* Wishlist */}
              <IconButton to="/user/wishlist">
                <Heart size={22} strokeWidth={1.5} />
              </IconButton>

              {/* Cart */}
              <IconButton to="/cart" className="relative">
                <ShoppingCart size={22} strokeWidth={1.5} />
                {cartResponse && 'cartItems' in cartResponse && cartResponse.cartItems.length > 0 && (
                  <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-black dark:bg-white text-[10px] font-bold text-white dark:text-black animate-in zoom-in duration-300">
                    {cartResponse.cartItems.length}
                  </span>
                )}
              </IconButton>

              {/* Profile Menu */}
              <HeadlessMenu as="div" className="relative ml-1">
                <HeadlessMenu.Button className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 active:scale-90 outline-none ring-offset-2 focus:ring-2 ring-gray-200 dark:ring-gray-700">
                  <UserCircle size={24} strokeWidth={1.5} className="text-gray-700 dark:text-gray-200" />
                </HeadlessMenu.Button>
                <HeadlessMenu.Items className="absolute right-0 mt-4 w-64 origin-top-right divide-y divide-gray-100 dark:divide-gray-800 rounded-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl shadow-2xl ring-1 ring-black/5 focus:outline-none z-[120] overflow-hidden border border-gray-100 dark:border-gray-800">
                  <div className="px-2 py-2">
                    {user ? (
                      <>
                        <div className="px-3 py-2 mb-2">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Tài khoản</p>
                          <p className="text-sm font-bold truncate">{user.fullname || user.email}</p>
                        </div>
                        <MenuLink to="/user" icon={<User size={18} />} label="Hồ sơ của tôi" />
                        <MenuLink to="/user/notification" icon={<Bell size={18} />} label="Thông báo" />
                        <MenuLink to="/user/review" icon={<Star size={18} />} label="Đánh giá sản phẩm" />
                        <MenuLink to="/order" icon={<FileBarcode size={18} />} label="Lịch sử đơn hàng" />
                        <MenuLink to="/user/wishlist" icon={<Heart size={18} />} label="Sách yêu thích" />

                        <div className="p-2 mt-2">
                          <div className="flex items-center justify-between p-1 bg-gray-50 dark:bg-gray-950 rounded-xl border border-gray-100 dark:border-gray-800">
                            <ThemeToggle active={colorScheme === 'light'} onClick={() => toggleColorScheme('light')} icon={<Sun size={14} />} label="Sáng" />
                            <ThemeToggle active={colorScheme === 'dark'} onClick={() => toggleColorScheme('dark')} icon={<Moon size={14} />} label="Tối" />
                          </div>
                        </div>

                        <div className="py-2 px-2">
                          <button
                            onClick={() => { resetAuthState(); NotifyUtils.simpleSuccess('Đã đăng xuất'); }}
                            className="group flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all active:scale-95"
                          >
                            <Logout size={18} />
                            Đăng xuất
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <MenuLink to="/signin" icon={<Login size={18} />} label="Đăng nhập" />
                        <MenuLink to="/signup" icon={<Fingerprint size={18} />} label="Đăng ký tài khoản" />
                      </>
                    )}
                  </div>
                </HeadlessMenu.Items>
              </HeadlessMenu>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// --- Sub-Components để code sạch hơn ---

const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
  const { pathname } = useLocation();
  const isActive = pathname === to || (to !== '/' && pathname.startsWith(to));

  return (
    <Link
      to={to}
      className={`px-5 py-2 text-sm transition-all relative rounded-full whitespace-nowrap ${isActive
          ? 'font-bold text-black dark:text-white bg-white dark:bg-gray-700 shadow-sm'
          : 'font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'
        }`}
    >
      {children}
    </Link>
  );
};


const IconButton = ({ to, children, className = "" }: any) => (
  <Link
    to={to}
    className={`p-2.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-black dark:hover:text-white transition-all duration-300 active:scale-90 ${className}`}
  >
    {children}
  </Link>
);

const MenuLink = ({ to, icon, label }: any) => (
  <HeadlessMenu.Item>
    {({ active }) => (
      <Link
        to={to}
        className={`${active ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white' : 'text-gray-600 dark:text-gray-300'} group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200`}
      >
        <span className={`${active ? 'scale-110' : ''} transition-transform duration-200`}>
          {icon}
        </span>
        {label}
      </Link>
    )}
  </HeadlessMenu.Item>
);

const ThemeToggle = ({ active, onClick, icon, label }: any) => (
  <button
    onClick={onClick}
    className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2 text-[11px] font-bold rounded-lg transition-all ${active ? 'bg-white dark:bg-gray-800 shadow-md text-black dark:text-white scale-100' : 'text-gray-500 hover:text-gray-700'
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