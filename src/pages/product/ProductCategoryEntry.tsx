import React, { useMemo, useState } from 'react';
import { Stack, Breadcrumbs, Anchor, Title, Text, Button, Box, Paper, Group, Loader, Badge, ThemeIcon, Divider, ActionIcon, Tooltip, Pagination } from '@mantine/core';
import { ArrowLeft, Plus, Eye, Folder, ChevronRight, LayoutGrid, Book, ExternalLink, Photo, InfoCircle, Tag as TagIcon } from 'tabler-icons-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import ManagerPath from 'constants/ManagerPath';
import CategoryConfigs from 'pages/category/CategoryConfigs';
import ProductConfigs from 'pages/product/ProductConfigs';
import CategoryExpandableContent from 'pages/category/components/CategoryExpandableContent';
import { ManageTable, ManageHeader, ManageHeaderTitle, ManageMain, ManagePagination, SearchPanel, FilterPanel, VariantTablePopover, StatusToggle } from 'components';
import useGetAllApi from 'hooks/use-get-all-api';
import useGetByIdApi from 'hooks/use-get-by-id-api';
import { CategoryResponse } from 'models/Category';
import { ProductResponse } from 'models/Product';
import useAppStore from 'stores/use-app-store';
import useResetManagePageState from 'hooks/use-reset-manage-page-state';
import useInitFilterPanelState from 'hooks/use-init-filter-panel-state';
import PageConfigs from 'pages/PageConfigs';
import { ListResponse } from 'utils/FetchUtils';
import FilterUtils from 'utils/FilterUtils';

const ProductCategoryEntry: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const parentId = searchParams.get('parentId');

    // State for Product Table specifically
    const [productPage, setProductPage] = useState(1);
    const [productPageSize] = useState(10);

    // Re-use manage page logic for the entry screen (Categories)
    useResetManagePageState('product-category-entry-' + (parentId || 'root'));
    useInitFilterPanelState(CategoryConfigs.properties);

    const {
        activePage,
        activePageSize,
        activeFilter,
        searchToken,
    } = useAppStore();

    // 1. Fetch current category details
    const { data: currentCategory, isLoading: isLoadingCurrent } = useGetByIdApi<CategoryResponse>(
        CategoryConfigs.resourceUrl,
        CategoryConfigs.resourceKey,
        Number(parentId),
        undefined,
        { enabled: !!parentId }
    );

    // 2. Fetch children categories
    const activeFilterRSQL = FilterUtils.convertToFilterRSQL(activeFilter);
    const categoryRequestParams = {
        page: activePage,
        size: activePageSize,
        sort: FilterUtils.convertToSortRSQL(activeFilter),
        filter: activeFilterRSQL 
            ? `${activeFilterRSQL};${parentId ? `parentCategory.id==${parentId}` : 'level==1'}` 
            : (parentId ? `parentCategory.id==${parentId}` : 'level==1'),
        search: searchToken,
    };

    const {
        isLoading: isLoadingList,
        data: listResponse = PageConfigs.initialListResponse as ListResponse<CategoryResponse>,
    } = useGetAllApi<CategoryResponse>(CategoryConfigs.resourceUrl, CategoryConfigs.resourceKey, categoryRequestParams);

    // 3. Fetch products in this category (with local pagination)
    const productRequestParams = {
        page: productPage,
        size: productPageSize,
        filter: `categories.id==${parentId}`,
        search: searchToken,
    };

    const {
        isLoading: isLoadingProducts,
        data: productListResponse = PageConfigs.initialListResponse as ListResponse<ProductResponse>,
    } = useGetAllApi<ProductResponse>(
        ProductConfigs.resourceUrl, 
        ProductConfigs.resourceKey, 
        productRequestParams,
        undefined,
        { enabled: !!parentId }
    );

    // 4. Breadcrumbs logic
    const breadcrumbs = useMemo(() => {
        const items = [
            { title: 'Quản lý đầu sách', href: ManagerPath.PRODUCT },
            { title: 'Nhập theo danh mục', href: ManagerPath.PRODUCT_CATEGORY_ENTRY }
        ];

        if (currentCategory) {
            if (currentCategory.parentCategory) {
                items.push({ 
                    title: currentCategory.parentCategory.name, 
                    href: `${ManagerPath.PRODUCT_CATEGORY_ENTRY}?parentId=${currentCategory.parentCategory.id}` 
                });
            }
            items.push({ title: currentCategory.name, href: '#' });
        }

        return items.map((item, index) => (
            <Anchor href={item.href} key={index} size="sm" weight={item.href === '#' ? 700 : 400} onClick={(e) => {
                if (item.href !== '#') {
                    e.preventDefault();
                    navigate(item.href);
                }
            }}>
                {item.title}
            </Anchor>
        ));
    }, [currentCategory, navigate]);

    const highlightText = (text: string, highlight: string) => {
        if (!highlight) return text;
        const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
        return parts.map((part, i) =>
            part.toLowerCase() === highlight.toLowerCase() ? (
                <mark key={i} className="bg-blue-200 dark:bg-blue-800">{part}</mark>
            ) : (
                part
            )
        );
    };

    // Category Table Properties
    const categoryShowedPropertiesFragment = (entity: CategoryResponse) => (
        <>
            <td>{entity.id}</td>
            <td className="text-sm font-semibold text-slate-700">
                {highlightText(entity.name, searchToken)}
            </td>
            <td className="text-sm text-slate-500 font-mono">
                {highlightText(entity.slug, searchToken)}
            </td>
            <td>
                <Badge variant="light" color="blue">Cấp {entity.level}</Badge>
            </td>
            <td className="text-slate-500 italic text-xs">
                {entity.parentCategory ? entity.parentCategory.name : 'Gốc'}
            </td>
            <td>
                <StatusToggle 
                    status={entity.status} 
                    entityId={entity.id} 
                    resourceUrl={CategoryConfigs.resourceUrl} 
                    resourceKey={CategoryConfigs.resourceKey} 
                />
            </td>
        </>
    );

    const categoryActionButtonsFragment = (entity: CategoryResponse) => (
        entity.level < 3 ? (
            <Link
                to={`${ManagerPath.PRODUCT_CATEGORY_ENTRY}?parentId=${entity.id}`}
                title="Vào cấp tiếp theo"
                className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors inline-block border border-blue-100 shadow-sm"
            >
                <Eye size={18} />
            </Link>
        ) : (
            <Tooltip label="Đã đạt cấp cuối cùng">
                <Text size="xs" color="dimmed">Cấp cuối</Text>
            </Tooltip>
        )
    );

    // Product Table Properties
    const productShowedPropertiesFragment = (entity: ProductResponse) => {
        const thumbnailImage = (entity.images || []).find((image) => image.isThumbnail);
        return (
            <>
                <td>{entity.id}</td>
                <td className="text-sm font-semibold text-slate-700">
                    {highlightText(entity.name, searchToken)}
                </td>
                <td className="text-sm font-mono text-slate-500">
                    {highlightText(entity.code, searchToken)}
                </td>
                <td>
                    <div className="flex justify-center">
                        <Box className="relative w-10 h-10 rounded-md overflow-hidden bg-slate-50 border border-slate-200 shadow-sm">
                            {thumbnailImage?.path ? (
                                <img src={thumbnailImage.path} alt={entity.name} className="w-full h-full object-cover" />
                            ) : (
                                <Photo size={20} className="text-slate-300" />
                            )}
                        </Box>
                    </div>
                </td>
                <td className="text-xs">
                    <div className="flex justify-center">
                        {(entity.categories?.length || 0) > 0 ? (
                            <Badge variant="light" color="blue" leftSection={<Folder size={10} strokeWidth={3} />}>
                                {entity.categories[0].name}
                            </Badge>
                        ) : (
                            <Text size="xs" color="dimmed">-</Text>
                        )}
                    </div>
                </td>
                <td>
                    <div className="flex flex-wrap gap-1 items-center justify-center">
                        {(entity.tags?.length || 0) > 0 ? (
                            entity.tags.slice(0, 2).map((tag, index) => (
                                <Badge key={index} variant="outline" size="xs" color="gray" leftSection={<TagIcon size={10} />}>
                                    {tag.name}
                                </Badge>
                            ))
                        ) : (
                            <Text size="xs" color="dimmed">-</Text>
                        )}
                    </div>
                </td>
                <td>
                    <VariantTablePopover variants={entity.variants} productProperties={entity.properties}/>
                </td>
                <td>
                    <StatusToggle 
                        status={entity.status} 
                        entityId={entity.id} 
                        resourceUrl={ProductConfigs.resourceUrl} 
                        resourceKey={ProductConfigs.resourceKey} 
                    />
                </td>
            </>
        );
    };

    const productActionButtonsFragment = (entity: ProductResponse) => (
        <Link
            to={`${ManagerPath.PRODUCT}/update/${entity.id}`}
            title="Chỉnh sửa chi tiết"
            className="p-1.5 text-blue-500 hover:bg-blue-50 rounded transition-colors inline-block"
        >
            <ExternalLink size={18} />
        </Link>
    );

    return (
        <Stack spacing="lg" p="md">
            {/* Context Header */}
            <Paper withBorder p="md" radius="lg" className="bg-white shadow-sm border-slate-200">
                <Stack spacing="md">
                    <Group position="apart" align="flex-start">
                        <Stack spacing={4}>
                            <Breadcrumbs separator={<ChevronRight size={14} className="text-slate-400" />}>{breadcrumbs}</Breadcrumbs>
                            <Group spacing="sm" mt={8}>
                                <ThemeIcon size="lg" radius="md" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }}>
                                    <LayoutGrid size={20} />
                                </ThemeIcon>
                                <div>
                                    <Title order={3} className="font-black text-slate-800 tracking-tight">
                                        {currentCategory ? `Thể loại: ${currentCategory.name}` : 'Danh mục gốc'}
                                    </Title>
                                    <Text size="xs" color="dimmed" weight={500}>
                                        {currentCategory 
                                            ? `Đang duyệt các thể loại con của bậc ${currentCategory.level}` 
                                            : 'Bắt đầu duyệt từ danh mục cấp 1'}
                                    </Text>
                                </div>
                            </Group>
                        </Stack>
                        
                        <Group>
                            {currentCategory && (
                                <Button
                                    component={Link}
                                    to={`${ManagerPath.PRODUCT}/create?categoryId=${currentCategory.id}`}
                                    size="md"
                                    color="teal"
                                    leftIcon={<Plus size={18} strokeWidth={3} />}
                                    radius="md"
                                    className="shadow-lg shadow-teal-100"
                                >
                                    Thêm sản phẩm cho "{currentCategory.name}"
                                </Button>
                            )}
                            <Button 
                                variant="default" 
                                leftIcon={<ArrowLeft size={16} />} 
                                onClick={() => {
                                    if (currentCategory?.parentCategory) {
                                        navigate(`${ManagerPath.PRODUCT_CATEGORY_ENTRY}?parentId=${currentCategory.parentCategory.id}`);
                                    } else {
                                        navigate(parentId ? ManagerPath.PRODUCT_CATEGORY_ENTRY : ManagerPath.PRODUCT);
                                    }
                                }}
                                radius="md"
                            >
                                {parentId ? 'Quay lại cấp cha' : 'Quay lại danh sách'}
                            </Button>
                        </Group>
                    </Group>
                </Stack>
            </Paper>

            <SearchPanel />
            <FilterPanel />

            {/* Category Table Section */}
            <Stack spacing={8}>
                <Group spacing="xs" px="xs">
                    <ThemeIcon color="orange" variant="light" size="sm" radius="md">
                        <Folder size={14} />
                    </ThemeIcon>
                    <Text weight={800} size="xs" className="uppercase tracking-widest text-slate-500">Danh mục con (Cấp tiếp theo)</Text>
                </Group>
                <ManageMain listResponse={listResponse} isLoading={isLoadingList || isLoadingCurrent}>
                    <ManageTable
                        listResponse={listResponse}
                        properties={CategoryConfigs.properties}
                        resourceUrl={CategoryConfigs.resourceUrl}
                        resourceKey={CategoryConfigs.resourceKey}
                        showedPropertiesFragment={categoryShowedPropertiesFragment}
                        entityDetailTableRowsFragment={() => <></>} 
                        actionButtonsFragment={categoryActionButtonsFragment}
                        renderExpandedRow={(entity) => <CategoryExpandableContent category={entity} readonly={true} />}
                        hideEdit={true}
                        hideDelete={true}
                        customViewEntityLink={(entity) => 
                            entity.level < 3 ? `${ManagerPath.PRODUCT_CATEGORY_ENTRY}?parentId=${entity.id}` : '#'
                        }
                    />
                </ManageMain>
                <ManagePagination listResponse={listResponse} />
            </Stack>

            {/* Products Table Section (Only if parentId exists) */}
            {parentId && (
                <Stack spacing={8} mt="xl">
                    <Divider variant="dashed" />
                    <Group position="apart" px="xs">
                        <Group spacing="xs">
                            <ThemeIcon color="blue" variant="light" size="sm" radius="md">
                                <Book size={14} />
                            </ThemeIcon>
                            <Text weight={800} size="xs" className="uppercase tracking-widest text-slate-500">Sản phẩm hiện có trong "{currentCategory?.name}"</Text>
                        </Group>
                        <Text size="xs" color="dimmed" weight={600}>Tổng cộng: {productListResponse.totalElements} sản phẩm</Text>
                    </Group>
                    
                    <Box className="relative">
                        {isLoadingProducts && (
                            <Box className="absolute inset-0 z-10 bg-white/50 backdrop-blur-[1px] flex items-center justify-center rounded-lg">
                                <Loader variant="dots" color="blue" />
                            </Box>
                        )}
                        
                        {productListResponse.content.length === 0 ? (
                            <Paper withBorder p="xl" radius="lg" className="bg-slate-50/50 border-dashed border-2">
                                <Stack align="center" spacing="xs">
                                    <InfoCircle size={32} className="text-slate-300" />
                                    <Text size="sm" color="dimmed">Chưa có sản phẩm nào cho danh mục này</Text>
                                    <Button 
                                        component={Link}
                                        to={`${ManagerPath.PRODUCT}/create?categoryId=${parentId}`}
                                        variant="light" 
                                        size="xs" 
                                        leftIcon={<Plus size={14} />}
                                    >
                                        Thêm ngay sản phẩm đầu tiên
                                    </Button>
                                </Stack>
                            </Paper>
                        ) : (
                            <Stack spacing="md">
                                <ManageTable
                                    listResponse={productListResponse}
                                    properties={ProductConfigs.properties}
                                    resourceUrl={ProductConfigs.resourceUrl}
                                    resourceKey={ProductConfigs.resourceKey}
                                    showedPropertiesFragment={productShowedPropertiesFragment}
                                    entityDetailTableRowsFragment={() => <></>}
                                    actionButtonsFragment={productActionButtonsFragment}
                                    hideEdit={true}
                                    customViewEntityLink={(entity) => `${ManagerPath.PRODUCT}/update/${entity.id}`}
                                />
                                <Group position="center" py="xs">
                                    <Pagination 
                                        page={productPage} 
                                        onChange={setProductPage} 
                                        total={Math.ceil(productListResponse.totalElements / productPageSize)} 
                                        size="sm"
                                        radius="md"
                                    />
                                </Group>
                            </Stack>
                        )}
                    </Box>
                </Stack>
            )}
        </Stack>
    );
};

export default ProductCategoryEntry;
