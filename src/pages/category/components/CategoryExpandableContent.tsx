import React from 'react';
import { Box, Group, Text, Button, Paper, Stack, Badge, Loader, SimpleGrid, ThemeIcon, ActionIcon } from '@mantine/core';
import { Plus, Book, FolderPlus, ListDetails, ExternalLink, Photo, ChevronRight } from 'tabler-icons-react';
import { Link } from 'react-router-dom';
import { CategoryResponse } from 'models/Category';
import useGetAllApi from 'hooks/use-get-all-api';
import ProductConfigs from 'pages/product/ProductConfigs';
import { ProductResponse } from 'models/Product';
import ManagerPath from 'constants/ManagerPath';
import { ListResponse } from 'utils/FetchUtils';

interface CategoryExpandableContentProps {
  category: CategoryResponse;
  readonly?: boolean;
}

const CategoryExpandableContent: React.FC<CategoryExpandableContentProps> = ({ category, readonly }) => {
  // Fetch products under this category
  const { data: productListResponse, isLoading: isLoadingProducts } = useGetAllApi<ProductResponse>(
    ProductConfigs.resourceUrl,
    ProductConfigs.resourceKey,
    { filter: `categories.id==${category.id}`, size: 10 }
  );

  const products = productListResponse?.content || [];
  const children = category.children || [];

  return (
    <Box p="xs">
      <SimpleGrid cols={2} breakpoints={[{ maxWidth: 'md', cols: 1 }]} spacing="xl">
        
        {/* RIGHT Column: Hierarchy & Children (Switched to L1 priority feel) */}
        <Stack spacing="md">
           <Group position="apart">
            <Group spacing="xs" className="flex-1">
              <ThemeIcon variant="light" color="orange" size="md">
                <FolderPlus size={18} />
              </ThemeIcon>
              <Text weight={700} size="sm" className="uppercase tracking-tight">Thể loại con của "{category.name}"</Text>
            </Group>
             {category.level < 3 && !readonly && (
                <Button
                  component={Link}
                  to={`${ManagerPath.CATEGORY}/create?parentCategoryId=${category.id}`}
                  size="xs"
                  variant="light"
                  color="orange"
                  leftIcon={<Plus size={14} />}
                >
                  Thêm cấp con
                </Button>
             )}
          </Group>

          <Paper withBorder radius="md" p="xs" className="bg-white/50">
            {children.length === 0 ? (
               <Box py="xl" className="text-center italic text-slate-400">
                <Text size="xs">Chưa có thể loại con nào</Text>
              </Box>
            ) : (
              <Stack spacing={8}>
                {children.map(child => (
                   <Paper key={child.id} withBorder p={8} radius="md" className="hover:border-blue-300 transition-colors bg-white">
                      <Group position="apart">
                        <Group spacing="xs">
                           <ChevronRight size={14} className="text-slate-400" />
                           <Text size="sm" weight={600}>{child.name}</Text>
                           <Badge size="xs" color="gray" variant="outline">Bậc {child.level}</Badge>
                        </Group>
                        <Group spacing={4}>
                           <Button
                              component={Link}
                              to={`${ManagerPath.PRODUCT}/create?categoryId=${child.id}`}
                              size="xs"
                              variant="subtle"
                              color="teal"
                              leftIcon={<Plus size={14} />}
                              compact
                            >
                              Thêm sản phẩm
                            </Button>
                            {!readonly && (
                                <ActionIcon
                                  component={Link}
                                  to={`${ManagerPath.CATEGORY}/update/${child.id}`}
                                  size="sm"
                                  color="blue"
                                  variant="transparent"
                                >
                                  <ExternalLink size={14} />
                                </ActionIcon>
                            )}
                        </Group>
                      </Group>
                   </Paper>
                ))}
              </Stack>
            )}
          </Paper>

          <Paper withBorder radius="md" p="md" className="bg-slate-900 border-slate-800 text-white">
               <Stack spacing={4}>
                  <Text size="xs" weight={800} color="slate.4" transform="uppercase">Thông tin quản lý</Text>
                  <Group spacing="xl" mt="xs">
                     <Stack spacing={2}>
                        <Text size="xs" color="slate.5">Slug:</Text>
                        <Text weight={700} size="xs" className="font-mono text-teal-400">/{category.slug}</Text>
                     </Stack>
                     <Stack spacing={2}>
                        <Text size="xs" color="slate.5">Cấp độ:</Text>
                        <Text weight={700} size="xs" className="text-blue-400">Bậc {category.level}</Text>
                     </Stack>
                  </Group>
               </Stack>
          </Paper>
        </Stack>

        {/* LEFT Column: Products */}
        <Stack spacing="md">
          <Group position="apart">
            <Group spacing="xs">
              <ThemeIcon variant="light" color="blue" size="md">
                <Book size={18} />
              </ThemeIcon>
              <Text weight={700} size="sm" className="uppercase tracking-tight">Sản phẩm đầu sách</Text>
            </Group>
            <Button
              component={Link}
              to={`${ManagerPath.PRODUCT}/create?categoryId=${category.id}`}
              size="xs"
              variant="outline"
              color="blue"
              leftIcon={<Plus size={14} />}
            >
              Thêm sản phẩm cho cấp này
            </Button>
          </Group>

          <Paper withBorder radius="md" p="xs" className="bg-slate-50/50">
            {isLoadingProducts ? (
              <Group position="center" py="xl">
                <Loader variant="dots" size="sm" />
                <Text size="xs" color="dimmed">Đang tải danh sách sách...</Text>
              </Group>
            ) : products.length === 0 ? (
              <Box py="xl" className="text-center italic text-slate-400">
                <Text size="xs">Chưa có sản phẩm nào cho danh mục này</Text>
              </Box>
            ) : (
              <Stack spacing={8}>
                {products.map(product => (
                  <Group key={product.id} position="apart" noWrap className="p-2 bg-white rounded-lg transition-colors border border-slate-100 hover:border-blue-200 shadow-sm">
                    <Group spacing="sm">
                       <Box className="w-10 h-10 rounded-md overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200">
                          {product.images.find(img => img.isThumbnail)?.path ? (
                            <img src={product.images.find(img => img.isThumbnail)?.path} className="w-full h-full object-cover" />
                          ) : (
                            <Photo size={16} className="text-slate-300" />
                          )}
                       </Box>
                       <Stack spacing={0}>
                          <Text weight={600} size="xs" className="line-clamp-1">{product.name}</Text>
                          <Text size="xs" color="dimmed" className="font-mono uppercase text-[10px]">{product.code}</Text>
                       </Stack>
                    </Group>
                    <ActionIcon
                      component={Link}
                      to={`${ManagerPath.PRODUCT}/update/${product.id}`}
                      color="blue"
                      size="sm"
                      variant="light"
                    >
                      <ExternalLink size={14} />
                    </ActionIcon>
                  </Group>
                ))}
                {productListResponse && productListResponse.totalElements > 10 && (
                  <Button
                    component={Link}
                    to={`${ManagerPath.PRODUCT}?categoryId=${category.id}`}
                    variant="subtle"
                    size="xs"
                    fullWidth
                    mt="xs"
                  >
                    Xem tất cả {productListResponse.totalElements} sản phẩm
                  </Button>
                )}
              </Stack>
            )}
          </Paper>
        </Stack>

      </SimpleGrid>
    </Box>
  );
};

export default CategoryExpandableContent;
