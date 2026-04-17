import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import 'dayjs/locale/vi';
import '@smastrom/react-rating/style.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import { Toaster } from 'react-hot-toast';
import ManagerPath from 'constants/ManagerPath';
import Client from 'pages/Client';
import Admin from 'pages/Admin';
import AdminDashboard from 'pages/AdminDashboard';
import AddressManage, { AddressCreate, AddressUpdate } from 'pages/address';
import ProvinceManage, { ProvinceCreate, ProvinceUpdate } from 'pages/province';
import DistrictManage, { DistrictCreate, DistrictUpdate } from 'pages/district';
import UserManage, { UserCreate, UserUpdate } from 'pages/user';
import RoleManage, { RoleCreate, RoleUpdate } from 'pages/role';
import ProductManage, { ProductCreate, ProductUpdate, ProductCategoryEntry } from 'pages/product';
import CategoryManage, { CategoryCreate, CategoryUpdate, CategoryDetail } from 'pages/category';
import BrandManage, { BrandCreate, BrandUpdate } from 'pages/brand';
import PropertyManage, { PropertyCreate, PropertyUpdate } from 'pages/property';
import SpecificationManage, { SpecificationCreate, SpecificationUpdate } from 'pages/specification';
import UnitManage, { UnitCreate, UnitUpdate } from 'pages/unit';
import TagManage, { TagCreate, TagUpdate } from 'pages/tag';
import GuaranteeManage, { GuaranteeCreate, GuaranteeUpdate } from 'pages/guarantee';
import SupplierManage, { SupplierCreate, SupplierUpdate } from 'pages/supplier';
import InventoryManage from 'pages/inventory';
import WarehouseManage, { WarehouseCreate, WarehouseUpdate } from 'pages/warehouse';
import OrderManage, { OrderCreate, OrderUpdate } from 'pages/order';
import OrderResourceManage, { OrderResourceCreate, OrderResourceUpdate } from 'pages/order-resource';
import OrderCancellationReasonManage, {
  OrderCancellationReasonCreate,
  OrderCancellationReasonUpdate
} from 'pages/order-cancellation-reason';
import ClientHome from 'pages/client-home';
import ClientAllCategories from 'pages/client-all-categories';
import ClientCategory from 'pages/client-category';
import ClientPromotionProducts from 'pages/client-promotion-products';
import ClientSearch from 'pages/client-search';
import ClientSignin from 'pages/client-signin';
import ClientUser from 'pages/client-user';
import { AdminError, AdminGuard, ClientError, ProtectedRoute, ScrollToTop } from 'components';
import ClientSetting from 'pages/client-setting';
import ClientSettingPersonal from 'pages/client-setting-personal';
import ClientSettingPhone from 'pages/client-setting-phone';
import ClientSettingEmail from 'pages/client-setting-email';
import ClientSettingPassword from 'pages/client-setting-password';
import ClientWishlist from 'pages/client-wishlist';
import ClientPreorder from 'pages/client-preorder';
import ClientNotification from 'pages/client-notification';
import ClientReview from 'pages/client-review';
import ReviewManage from 'pages/review';
import VoucherManage from 'pages/voucher';
import PaymentMethodManage from 'pages/payment-method';
import PromotionManage, { PromotionCreate, PromotionUpdate } from 'pages/promotion';
import ClientProduct from 'pages/client-product';
import ClientCart from 'pages/client-cart';
import WaybillManage, { WaybillCreate, WaybillUpdate } from 'pages/waybill';
import ClientOrder from 'pages/client-order';
import ClientOrderDetail from 'pages/client-order-detail';
import ClientChat from 'pages/client-chat';
import { StompSessionProvider } from 'react-stomp-hooks';
import ApplicationConstants from 'constants/ApplicationConstants';
import ChatDashboard from 'pages/chat';
import ClientPaymentSuccess from 'pages/client-payment-success';
import ClientPaymentCancel from 'pages/client-payment-cancel';
import AdminNotification from 'pages/admin-notification';
import AdminAccount from 'pages/admin-account';
import ClientSignup from 'pages/client-signup';
import ClientForgotPassword, { ClientChangePassword } from 'pages/client-forgot-password';
import ClientContact from 'pages/client-contact';

const queryClient = new QueryClient();

function App() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));
  return (
    <QueryClientProvider client={queryClient}>
      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
          <NotificationsProvider>
            <ModalsProvider>
              <Toaster 
                position="top-center"
                containerStyle={{ top: 72 }}
                toastOptions={{
                  duration: 1000,
                  style: {
                    borderRadius: '8px',
                    padding: '12px 16px',
                    fontSize: '14px',
                    fontWeight: 500,
                  },
                  success: {
                    iconTheme: {
                      primary: '#10b981',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
              <ScrollToTop/>
              <Routes>
                <Route path="/signin" element={<ClientSignin/>}/>
                <Route path="/signup" element={<ClientSignup/>}/>
                <Route path="/forgot" element={<ClientForgotPassword/>}/>
                <Route path="/change-password" element={<ClientChangePassword/>}/>
                <Route path="/" element={<Client/>}>
                  <Route index element={<ClientHome/>}/>
                  <Route path="/*" element={<ClientError/>}/>
                  <Route path="/all-categories" element={<ClientAllCategories/>}/>
                  <Route path="/category/:slug" element={<ClientCategory/>}/>
                  <Route path="/promotion-products" element={<ClientPromotionProducts/>}/>
                  <Route path="/search" element={<ClientSearch/>}/>
                  <Route path="/user" element={(
                    <ProtectedRoute>
                      <ClientUser/>
                    </ProtectedRoute>
                  )}/>
                  <Route path="/user/setting" element={(
                    <ProtectedRoute>
                      <ClientSetting/>
                    </ProtectedRoute>
                  )}/>
                  <Route path="/user/setting/personal" element={(
                    <ProtectedRoute>
                      <ClientSettingPersonal/>
                    </ProtectedRoute>
                  )}/>
                  <Route path="/user/setting/phone" element={(
                    <ProtectedRoute>
                      <ClientSettingPhone/>
                    </ProtectedRoute>
                  )}/>
                  <Route path="/user/setting/email" element={(
                    <ProtectedRoute>
                      <ClientSettingEmail/>
                    </ProtectedRoute>
                  )}/>
                  <Route path="/user/setting/password" element={(
                    <ProtectedRoute>
                      <ClientSettingPassword/>
                    </ProtectedRoute>
                  )}/>
                  <Route path="/user/wishlist" element={(
                    <ProtectedRoute>
                      <ClientWishlist/>
                    </ProtectedRoute>
                  )}/>
                  <Route path="/user/preorder" element={(
                    <ProtectedRoute>
                      <ClientPreorder/>
                    </ProtectedRoute>
                  )}/>
                  <Route path="/user/notification" element={(
                    <ProtectedRoute>
                      <ClientNotification/>
                    </ProtectedRoute>
                  )}/>
                  <Route path="/user/review" element={(
                    <ProtectedRoute>
                      <ClientReview/>
                    </ProtectedRoute>
                  )}/>
                  <Route path="/product/:slug" element={<ClientProduct/>}/>
                  <Route path="/cart" element={(
                    <ProtectedRoute>
                      <ClientCart/>
                    </ProtectedRoute>
                  )}/>
                  <Route path="/order" element={(
                    <ProtectedRoute>
                      <ClientOrder/>
                    </ProtectedRoute>
                  )}/>
                  <Route path="/order/detail/:code" element={(
                    <ProtectedRoute>
                      <ClientOrderDetail/>
                    </ProtectedRoute>
                  )}/>
                  <Route path="/user/chat" element={(
                    <ProtectedRoute>
                      <StompSessionProvider url={ApplicationConstants.WEBSOCKET_PATH}>
                        <ClientChat/>
                      </StompSessionProvider>
                    </ProtectedRoute>
                  )}/>
                  <Route path="/contact" element={<ClientContact/>}/>
                  <Route path="/lien-he" element={<ClientContact/>}/>
                </Route>
                <Route path="/admin" element={<Admin/>}>
                  <Route path="/admin/*" element={<AdminError/>}/>
                  <Route index element={<AdminDashboard/>}/>
                  
                  {/* USER & ROLE (ADMIN ONLY) */}
                  <Route element={<AdminGuard allowedRoles={['ADMIN']} />}>
                    <Route path={ManagerPath.USER} element={<UserManage/>}/>
                    <Route path={ManagerPath.USER + '/create'} element={<UserCreate/>}/>
                    <Route path={ManagerPath.USER + '/update/:id'} element={<UserUpdate/>}/>
                    <Route path={ManagerPath.ROLE} element={<RoleManage/>}/>
                    <Route path={ManagerPath.ROLE + '/create'} element={<RoleCreate/>}/>
                    <Route path={ManagerPath.ROLE + '/update/:id'} element={<RoleUpdate/>}/>
                  </Route>

                  {/* PRODUCT & CATEGORY (ADMIN, MANAGER) */}
                  <Route element={<AdminGuard allowedRoles={['ADMIN', 'MANAGER']} />}>
                    <Route path={ManagerPath.PRODUCT} element={<ProductManage/>}/>
                    <Route path={ManagerPath.PRODUCT + '/create'} element={<ProductCreate/>}/>
                    <Route path={ManagerPath.PRODUCT + '/category-entry'} element={<ProductCategoryEntry/>}/>
                    <Route path={ManagerPath.PRODUCT + '/update/:id'} element={<ProductUpdate/>}/>
                    <Route path={ManagerPath.CATEGORY} element={<CategoryManage/>}/>
                    <Route path={ManagerPath.CATEGORY + '/create'} element={<CategoryCreate/>}/>
                    <Route path={ManagerPath.CATEGORY + '/update/:id'} element={<CategoryUpdate/>}/>
                    <Route path={ManagerPath.CATEGORY + '/detail/:id'} element={<CategoryDetail/>}/>
                    <Route path={ManagerPath.BRAND} element={<BrandManage/>}/>
                    <Route path={ManagerPath.BRAND + '/create'} element={<BrandCreate/>}/>
                    <Route path={ManagerPath.BRAND + '/update/:id'} element={<BrandUpdate/>}/>
                    <Route path={ManagerPath.SUPPLIER} element={<SupplierManage/>}/>
                    <Route path={ManagerPath.SUPPLIER + '/create'} element={<SupplierCreate/>}/>
                    <Route path={ManagerPath.SUPPLIER + '/update/:id'} element={<SupplierUpdate/>}/>
                    <Route path={ManagerPath.UNIT} element={<UnitManage/>}/>
                    <Route path={ManagerPath.UNIT + '/create'} element={<UnitCreate/>}/>
                    <Route path={ManagerPath.UNIT + '/update/:id'} element={<UnitUpdate/>}/>
                    <Route path={ManagerPath.TAG} element={<TagManage/>}/>
                    <Route path={ManagerPath.TAG + '/create'} element={<TagCreate/>}/>
                    <Route path={ManagerPath.TAG + '/update/:id'} element={<TagUpdate/>}/>
                    <Route path={ManagerPath.GUARANTEE} element={<GuaranteeManage/>}/>
                    <Route path={ManagerPath.GUARANTEE + '/create'} element={<GuaranteeCreate/>}/>
                    <Route path={ManagerPath.GUARANTEE + '/update/:id'} element={<GuaranteeUpdate/>}/>
                    <Route path={ManagerPath.PROPERTY} element={<PropertyManage/>}/>
                    <Route path={ManagerPath.PROPERTY + '/create'} element={<PropertyCreate/>}/>
                    <Route path={ManagerPath.PROPERTY + '/update/:id'} element={<PropertyUpdate/>}/>
                    <Route path={ManagerPath.SPECIFICATION} element={<SpecificationManage/>}/>
                    <Route path={ManagerPath.SPECIFICATION + '/create'} element={<SpecificationCreate/>}/>
                    <Route path={ManagerPath.SPECIFICATION + '/update/:id'} element={<SpecificationUpdate/>}/>
                    <Route path={ManagerPath.INVENTORY} element={<InventoryManage/>}/>
                    <Route path={ManagerPath.WAREHOUSE} element={<WarehouseManage/>}/>
                    <Route path={ManagerPath.WAREHOUSE + '/create'} element={<WarehouseCreate/>}/>
                    <Route path={ManagerPath.WAREHOUSE + '/update/:id'} element={<WarehouseUpdate/>}/>
                    <Route path={ManagerPath.PROMOTION} element={<PromotionManage/>}/>
                    <Route path={ManagerPath.PROMOTION + '/create'} element={<PromotionCreate/>}/>
                    <Route path={ManagerPath.PROMOTION + '/update/:id'} element={<PromotionUpdate/>}/>
                  </Route>

                  {/* ORDER & OPERATION (ADMIN, OPERATOR) */}
                  <Route element={<AdminGuard allowedRoles={['ADMIN', 'OPERATOR']} />}>
                    <Route path={ManagerPath.ORDER} element={<OrderManage/>}/>
                    <Route path={ManagerPath.ORDER + '/create'} element={<OrderCreate/>}/>
                    <Route path={ManagerPath.ORDER + '/update/:id'} element={<OrderUpdate/>}/>
                    <Route path={ManagerPath.ORDER_RESOURCE} element={<OrderResourceManage/>}/>
                    <Route path={ManagerPath.ORDER_RESOURCE + '/create'} element={<OrderResourceCreate/>}/>
                    <Route path={ManagerPath.ORDER_RESOURCE + '/update/:id'} element={<OrderResourceUpdate/>}/>
                    <Route path={ManagerPath.ORDER_CANCELLATION_REASON} element={<OrderCancellationReasonManage/>}/>
                    <Route
                      path={ManagerPath.ORDER_CANCELLATION_REASON + '/create'}
                      element={<OrderCancellationReasonCreate/>}
                    />
                    <Route
                      path={ManagerPath.ORDER_CANCELLATION_REASON + '/update/:id'}
                      element={<OrderCancellationReasonUpdate/>}
                    />
                    <Route path={ManagerPath.WAYBILL} element={<WaybillManage/>}/>
                    <Route path={ManagerPath.WAYBILL + '/create'} element={<WaybillCreate/>}/>
                    <Route path={ManagerPath.WAYBILL + '/update/:id'} element={<WaybillUpdate/>}/>
                    <Route path={ManagerPath.REVIEW} element={<ReviewManage/>}/>
                    <Route path={ManagerPath.CHAT} element={
                      <StompSessionProvider url={ApplicationConstants.WEBSOCKET_PATH}>
                        <ChatDashboard/>
                      </StompSessionProvider>
                    }/>
                  </Route>

                  <Route path={ManagerPath.NOTIFICATION} element={<AdminNotification/>}/>
                  <Route path={ManagerPath.ACCOUNT} element={<AdminAccount/>}/>
                </Route>
                <Route path="/payment/success" element={<ClientPaymentSuccess/>}/>
                <Route path="/payment/cancel" element={<ClientPaymentCancel/>}/>
              </Routes>
            </ModalsProvider>
          </NotificationsProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </QueryClientProvider>
  );
}

export default App;
