import BaseResponse from 'models/BaseResponse';

export interface CategoryResponse extends BaseResponse {
  name: string;
  slug: string;
  level: number;
  parentCategory: ParentCategoryResponse | null;
  status: number;
  children: CategoryResponse[];
}

interface ParentCategoryResponse extends BaseResponse {
  name: string;
  slug: string;
  level: number;
  status: number;
}

export interface CategoryRequest {
  name: string;
  slug: string;
  level: number;
  parentCategoryId: number | null;
  status: number;
}
