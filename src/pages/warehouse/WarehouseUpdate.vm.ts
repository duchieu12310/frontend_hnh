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
    () => FetchUtils.get<any>(InventoryConfigs.productInventoryHierarchyResourceUrl)
      .then(res => {
        if (Array.isArray(res)) return res;
        // Search deeply for categories if the response is an object
        const categories = res?.categories || res?.data?.categories || res?.data || res?.content || [];
        return Array.isArray(categories) ? categories : [];
      })
  );

  useGetByIdApi<WarehouseResponse>(WarehouseConfigs.resourceUrl, WarehouseConfigs.resourceKey, id,
    (warehouseResponse) => {
      setWarehouse(warehouseResponse);
      
      const categories = warehouseResponse.categories || [];
      const products = warehouseResponse.products || [];
      
      // RECURSIVE MAPPING: Handles both nested and flat category structures
      const buildTree = (allCats: CategoryResponse[], allProducts: ProductResponse[], parentId: number | null = null, level: number = 1): SelectionNode[] => {
        const nodes: SelectionNode[] = [];
        
        // Find categories at this level under this parent
        const matches = allCats.filter(c => c.level === level && (parentId === null || c.parentCategory?.id === parentId));
        
        matches.forEach(cat => {
          const node: SelectionNode = {
            id: Math.random().toString(36).substr(2, 9),
            type: ('L' + level) as any,
            value: String(cat.id),
            children: buildTree(allCats, allProducts, cat.id, level + 1)
          };

          // If this is Level 3, append products
          if (level === 3) {
            const catProducts = allProducts.filter(p => p.category?.id === cat.id);
            catProducts.forEach(p => {
              node.children.push({
                id: Math.random().toString(36).substr(2, 9),
                type: 'Product',
                value: String(p.id),
                children: []
              });
            });
          }
          
          nodes.push(node);
        });

        // FALLBACK: If level 1 finds nothing but the array isn't empty, check if it's already nested
        if (level === 1 && nodes.length === 0 && allCats.length > 0) {
           allCats.forEach(cat => {
              const node: SelectionNode = { id: Math.random().toString(36).substr(2, 9), type: 'L1', value: String(cat.id), children: [] };
              if (cat.children) {
                 cat.children.forEach(l2 => {
                    const l2Node: SelectionNode = { id: Math.random().toString(36).substr(2, 9), type: 'L2', value: String(l2.id), children: [] };
                    if (l2.children) {
                       l2.children.forEach(l3 => {
                          const l3Node: SelectionNode = { id: Math.random().toString(36).substr(2, 9), type: 'L3', value: String(l3.id), children: [] };
                          allProducts.filter(p => p.category?.id === l3.id).forEach(p => {
                             l3Node.children.push({ id: Math.random().toString(36).substr(2, 9), type: 'Product', value: String(p.id), children: [] });
                          });
                          l2Node.children.push(l3Node);
                       });
                    }
                    node.children.push(l2Node);
                 });
              }
              nodes.push(node);
           });
        }
        return nodes;
      };

      const reconstructedTree = buildTree(categories, products);

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
    }
  );

  useGetAllApi<DistrictResponse>(DistrictConfigs.resourceUrl, DistrictConfigs.resourceKey,
    { all: 1 },
    (districtListResponse) => {
      const selectList: SelectOption[] = districtListResponse.content.map((item) => ({
        value: String(item.id),
        label: item.name,
      }));
      setDistrictSelectList(selectList);
    }
  );

  useGetAllApi<WardResponse>(WardConfigs.resourceUrl, WardConfigs.resourceKey,
    { all: 1 },
    (wardListResponse) => {
      const selectList: SelectOption[] = wardListResponse.content.map((item) => ({
        value: String(item.id),
        label: item.name,
      }));
      setWardSelectList(selectList);
    }
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
    if (!parentId) {
      // Return ALL products
      const allL2s = globalHierarchy.flatMap(l1 => l1.children || []);
      const allL3s = allL2s.flatMap(l2 => l2.children || []);
      return allL3s.flatMap(l3 => l3.products || []).map(p => ({ value: String(p.productId), label: p.productName }));
    }
    for (const l1 of globalHierarchy) {
      for (const l2 of l1.children || []) {
        const l3 = l2.children?.find(c => String(c.id) === parentId);
        if (l3) return (l3.products || []).map(p => ({ value: String(p.productId), label: p.productName }));
      }
    }
    return [];
  };

  /**
   * RECURSIVE EXPANSION:
   * If a user selects "All" (null value), this function finds all products under that branch.
   */
  const expandAllProducts = (nodeId: string | null, type: SelectionNode['type'], map: Map<number, Set<number>>) => {
    const collectFromL3 = (l3: any) => {
      if (!l3.products) return;
      if (!map.has(l3.id)) map.set(l3.id, new Set());
      l3.products.forEach((p: any) => map.get(l3.id)!.add(p.productId));
    };

    const collectFromL2 = (l2: any) => {
      l2.children?.forEach(collectFromL3);
    };

    const collectFromL1 = (l1: any) => {
      l1.children?.forEach(collectFromL2);
    };

    if (type === 'L1') {
      const roots = nodeId ? globalHierarchy.filter(c => String(c.id) === nodeId) : globalHierarchy;
      roots.forEach(collectFromL1);
    } else if (type === 'L2') {
      for (const l1 of globalHierarchy) {
        const matches = nodeId ? l1.children?.filter(c => String(c.id) === nodeId) : l1.children;
        matches?.forEach(collectFromL2);
      }
    } else if (type === 'L3') {
      for (const l1 of globalHierarchy) {
        for (const l2 of l1.children || []) {
          const matches = nodeId ? l2.children?.filter(c => String(c.id) === nodeId) : l2.children;
          matches?.forEach(collectFromL3);
        }
      }
    }
  };

  const handleFormSubmit = form.onSubmit((formValues) => {
    if (!MiscUtils.isEquals(formValues, prevFormValues)) {
      setPrevFormValues(formValues);
      const categoriesMap = new Map<number, Set<number>>();

      const traverse = (node: SelectionNode, parentCategoryId: number | null) => {
        if (node.value === null) {
          // SELECT ALL LOGIC: Expand this branch recursively
          expandAllProducts(node.value, node.type, categoriesMap);
        } else {
          let currentCatId = parentCategoryId;
          if (node.type !== 'Product') {
            currentCatId = Number(node.value);
            if (!categoriesMap.has(currentCatId)) categoriesMap.set(currentCatId, new Set());
          } else {
            // It's a specific product
            if (currentCatId) {
              categoriesMap.get(currentCatId)!.add(Number(node.value));
            }
          }
          node.children.forEach(child => traverse(child, currentCatId));
        }
      };

      if (formValues.selectionTree.length === 0) {
        // DEFAULT ALL LOGIC: If no selection is made, allow ALL products and categories
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
