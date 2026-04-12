import { z } from 'zod';
import { Configs, EntityPropertySchema, EntityPropertyType, TitleLink } from 'types';
import ResourceURL from 'constants/ResourceURL';
import PageConfigs from 'pages/PageConfigs';
import ManagerPath from 'constants/ManagerPath';

class StorageLocationConfigs extends Configs {
  static managerPath = ManagerPath.STORAGE_LOCATION;
  static resourceUrl = ResourceURL.STORAGE_LOCATION;
  static resourceKey = 'storageLocations';
  static createTitle = 'Thêm vị trí lưu trữ';
  static updateTitle = 'Cập nhật vị trí lưu trữ';
  static manageTitle = 'Quản lý vị trí lưu trữ';

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
    aisle: {
      label: 'Dãy',
      type: EntityPropertyType.STRING,
      isShowInTable: true,
    },
    shelf: {
      label: 'Kệ',
      type: EntityPropertyType.STRING,
      isShowInTable: true,
    },
    bin: {
      label: 'Ô',
      type: EntityPropertyType.STRING,
      isShowInTable: true,
    },
    'warehouse.name': {
      label: 'Nhà kho',
      type: EntityPropertyType.STRING,
      isShowInTable: true,
    },
    warehouseId: {
      label: 'Nhà kho',
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

  static properties = StorageLocationConfigs._rawProperties as
    EntityPropertySchema<typeof StorageLocationConfigs._rawProperties & typeof PageConfigs.properties>;

  static initialCreateUpdateFormValues = {
    aisle: '',
    shelf: '',
    bin: '',
    warehouseId: null as string | null,
    categoryId: null as string | null,
    productId: null as string | null,
    variants: [] as Array<{ id: number; sku: string; quantity: number }>,
  };

  static createUpdateFormSchema = z.object({
    aisle: z.string().min(1, 'Vui lòng nhập dãy'),
    shelf: z.string().min(1, 'Vui lòng nhập kệ'),
    bin: z.string().min(1, 'Vui lòng nhập ô'),
    warehouseId: z.string().nullable(),
    categoryId: z.string().nullable(),
    productId: z.string().nullable(),
    variants: z.array(z.object({
        id: z.number(),
        sku: z.string(),
        quantity: z.number().min(1, 'Số lượng phải lớn hơn 0'),
    })).min(1, 'Vui lòng chọn ít nhất một phiên bản'),
  });
}

export default StorageLocationConfigs;
