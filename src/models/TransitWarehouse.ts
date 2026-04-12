import BaseResponse from 'models/BaseResponse';
import { AddressResponse, AddressRequest } from 'models/Address';
import { WarehouseResponse } from 'models/Warehouse';
import { CategoryResponse } from 'models/Category';

export interface TransitWarehouseResponse extends BaseResponse {
  name: string;
  code: string;
  address: AddressResponse | null;
  mainWarehouse: WarehouseResponse | null;
  categories: CategoryResponse[];
}

export interface TransitWarehouseRequest {
  name: string;
  parentWarehouse: { id: number };
  address: AddressRequest | null;
  categories: Array<{
    id: number;
    name?: string;
    products?: Array<{
      id: number;
      name?: string;
      code?: string;
    }>;
  }>;
}
