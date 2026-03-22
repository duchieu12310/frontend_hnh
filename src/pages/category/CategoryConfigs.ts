import { z } from 'zod';
import { Configs, EntityPropertySchema, EntityPropertyType, TitleLink } from 'types';
import ResourceURL from 'constants/ResourceURL';
import MessageUtils from 'utils/MessageUtils';
import PageConfigs from 'pages/PageConfigs';
import ManagerPath from 'constants/ManagerPath';
import ProductConfigs from 'pages/product/ProductConfigs';

class CategoryConfigs extends Configs {
  static managerPath = ManagerPath.CATEGORY;
  static resourceUrl = ResourceURL.CATEGORY;
  static resourceKey = 'categories';
  static createTitle = 'Thêm thể loại sách';
  static updateTitle = 'Cập nhật thể loại sách';
  static manageTitle = 'Quản lý thể loại sách';

  static manageTitleLinks: TitleLink[] = ProductConfigs.manageTitleLinks;

  protected static _rawProperties = {
    ...PageConfigs.getProperties(true),
    name: {
      label: 'Tên thể loại sách',
      type: EntityPropertyType.STRING,
      isShowInTable: true,
    },
    slug: {
      label: 'Slug thể loại sách',
      type: EntityPropertyType.STRING,
      isShowInTable: true,
    },
    level: {
      label: 'Cấp độ',
      type: EntityPropertyType.NUMBER,
      isShowInTable: true,
    },
    'parentCategory.name': {
      label: 'Tên thể loại cha',
      type: EntityPropertyType.STRING,
      isShowInTable: true,
    },
    status: {
      label: 'Trạng thái thể loại',
      type: EntityPropertyType.NUMBER,
      isShowInTable: true,
    },
    parentCategoryId: {
      label: 'Thể loại cha',
      type: EntityPropertyType.NUMBER,
      isNotAddToSortCriteria: true,
      isNotAddToFilterCriteria: true,
    },
  };

  static properties = CategoryConfigs._rawProperties as
    EntityPropertySchema<typeof CategoryConfigs._rawProperties & typeof PageConfigs.properties>;

  static initialCreateUpdateFormValues = {
    name: '',
    slug: '',
    parentCategoryId: null as string | null,
    status: '1',
    level: 1,
  };

  static createUpdateFormSchema = z.object({
    name: z.string().min(2, MessageUtils.min(CategoryConfigs.properties.name.label, 2)),
    slug: z.string(),
    parentCategoryId: z.string().nullable(),
    status: z.string(),
  });
}

export default CategoryConfigs;
