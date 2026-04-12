import BaseResponse from 'models/BaseResponse';

export interface CategoryLevel1Node {
    id: number;
    name: string;
    children: CategoryLevel2Node[];
}

export interface CategoryLevel2Node {
    id: number;
    name: string;
    children: CategoryLevel3Node[];
}

export interface CategoryLevel3Node {
    id: number;
    name: string;
    products: ProductStorageNode[];
}

export interface ProductStorageNode {
    productId: number;
    productName: string;
    productCode: string;
    storageLocationId: number | null;
    
    // Vị trí kho hiển thị cho từng sản phẩm
    aisle: string;
    shelf: string;
    bin: string;
    
    // Hiện tất cả variant của sản phẩm này
    variants: VariantInventoryDto[];
}

export interface VariantInventoryDto {
    variantId: number;
    sku: string;
    properties: string; // VD: {"color": "Red", "size": "XL"}
    quantityInLocation: number;  // Số lượng tại ô cụ thể này
    totalVariantQuantity: number; // Tổng số lượng trên toàn hệ thống
}

export interface InventoryUpdateDto {
  warehouseId: number;
  variantId: number;
  storageLocationId: number;
  newQuantity: number;
}

export interface FlattenedInventoryRow {
  l1Name: string;
  l2Name: string;
  l3Name: string;
  productId: number;
  productName: string;
  productCode: string;
  storageLocationId: number;
  aisle: string;
  shelf: string;
  bin: string;
  variantId: number;
  sku: string;
  properties: string;
  quantityInLocation: number;
  totalVariantQuantity: number;
}

export interface InventoryHierarchyResponse extends BaseResponse {
    categories: CategoryLevel1Node[];
}
