import BaseResponse from 'models/BaseResponse';
import { OrderResponse } from 'models/Order';
import { WarehouseResponse } from 'models/Warehouse';
import { UserResponse } from 'models/User';

export interface WaybillResponse extends BaseResponse {
  code: string;
  order: OrderResponse;
  shippingDate: string;
  expectedDeliveryTime: string;
  status: number;
  codAmount: number;
  shippingFee: number;
  weight: number;
  length: number;
  width: number;
  height: number;
  note: string | null;
  ghnPaymentTypeId: number;
  ghnRequiredNote: RequiredNote;
  fromWarehouse: WarehouseResponse | null;
  shipper: UserResponse | null;
}

export interface WaybillRequest {
  orderId: number;
  shippingDate: string;
  weight: number;
  length: number;
  width: number;
  height: number;
  note: string | null;
  ghnRequiredNote: RequiredNote;
}

export enum RequiredNote {
  CHOTHUHANG = 'CHOTHUHANG',
  CHOXEMHANGKHONGTHU = 'CHOXEMHANGKHONGTHU',
  KHONGCHOXEMHANG = 'KHONGCHOXEMHANG'
}
