import { Configs, TitleLink } from 'types';
import WarehouseConfigs from 'pages/warehouse/WarehouseConfigs';
import ResourceURL from 'constants/ResourceURL';

class InventoryConfigs extends Configs {
  static productInventoryResourceUrl = ResourceURL.PRODUCT_INVENTORY;
  static productInventoryResourceKey = 'product-inventories';
  static productInventoryHierarchyResourceUrl = ResourceURL.PRODUCT_INVENTORY_HIERARCHY;
  static productInventoryHierarchyResourceKey = 'product-inventories-hierarchy';
  static manageTitle = 'Theo dõi kho hàng';
  static manageTitleLinks: TitleLink[] = WarehouseConfigs.manageTitleLinks;
}

export default InventoryConfigs;
