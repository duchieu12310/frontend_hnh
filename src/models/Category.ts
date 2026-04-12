import BaseResponse from 'models/BaseResponse';

export interface CategoryResponse extends BaseResponse {
  name: string;
  slug: string;
  level: number;
  parentCategory: CategoryResponse | null;
  status: number;
  children: CategoryResponse[];
}

export interface CategoryRequest {
  name: string;
  slug: string;
  level: number;
  parentCategoryId: number | null;
  status: number;
}
