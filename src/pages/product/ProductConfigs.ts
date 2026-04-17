import { z } from 'zod';
import { CollectionWrapper, Configs, EntityPropertySchema, EntityPropertyType, TitleLink } from 'types';
import ResourceURL from 'constants/ResourceURL';
import MessageUtils from 'utils/MessageUtils';
import PageConfigs from 'pages/PageConfigs';
import ManagerPath from 'constants/ManagerPath';
import { ProductPropertyItem, SpecificationItem } from 'models/Product';
import { VariantRequest } from 'models/Variant';
import { ImageRequest } from 'models/Image';

class ProductConfigs extends Configs {
  static managerPath = ManagerPath.PRODUCT;
  static resourceUrl = ResourceURL.PRODUCT;
  static resourceKey = 'products';
  static createTitle = 'Thêm đầu sách';
  static updateTitle = 'Cập nhật đầu sách';
  static manageTitle = 'Quản lý đầu sách';

  static manageTitleLinks: TitleLink[] = [
    {
      link: ManagerPath.PRODUCT,
      label: 'Quản lý đầu sách',
    },
    {
      link: ManagerPath.CATEGORY,
      label: 'Quản lý thể loại',
    },
    {
      link: ManagerPath.BRAND,
      label: 'Quản lý tác giả',
    },
    {
      link: ManagerPath.SUPPLIER,
      label: 'Quản lý nhà xuất bản',
    },
    {
      link: ManagerPath.UNIT,
      label: 'Quản lý đơn vị tính',
    },
    {
      link: ManagerPath.TAG,
      label: 'Quản lý tag',
    },
    {
      link: ManagerPath.GUARANTEE,
      label: 'Quản lý bảo hành',
    },
    {
      link: ManagerPath.PROPERTY,
      label: 'Quản lý thuộc tính sách',
    },
    {
      link: ManagerPath.SPECIFICATION,
      label: 'Quản lý thông số sách',
    },
  ];

  protected static _rawProperties = {
    ...PageConfigs.getProperties(true),
    name: {
      label: 'Tên đầu sách',
      type: EntityPropertyType.STRING,
      isShowInTable: true,
    },
    code: {
      label: 'Mã đầu sách',
      type: EntityPropertyType.STRING,
      isShowInTable: true,
    },
    slug: {
      label: 'Slug đầu sách',
      type: EntityPropertyType.STRING,
    },
    shortDescription: {
      label: 'Mô tả ngắn',
      type: EntityPropertyType.STRING,
    },
    description: {
      label: 'Mô tả chung',
      type: EntityPropertyType.STRING,
    },
    thumbnail: {
      label: 'Hình đại diện',
      type: EntityPropertyType.STRING,
      isShowInTable: true,
      isNotAddToSortCriteria: true,
      isNotAddToFilterCriteria: true,
    },
    images: {
      label: 'Hình ảnh sách',
      type: EntityPropertyType.ARRAY,
      isNotAddToSortCriteria: true,
      isNotAddToFilterCriteria: true,
    },
    'category.name': {
      label: 'Tên thể loại',
      type: EntityPropertyType.STRING,
      isShowInTable: true,
    },
    'brand.name': {
      label: 'Tên tác giả',
      type: EntityPropertyType.STRING,
    },
    'supplier.displayName': {
      label: 'Tên nhà xuất bản',
      type: EntityPropertyType.STRING,
    },
    'unit.name': {
      label: 'Tên đơn vị tính',
      type: EntityPropertyType.STRING,
    },
    tags: {
      label: 'Danh sách tag',
      type: EntityPropertyType.ARRAY,
      isShowInTable: true,
      isNotAddToSortCriteria: true,
      isNotAddToFilterCriteria: true,
    },
    specifications: {
      label: 'Thông số sách',
      type: EntityPropertyType.COLLECTION,
      isNotAddToSortCriteria: true,
      isNotAddToFilterCriteria: true,
    },
    properties: {
      label: 'Thuộc tính sách',
      type: EntityPropertyType.COLLECTION,
      isNotAddToSortCriteria: true,
      isNotAddToFilterCriteria: true,
    },
    variants: {
      label: 'Phiên bản',
      type: EntityPropertyType.ARRAY,
      isShowInTable: true,
      isNotAddToSortCriteria: true,
      isNotAddToFilterCriteria: true,
    },
    weight: {
      label: 'Khối lượng sản phẩm',
      type: EntityPropertyType.NUMBER,
    },
    'guarantee.name': {
      label: 'Thông tin bảo hành',
      type: EntityPropertyType.STRING,
    },
    categoryId: {
      label: 'Thể loại',
      type: EntityPropertyType.NUMBER,
      isNotAddToSortCriteria: true,
      isNotAddToFilterCriteria: true,
    },
    brandId: {
      label: 'Tác giả',
      type: EntityPropertyType.NUMBER,
      isNotAddToSortCriteria: true,
      isNotAddToFilterCriteria: true,
    },
    supplierId: {
      label: 'Nhà xuất bản',
      type: EntityPropertyType.NUMBER,
      isNotAddToSortCriteria: true,
      isNotAddToFilterCriteria: true,
    },
    unitId: {
      label: 'Đơn vị tính',
      type: EntityPropertyType.NUMBER,
      isNotAddToSortCriteria: true,
      isNotAddToFilterCriteria: true,
    },
    guaranteeId: {
      label: 'Bảo hành',
      type: EntityPropertyType.NUMBER,
      isNotAddToSortCriteria: true,
      isNotAddToFilterCriteria: true,
    },
  
    status: {
      label: 'Trạng thái hiển thị',
      type: EntityPropertyType.NUMBER,
      isShowInTable: true,
    },
  };

  static properties = ProductConfigs._rawProperties as
    EntityPropertySchema<typeof ProductConfigs._rawProperties & typeof PageConfigs.properties>;

  static initialCreateUpdateFormValues = {
    name: '',
    code: '',
    slug: '',
    shortDescription: '',
    description: '',
    images: [] as ImageRequest[],
    status: '1',
    categoryIds: [] as number[],
    brandId: null as string | null,
    supplierId: null as string | null,
    unitId: null as string | null,
    tags: [] as string[],
    specifications: null as CollectionWrapper<SpecificationItem> | null,
    properties: null as CollectionWrapper<ProductPropertyItem> | null,
    variants: [
      {
        sku: '',
        cost: 0,
        price: 0,
        properties: null,
        status: 1,
      },
    ] as VariantRequest[],
    weight: 0.00,
    guaranteeId: null as string | null,
  };

  static createUpdateFormSchema = z.object({
    name: z.string().min(2, MessageUtils.min(ProductConfigs.properties.name.label, 2)),
    code: z.string(),
    slug: z.string(),
    shortDescription: z.string(),
    description: z.string(),
    images: z.array(z.object({
      id: z.number(),
      name: z.string(),
      path: z.string(),
      contentType: z.string(),
      size: z.number(),
      group: z.string(),
      isThumbnail: z.boolean(),
      isEliminated: z.boolean(),
    })),
    status: z.string(),
    categoryIds: z.array(z.number()),
    brandId: z.string().nullable(),
    supplierId: z.string().nullable(),
    unitId: z.string().nullable(),
    tags: z.array(z.string()),
    specifications: z.object({
      content: z.array(z.object({
        id: z.number(),
        name: z.string(),
        code: z.string(),
        value: z.string(),
      })),
      totalElements: z.number(),
    }).nullable(),
    properties: z.object({
      content: z.array(z.object({
        id: z.number(),
        name: z.string(),
        code: z.string(),
        value: z.array(z.string()),
      })),
      totalElements: z.number(),
    }).nullable(),
    variants: z.array(z.object({
      sku: z.string(),
      cost: z.number(),
      price: z.number(),
      properties: z.object({
        content: z.array(z.object({
          id: z.number(),
          name: z.string(),
          code: z.string(),
          value: z.string(),
        })),
        totalElements: z.number(),
      }).nullable(),
      status: z.number(),
    })),
    weight: z.number(),
    guaranteeId: z.string().nullable(),
  });
}

export default ProductConfigs;
