import BaseResponse from 'models/BaseResponse';

export interface StorageLocationResponseItemDto {
  productId: number;
  productName: string;
  variantId: number;
  sku: string;
  quantity: number;
}

export interface StorageLocationResponse extends BaseResponse {
  warehouseId: number;
  warehouseName: string;
  aisle: string;
  shelf: string;
  bin: string;
  items: StorageLocationResponseItemDto[];
}

export interface StorageLocationRequestItemDto {
  productId: number;
  variantId: number;
  sku: string;
  quantity: number;
}

export interface StorageLocationRequest {
  categoryIds?: number[];
  productIds?: number[];
  warehouseId: number;
  aisle: string;
  shelf: string;
  bin: string;
  items: StorageLocationRequestItemDto[];
}
