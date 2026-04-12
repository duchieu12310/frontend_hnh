import BaseResponse from 'models/BaseResponse';
import { TransitWarehouseResponse } from 'models/TransitWarehouse';
import { PurchaseOrderVariantResponse } from 'models/PurchaseOrderVariant';

export interface TransitItemResponse extends BaseResponse {
  transitWarehouse: TransitWarehouseResponse | null;
  purchaseOrderVariant: PurchaseOrderVariantResponse | null;
  status: string;
  receivedAt: string | null;
}

export interface TransitItemRequest {
  transitWarehouseId: number;
  category: { id: number };
  product: { id: number };
  variants: Array<{
    id: number;
    sku: string;
    properties?: Record<string, string>;
    quantity: number;
  }>;
}
