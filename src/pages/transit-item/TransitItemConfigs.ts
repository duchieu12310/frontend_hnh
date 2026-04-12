import { z } from 'zod';
import { Configs, EntityPropertySchema, EntityPropertyType, TitleLink } from 'types';
import ResourceURL from 'constants/ResourceURL';
import PageConfigs from 'pages/PageConfigs';
import ManagerPath from 'constants/ManagerPath';

class TransitItemConfigs extends Configs {
  static managerPath = ManagerPath.TRANSIT_ITEM;
  static resourceUrl = ResourceURL.TRANSIT_ITEM;
  static resourceKey = 'transitItems';
  static createTitle = 'Thêm mặt hàng trung chuyển';
  static updateTitle = 'Cập nhật mặt hàng trung chuyển';
  static manageTitle = 'Quản lý mặt hàng trung chuyển';

  static manageTitleLinks: TitleLink[] = [
    {
      link: ManagerPath.INVENTORY,
      label: 'Theo dõi tồn kho',
    },
    {
      link: ManagerPath.WAREHOUSE,
      label: 'Quản lý nhà kho',
    },
    {
        link: ManagerPath.STORAGE_LOCATION,
        label: 'Quản lý vị trí lưu trữ',
    },
    {
        link: ManagerPath.TRANSIT_WAREHOUSE,
        label: 'Quản lý trạm trung chuyển',
    },
    {
        link: ManagerPath.TRANSIT_ITEM,
        label: 'Quản lý hàng trung chuyển',
    },
    {
      link: ManagerPath.DOCKET,
      label: 'Quản lý phiếu nhập xuất kho',
    },
  ];

  protected static _rawProperties = {
    ...PageConfigs.getProperties(true, true, true),
    'transitWarehouse.name': {
      label: 'Trạm trung chuyển',
      type: EntityPropertyType.STRING,
      isShowInTable: true,
    },
    'purchaseOrderVariant.variant.product.name': {
      label: 'Cuốn sách',
      type: EntityPropertyType.STRING,
      isShowInTable: true,
    },
    'purchaseOrderVariant.id': {
        label: 'ID chi tiết đơn mua',
        type: EntityPropertyType.NUMBER,
    },
    status: {
      label: 'Trạng thái',
      type: EntityPropertyType.STRING,
      isShowInTable: true,
    },
    receivedAt: {
      label: 'Ngày nhận',
      type: EntityPropertyType.DATE,
      isShowInTable: true,
    },
    transitWarehouseId: {
        label: 'Trạm trung chuyển',
        type: EntityPropertyType.NUMBER,
        isNotAddToSortCriteria: true,
        isNotAddToFilterCriteria: true,
    },
    purchaseOrderVariantId: {
        label: 'Chi tiết đơn mua',
        type: EntityPropertyType.NUMBER,
        isNotAddToSortCriteria: true,
        isNotAddToFilterCriteria: true,
    },
    categoryId: {
        label: 'Danh mục',
        type: EntityPropertyType.NUMBER,
        isNotAddToSortCriteria: true,
        isNotAddToFilterCriteria: true,
    },
    productId: {
        label: 'Sách',
        type: EntityPropertyType.NUMBER,
        isNotAddToSortCriteria: true,
        isNotAddToFilterCriteria: true,
    },
  };

  static properties = TransitItemConfigs._rawProperties as
    EntityPropertySchema<typeof TransitItemConfigs._rawProperties & typeof PageConfigs.properties>;

  static initialCreateUpdateFormValues = {
    transitWarehouseId: null as string | null,
    categoryId: null as string | null,
    productId: null as string | null,
    variants: [] as Array<{ id: number; sku: string; quantity: number; properties?: Record<string, string> }>,
    status: 'IN_TRANSIT',
  };

  static createUpdateFormSchema = z.object({
    transitWarehouseId: z.string().nullable(),
    categoryId: z.string().nullable(),
    productId: z.string().nullable(),
    variants: z.array(z.object({
        id: z.number(),
        sku: z.string(),
        quantity: z.number().min(1, 'Số lượng phải lớn hơn 0'),
        properties: z.record(z.string()).optional(),
    })).min(1, 'Vui lòng chọn ít nhất một phiên bản'),
    status: z.string(),
  });
}

export default TransitItemConfigs;
