import { z } from 'zod';
import { Configs, EntityPropertySchema, EntityPropertyType, TitleLink } from 'types';
import ResourceURL from 'constants/ResourceURL';
import MessageUtils from 'utils/MessageUtils';
import PageConfigs from 'pages/PageConfigs';
import ManagerPath from 'constants/ManagerPath';
import ProductConfigs from 'pages/product/ProductConfigs';

class BrandConfigs extends Configs {
  static managerPath = ManagerPath.BRAND;
  static resourceUrl = ResourceURL.BRAND;
  static resourceKey = 'brands';
  static createTitle = 'Thêm tác giả';
  static updateTitle = 'Cập nhật tác giả';
  static manageTitle = 'Quản lý tác giả';

  static manageTitleLinks: TitleLink[] = ProductConfigs.manageTitleLinks;

  protected static _rawProperties = {
    ...PageConfigs.getProperties(true, true, true),
    name: {
      label: 'Tên tác giả',
      type: EntityPropertyType.STRING,
      isShowInTable: true,
    },
    code: {
      label: 'Mã tác giả',
      type: EntityPropertyType.STRING,
      isShowInTable: true,
    },
    description: {
      label: 'Mô tả tác giả',
      type: EntityPropertyType.STRING,
    },
    status: {
      label: 'Trạng thái tác giả',
      type: EntityPropertyType.NUMBER,
      isShowInTable: true,
    },
  };

  static properties = BrandConfigs._rawProperties as
    EntityPropertySchema<typeof BrandConfigs._rawProperties & typeof PageConfigs.properties>;

  static initialCreateUpdateFormValues = {
    name: '',
    code: '',
    description: '',
    status: '1',
  };

  static createUpdateFormSchema = z.object({
    name: z.string().min(2, MessageUtils.min(BrandConfigs.properties.name.label, 2)),
    code: z.string(),
    description: z.string(),
    status: z.string(),
  });
}

export default BrandConfigs;
