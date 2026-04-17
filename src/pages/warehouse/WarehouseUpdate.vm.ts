import { useMemo, useState } from 'react';
import { useForm, zodResolver } from '@mantine/form';
import WarehouseConfigs from 'pages/warehouse/WarehouseConfigs';
import { WarehouseRequest, WarehouseResponse } from 'models/Warehouse';
import useUpdateApi from 'hooks/use-update-api';
import useGetByIdApi from 'hooks/use-get-by-id-api';
import MiscUtils from 'utils/MiscUtils';
import { SelectOption } from 'types';
import useGetAllApi from 'hooks/use-get-all-api';
import { ProvinceResponse } from 'models/Province';
import ProvinceConfigs from 'pages/province/ProvinceConfigs';
import { DistrictResponse } from 'models/District';
import DistrictConfigs from 'pages/district/DistrictConfigs';
import { WardResponse } from 'models/Ward';
import WardConfigs from 'pages/ward/WardConfigs';
import { SelectionNode } from './components/WarehouseSelectionTree';
import { useQuery } from 'react-query';
import FetchUtils from 'utils/FetchUtils';
import InventoryConfigs from 'pages/inventory/InventoryConfigs';
import { CategoryLevel1Node } from 'models/InventoryHierarchy';
import { CategoryResponse } from 'models/Category';
import { ProductResponse } from 'models/Product';

function useWarehouseUpdateViewModel(id: number) {
  const form = useForm({
    initialValues: WarehouseConfigs.initialCreateUpdateFormValues,
    validate: zodResolver(WarehouseConfigs.createUpdateFormSchema),
  });

  const [warehouse, setWarehouse] = useState<WarehouseResponse>();
  const [prevFormValues, setPrevFormValues] = useState<typeof form.values>();
  const [provinceSelectList, setProvinceSelectList] = useState<SelectOption[]>([]);
  const [districtSelectList, setDistrictSelectList] = useState<SelectOption[]>([]);
  const [wardSelectList, setWardSelectList] = useState<SelectOption[]>([]);

  // 1. Fetch the Global Hierarchy for selection options
  // We omit the warehouseId parameter to request the full system catalog from the backend
  const { data: globalHierarchy = [] as CategoryLevel1Node[] } = useQuery(
    [InventoryConfigs.productInventoryHierarchyResourceKey, 'global-hierarchy'],
    () => FetchUtils.getWithToken<any>(InventoryConfigs.productInventoryHierarchyResourceUrl)
      .then(res => {
        if (Array.isArray(res)) return res;
        // Search deeply for categories if the response is an object
        const categories = res?.categories || res?.data?.categories || res?.data || res?.content || [];
        return Array.isArray(categories) ? categories : [];
      })
  );

  const { refetch } = useGetByIdApi<WarehouseResponse>(WarehouseConfigs.resourceUrl, WarehouseConfigs.resourceKey, id,
    (warehouseResponse) => {
      setWarehouse(warehouseResponse);
      
      const categories = warehouseResponse.categories || [];
      const products = warehouseResponse.products || [];
      
      // RECURSIVE RECONSTRUCTION: Build tree based on manually selected products and their categories
      const buildTree = (savedProducts: ProductResponse[]): SelectionNode[] => {
        const l1Map = new Map<string, SelectionNode>();

        savedProducts.forEach(product => {
          // Each product has categories (usually 1 but many-to-many is supported)
          product.categories.forEach(leafCat => {
            // 1. Find the full ancestry of this leaf category in globalHierarchy
            let l1: any = null, l2: any = null, l3: any = null;

            for (const root of globalHierarchy) {
              if (root.id === leafCat.id) { l1 = root; break; }
              for (const child2 of root.children || []) {
                if (child2.id === leafCat.id) { l1 = root; l2 = child2; break; }
                for (const child3 of (child2 as any).children || []) {
                  if (child3.id === leafCat.id) { l1 = root; l2 = child2; l3 = child3; break; }
                }
                if (l1) break;
              }
              if (l1) break;
            }

            if (!l1) return; // Not found in current global catalog

            // 2. Build/Merge into L1
            const l1Key = String(l1.id);
            if (!l1Map.has(l1Key)) {
              l1Map.set(l1Key, { id: Math.random().toString(36).substr(2, 9), type: 'L1', value: l1Key, children: [] });
            }
            const l1Node = l1Map.get(l1Key)!;

            let parentForProduct: SelectionNode = l1Node;

            // 3. Merge L2 if exists
            if (l2) {
              const l2Key = String(l2.id);
              let l2Node = l1Node.children.find(c => c.value === l2Key);
              if (!l2Node) {
                l2Node = { id: Math.random().toString(36).substr(2, 9), type: 'L2', value: l2Key, children: [] };
                l1Node.children.push(l2Node);
              }
              parentForProduct = l2Node;

              // 4. Merge L3 if exists
              if (l3) {
                const l3Key = String(l3.id);
                let l3Node = l2Node.children.find(c => c.value === l3Key);
                if (!l3Node) {
                  l3Node = { id: Math.random().toString(36).substr(2, 9), type: 'L3', value: l3Key, children: [] };
                  l2Node.children.push(l3Node);
                }
                parentForProduct = l3Node;
              }
            }

            // 5. Add/Update Product node
            let prodNode = parentForProduct.children.find(c => c.type === 'Product');
            if (!prodNode) {
              prodNode = { id: Math.random().toString(36).substr(2, 9), type: 'Product', value: [], children: [] };
              parentForProduct.children.push(prodNode);
            }
            const currentProductIds = prodNode.value as string[];
            const prodIdStr = String(product.id);
            if (!currentProductIds.includes(prodIdStr)) {
               currentProductIds.push(prodIdStr);
            }
          });
        });

        return Array.from(l1Map.values());
      };

      const reconstructedTree = buildTree(products);

      const formValues: typeof form.values = {
        code: warehouseResponse.code,
        name: warehouseResponse.name,
        'address.line': warehouseResponse.address?.line || '',
        'address.provinceId': warehouseResponse.address?.province ? String(warehouseResponse.address.province.id) : null,
        'address.districtId': warehouseResponse.address?.district ? String(warehouseResponse.address.district.id) : null,
        'address.wardId': warehouseResponse.address?.ward ? String(warehouseResponse.address.ward.id) : null,
        status: String(warehouseResponse.status),
        selectionTree: reconstructedTree
      };
      form.setValues(formValues);
      setPrevFormValues(formValues);
    }
  );

  const updateApi = useUpdateApi<WarehouseRequest, WarehouseResponse>(WarehouseConfigs.resourceUrl, WarehouseConfigs.resourceKey, id);

  useGetAllApi<ProvinceResponse>(ProvinceConfigs.resourceUrl, ProvinceConfigs.resourceKey,
    { all: 1 },
    (provinceListResponse) => {
      const selectList: SelectOption[] = provinceListResponse.content.map((item) => ({
        value: String(item.id),
        label: item.name,
      }));
      setProvinceSelectList(selectList);
    },
    { refetchOnWindowFocus: false }
  );

  useGetAllApi<DistrictResponse>(DistrictConfigs.resourceUrl, DistrictConfigs.resourceKey,
    { all: 1 },
    (districtListResponse) => {
      const selectList: SelectOption[] = districtListResponse.content.map((item) => ({
        value: String(item.id),
        label: item.name,
      }));
      setDistrictSelectList(selectList);
    },
    { refetchOnWindowFocus: false }
  );

  useGetAllApi<WardResponse>(WardConfigs.resourceUrl, WardConfigs.resourceKey,
    { all: 1 },
    (wardListResponse) => {
      const selectList: SelectOption[] = wardListResponse.content.map((item) => ({
        value: String(item.id),
        label: item.name,
      }));
      setWardSelectList(selectList);
    },
    { refetchOnWindowFocus: false }
  );

  // Helper selectors from Global Hierarchy
  const l1Options = useMemo(() => 
    globalHierarchy.map(c => ({ value: String(c.id), label: c.name })), 
  [globalHierarchy]);

  const l2Options = (parentId: string | null) => {
    if (!parentId) {
      // Return ALL L2 categories across all L1s
      return globalHierarchy.flatMap(l1 => l1.children || []).map(c => ({ value: String(c.id), label: c.name }));
    }
    const l1 = globalHierarchy.find(c => String(c.id) === parentId);
    return (l1?.children || []).map(c => ({ value: String(c.id), label: c.name }));
  };

  const l3Options = (parentId: string | null) => {
    if (!parentId) {
      // Return ALL L3 categories
      const allL2s = globalHierarchy.flatMap(l1 => l1.children || []);
      return allL2s.flatMap(l2 => l2.children || []).map(c => ({ value: String(c.id), label: c.name }));
    }
    for (const l1 of globalHierarchy) {
      const l2 = l1.children?.find(c => String(c.id) === parentId);
      if (l2) return (l2.children || []).map(c => ({ value: String(c.id), label: c.name }));
    }
    return [];
  };

  const productOptions = (parentId: string | null) => {
    // Recursive search for the category and collect products from all its subcategories
    const collectProducts = (cat: any): any[] => {
      let products: any[] = cat.products || [];
      if (cat.children) {
        cat.children.forEach((child: any) => {
          products = [...products, ...collectProducts(child)];
        });
      }
      return products;
    };

    if (!parentId) {
      // Return ALL products from ALL categories
      let allProducts: any[] = [];
      globalHierarchy.forEach(l1 => {
          allProducts = [...allProducts, ...collectProducts(l1)];
      });
      return allProducts.map(p => ({ value: String(p.productId), label: p.productName }));
    }

    // Find cat at L1
    const l1 = globalHierarchy.find(c => String(c.id) === parentId);
    if (l1) return collectProducts(l1).map(p => ({ value: String(p.productId), label: p.productName }));

    // Find cat at L2
    for (const l1Node of globalHierarchy) {
      const l2 = l1Node.children?.find(c => String(c.id) === parentId);
      if (l2) return collectProducts(l2).map(p => ({ value: String(p.productId), label: p.productName }));
    }

    // Find cat at L3
    for (const l1Node of globalHierarchy) {
      for (const l2Node of l1Node.children || []) {
        const l3 = l2Node.children?.find(c => String(c.id) === parentId);
        if (l3) return collectProducts(l3).map(p => ({ value: String(p.productId), label: p.productName }));
      }
    }

    return [];
  };


  /**
   * RECURSIVE EXPANSION Logic: Collects all products from a category down to its leaves
   */
  const expandAllProducts = (nodeId: string | null, type: SelectionNode['type'], map: Map<number, Set<number>>) => {
    const processCategory = (cat: any) => {
        if (!cat) return;
        if (cat.products && cat.products.length > 0) {
            if (!map.has(cat.id)) map.set(cat.id, new Set());
            cat.products.forEach((p: any) => map.get(cat.id)!.add(p.productId));
        }
        if (cat.children) {
            cat.children.forEach(processCategory);
        }
    }

    if (!nodeId) {
        globalHierarchy.forEach(processCategory);
        return;
    }

    if (type === 'L1') {
        const target = globalHierarchy.find(c => String(c.id) === nodeId);
        if (target) processCategory(target);
    } else if (type === 'L2') {
        for (const l1 of globalHierarchy) {
            const target = l1.children?.find(c => String(c.id) === nodeId);
            if (target) { processCategory(target); break; }
        }
    } else if (type === 'L3') {
        for (const l1 of globalHierarchy) {
            for (const l2 of l1.children || []) {
                const target = l2.children?.find(c => String(c.id) === nodeId);
                if (target) { processCategory(target); return; }
            }
        }
    }
  };

  const handleFormSubmit = form.onSubmit((formValues) => {
    if (!MiscUtils.isEquals(formValues, prevFormValues)) {
      setPrevFormValues(formValues);
      const categoriesMap = new Map<number, Set<number>>();

      const traverse = (node: SelectionNode, parentCategoryId: number | null) => {
        const currentCatId = node.value ? Number(node.value as string) : parentCategoryId;

        if (node.type === 'Product') {
           if (parentCategoryId && Array.isArray(node.value) && node.value.length > 0) {
              if (!categoriesMap.has(parentCategoryId)) categoriesMap.set(parentCategoryId, new Set());
              node.value.forEach(id => categoriesMap.get(parentCategoryId)!.add(Number(id)));
           }
        } else {
           if (node.children.length === 0 && currentCatId) {
              // AUTO-EXPAND: If no sub-nodes are added, treat it as "Select All" for this category
              expandAllProducts(String(currentCatId), node.type, categoriesMap);
           } else {
              node.children.forEach(child => traverse(child, currentCatId));
           }
        }
      };

      if (formValues.selectionTree.length === 0) {
        // DEFAULT ALL: If no tree is built, allow EVERYTHING
        expandAllProducts(null, 'L1', categoriesMap);
      } else {
        formValues.selectionTree.forEach(root => traverse(root, null));
      }

      const requestBody: WarehouseRequest = {
        code: formValues.code,
        name: formValues.name,
        address: formValues['address.line'] || formValues['address.provinceId'] ? {
          line: formValues['address.line'] || null,
          province: formValues['address.provinceId'] ? { id: Number(formValues['address.provinceId']) } : null,
          district: formValues['address.districtId'] ? { id: Number(formValues['address.districtId']) } : null,
          ward: formValues['address.wardId'] ? { id: Number(formValues['address.wardId']) } : null,
        } : null,
        status: Number(formValues.status),
        categories: Array.from(categoriesMap.entries()).map(([id, productIds]) => ({
          id,
          productIds: productIds.size > 0 ? Array.from(productIds) : undefined
        })),
      };
      updateApi.mutate(requestBody);
    }
  });

  const statusSelectList: SelectOption[] = [
    { value: '1', label: 'Có hiệu lực' },
    { value: '2', label: 'Vô hiệu lực' },
  ];

  return {
    warehouse,
    form,
    handleFormSubmit,
    provinceSelectList,
    districtSelectList,
    wardSelectList,
    treeMetadata: {
      l1Options,
      l2Options,
      l3Options,
      productOptions
    },
    statusSelectList,
  };
}

export default useWarehouseUpdateViewModel;
