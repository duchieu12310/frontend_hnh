import BaseResponse from 'models/BaseResponse';
import { AddressResponse } from 'models/Address';
import { CategoryResponse } from 'models/Category';
import { ProductResponse } from 'models/Product';

export interface WarehouseResponse extends BaseResponse {
  code: string;
  name: string;
  address: AddressResponse | null;
  status: number;
  categories: CategoryResponse[];
  products: ProductResponse[];
}

export interface WarehouseAddressRequest {
  id?: number | null;
  line: string | null;
  province: { id: number } | null;
  district: { id: number } | null;
  ward: { id: number } | null;
}

export interface WarehouseRequest {
  code: string;
  name: string;
  address: WarehouseAddressRequest | null;
  status: number;
  categories: { id: number; productIds?: number[] }[];
}
