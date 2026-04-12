import { z } from 'zod';
import { Configs, EntityPropertySchema, EntityPropertyType, TitleLink } from 'types';
import ResourceURL from 'constants/ResourceURL';
import MessageUtils from 'utils/MessageUtils';
import PageConfigs from 'pages/PageConfigs';
import ManagerPath from 'constants/ManagerPath';

class TransitWarehouseConfigs extends Configs {
  static managerPath = ManagerPath.TRANSIT_WAREHOUSE;
  static resourceUrl = ResourceURL.TRANSIT_WAREHOUSE;
  static resourceKey = 'transitWarehouses';
  static createTitle = 'Thêm trạm trung chuyển';
  static updateTitle = 'Cập nhật trạm trung chuyển';
  static manageTitle = 'Quản lý trạm trung chuyển';

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
    code: {
      label: 'Mã trạm',
      type: EntityPropertyType.STRING,
      isShowInTable: true,
    },
    name: {
      label: 'Tên trạm',
      type: EntityPropertyType.STRING,
      isShowInTable: true,
    },
    'address.line': {
      label: 'Địa chỉ',
      type: EntityPropertyType.STRING,
    },
    'mainWarehouse.name': {
      label: 'Kho quản lý',
      type: EntityPropertyType.STRING,
      isShowInTable: true,
    },
    mainWarehouseId: {
      label: 'Kho quản lý',
      type: EntityPropertyType.NUMBER,
      isNotAddToSortCriteria: true,
      isNotAddToFilterCriteria: true,
    },
    'address.provinceId': {
        label: 'Tỉnh thành',
        type: EntityPropertyType.NUMBER,
        isNotAddToSortCriteria: true,
        isNotAddToFilterCriteria: true,
    },
    'address.districtId': {
        label: 'Quận huyện',
        type: EntityPropertyType.NUMBER,
        isNotAddToSortCriteria: true,
        isNotAddToFilterCriteria: true,
    },
    'address.wardId': {
        label: 'Phường xã',
        type: EntityPropertyType.NUMBER,
        isNotAddToSortCriteria: true,
        isNotAddToFilterCriteria: true,
    },
    parentWarehouseId: {
        label: 'Kho tổng quản lý',
        type: EntityPropertyType.NUMBER,
        isNotAddToSortCriteria: true,
        isNotAddToFilterCriteria: true,
    },
  };

  static properties = TransitWarehouseConfigs._rawProperties as
    EntityPropertySchema<typeof TransitWarehouseConfigs._rawProperties & typeof PageConfigs.properties>;

  static initialCreateUpdateFormValues = {
    name: '',
    'address.line': '',
    'address.provinceId': null as string | null,
    'address.districtId': null as string | null,
    'address.wardId': null as string | null,
    parentWarehouseId: null as string | null,
    categories: [] as Array<{
        id: number;
        name: string;
        products: Array<{ id: number; name: string; code: string }>;
    }>,
  };

  static createUpdateFormSchema = z.object({
    name: z.string().min(2, MessageUtils.min('Tên trạm', 2)),
    'address.line': z.string(),
    'address.provinceId': z.string().nullable(),
    'address.districtId': z.string().nullable(),
    'address.wardId': z.string().nullable(),
    parentWarehouseId: z.string().nullable(),
    categories: z.array(z.object({
        id: z.number(),
        name: z.string(),
        products: z.array(z.object({
            id: z.number(),
            name: z.string(),
            code: z.string(),
        })),
    })),
  });
}

export default TransitWarehouseConfigs;
