import { useForm, zodResolver } from '@mantine/form';
import WarehouseConfigs from 'pages/warehouse/WarehouseConfigs';
import { WarehouseRequest, WarehouseResponse } from 'models/Warehouse';
import useCreateApi from 'hooks/use-create-api';
import { useMemo, useState } from 'react';
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

function useWarehouseCreateViewModel() {
  const form = useForm({
    initialValues: WarehouseConfigs.initialCreateUpdateFormValues,
    validate: zodResolver(WarehouseConfigs.createUpdateFormSchema),
  });

  const [provinceSelectList, setProvinceSelectList] = useState<SelectOption[]>([]);
  const [districtSelectList, setDistrictSelectList] = useState<SelectOption[]>([]);
  const [wardSelectList, setWardSelectList] = useState<SelectOption[]>([]);
  
  // 1. Fetch Global Hierarchy for dropdown options
  const { data: globalHierarchy = [] as CategoryLevel1Node[] } = useQuery(
    [InventoryConfigs.productInventoryHierarchyResourceKey, 'global-hierarchy'],
    () => FetchUtils.get<any>(InventoryConfigs.productInventoryHierarchyResourceUrl, { warehouseId: 0 })
      .then(res => {
        if (Array.isArray(res)) return res;
        return res.categories || res.data || res.content || [];
      })
  );

  const createApi = useCreateApi<WarehouseRequest, WarehouseResponse>(WarehouseConfigs.resourceUrl);
  
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

  // Helper selectors from Hierarchy
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
   * RECURSIVE EXPANSION Logic
   */
  const expandAllProducts = (nodeId: string | null, type: SelectionNode['type'], map: Map<number, Set<number>>) => {
    const collectFromL3 = (l3: any) => {
      if (!l3.products) return;
      if (!map.has(l3.id)) map.set(l3.id, new Set());
      l3.products.forEach((p: any) => map.get(l3.id)!.add(p.productId));
    };

    const collectFromL2 = (l2: any) => l2.children?.forEach(collectFromL3);
    const collectFromL1 = (l1: any) => l1.children?.forEach(collectFromL2);

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
    const categoriesMap = new Map<number, Set<number>>();

    const traverse = (node: SelectionNode, parentCategoryId: number | null) => {
      if (node.value === null) {
        // Recursive expansion for "Select All"
        expandAllProducts(node.value, node.type, categoriesMap);
      } else {
        let currentCatId = parentCategoryId;
        if (node.type !== 'Product') {
          currentCatId = Number(node.value);
          if (!categoriesMap.has(currentCatId)) categoriesMap.set(currentCatId, new Set());
        } else {
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
    createApi.mutate(requestBody);
  });

  const statusSelectList: SelectOption[] = [
    { value: '1', label: 'Có hiệu lực' },
    { value: '2', label: 'Vô hiệu lực' },
  ];

  return {
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

export default useWarehouseCreateViewModel;
