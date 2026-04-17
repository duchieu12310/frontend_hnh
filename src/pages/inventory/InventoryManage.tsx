import React, { useMemo, useState } from 'react';
import { 
  Paper, 
  Group, 
  Text, 
  Stack, 
  Box, 
  Grid, 
  ActionIcon, 
  Center, 
  Tooltip,
  Table,
  TextInput,
  Divider,
  MultiSelect,
  Pagination,
  Badge as MantineBadge,
  Loader
} from '@mantine/core';
import { 
  Refresh, 
  RotateClockwise, 
  Package, 
  LayoutColumns,
  Search,
  Database,
  BoxModel2,
  BuildingWarehouse,
  ArrowUpRight,
  Filter
} from 'tabler-icons-react';
import { useQuery } from 'react-query';
import FetchUtils from 'utils/FetchUtils';
import ResourceURL from 'constants/ResourceURL';
import NotifyUtils from 'utils/NotifyUtils';
import { CategoryLevel1Node, FlattenedInventoryRow } from 'models/InventoryHierarchy';
import { ListResponse, ErrorMessage } from 'utils/FetchUtils';
import InventoryConfigs from 'pages/inventory/InventoryConfigs';
import { WarehouseResponse } from 'models/Warehouse';
import InventoryTableRow from './components/InventoryTableRow';

const InventoryManage: React.FC = () => {
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter States
  const [selectedL1Ids, setSelectedL1Ids] = useState<string[]>([]);
  const [selectedL2Ids, setSelectedL2Ids] = useState<string[]>([]);
  const [selectedL3Ids, setSelectedL3Ids] = useState<string[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  
  // Pagination State
  const [activePage, setActivePage] = useState(1);
  const pageSize = 20;

  // 1. Fetch Warehouses
  const { data: warehousesResponse = { content: [] } as ListResponse<WarehouseResponse>, isLoading: isWarehousesLoading } = useQuery(
    [ResourceURL.WAREHOUSE, 'get-all-warehouses'],
    () => FetchUtils.getAllWithToken<WarehouseResponse>(ResourceURL.WAREHOUSE, { all: 1 })
  );

  const warehouses = warehousesResponse.content;
  useMemo(() => {
    if (!selectedWarehouseId && warehouses.length > 0) {
      setSelectedWarehouseId(warehouses[0].id);
    }
  }, [warehouses, selectedWarehouseId]);

  // 2. Fetch hierarchical inventory
  const {
    isLoading: isHierarchyLoading,
    data: categories = [] as CategoryLevel1Node[],
    refetch,
    isFetching: isHierarchyFetching
  } = useQuery<CategoryLevel1Node[], ErrorMessage>(
    [
      InventoryConfigs.productInventoryHierarchyResourceKey, 
      'getHierarchy', 
      selectedWarehouseId,
      selectedL1Ids,
      selectedL2Ids,
      selectedL3Ids,
      selectedProductIds
    ],
    () => FetchUtils.getWithToken<any>(
      InventoryConfigs.productInventoryHierarchyResourceUrl,
      { 
        warehouseId: selectedWarehouseId,
        categoryL1Ids: selectedL1Ids.length > 0 ? selectedL1Ids.join(',') : undefined,
        categoryL2Ids: selectedL2Ids.length > 0 ? selectedL2Ids.join(',') : undefined,
        categoryL3Ids: selectedL3Ids.length > 0 ? selectedL3Ids.join(',') : undefined,
        productIds: selectedProductIds.length > 0 ? selectedProductIds.join(',') : undefined,
      }
    ).then((res) => {
      if (Array.isArray(res)) return res;
      if (res && res.categories) return res.categories;
      if (res && res.data) return res.data;
      return [];
    }),
    {
      enabled: !!selectedWarehouseId,
      onError: (error) => NotifyUtils.simpleFailed(`Lỗi: Không lấy được dữ liệu kho.`),
      staleTime: 60 * 60 * 1000, // 60 minutes
      cacheTime: 60 * 60 * 1000, // 60 minutes
      refetchOnWindowFocus: false,
    }
  );

  // Flatten logic with recursive traversal
  const flattenedRows = useMemo(() => {
    const rows: FlattenedInventoryRow[] = [];
    
    const processCategory = (cat: any, l1: string, l2: string, l3: string, level: number) => {
      let curL1 = l1, curL2 = l2, curL3 = l3;
      if (level === 1) curL1 = cat.name;
      else if (level === 2) curL2 = cat.name;
      else if (level === 3) curL3 = cat.name;

      // Add products found at this level
      cat.products?.forEach((product: any) => {
        product.variants?.forEach((variant: any) => {
          rows.push({
            l1Name: curL1,
            l2Name: curL2,
            l3Name: curL3,
            productId: product.productId,
            productName: product.productName,
            productCode: product.productCode,
            storageLocationId: product.storageLocationId,
            aisle: product.aisle,
            shelf: product.shelf,
            bin: product.bin,
            variantId: variant.variantId,
            sku: variant.sku,
            properties: variant.properties,
            quantityInLocation: variant.quantityInLocation,
            totalVariantQuantity: variant.totalVariantQuantity
          });
        });
      });

      // Traverse children
      cat.children?.forEach((child: any) => processCategory(child, curL1, curL2, curL3, level + 1));
    };

    categories.forEach(l1Node => processCategory(l1Node, '', '', '', 1));
    return rows;
  }, [categories]);

  // Extract filter options from the current hierarchy
  const l1Options = useMemo(() => 
    categories.map(c => ({ value: String(c.id), label: c.name })), 
  [categories]);

  const l2Options = useMemo(() => {
    const list: { value: string, label: string }[] = [];
    categories.forEach(l1 => {
      l1.children?.forEach(l2 => {
        list.push({ value: String(l2.id), label: l2.name });
        // Although the original only took children of L1, we should also handle deeper levels if any
      });
    });
    return list;
  }, [categories]);

  const l3Options = useMemo(() => {
    const list: { value: string, label: string }[] = [];
    categories.forEach(l1 => {
      l1.children?.forEach(l2 => {
        l2.children?.forEach(l3 => {
          list.push({ value: String(l3.id), label: l3.name });
        });
      });
    });
    return list;
  }, [categories]);

  const productOptions = useMemo(() => {
    const list: { value: string, label: string }[] = [];
    const collectProducts = (cat: any) => {
      cat.products?.forEach((p: any) => {
        list.push({ value: String(p.productId), label: p.productName });
      });
      cat.children?.forEach(collectProducts);
    };
    categories.forEach(collectProducts);
    // Remove duplicates if any
    const unique = Array.from(new Map(list.map(item => [item.value, item])).values());
    return unique;
  }, [categories]);

  // Filtered rows for Client-side Search
  const filteredRows = useMemo(() => {
    if (!searchTerm) return flattenedRows;
    const s = searchTerm.toLowerCase();
    return flattenedRows.filter(r => 
      r.productName.toLowerCase().includes(s) || 
      r.sku.toLowerCase().includes(s) ||
      r.productCode.toLowerCase().includes(s) ||
      `${r.aisle}-${r.shelf}-${r.bin}`.toLowerCase().includes(s)
    );
  }, [flattenedRows, searchTerm]);

  // Stats calculation
  const stats = useMemo(() => {
    const uniqueProducts = new Set(flattenedRows.map(r => r.productId));
    const totalInventory = flattenedRows.reduce((sum, r) => sum + (r.quantityInLocation || 0), 0);
    return {
      productCount: uniqueProducts.size,
      variantCount: flattenedRows.length,
      totalStock: totalInventory
    };
  }, [flattenedRows]);

  const resetFilters = () => {
    setSelectedL1Ids([]);
    setSelectedL2Ids([]);
    setSelectedL3Ids([]);
    setSelectedProductIds([]);
    setActivePage(1);
    setSearchTerm('');
    refetch();
  };

  // Reset page when filters or search change
  React.useEffect(() => {
      setActivePage(1);
  }, [searchTerm, selectedL1Ids, selectedL2Ids, selectedL3Ids, selectedProductIds, selectedWarehouseId]);

  const totalPages = Math.ceil(filteredRows.length / pageSize);
  const paginatedRows = filteredRows.slice((activePage - 1) * pageSize, activePage * pageSize);

  return (
    <Stack spacing="xl" p="md" className="bg-gray-50/50 min-h-screen">
      {/* Dashboard Top Header */}
      <Paper radius="xl" p="xl" withBorder className="shadow-sm border-gray-200/50 bg-white/80 backdrop-blur-xl">
        <Grid gutter={40} align="center">
          <Grid.Col md={4}>
            <Group spacing="lg">
              <Box className="p-4 bg-blue-600 text-white rounded-[2rem] shadow-xl shadow-blue-200 rotate-3">
                <BuildingWarehouse size={28} strokeWidth={2.5} />
              </Box>
              <Stack spacing={0}>
                <Text weight={900} size="xl" className="tracking-tight text-gray-900 font-bold">Quản lý Kho hàng</Text>
                <Text size="xs" color="dimmed" weight={600} transform="uppercase" sx={{ letterSpacing: 1.5 }}>
                  Hệ thống phân cấp đa tầng (5 Levels)
                </Text>
              </Stack>
            </Group>
          </Grid.Col>

          <Grid.Col md={8}>
            <Group position="right" spacing="xl">
              <Box className="flex gap-12 bg-gray-50/50 px-10 py-4 rounded-[2rem] border border-gray-100">
                <Stack spacing={0}>
                  <Text size="xs" color="dimmed" weight={700} transform="uppercase">Sản phẩm</Text>
                  <Group spacing={6}>
                    <Text size="xl" weight={900} color="blue">{stats.productCount}</Text>
                    <ArrowUpRight size={14} className="text-blue-500 mb-1" />
                  </Group>
                </Stack>
                <Divider orientation="vertical" />
                <Stack spacing={0}>
                  <Text size="xs" color="dimmed" weight={700} transform="uppercase">Phân loại</Text>
                  <Text size="xl" weight={900} color="blue">{stats.variantCount}</Text>
                </Stack>
                <Divider orientation="vertical" />
                <Stack spacing={0}>
                  <Text size="xs" color="dimmed" weight={700} transform="uppercase">Tổng tồn</Text>
                  <Group spacing={6}>
                    <Text size="xl" weight={900} color="indigo">{stats.totalStock}</Text>
                    <Box className="px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded text-[9px] font-black uppercase">Qty</Box>
                  </Group>
                </Stack>
              </Box>
              
              <Group spacing="sm">
                <ActionIcon 
                  variant="transparent" 
                  color="gray" 
                  onClick={resetFilters}
                  title="Đặt lại bộ lọc"
                  size="xl"
                  radius="lg"
                >
                  <RotateClockwise size={20} />
                </ActionIcon>
                <ActionIcon 
                   variant="filled" 
                   color="blue" 
                   size={56} 
                   radius="xl" 
                   loading={isHierarchyFetching}
                   onClick={() => refetch()}
                   className="shadow-lg shadow-blue-100"
                >
                  <Refresh size={24} />
                </ActionIcon>
              </Group>
            </Group>
          </Grid.Col>
        </Grid>
      </Paper>

      {/* Control Bar: Warehouse Pills + Filters */}
      <Stack spacing="lg">
        <Group position="apart" px="md">
          <div className="flex gap-2 p-1.5 bg-white border border-gray-100 rounded-full shadow-sm">
            {warehouses.map((w) => (
              <button
                key={w.id}
                onClick={() => setSelectedWarehouseId(w.id)}
                className={`px-8 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all ${
                  selectedWarehouseId === w.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 translate-y-[-1px]' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }`}
              >
                {w.name}
              </button>
            ))}
          </div>

          <TextInput 
            placeholder="Tìm sản phẩm, SKU hoặc vị trí..."
            size="md"
            radius="xl"
            icon={<Search size={18} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: 400 }}
            styles={{ input: { border: '1px solid #eee', fontWeight: 600, paddingLeft: 45 } }}
          />
        </Group>

        {/* Multi-Level Filters Card */}
        <Paper radius="xl" p="xl" withBorder className="bg-white/50 border-gray-100 shadow-sm">
            <Grid gutter="xl">
                <Grid.Col md={3} sm={6}>
                    <MultiSelect
                        label={<Text size="xs" weight={900} color="blue" transform="uppercase" mb={4} ml={4}>Danh mục Cấp 1</Text>}
                        placeholder="Chọn danh mục chính..."
                        data={l1Options}
                        value={selectedL1Ids}
                        onChange={setSelectedL1Ids}
                        searchable
                        radius="lg"
                        size="sm"
                        clearable
                        styles={{ label: { marginBottom: 8 } }}
                    />
                </Grid.Col>
                <Grid.Col md={3} sm={6}>
                    <MultiSelect
                        label={<Text size="xs" weight={900} color="indigo" transform="uppercase" mb={4} ml={4}>Danh mục Cấp 2</Text>}
                        placeholder="Chọn danh mục phụ..."
                        data={l2Options}
                        value={selectedL2Ids}
                        onChange={setSelectedL2Ids}
                        searchable
                        radius="lg"
                        size="sm"
                        clearable
                    />
                </Grid.Col>
                <Grid.Col md={3} sm={6}>
                    <MultiSelect
                        label={<Text size="xs" weight={900} color="teal" transform="uppercase" mb={4} ml={4}>Danh mục Cấp 3</Text>}
                        placeholder="Chọn phân loại..."
                        data={l3Options}
                        value={selectedL3Ids}
                        onChange={setSelectedL3Ids}
                        searchable
                        radius="lg"
                        size="sm"
                        clearable
                    />
                </Grid.Col>
                <Grid.Col md={3} sm={6}>
                    <MultiSelect
                        label={<Text size="xs" weight={900} color="orange" transform="uppercase" mb={4} ml={4}>Sản phẩm cụ thể</Text>}
                        placeholder="Chọn sản phẩm..."
                        data={productOptions}
                        value={selectedProductIds}
                        onChange={setSelectedProductIds}
                        searchable
                        radius="lg"
                        size="sm"
                        clearable
                    />
                </Grid.Col>
            </Grid>
        </Paper>
      </Stack>

      {/* Main Data Table */}
      <Paper radius="xl" withBorder className="overflow-hidden shadow-sm border-gray-200 bg-white flex flex-col">
        <div className="relative overflow-x-auto" style={{ maxHeight: 'calc(100vh - 400px)' }}>
          {isHierarchyLoading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
              <Stack align="center" spacing="xs">
                <Loader size="lg" variant="dots" />
                <Text size="sm" weight={700} color="dimmed">Đang tải dữ liệu...</Text>
              </Stack>
            </div>
          )}

          <Table 
            horizontalSpacing="md" 
            verticalSpacing="xs" 
            className="w-full border-collapse"
            sx={{ 
                minWidth: 1200,
                'thead': {
                    position: 'sticky',
                    top: 0,
                    zIndex: 20,
                    backgroundColor: '#1e293b',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }
            }}
          >
            <thead>
              <tr>
                <th className="text-[11px] font-bold text-white uppercase tracking-wider py-4 border-r border-slate-700 w-32">Danh mục 1</th>
                <th className="text-[11px] font-bold text-white uppercase tracking-wider py-4 border-r border-slate-700 w-32">Danh mục 2</th>
                <th className="text-[11px] font-bold text-white uppercase tracking-wider py-4 border-r border-slate-700 w-32">Danh mục 3</th>
                <th className="text-[11px] font-bold text-white uppercase tracking-wider py-4 border-r border-slate-700">Sản phẩm</th>
                <th className="text-[11px] font-bold text-white uppercase tracking-wider py-4 border-r border-slate-700">Biến thể</th>
                <th className="text-[11px] font-bold text-white uppercase tracking-wider py-4 border-r border-slate-700 text-center w-28">Tồn gốc</th>
                <th className="text-[11px] font-bold text-white uppercase tracking-wider py-4 border-r border-slate-700 text-center w-40">Điều chỉnh (+/-)</th>
                <th className="text-[11px] font-bold text-white uppercase tracking-wider py-4 border-r border-slate-700 text-center w-32">Tổng hiện tại</th>
                <th className="text-[11px] font-bold text-white uppercase tracking-wider py-4 text-center w-32">Toàn hệ thống</th>
                <th className="w-12 border-l border-slate-700"></th>
              </tr>
            </thead>
            <tbody>
              {paginatedRows.length > 0 ? (
                paginatedRows.map((row, index) => {
                  const prevRow = index > 0 ? paginatedRows[index - 1] : null;
                  const isFirstL1 = !prevRow || row.l1Name !== prevRow.l1Name;
                  const isFirstL2 = isFirstL1 || row.l2Name !== prevRow.l2Name;
                  const isFirstL3 = isFirstL2 || row.l3Name !== prevRow.l3Name;
                  const isFirstProduct = isFirstL3 || row.productId !== prevRow.productId;

                  return (
                    <InventoryTableRow 
                      key={`${row.storageLocationId}-${row.variantId}`}
                      row={row} 
                      warehouseId={selectedWarehouseId!}
                      isFirstL1={isFirstL1}
                      isFirstL2={isFirstL2}
                      isFirstL3={isFirstL3}
                      isFirstProduct={isFirstProduct}
                    />
                  );
                })
              ) : (
                <tr>
                  <td colSpan={10} className="py-20 text-center">
                    <Center>
                      <Stack align="center" spacing="lg">
                        <Box className="p-8 bg-gray-50 rounded-[2.5rem] text-gray-200 border border-gray-100">
                          <BoxModel2 size={64} strokeWidth={1} />
                        </Box>
                        <Stack align="center" spacing={4}>
                          <Text weight={900} color="gray" size="xl">Kho hàng trống</Text>
                          <Text size="sm" color="dimmed" weight={500}>Không có sản phẩm nào khớp với bộ lọc của bạn.</Text>
                        </Stack>
                      </Stack>
                    </Center>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Paper>
    </Stack>
  );
}

export default InventoryManage;
