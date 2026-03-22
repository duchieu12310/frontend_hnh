import { z } from 'zod';
import { Configs, EntityPropertySchema, EntityPropertyType, TitleLink } from 'types';
import ResourceURL from 'constants/ResourceURL';
import MessageUtils from 'utils/MessageUtils';
import PageConfigs from 'pages/PageConfigs';
import ManagerPath from 'constants/ManagerPath';
import OrderResourceConfigs from 'pages/order-resource/OrderResourceConfigs';
import { OrderVariantRequest } from 'models/OrderVariant';
import ApplicationConstants from 'constants/ApplicationConstants';
import { PaymentMethodType } from 'models/PaymentMethod';
import { OrderResponse } from 'models/Order';
import DateUtils from 'utils/DateUtils';
import MiscUtils from 'utils/MiscUtils';
import React from 'react';

class OrderConfigs extends Configs {
  static managerPath = ManagerPath.ORDER;
  static resourceUrl = ResourceURL.ORDER;
  static resourceKey = 'orders';
  static createTitle = 'Thêm đơn hàng';
  static updateTitle = 'Cập nhật đơn hàng';
  static manageTitle = 'Quản lý đơn hàng';

  static manageTitleLinks: TitleLink[] = OrderResourceConfigs.manageTitleLinks;

  protected static _rawProperties = {
    ...PageConfigs.getProperties(true, true),
    code: {
      label: 'Mã đơn hàng',
      type: EntityPropertyType.STRING,
      isShowInTable: true,
    },
    'orderResource.name': {
      label: 'Tên nguồn đơn hàng',
      type: EntityPropertyType.STRING,
      isShowInTable: true,
    },
    user: {
      label: 'Người đặt hàng',
      type: EntityPropertyType.PLACEHOLDER,
      isShowInTable: true,
      isNotAddToSortCriteria: true,
      isNotAddToFilterCriteria: true,
    },
    to: {
      label: 'Người nhận hàng',
      type: EntityPropertyType.PLACEHOLDER,
      isShowInTable: true,
      isNotAddToSortCriteria: true,
      isNotAddToFilterCriteria: true,
    },
    totalPay: {
      label: 'Tổng tiền trả',
      type: EntityPropertyType.NUMBER,
      isShowInTable: true,
    },
    warehouse: {
      label: 'Kho',
      type: EntityPropertyType.PLACEHOLDER,
      isShowInTable: true,
      isNotAddToSortCriteria: true,
      isNotAddToFilterCriteria: true,
    },
    status: {
      label: 'Trạng thái đơn hàng',
      type: EntityPropertyType.NUMBER,
      isShowInTable: true,
    },
  };

  static properties = OrderConfigs._rawProperties as
    EntityPropertySchema<typeof OrderConfigs._rawProperties & typeof PageConfigs.properties>;

  static initialCreateUpdateFormValues = {
    code: '',
    status: '1',
    toName: '',
    toPhone: '',
    toAddress: '',
    toWardName: '',
    toDistrictName: '',
    toProvinceName: '',
    orderResourceId: '1',
    orderCancellationReasonId: null as string | null,
    note: '',
    userId: null as string | null,
    orderVariants: [] as OrderVariantRequest[],
    totalAmount: 0,
    tax: ApplicationConstants.DEFAULT_TAX,
    shippingCost: ApplicationConstants.DEFAULT_SHIPPING_COST,
    totalPay: ApplicationConstants.DEFAULT_SHIPPING_COST,
    paymentMethodType: PaymentMethodType.CASH,
    paymentStatus: '1',
  };

  static createUpdateFormSchema = z.object({
    code: z.string().min(5, MessageUtils.min(OrderConfigs.properties.code.label, 5)),
    status: z.string(),
    toName: z.string(),
    toPhone: z.string(),
    toAddress: z.string(),
    toWardName: z.string(),
    toDistrictName: z.string(),
    toProvinceName: z.string(),
    orderResourceId: z.string({ invalid_type_error: 'Vui lòng không bỏ trống' }),
    orderCancellationReasonId: z.string().nullable(),
    note: z.string(),
    userId: z.string({ invalid_type_error: 'Vui lòng không bỏ trống' }),
    orderVariants: z.array(z.object({
      variantId: z.number(),
      price: z.number(),
      quantity: z.number(),
      amount: z.number(),
    })).min(1, 'Cần thêm ít nhất 1 mặt hàng'),
    totalAmount: z.number().min(0),
    tax: z.number().min(0),
    shippingCost: z.number().min(0),
    totalPay: z.number().min(0),
    paymentMethodType: z.string(),
    paymentStatus: z.string(),
  });

  static orderStatusBadgeFragment = (status: number) => {
    switch (status) {
    case 1:
      return <span className="px-2 py-1 text-xs font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded">Đơn hàng mới</span>;
    case 2:
      return <span className="px-2 py-1 text-xs font-medium border border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-400 rounded">Đang xử lý</span>;
    case 3:
      return <span className="px-2 py-1 text-xs font-medium border border-violet-300 dark:border-violet-600 text-violet-700 dark:text-violet-400 rounded">Đang giao hàng</span>;
    case 4:
      return <span className="px-2 py-1 text-xs font-medium border border-green-300 dark:border-green-600 text-green-700 dark:text-green-400 rounded">Đã giao hàng</span>;
    case 5:
      return <span className="px-2 py-1 text-xs font-medium border border-red-300 dark:border-red-600 text-red-700 dark:text-red-400 rounded">Hủy bỏ</span>;
    }
  };

  static orderPaymentStatusBadgeFragment = (paymentStatus: number) => {
    switch (paymentStatus) {
    case 1:
      return <span className="px-2 py-1 text-xs font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded">Chưa thanh toán</span>;
    case 2:
      return <span className="px-2 py-1 text-xs font-medium border border-green-300 dark:border-green-600 text-green-700 dark:text-green-400 rounded">Đã thanh toán</span>;
    }
  };

  static entityDetailTableRowsFragment = (entity: OrderResponse) => {
    const PaymentMethodIcon = PageConfigs.paymentMethodIconMap[entity.paymentMethodType];

    return (
      <>
        <tr>
          <td>{OrderConfigs.properties.id.label}</td>
          <td>{entity.id}</td>
        </tr>
        <tr>
          <td>{OrderConfigs.properties.createdAt.label}</td>
          <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
        </tr>
        <tr>
          <td>{OrderConfigs.properties.updatedAt.label}</td>
          <td>{DateUtils.isoDateToString(entity.updatedAt)}</td>
        </tr>
        <tr>
          <td>{OrderConfigs.properties.code.label}</td>
          <td>{entity.code}</td>
        </tr>
        <tr>
          <td>{OrderConfigs.properties.status.label}</td>
          <td>{OrderConfigs.orderStatusBadgeFragment(entity.status)}</td>
        </tr>
        <tr>
          <td>{OrderConfigs.properties['orderResource.name'].label}</td>
          <td>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: entity.orderResource.color }}></div>
              <span>{entity.orderResource.name}</span>
            </div>
          </td>
        </tr>
        <tr>
          <td>Tên lý do hủy đơn hàng</td>
          <td>{entity.orderCancellationReason?.name}</td>
        </tr>
        <tr>
          <td>Ghi chú đơn hàng</td>
          <td className="max-w-[300px]">{entity.note}</td>
        </tr>
        <tr>
          <td>Người đặt hàng</td>
          <td>
            <div className="flex flex-col gap-0">
              <p className="text-sm">{entity.user.fullname}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{entity.user.username}</p>
            </div>
          </td>
        </tr>
        <tr>
          <td>Người nhận hàng</td>
          <td>
            <div className="flex flex-col gap-0">
              <p className="text-sm">{entity.toName}</p>
              <p className="text-xs">{entity.toPhone}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {[entity.toAddress, entity.toWardName, entity.toDistrictName, entity.toProvinceName].join(', ')}
              </p>
            </div>
          </td>
        </tr>
        <tr>
          <td>Số mặt hàng</td>
          <td>{entity.orderVariants.length} SKU</td>
        </tr>
        <tr>
          <td>Tổng thành tiền</td>
          <td>{MiscUtils.formatPrice(entity.totalAmount) + ' ₫'}</td>
        </tr>
        <tr>
          <td>Thuế</td>
          <td>{entity.tax * 100 + '%'}</td>
        </tr>
        <tr>
          <td>Phí vận chuyển</td>
          <td>{MiscUtils.formatPrice(entity.shippingCost) + ' ₫'}</td>
        </tr>
        <tr>
          <td>{OrderConfigs.properties.totalPay.label}</td>
          <td>{MiscUtils.formatPrice(entity.totalPay) + ' ₫'}</td>
        </tr>
        <tr>
          <td>Hình thức thanh toán</td>
          <td><PaymentMethodIcon /></td>
        </tr>
        <tr>
          <td>Trạng thái thanh toán</td>
          <td>{OrderConfigs.orderPaymentStatusBadgeFragment(entity.paymentStatus)}</td>
        </tr>
      </>
    );
  };
}

export default OrderConfigs;
