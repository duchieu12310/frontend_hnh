import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MiscUtils from 'utils/MiscUtils';
import {
  ClientCartRequest,
  ClientListedProductResponse,
  ClientPreorderRequest,
  ClientWishRequest,
  UpdateQuantityType
} from 'types';
import { BellPlus, HeartPlus, ShoppingCartPlus } from 'tabler-icons-react';
import NotifyUtils from 'utils/NotifyUtils';
import useAuthStore from 'stores/use-auth-store';
import useCreateWishApi from 'hooks/use-create-wish-api';
import useCreatePreorderApi from 'hooks/use-create-preorder-api';
import useSaveCartApi from 'hooks/use-save-cart-api';

interface ClientProductCardProps {
  product: ClientListedProductResponse;
  search?: string;
}

function ClientProductCard({ product, search }: ClientProductCardProps) {
  const [opened, setOpened] = useState(false);

  const createWishApi = useCreateWishApi();
  const createPreorderApi = useCreatePreorderApi();
  const saveCartApi = useSaveCartApi();

  const { user, currentCartId } = useAuthStore();

  const handleCreateWishButton = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
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

  const handleCreatePreorderButton = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
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

  const handleAddToCartButton = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    if (!user) {
      NotifyUtils.simple('Vui lòng đăng nhập để sử dụng chức năng');
    } else {
      const cartRequest: ClientCartRequest = {
        cartId: currentCartId,
        userId: user.id,
        cartItems: [
          {
            variantId: product.productVariants[0].variantId,
            quantity: 1,
          },
        ],
        status: 1,
        updateQuantityType: UpdateQuantityType.INCREMENTAL,
      };
      saveCartApi.mutate(cartRequest, {
        onSuccess: () => NotifyUtils.simpleSuccess(`Đã thêm sản phẩm ${product.productName} vào giỏ hàng thành công`),
      });
    }
  };

  const highlightText = (text: string, search?: string) => {
    if (!search) return text;
    const parts = text.split(new RegExp(`(${search})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === search.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200 dark:bg-yellow-800">{part}</mark>
      ) : (
        part
      )
    );
  };

  return (
    <Link
      to={'/product/' + product.productSlug}
      className="block h-full bg-white dark:bg-gray-800 rounded-md shadow-sm p-6 transition-shadow hover:shadow-lg"
      onMouseEnter={() => setOpened(true)}
      onMouseLeave={() => setOpened(false)}
    >
      <div className="flex flex-col gap-2">
        <div className="relative">
          <img
            src={product.productThumbnail || undefined}
            alt={product.productName}
            className="w-full rounded-md aspect-square object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="14" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
            }}
          />
          <div
            className={`absolute left-1/2 bottom-0 -translate-x-1/2 mb-3 flex items-center gap-2 transition-opacity ${
              opened ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <button
              type="button"
              onClick={handleCreateWishButton}
              title="Thêm vào danh sách yêu thích"
              className="p-2 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition-colors"
            >
              <HeartPlus size={18}/>
            </button>
            {product.productVariants.length > 0 && (
              product.productSaleable
                ? (
                  <button
                    type="button"
                    onClick={handleAddToCartButton}
                    title="Thêm vào giỏ hàng"
                    className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                  >
                    <ShoppingCartPlus size={18}/>
                  </button>
                )
                : (
                  <button
                    type="button"
                    onClick={handleCreatePreorderButton}
                    title="Thông báo khi có hàng"
                    className="p-2 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-colors"
                  >
                    <BellPlus size={18}/>
                  </button>
                )
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <p className="font-medium">
              {search ? highlightText(product.productName, search) : product.productName}
            </p>
            {!product.productSaleable && (
              <span className="px-2 py-0.5 text-xs font-semibold text-white bg-red-600 rounded">
                Hết hàng
              </span>
            )}
          </div>
          <p className="font-medium text-pink-600">
            {product.productPriceRange
              .map(price => product.productPromotion
                ? MiscUtils.calculateDiscountedPrice(price, product.productPromotion.promotionPercent)
                : price)
              .map(MiscUtils.formatPrice).join('–') + '\u00A0₫'}
          </p>
          {product.productPromotion && (
            <div className="flex items-center gap-2">
              <p className="text-sm line-through text-gray-500">
                {product.productPriceRange.map(MiscUtils.formatPrice).join('–') + '\u00A0₫'}
              </p>
              <span className="px-2 py-1 text-xs font-semibold text-white bg-pink-600 rounded">
                -{product.productPromotion.promotionPercent}%
              </span>
            </div>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {product.productVariants.length} phiên bản
          </p>
        </div>
      </div>
    </Link>
  );
}

export default ClientProductCard;
