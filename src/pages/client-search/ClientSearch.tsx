import React, { useState } from 'react';
import {
  Card,
  Checkbox,
  Container,
  Grid,
  Group,
  Pagination,
  Radio,
  RadioGroup,
  Skeleton,
  Stack,
  Text,
  Title,
  useMantineTheme
} from '@mantine/core';
import { Link, useLocation } from 'react-router-dom';
import { AlertTriangle, ArrowsDownUp, ChartCandle, Marquee } from 'tabler-icons-react';
import { ClientProductCard } from 'components';
import ApplicationConstants from 'constants/ApplicationConstants';
import { useQuery } from 'react-query';
import FetchUtils, { ErrorMessage, ListResponse } from 'utils/FetchUtils';
import { ClientListedProductResponse } from 'types';
import ResourceURL from 'constants/ResourceURL';
import NotifyUtils from 'utils/NotifyUtils';
import useTitle from 'hooks/use-title';

function ClientSearch() {
  const theme = useMantineTheme();

  const queryParams = new URLSearchParams(useLocation().search);
  const searchQuery = queryParams.get('q') || queryParams.get('brand');
  useTitle(searchQuery ? `Kết quả tìm kiếm cho "${searchQuery}"` : 'Tất cả sản phẩm');

  const [activePage, setActivePage] = useState(1);
  const [activeSort, setActiveSort] = useState<string | null>(null);
  const [activeSaleable, setActiveSaleable] = useState(false);

  const requestParams = {
    page: activePage,
    size: ApplicationConstants.DEFAULT_CLIENT_SEARCH_PAGE_SIZE,
    filter: null,
    sort: activeSort,
    search: searchQuery,
    saleable: activeSaleable,
  };

  const {
    data: searchResults,
    isLoading: isLoadingSearch,
    isError: isErrorSearch,
  } = useQuery<ListResponse<ClientListedProductResponse>, ErrorMessage>(
    ['client-api', 'products', 'shop', activePage, activeSort, activeSaleable, searchQuery],
    () => FetchUtils.get(ResourceURL.CLIENT_PRODUCT_SHOP, {
      page: activePage,
      size: ApplicationConstants.DEFAULT_CLIENT_SEARCH_PAGE_SIZE,
      sort: activeSort || '',
      saleable: activeSaleable,
      search: searchQuery || '',
    }),
    {
      onError: () => NotifyUtils.simpleFailed('Lấy dữ liệu không thành công'),
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  // Parallel query to retrieve matching categories and brands/authors when searching
  const { data: globalSearchResults } = useQuery<any, ErrorMessage>(
    ['client-api', 'search', 'global-metadata', searchQuery],
    () => FetchUtils.get(ResourceURL.CLIENT_SEARCH, { query: searchQuery || '' }),
    {
      enabled: !!searchQuery,
      refetchOnWindowFocus: false,
    }
  );

  let resultFragment;

  if (isLoadingSearch) {
    resultFragment = (
      <Stack>
        {Array(5).fill(0).map((_, index) => (
          <Skeleton key={index} height={100} radius="md"/>
        ))}
      </Stack>
    );
  }

  if (isErrorSearch) {
    resultFragment = (
      <Stack my={theme.spacing.xl} sx={{ alignItems: 'center', color: theme.colors.pink[6] }}>
        <AlertTriangle size={125} strokeWidth={1}/>
        <Text size="xl" weight={500}>Đã có lỗi xảy ra</Text>
      </Stack>
    );
  }

  const products = searchResults?.content || [];
  const totalPages = searchResults?.totalPages || 1;
  const totalElements = searchResults?.totalElements || 0;

  const categories = globalSearchResults?.categories || [];
  const brands = globalSearchResults?.brands || [];

  if (searchResults && products.length === 0) {
    resultFragment = (
      <Stack my={theme.spacing.xl} sx={{ alignItems: 'center', color: theme.colors.blue[6] }}>
        <Marquee size={125} strokeWidth={1}/>
        <Text size="xl" weight={500}>Không có sản phẩm</Text>
      </Stack>
    );
  }

  if (products.length > 0 || categories.length > 0 || brands.length > 0) {
    resultFragment = (
      <Stack spacing="xl">
        {/* Categories Section */}
        {categories.length > 0 && (
          <Card radius="md" p="md" withBorder>
            <Text weight={700} size="sm" color="dimmed" mb="xs" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
              Thể loại phù hợp
            </Text>
            <Group spacing="xs">
              {categories.map((cat: any) => (
                <Card 
                  key={cat.categorySlug} 
                  component={Link} 
                  to={`/category/${cat.categorySlug}`}
                  p="xs" 
                  radius="md" 
                  withBorder 
                  sx={{ 
                    cursor: 'pointer', 
                    '&:hover': { backgroundColor: theme.colors.blue[0], borderColor: theme.colors.blue[4] } 
                  }}
                >
                  <Text size="sm" weight={500}>{cat.categoryName}</Text>
                </Card>
              ))}
            </Group>
          </Card>
        )}

        {/* Brands/Authors Section */}
        {brands.length > 0 && (
          <Card radius="md" p="md" withBorder>
            <Text weight={700} size="sm" color="dimmed" mb="xs" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
              Tác giả & Nhà xuất bản
            </Text>
            <Group spacing="xs">
              {brands.map((brand: any) => (
                <Card 
                  key={brand.brandId} 
                  component={Link} 
                  to={`/search?brand=${brand.brandName}`}
                  p="xs" 
                  radius="md" 
                  withBorder 
                  sx={{ 
                    cursor: 'pointer', 
                    '&:hover': { backgroundColor: theme.colors.blue[0], borderColor: theme.colors.blue[4] } 
                  }}
                >
                  <Text size="sm" weight={500}>{brand.brandName}</Text>
                </Card>
              ))}
            </Group>
          </Card>
        )}

        {/* Products Section */}
        {products.length > 0 && (
          <div>
            <Text weight={700} size="sm" color="dimmed" mb="xs" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
              Sách tìm thấy ({totalElements})
            </Text>
            <Grid>
              {products.map((product: any, index: number) => (
                <Grid.Col key={index} span={6} sm={4} md={3}>
                  <ClientProductCard 
                    product={{
                      ...product,
                      id: product.productId,
                      price: product.productPriceRange[0]
                    } as any} 
                    search={searchQuery || ''}
                  />
                </Grid.Col>
              ))}
            </Grid>
            
            {totalPages > 1 && (
              <Group position="center" mt="xl">
                <Pagination
                  page={activePage}
                  onChange={setActivePage}
                  total={totalPages}
                />
              </Group>
            )}
          </div>
        )}
      </Stack>
    );
  }

  return (
    <main>
      <Container size="xl">
        <Stack spacing={theme.spacing.xl * 1.5}>
          <Card radius="md" shadow="sm" p="lg">
            <Title order={2}>
              {searchQuery ? (
                <>Kết quả tìm kiếm cho &quot;<Text component="span" color="yellow" inherit>{searchQuery}</Text>&quot;</>
              ) : (
                'Tất cả sản phẩm'
              )}
            </Title>
          </Card>

          <Stack spacing="lg">
            <Group position="apart">
              <Group spacing="xs">
                <ArrowsDownUp size={20}/>
                <Text weight={500} mr={theme.spacing.xs}>Sắp xếp theo</Text>
                <RadioGroup
                  value={activeSort || ''}
                  onChange={(value) => {
                    setActiveSort((value as '' | 'lowest-price' | 'highest-price') || null);
                    setActivePage(1);
                  }}
                >
                  <Radio value="" label="Mới nhất"/>
                  <Radio value="lowest-price" label="Giá thấp → cao"/>
                  <Radio value="highest-price" label="Giá cao → thấp"/>
                </RadioGroup>
              </Group>
              <Text>{totalElements} sản phẩm</Text>
            </Group>

            <Group spacing="xs">
              <ChartCandle size={20}/>
              <Text weight={500} mr={theme.spacing.xs}>Lọc theo</Text>
              <Checkbox
                label="Chỉ tính còn hàng"
                checked={activeSaleable}
                onChange={(event) => {
                  setActiveSaleable(event.currentTarget.checked);
                  setActivePage(1);
                }}
              />
            </Group>

            {resultFragment}
          </Stack>
        </Stack>
      </Container>
    </main>
  );
}

export default ClientSearch;
