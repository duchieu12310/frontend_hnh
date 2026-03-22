import { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  Check,
  Home,
  InfoCircle,
  Marquee,
  ShoppingCart,
  Trash,
  X,
  Minus,
  Plus
} from 'tabler-icons-react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  ClientCartRequest,
  ClientCartResponse,
  ClientCartVariantKeyRequest,
  ClientCartVariantResponse,
  ClientConfirmedOrderResponse,
  ClientPaymentMethodResponse,
  ClientSimpleOrderRequest,
  CollectionWrapper,
  Empty,
  UpdateQuantityType
} from 'types';
import FetchUtils, { ErrorMessage } from 'utils/FetchUtils';
import ResourceURL from 'constants/ResourceURL';
import NotifyUtils from 'utils/NotifyUtils';
import useTitle from 'hooks/use-title';
import { Link } from 'react-router-dom';
import MiscUtils from 'utils/MiscUtils';
import useAuthStore from 'stores/use-auth-store';
import { Dialog } from '@headlessui/react';
import ApplicationConstants from 'constants/ApplicationConstants';
import useSaveCartApi from 'hooks/use-save-cart-api';
import PageConfigs from 'pages/PageConfigs';
import { PaymentMethodType } from 'models/PaymentMethod';
import useClientSiteStore from 'stores/use-client-site-store';
import { NotificationType } from 'models/Notification';
import React from 'react';
import { useColorScheme } from 'hooks/use-color-scheme';
function ClientCart() {
  useTitle();

  const { colorScheme } = useColorScheme();
  const [confirmOrderDialogOpen, setConfirmOrderDialogOpen] = useState(false);
  const [confirmedOrderDialogOpen, setConfirmedOrderDialogOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

  const { user, currentPaymentMethod, updateCurrentPaymentMethod } =
		useAuthStore();

  const { cartResponse, isLoadingCartResponse, isErrorCartResponse } =
		useGetCartApi();
  const {
    paymentMethodResponses,
    isLoadingPaymentMethodResponses,
    isErrorPaymentMethodResponses,
  } = useGetAllPaymentMethodsApi();

  const isLoading = isLoadingCartResponse || isLoadingPaymentMethodResponses;
  const isError = isErrorCartResponse || isErrorPaymentMethodResponses;

  const handleOrderButton = () => {
    setConfirmOrderDialogOpen(true);
  };

  const handleConfirmOrder = () => {
    setConfirmOrderDialogOpen(false);
    setConfirmedOrderDialogOpen(true);
  };

  // Initialize selected items when cart loads
  useEffect(() => {
    if (cartResponse && Object.hasOwn(cartResponse, 'cartId')) {
      const cart = cartResponse as ClientCartResponse;
      // Auto-select all items when cart loads
      setSelectedItems(new Set(cart.cartItems.map(item => item.cartItemVariant.variantId)));
    }
  }, [cartResponse]);

  let cartContentFragment;

  if (isLoading) {
    cartContentFragment = (
      <div className="flex flex-col gap-4">
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="h-12 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
          ))}
      </div>
    );
  }

  if (isError) {
    cartContentFragment = (
      <div className="flex flex-col items-center gap-4 my-8 text-pink-600 dark:text-pink-400">
        <AlertTriangle size={125} strokeWidth={1} />
        <p className="text-xl font-medium">
					Đã có lỗi xảy ra
        </p>
      </div>
    );
  }

  if (cartResponse && paymentMethodResponses) {
    let cart: ClientCartResponse;

    if (Object.hasOwn(cartResponse, 'cartId')) {
      cart = cartResponse as ClientCartResponse;
    } else {
      cart = { cartId: 0, cartItems: [] };
    }

    const totalAmount = cart.cartItems
      .filter((cartItem) => selectedItems.has(cartItem.cartItemVariant.variantId))
      .map(
        (cartItem) =>
          cartItem.cartItemQuantity *
					MiscUtils.calculateDiscountedPrice(
					  cartItem.cartItemVariant.variantPrice,
					  cartItem.cartItemVariant.variantProduct.productPromotion
					    ? cartItem.cartItemVariant.variantProduct
					      .productPromotion.promotionPercent
					    : 0
					)
      )
      .reduce((partialSum, a) => partialSum + a, 0);

    const taxCost = Number(
      (totalAmount * ApplicationConstants.DEFAULT_TAX).toFixed(0)
    );

    const shippingCost = ApplicationConstants.DEFAULT_SHIPPING_COST;

    const totalPay = totalAmount + taxCost + shippingCost;

    cartContentFragment = (
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-9">
          <div className="p-0 rounded-md shadow-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div className="overflow-auto max-h-[600px]">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="p-4 text-center min-w-[50px]">
                      <input
                        type="checkbox"
                        checked={cart.cartItems.length > 0 && selectedItems.size === cart.cartItems.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedItems(new Set(cart.cartItems.map(item => item.cartItemVariant.variantId)));
                          } else {
                            setSelectedItems(new Set());
                          }
                        }}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </th>
                    <th className="p-4 text-left min-w-[325px]">
                      <p className="text-sm font-normal text-gray-600 dark:text-gray-400">
												Mặt hàng
                      </p>
                    </th>
                    <th className="p-4 text-left min-w-[125px]">
                      <p className="text-sm font-normal text-gray-600 dark:text-gray-400">
												Đơn giá
                      </p>
                    </th>
                    <th className="p-4 text-left min-w-[150px]">
                      <p className="text-sm font-normal text-gray-600 dark:text-gray-400">
												Số lượng
                      </p>
                    </th>
                    <th className="p-4 text-left min-w-[125px]">
                      <p className="text-sm font-normal text-gray-600 dark:text-gray-400">
												Thành tiền
                      </p>
                    </th>
                    <th className="p-4 text-center min-w-[80px]">
                      <p className="text-sm font-normal text-gray-600 dark:text-gray-400">
												Thao tác
                      </p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cart.cartItems.map((cartItem) => (
                    <CartItemTableRow
                      key={
                        cartItem.cartItemVariant
                          .variantId
                      }
                      cartItem={cartItem}
                      isSelected={selectedItems.has(cartItem.cartItemVariant.variantId)}
                      onToggleSelect={(variantId) => {
                        const newSelected = new Set(selectedItems);
                        if (newSelected.has(variantId)) {
                          newSelected.delete(variantId);
                        } else {
                          newSelected.add(variantId);
                        }
                        setSelectedItems(newSelected);
                      }}
                    />
                  ))}
                  {cart.cartItems.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8">
                        <div className="flex flex-col items-center gap-4 my-8 text-blue-600 dark:text-blue-400">
                          <Marquee
                            size={125}
                            strokeWidth={1}
                          />
                          <p className="text-xl font-medium">
														Chưa thêm mặt hàng nào
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="flex flex-col gap-4">
            <div className="p-6 rounded-md shadow-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-600 dark:text-gray-400">
										Giao tới
                  </p>
                  <Link
                    to="/user/setting/personal"
                    className="px-2 py-1 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                  >
										Thay đổi
                  </Link>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="font-medium text-sm text-gray-900 dark:text-gray-100 flex items-center gap-1">
                    {user?.fullname}
                    <span className="p-1 bg-teal-100 dark:bg-teal-900/20 rounded text-teal-600 dark:text-teal-400" title="Địa chỉ của người dùng đặt mua">
                      <Home size={12} />
                    </span>
                  </p>
                  <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                    {user?.phone}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {[
                      user?.address.line,
                      user?.address.ward?.name,
                      user?.address.district?.name,
                      user?.address.province?.name,
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-md shadow-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col gap-2">
                <p className="font-medium text-gray-600 dark:text-gray-400">
									Hình thức giao hàng
                </p>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="shipping"
                      value="ghn"
                      defaultChecked
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <img
                      src={MiscUtils.ghnLogoPath}
                      alt="GHN"
                      className="max-w-[170px]"
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-md shadow-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col gap-2">
                <p className="font-medium text-gray-600 dark:text-gray-400">
									Hình thức thanh toán
                </p>
                <div className="flex flex-col gap-2">
                  {paymentMethodResponses.content.map(
                    (paymentMethod) => {
                      const PaymentMethodIcon =
												PageConfigs
												  .paymentMethodIconMap[
												    paymentMethod
												      .paymentMethodCode
												  ];

                      return (
                        <label
                          key={paymentMethod.paymentMethodId}
                          className="flex items-center gap-2 cursor-pointer w-full"
                        >
                          <input
                            type="radio"
                            name="payment"
                            value={paymentMethod.paymentMethodCode}
                            checked={currentPaymentMethod === paymentMethod.paymentMethodCode}
                            onChange={() => updateCurrentPaymentMethod(paymentMethod.paymentMethodCode)}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <PaymentMethodIcon size={24} />
                          <p className="text-sm text-gray-900 dark:text-gray-100">
                            {paymentMethod.paymentMethodName}
                          </p>
                        </label>
                      );
                    }
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 rounded-md shadow-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
											Tạm tính
                    </p>
                    <p className="text-sm text-right text-gray-900 dark:text-gray-100">
                      {MiscUtils.formatPrice(totalAmount) + '\u00A0₫'}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
											Thuế (10%)
                    </p>
                    <p className="text-sm text-right text-gray-900 dark:text-gray-100">
                      {MiscUtils.formatPrice(taxCost) + '\u00A0₫'}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 group relative">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
												Tổng tiền
                      </p>
                      <div className="group relative">
                        <InfoCircle size={14} className="text-blue-600 dark:text-blue-400 cursor-help" />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 dark:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                          Chưa tính phí vận chuyển
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                        </div>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400 text-right">
                      {MiscUtils.formatPrice(totalPay) + '\u00A0₫'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleOrderButton}
              disabled={cart.cartItems.length === 0 || selectedItems.size === 0}
              className="w-full px-6 py-3 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-md transition-colors"
            >
              <ShoppingCart size={20} />
							Đặt mua ({selectedItems.size})
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <ShoppingCart size={24} />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Giỏ hàng</h2>
            </div>

            {cartContentFragment}
          </div>
        </div>
      </main>

      {/* Confirm Order Dialog */}
      <Dialog open={confirmOrderDialogOpen} onClose={() => setConfirmOrderDialogOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-lg bg-white dark:bg-gray-800 p-6 shadow-xl">
            <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Thông báo xác nhận đặt mua
            </Dialog.Title>
            <div className="flex flex-col gap-4">
              <p className="text-gray-700 dark:text-gray-300">
                Bạn có muốn đặt mua những sản phẩm đã chọn với hình thức thanh toán sau?
              </p>
              <div className="flex items-center gap-2">
                {(() => {
                  const PaymentMethodIcon = PageConfigs.paymentMethodIconMap[currentPaymentMethod];
                  return <PaymentMethodIcon size={20} className="text-gray-500" />;
                })()}
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {PageConfigs.paymentMethodNameMap[currentPaymentMethod]}
                </p>
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-6">
              <button
                onClick={() => setConfirmOrderDialogOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmOrder}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                Xác nhận đặt mua
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Confirmed Order Dialog */}
      <Dialog open={confirmedOrderDialogOpen} onClose={() => setConfirmedOrderDialogOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-lg bg-white dark:bg-gray-800 p-6 shadow-xl">
            <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Thông báo xác nhận đặt mua
            </Dialog.Title>
            <ConfirmedOrder 
              onClose={() => {
                setConfirmedOrderDialogOpen(false);
                setSelectedItems(new Set());
              }} 
              selectedItems={selectedItems} 
            />
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}

function CartItemTableRow({
  cartItem,
  isSelected,
  onToggleSelect,
}: {
	cartItem: ClientCartVariantResponse;
  isSelected: boolean;
  onToggleSelect: (variantId: number) => void;
}) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [quantity, setQuantity] = useState(cartItem.cartItemQuantity);
  const [quantityError, setQuantityError] = useState<string | null>(null);

  const { currentCartId, user } = useAuthStore();

  const saveCartApi = useSaveCartApi();
  const deleteCartItemsApi = useDeleteCartItemsApi();

  // Đồng bộ quantity khi cartItem thay đổi
  useEffect(() => {
    setQuantity(cartItem.cartItemQuantity);
    setQuantityError(null);
  }, [cartItem.cartItemQuantity]);

  const handleCartItemQuantityInput = (cartItemQuantity: number) => {
    const maxInventory = cartItem.cartItemVariant.quantity;
    
    // Kiểm tra nếu vượt quá tồn kho
    if (cartItemQuantity > maxInventory) {
      setQuantityError(`Số lượng không được vượt quá tồn kho (${maxInventory})`);
      NotifyUtils.simpleFailed(`Số lượng không được vượt quá tồn kho. Tồn kho hiện có: ${maxInventory}`);
      // Tự động điều chỉnh về số lượng tối đa
      const adjustedQuantity = maxInventory;
      setQuantity(adjustedQuantity);
      
      if (
        user &&
        adjustedQuantity !== cartItem.cartItemQuantity &&
        adjustedQuantity <= maxInventory
      ) {
        const cartRequest: ClientCartRequest = {
          cartId: currentCartId,
          userId: user.id,
          cartItems: [
            {
              variantId: cartItem.cartItemVariant.variantId,
              quantity: adjustedQuantity,
            },
          ],
          status: 1,
          updateQuantityType: UpdateQuantityType.OVERRIDE,
        };
        saveCartApi.mutate(cartRequest);
      }
      return;
    }
    
    // Xóa thông báo lỗi nếu hợp lệ
    setQuantityError(null);
    
    if (
      user &&
			cartItemQuantity !== cartItem.cartItemQuantity &&
			cartItemQuantity <= maxInventory
    ) {
      const cartRequest: ClientCartRequest = {
        cartId: currentCartId,
        userId: user.id,
        cartItems: [
          {
            variantId: cartItem.cartItemVariant.variantId,
            quantity: cartItemQuantity,
          },
        ],
        status: 1,
        updateQuantityType: UpdateQuantityType.OVERRIDE,
      };
      saveCartApi.mutate(cartRequest);
    }
  };

  const handleDeleteCartItemButton = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteCartItemsApi.mutate([
      {
        cartId: currentCartId as number,
        variantId: cartItem.cartItemVariant.variantId,
      },
    ]);
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <tr key={cartItem.cartItemVariant.variantId} className={`border-b border-gray-200 dark:border-gray-700 ${isSelected ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}>
        <td className="p-4 text-center">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(cartItem.cartItemVariant.variantId)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
        </td>
        <td className="p-4">
          <div className="flex items-center gap-2">
            <img
              className="rounded-md w-[65px] h-[65px] object-cover"
              src={
                cartItem.cartItemVariant.variantProduct
                  .productThumbnail || undefined
              }
              alt={
                cartItem.cartItemVariant.variantProduct.productName
              }
            />
            <div className="flex flex-col gap-2">
              <Link
                to={
                  '/product/' +
                  cartItem.cartItemVariant.variantProduct
                    .productSlug
                }
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                {
                  cartItem.cartItemVariant.variantProduct
                    .productName
                }
              </Link>
              {cartItem.cartItemVariant.variantProperties && (
                <div className="flex flex-col gap-1">
                  {cartItem.cartItemVariant.variantProperties.content.map(
                    (variantProperty) => (
                      <p
                        key={variantProperty.id}
                        className="text-xs text-gray-600 dark:text-gray-400"
                      >
                        {variantProperty.name}:{' '}
                        {variantProperty.value}
                      </p>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </td>
        <td className="p-4">
          <div className="flex flex-col gap-2">
            <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
              {MiscUtils.formatPrice(
                MiscUtils.calculateDiscountedPrice(
                  cartItem.cartItemVariant.variantPrice,
                  cartItem.cartItemVariant.variantProduct
                    .productPromotion
                    ? cartItem.cartItemVariant.variantProduct
                      .productPromotion.promotionPercent
                    : 0
                )
              )}{' '}
              ₫
            </p>
            {cartItem.cartItemVariant.variantProduct
              .productPromotion && (
              <div className="flex items-center gap-2">
                <p className="text-xs text-gray-600 dark:text-gray-400 line-through">
                  {MiscUtils.formatPrice(
                    cartItem.cartItemVariant.variantPrice
                  )}{' '}
                  ₫
                </p>
                <span className="px-2 py-0.5 text-xs font-medium bg-pink-100 dark:bg-pink-900/20 text-pink-700 dark:text-pink-400 rounded">
                  -
                  {
                    cartItem.cartItemVariant.variantProduct
                      .productPromotion.promotionPercent
                  }
                  %
                </span>
              </div>
            )}
          </div>
        </td>
        <td className="p-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  const newQuantity = Math.max(1, quantity - 1);
                  setQuantity(newQuantity);
                  handleCartItemQuantityInput(newQuantity);
                }}
                className="w-8 h-8 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Minus size={16} />
              </button>

              <input
                type="number"
                value={quantity}
                onChange={(e) => {
                  const newQuantity = Number(e.target.value) || 1;
                  setQuantity(newQuantity);
                  handleCartItemQuantityInput(newQuantity);
                }}
                onBlur={(e) => {
                  // Khi blur, đảm bảo số lượng hợp lệ
                  const newQuantity = Number(e.target.value) || 1;
                  const maxInventory = cartItem.cartItemVariant.quantity;
                  if (newQuantity > maxInventory) {
                    setQuantity(maxInventory);
                    handleCartItemQuantityInput(maxInventory);
                  } else if (newQuantity < 1) {
                    setQuantity(1);
                    handleCartItemQuantityInput(1);
                  }
                }}
                min={1}
                max={cartItem.cartItemVariant.quantity}
                className={`w-12 h-8 text-center border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  quantityError 
                    ? 'border-red-500 dark:border-red-500' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              />

              <button
                onClick={() => {
                  const newQuantity = Math.min(
                    cartItem.cartItemVariant.quantity,
                    quantity + 1
                  );
                  setQuantity(newQuantity);
                  handleCartItemQuantityInput(newQuantity);
                }}
                className="w-8 h-8 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Tồn kho: {cartItem.cartItemVariant.quantity}
              </p>
              {quantityError && (
                <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                  {quantityError}
                </p>
              )}
            </div>
          </div>
        </td>
        <td className="p-4">
          <p className="font-medium text-sm text-blue-600 dark:text-blue-400">
            {MiscUtils.formatPrice(
              cartItem.cartItemQuantity *
                MiscUtils.calculateDiscountedPrice(
                  cartItem.cartItemVariant.variantPrice,
                  cartItem.cartItemVariant.variantProduct
                    .productPromotion
                    ? cartItem.cartItemVariant.variantProduct
                      .productPromotion.promotionPercent
                    : 0
                )
            ) + ' ₫'}
          </p>
        </td>
        <td className="p-4">
          <button
            onClick={handleDeleteCartItemButton}
            title="Xóa"
            className="mx-auto flex items-center justify-center w-6 h-6 border border-red-300 dark:border-red-600 rounded text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <Trash size={16} />
          </button>
        </td>
      </tr>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-xs rounded-lg bg-white dark:bg-gray-800 p-6 shadow-xl">
            <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Xóa mặt hàng
            </Dialog.Title>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Bạn có muốn xóa mặt hàng này?
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setDeleteDialogOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
              >
                Không xóa
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
              >
                Xóa
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}

function ConfirmedOrder({ onClose, selectedItems }: { onClose: () => void; selectedItems: Set<number> }) {
  const { updateCurrentTotalCartItems, currentCartId, user } = useAuthStore();
  const queryClient = useQueryClient();
  const {
    mutate: createClientOrder,
    data: clientConfirmedOrderResponse,
    isLoading,
    isError,
  } = useCreateClientOrderApi();
  
  const deleteCartItemsApi = useDeleteCartItemsApi();
  const hasProcessedRef = useRef(false);

  const [checkoutPaypalStatus, setCheckoutPaypalStatus] = useState<
		'none' | 'success' | 'cancel'
	>('none');

  const { currentPaymentMethod } = useAuthStore();

  let contentFragment;

  useEffect(() => {
    if (checkoutPaypalStatus === 'none' && !hasProcessedRef.current) {
      hasProcessedRef.current = true;
      
      const processOrder = () => {
        // Get current cart
        const cartResponse = queryClient.getQueryData<ClientCartResponse | Empty>(['client-api', 'carts', 'getCart']);
        
        if (cartResponse && Object.hasOwn(cartResponse, 'cartId')) {
          const cart = cartResponse as ClientCartResponse;
          // Find items to remove (not selected)
          const itemsToRemove = cart.cartItems
            .filter(item => !selectedItems.has(item.cartItemVariant.variantId))
            .map(item => ({
              cartId: currentCartId as number,
              variantId: item.cartItemVariant.variantId,
            }));

          if (itemsToRemove.length > 0) {
            // Remove unselected items before creating order
            deleteCartItemsApi.mutate(itemsToRemove, {
              onSuccess: () => {
                // After removing unselected items, create order
                const request: ClientSimpleOrderRequest = {
                  paymentMethodType: currentPaymentMethod,
                };
                createClientOrder(request);
              },
              onError: () => {
                // Even if delete fails (items might already be deleted), proceed with order
                // This handles the case where items were already removed
                const request: ClientSimpleOrderRequest = {
                  paymentMethodType: currentPaymentMethod,
                };
                createClientOrder(request);
              },
            });
          } else {
            // All items are selected, create order directly
            const request: ClientSimpleOrderRequest = {
              paymentMethodType: currentPaymentMethod,
            };
            createClientOrder(request);
          }
        } else {
          // No cart, create order directly
          const request: ClientSimpleOrderRequest = {
            paymentMethodType: currentPaymentMethod,
          };
          createClientOrder(request);
        }
      };

      processOrder();
    }
  }, [checkoutPaypalStatus, queryClient, selectedItems, currentCartId, deleteCartItemsApi, createClientOrder, currentPaymentMethod]);

  const { newNotifications } = useClientSiteStore();

  useEffect(() => {
    if (newNotifications.length > 0 && clientConfirmedOrderResponse) {
      const lastNotification =
				newNotifications[newNotifications.length - 1];
      if (
        lastNotification.message.includes(
          clientConfirmedOrderResponse.orderCode
        )
      ) {
        if (
          lastNotification.type ===
					NotificationType.CHECKOUT_PAYPAL_SUCCESS
        ) {
          setCheckoutPaypalStatus('success');
        }
        if (
          lastNotification.type ===
					NotificationType.CHECKOUT_PAYPAL_CANCEL
        ) {
          setCheckoutPaypalStatus('cancel');
        }
      }
    }
  }, [
    clientConfirmedOrderResponse,
    newNotifications,
    newNotifications.length,
  ]);

  const handlePaypalCheckoutButton = (checkoutLink: string) => {
    window.open(checkoutLink, 'mywin', 'width=500,height=800');
  };

  if (isError) {
    contentFragment = (
      <div className="flex flex-col justify-between min-h-[200px]">
        <div className="flex flex-col items-center gap-4 text-pink-600 dark:text-pink-400">
          <AlertTriangle size={100} strokeWidth={1} />
          <p className="font-medium">Đã có lỗi xảy ra</p>
        </div>
        <button
          onClick={onClose}
          className="w-full px-4 py-2 mt-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors"
        >
          Đóng
        </button>
      </div>
    );
  }

  if (
    clientConfirmedOrderResponse &&
		clientConfirmedOrderResponse.orderPaymentMethodType ===
			PaymentMethodType.CASH
  ) {
    contentFragment = (
      <div className="flex flex-col justify-between min-h-[200px]">
        <div className="flex flex-col items-center gap-4 text-teal-600 dark:text-teal-400">
          <Check size={100} strokeWidth={1} />
          <p className="text-center">
            <span>Đơn hàng </span>
            <Link
              to={
                '/order/detail/' +
                clientConfirmedOrderResponse.orderCode
              }
              onClick={onClose}
              className="font-medium text-teal-600 dark:text-teal-400 hover:underline"
            >
              {clientConfirmedOrderResponse.orderCode}
            </Link>
            <span> đã được tạo!</span>
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-full px-4 py-2 mt-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors"
        >
          Đóng
        </button>
      </div>
    );
  }

  if (
    clientConfirmedOrderResponse &&
		clientConfirmedOrderResponse.orderPaymentMethodType ===
			PaymentMethodType.PAYPAL
  ) {
    contentFragment = (
      <div className="flex flex-col justify-between min-h-[200px]">
        <div className="flex flex-col items-center gap-4 text-teal-600 dark:text-teal-400">
          <Check size={100} strokeWidth={1} />
          <p className="text-center">
            <span>Đơn hàng </span>
            <span className="font-medium">
              {clientConfirmedOrderResponse.orderCode}
            </span>
            <span> đã được tạo!</span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Hoàn tất thanh toán PayPal bằng cách bấm nút dưới
          </p>
        </div>
        {checkoutPaypalStatus === 'none' ? (
          <button
            onClick={() =>
              handlePaypalCheckoutButton(
                clientConfirmedOrderResponse.orderPaypalCheckoutLink ||
                  ''
              )
            }
            className="w-full px-4 py-2 mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
          >
            Thanh toán PayPal
          </button>
        ) : checkoutPaypalStatus === 'success' ? (
          <button
            onClick={onClose}
            className="w-full px-4 py-2 mt-4 flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-md transition-colors"
          >
            <Check size={16} />
            Đã thanh toán thành công
          </button>
        ) : (
          <div className="flex flex-col gap-2">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 mt-4 flex items-center justify-center gap-2 border border-pink-300 dark:border-pink-600 text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/20 rounded-md transition-colors"
            >
              <X size={16} />
              Đã hủy thanh toán. Đóng hộp thoại này.
            </button>
            <button
              onClick={() =>
                handlePaypalCheckoutButton(
                  clientConfirmedOrderResponse.orderPaypalCheckoutLink ||
                    ''
                )
              }
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
            >
              Thanh toán PayPal lần nữa
            </button>
          </div>
        )}
      </div>
    );
  }
  if (
    clientConfirmedOrderResponse &&
		clientConfirmedOrderResponse.orderPaymentMethodType ===
			PaymentMethodType.VNPAY
  ) {
    contentFragment = (
      <div className="flex flex-col justify-between min-h-[200px]">
        <div className="flex flex-col items-center gap-4 text-teal-600 dark:text-teal-400">
          <Check size={100} strokeWidth={1} />
          <p className="text-center">
            <span>Đơn hàng </span>
            <span className="font-medium">
              {clientConfirmedOrderResponse.orderCode}
            </span>
            <span> đã được tạo!</span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Hoàn tất thanh toán VNPay bằng cách bấm nút dưới
          </p>
        </div>
        {checkoutPaypalStatus === 'none' ? (
          <button
            onClick={() =>
              handlePaypalCheckoutButton(
                clientConfirmedOrderResponse.orderPaypalCheckoutLink ||
                  ''
              )
            }
            className="w-full px-4 py-2 mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
          >
            Thanh toán VNPay
          </button>
        ) : checkoutPaypalStatus === 'success' ? (
          <button
            onClick={() => {
              onClose();
              updateCurrentTotalCartItems(0);
            }}
            className="w-full px-4 py-2 mt-4 flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-md transition-colors"
          >
            <Check size={16} />
            Đã thanh toán thành công
          </button>
        ) : (
          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                onClose();
                updateCurrentTotalCartItems(0);
              }}
              className="w-full px-4 py-2 mt-4 flex items-center justify-center gap-2 border border-pink-300 dark:border-pink-600 text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/20 rounded-md transition-colors"
            >
              <X size={16} />
              Đã hủy thanh toán. Đóng hộp thoại này.
            </button>
            <button
              onClick={() =>
                handlePaypalCheckoutButton(
                  clientConfirmedOrderResponse.orderPaypalCheckoutLink ||
                    ''
                )
              }
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
            >
              Thanh toán VNPay lần nữa
            </button>
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="relative min-h-[200px]">
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm flex items-center justify-center rounded-lg z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
      {contentFragment}
    </div>
  );
}

function useGetCartApi() {
  const { user } = useAuthStore();
  
  const {
    data: cartResponse,
    isLoading: isLoadingCartResponse,
    isError: isErrorCartResponse,
  } = useQuery<ClientCartResponse | Empty, ErrorMessage>(
    ['client-api', 'carts', 'getCart'],
    () => FetchUtils.getWithToken(ResourceURL.CLIENT_CART),
    {
      enabled: !!user,
      onError: () =>
        NotifyUtils.simpleFailed('Lấy dữ liệu không thành công'),
      keepPreviousData: true,
    }
  );

  return { cartResponse, isLoadingCartResponse, isErrorCartResponse };
}

function useGetAllPaymentMethodsApi() {
  const {
    data: paymentMethodResponses,
    isLoading: isLoadingPaymentMethodResponses,
    isError: isErrorPaymentMethodResponses,
  } = useQuery<CollectionWrapper<ClientPaymentMethodResponse>, ErrorMessage>(
    ['client-api', 'payment-methods', 'getAllPaymentMethods'],
    () => FetchUtils.get(ResourceURL.CLIENT_PAYMENT_METHOD),
    {
      onError: () =>
        NotifyUtils.simpleFailed('Lấy dữ liệu không thành công'),
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  return {
    paymentMethodResponses,
    isLoadingPaymentMethodResponses,
    isErrorPaymentMethodResponses,
  };
}

function useDeleteCartItemsApi() {
  const queryClient = useQueryClient();

  const { currentTotalCartItems, updateCurrentTotalCartItems } =
		useAuthStore();

  return useMutation<void, ErrorMessage, ClientCartVariantKeyRequest[]>(
    (requestBody) =>
      FetchUtils.deleteWithToken(ResourceURL.CLIENT_CART, requestBody),
    {
      onSuccess: (_, requestBody) => {
        void queryClient.invalidateQueries([
          'client-api',
          'carts',
          'getCart',
        ]);
        updateCurrentTotalCartItems(
          currentTotalCartItems - requestBody.length
        );
      },
      onError: () =>
        NotifyUtils.simpleFailed(
          'Không xóa được mặt hàng khỏi giỏ hàng'
        ),
    }
  );
}

function useCreateClientOrderApi() {
  const queryClient = useQueryClient();

  const { updateCurrentCartId, updateCurrentTotalCartItems } = useAuthStore();

  return useMutation<
		ClientConfirmedOrderResponse,
		ErrorMessage,
		ClientSimpleOrderRequest
	>(
	  (requestBody) =>
	    FetchUtils.postWithToken(ResourceURL.CLIENT_ORDER, requestBody),
	  {
	    onSuccess: () => {
	      void queryClient.invalidateQueries([
	        'client-api',
	        'carts',
	        'getCart',
	      ]);
	      updateCurrentCartId(null);
	      updateCurrentTotalCartItems(0);
	    },
	  }
	);
}

export default ClientCart;
