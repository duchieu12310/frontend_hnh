import { Link, useNavigate } from 'react-router-dom';
import MiscUtils from 'utils/MiscUtils';
import { ClientCarousel, ReviewStarGroup } from 'components';
import { BellPlus, Heart, PhotoOff, ShoppingCart, Minus, Plus, Bolt } from 'tabler-icons-react';
import React, { useState } from 'react';
import {
  ClientCartRequest,
  ClientPreorderRequest,
  ClientProductResponse,
  ClientWishRequest,
  UpdateQuantityType
} from 'types';
import useCreateWishApi from 'hooks/use-create-wish-api';
import NotifyUtils from 'utils/NotifyUtils';
import useAuthStore from 'stores/use-auth-store';
import useCreatePreorderApi from 'hooks/use-create-preorder-api';
import useSaveCartApi from 'hooks/use-save-cart-api';

interface ClientProductIntroProps {
  product: ClientProductResponse;
}

function ClientProductIntro({ product }: ClientProductIntroProps) {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  const { user, currentCartId } = useAuthStore();

  const createWishApi = useCreateWishApi();
  const createPreorderApi = useCreatePreorderApi();
  const saveCartApi = useSaveCartApi();

  const handleSelectVariantButton = (variantIndex: number) => {
    setSelectedVariantIndex(variantIndex);
    setQuantity(1);
  };

  const handleCreateWishButton = () => {
    if (!user) {
      NotifyUtils.simple('Vui lòng đăng nhập để sử dụng chức năng');
    } else {
      const clientWishRequest: ClientWishRequest = {
        userId: user.id,
        productId: product.productId,
      };
      createWishApi.mutate(clientWishRequest);
    }
  };

  const handleCreatePreorderButton = () => {
    if (!user) {
      NotifyUtils.simple('Vui lòng đăng nhập để sử dụng chức năng');
    } else {
      const clientPreorderRequest: ClientPreorderRequest = {
        userId: user.id,
        productId: product.productId,
        status: 1,
      };
      createPreorderApi.mutate(clientPreorderRequest);
    }
  };

  const handleAddToCartButton = () => {
    if (!user) {
      NotifyUtils.simple('Vui lòng đăng nhập để sử dụng chức năng');
    } else {
      const cartRequest: ClientCartRequest = {
        cartId: currentCartId,
        userId: user.id,
        cartItems: [
          {
            variantId: product.productVariants[selectedVariantIndex].variantId,
            quantity: quantity,
          },
        ],
        status: 1,
        updateQuantityType: UpdateQuantityType.INCREMENTAL,
      };
      saveCartApi.mutate(cartRequest, {
        onSuccess: () => NotifyUtils.simpleSuccess('Đã thêm sản phẩm vào giỏ hàng thành công'),
      });
    }
  };

  const handleBuyNowButton = () => {
    if (!user) {
      NotifyUtils.simple('Vui lòng đăng nhập để sử dụng chức năng');
    } else {
      const cartRequest: ClientCartRequest = {
        cartId: currentCartId,
        userId: user.id,
        cartItems: [
          {
            variantId: product.productVariants[selectedVariantIndex].variantId,
            quantity: quantity,
          },
        ],
        status: 1,
        updateQuantityType: UpdateQuantityType.INCREMENTAL,
      };
      saveCartApi.mutate(cartRequest, {
        onSuccess: () => {
          NotifyUtils.simpleSuccess('Đã thêm sản phẩm vào giỏ hàng');
          setTimeout(() => {
            navigate('/cart');
          }, 500);
        },
      });
    }
  };

  return (
    <div className="p-6 rounded-md shadow-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col gap-6">
        <nav className="flex items-center gap-2 text-sm">
          <Link to="/" className="text-blue-600 dark:text-blue-400 hover:underline">
            Trang chủ
          </Link>
          {product.productCategories && product.productCategories.length > 0 && MiscUtils.makeCategoryBreadcrumbs(product.productCategories[0]).map(c => (
            <React.Fragment key={c.categorySlug}>
              <span className="text-gray-400">/</span>
              <Link to={'/category/' + c.categorySlug} className="text-blue-600 dark:text-blue-400 hover:underline">
                {c.categoryName}
              </Link>
            </React.Fragment>
          ))}
          <span className="text-gray-400">/</span>
          <span className="text-gray-600 dark:text-gray-400">
            {product.productName}
          </span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            {product.productImages.length > 0
              ? (
                <ClientCarousel>
                  {product.productImages.map(image => (
                    <img
                      key={image.id}
                      className="rounded-md w-full aspect-square object-cover"
                      src={image.path}
                      alt={product.productName}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="14" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  ))}
                </ClientCarousel>
              )
              : (
                <div className="rounded-md w-full aspect-square border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center">
                  <PhotoOff size={100} strokeWidth={1} className="text-gray-400" />
                  <p className="text-gray-600 dark:text-gray-400 mt-2">Không có hình cho sản phẩm này</p>
                </div>
              )}
          </div>
          <div>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2 items-start">
                <span className={`px-2 py-1 text-xs font-medium rounded mb-2 ${product.productSaleable
                  ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                  : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                  }`}>
                  {product.productSaleable ? 'Còn hàng' : 'Hết hàng'}
                </span>
                {product.productBrand && (
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Tác giả:</span>
                    <Link to={'/brand/' + product.productBrand.brandId} className="text-blue-600 dark:text-blue-400 font-medium hover:underline text-sm">
                      {product.productBrand.brandName}
                    </Link>
                  </div>
                )}
                {product.productCategories && product.productCategories.length > 0 && (
                  <div className="flex items-center gap-1 text-sm flex-wrap">
                    <span className="text-gray-600 dark:text-gray-400">Thể loại:</span>
                    <div className="flex gap-2">
                      {product.productCategories.map((cat, idx) => (
                        <React.Fragment key={cat.categorySlug}>
                          {idx > 0 && <span className="text-gray-400">,</span>}
                          <Link to={'/category/' + cat.categorySlug} className="text-blue-600 dark:text-blue-400 font-medium hover:underline text-sm">
                            {cat.categoryName}
                          </Link>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                )}
                {product.productSupplier && (
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Nhà xuất bản:</span>
                    <span className="text-gray-900 dark:text-gray-100 font-medium text-sm">
                      {product.productSupplier.supplierName}
                    </span>
                  </div>
                )}
                <div className="flex gap-4">
                  {product.productUnit && (
                    <div className="flex items-center gap-1 text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Đơn vị tính:</span>
                      <span className="text-gray-900 dark:text-gray-100 font-medium text-sm">
                        {product.productUnit.unitName}
                      </span>
                    </div>
                  )}
                  {product.productGuarantee && (
                    <div className="flex items-center gap-1 text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Bảo hành:</span>
                      <span className="text-gray-900 dark:text-gray-100 font-medium text-sm">
                        {product.productGuarantee.guaranteeName}
                      </span>
                    </div>
                  )}
                </div>
                {product.productTags && product.productTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {product.productTags.map(tag => (
                      <span key={tag.tagId} className="px-2 py-0.5 text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full border border-gray-200 dark:border-gray-700">
                        {tag.tagName}
                      </span>
                    ))}
                  </div>
                )}
                <h1 className="text-2xl font-medium text-gray-900 dark:text-gray-100">
                  {product.productName}
                </h1>
                <div className="flex items-center gap-6 mt-2">
                  <div className="flex items-center gap-1">
                    <ReviewStarGroup ratingScore={product.productAverageRatingScore} />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{product.productCountReviews} đánh giá</span>
                  </div>
                </div>
              </div>

              {product.productShortDescription && <p className="text-gray-600 dark:text-gray-400">{product.productShortDescription}</p>}

              <div className="bg-gray-100 dark:bg-gray-700/50 rounded-md p-4">
                <div className="flex items-center gap-3">
                  <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                    {product.productVariants.length > 0 && product.productVariants[selectedVariantIndex]
                      ? `${MiscUtils.formatPrice(
                        MiscUtils.calculateDiscountedPrice(
                          product.productVariants[selectedVariantIndex].variantPrice,
                          product.productPromotion ? product.productPromotion.promotionPercent : 0
                        )
                      )} ₫`
                      : 'Liên hệ'}
                  </p>
                  {product.productPromotion && product.productVariants.length > 0 && product.productVariants[selectedVariantIndex] && (
                    <>
                      <p className="text-lg line-through text-gray-500 dark:text-gray-400">
                        {MiscUtils.formatPrice(product.productVariants[selectedVariantIndex].variantPrice)} ₫
                      </p>
                      <span className="px-2 py-1 text-sm font-medium bg-pink-100 dark:bg-pink-900/20 text-pink-700 dark:text-pink-400 rounded">
                        -{product.productPromotion.promotionPercent}%
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <p className="font-medium text-gray-900 dark:text-gray-100">Phiên bản</p>
                {product.productVariants.length > 0
                  ? (
                    <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-md">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">SKU</th>
                            <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Giá bán</th>
                            <th className="px-4 py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Số lượng</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"></th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                          {product.productVariants.map((variant, index) => (
                            <tr
                              key={variant.variantId}
                              onClick={() => handleSelectVariantButton(index)}
                              className={`cursor-pointer transition-colors ${index === selectedVariantIndex
                                ? 'bg-blue-50 dark:bg-blue-900/20'
                                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                                } ${variant.quantity === 0 ? 'opacity-70' : ''}`}
                            >
                              <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-medium">{variant.variantSku}</td>
                              <td className="px-4 py-3 text-sm text-right font-bold text-pink-600 dark:text-pink-400">
                                {MiscUtils.formatPrice(
                                  MiscUtils.calculateDiscountedPrice(
                                    variant.variantPrice,
                                    product.productPromotion ? product.productPromotion.promotionPercent : 0
                                  )
                                )} ₫
                              </td>
                              <td className="px-4 py-3 text-sm text-center">
                                <span className={`font-bold ${variant.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {variant.quantity > 0 ? variant.quantity : variant.inventoryStatus}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <input
                                  type="radio"
                                  checked={index === selectedVariantIndex}
                                  readOnly
                                  className="w-4 h-4 text-blue-600"
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                  : <p className="text-sm text-gray-600 dark:text-gray-400">Không có phiên bản nào cho sản phẩm này</p>}
              </div>

              {product.productVariants[selectedVariantIndex]?.quantity > 0 && (
                <div className="flex flex-col gap-2">
                  <p className="font-medium text-gray-900 dark:text-gray-100">Số lượng</p>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-9 h-9 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Minus size={16} />
                    </button>

                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        const newQuantity = Number(e.target.value) || 1;
                        setQuantity(Math.min(product.productVariants[selectedVariantIndex].quantity, Math.max(1, newQuantity)));
                      }}
                      min={1}
                      max={product.productVariants[selectedVariantIndex].quantity}
                      className="w-14 h-9 text-center border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />

                    <button
                      onClick={() => setQuantity(Math.min(product.productVariants[selectedVariantIndex].quantity, quantity + 1))}
                      className="w-9 h-9 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              )}

                <div className="flex items-center gap-3 mt-4">
                  {product.productVariants.length > 0 && (
                    product.productVariants[selectedVariantIndex]?.quantity === 0
                      ? (
                        <button
                          onClick={handleCreatePreorderButton}
                          className="px-6 py-3 flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-md transition-colors"
                        >
                          <BellPlus size={20} />
                          Đặt trước
                        </button>
                      )
                      : (
                        <>
                          <button
                            onClick={handleBuyNowButton}
                            className="px-6 py-3 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
                          >
                            <Bolt size={20} />
                            Mua ngay
                          </button>
                          <button
                            onClick={handleAddToCartButton}
                            className="px-6 py-3 flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-md transition-colors"
                          >
                            <ShoppingCart size={20} />
                            Chọn mua
                          </button>
                        </>
                      )
                  )}
                  <button
                    onClick={handleCreateWishButton}
                    className="px-6 py-3 flex items-center gap-2 border border-pink-300 dark:border-pink-600 text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/20 rounded-md transition-colors"
                  >
                    <Heart size={20} />
                    Yêu thích
                  </button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientProductIntro;
