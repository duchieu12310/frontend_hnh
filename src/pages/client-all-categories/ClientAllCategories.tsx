import React from 'react';
import {
  Anchor,
  Breadcrumbs,
  Card,
  Container,
  Divider,
  Grid,
  Group,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
  Title,
  useMantineTheme
} from '@mantine/core';
import PageConfigs from 'pages/PageConfigs';
import { Link } from 'react-router-dom';
import useTitle from 'hooks/use-title';
import { useQuery } from 'react-query';
import FetchUtils, { ErrorMessage } from 'utils/FetchUtils';
import { ClientCategoryResponse, CollectionWrapper } from 'types';
import ResourceURL from 'constants/ResourceURL';
import NotifyUtils from 'utils/NotifyUtils';
import { AlertTriangle } from 'tabler-icons-react';

function ClientAllCategories() {
  useTitle();

  const theme = useMantineTheme();

  const {
    data: categoryResponses,
    isLoading: isLoadingCategoryResponses,
    isError: isErrorCategoryResponses,
  } = useQuery<CollectionWrapper<ClientCategoryResponse>, ErrorMessage>(
    ['client-api', 'categories', 'getAllCategories'],
    () => FetchUtils.get(ResourceURL.CLIENT_CATEGORY),
    {
      onError: () => NotifyUtils.simpleFailed('Lấy dữ liệu không thành công'),
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  let resultFragment;

  if (isLoadingCategoryResponses) {
    resultFragment = (
      <Stack>
        {Array(5).fill(0).map((_, index) => (
          <Skeleton key={index} height={50} radius="md"/>
        ))}
      </Stack>
    );
  }

  if (isErrorCategoryResponses) {
    resultFragment = (
      <Stack my={theme.spacing.xl} sx={{ alignItems: 'center', color: theme.colors.pink[6] }}>
        <AlertTriangle size={125} strokeWidth={1}/>
        <Text size="xl" weight={500}>Đã có lỗi xảy ra</Text>
      </Stack>
    );
  }

  if (categoryResponses) {
    resultFragment = (
      <Stack spacing={40}>
        {categoryResponses.content.map((firstCategory, index) => {
          const FirstCategoryIcon = PageConfigs.categorySlugIconMap[firstCategory.categorySlug] || AlertTriangle;

          return (
            <div key={index} className="flex flex-col gap-6">
              {/* Level 1: Standard Group Header */}
              <div className="flex flex-col gap-2">
                <Group spacing="md">
                  <div className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300">
                    <FirstCategoryIcon size={24} strokeWidth={2} />
                  </div>
                  <Anchor
                    component={Link}
                    to={'/category/' + firstCategory.categorySlug}
                    className="text-[20px] font-bold text-gray-900 dark:text-gray-100 hover:text-emerald-600 no-underline transition-colors"
                  >
                    {firstCategory.categoryName}
                  </Anchor>
                </Group>
                <Divider size="sm" color="gray" className="opacity-20" />
              </div>

              {/* Level 2 & 3: Structured Grid */}
              <Grid gutter={24}>
                {firstCategory.categoryChildren.map((secondCategory, secondIndex) => (
                  <Grid.Col span={12} sm={6} md={4} lg={3} key={secondIndex}>
                    {/* Consistent spacing between L2 groups provided by Grid gutter or manual mb if needed */}
                    <div className="flex flex-col mb-2">
                      {/* Level 2: Sub-header */}
                      <Anchor
                        component={Link}
                        to={'/category/' + secondCategory.categorySlug}
                        className="text-[16px] font-semibold text-black dark:text-white hover:text-emerald-500 no-underline transition-colors mb-2 block"
                      >
                        {secondCategory.categoryName}
                      </Anchor>

                      {/* Level 3: Vertical List */}
                      <div className="flex flex-col gap-[8px] pl-1">
                        {secondCategory.categoryChildren.map((thirdCategory, thirdIndex) => (
                          <Group key={thirdIndex} spacing={6} noWrap className="group/item">
                            <span className="text-gray-300 dark:text-gray-600 font-medium">↳</span>
                            <Anchor
                              component={Link}
                              to={'/category/' + thirdCategory.categorySlug}
                              className="text-[14px] font-normal text-gray-600 dark:text-gray-400 hover:text-emerald-600 no-underline transition-colors"
                            >
                              {thirdCategory.categoryName}
                            </Anchor>
                          </Group>
                        ))}
                        {secondCategory.categoryChildren.length === 0 && (
                          <Text size="xs" color="dimmed" sx={{ fontStyle: 'italic' }} pl={20}>
                            Không có danh mục con
                          </Text>
                        )}
                      </div>
                    </div>
                  </Grid.Col>
                ))}
              </Grid>
            </div>
          );
        })}
      </Stack>
    );
  }

  return (
    <main>
      <Container size="xl">
        <Stack spacing={theme.spacing.xl * 2}>
          {/* TODO: Refactor */}
          <Card radius="md" shadow="sm" p="lg">
            <Stack>
              <Breadcrumbs>
                <Anchor component={Link} to="/">
                  Trang chủ
                </Anchor>
                <Text color="dimmed">
                  Tất cả danh mục sản phẩm
                </Text>
              </Breadcrumbs>
              <Title order={2}>Tất cả danh mục sản phẩm</Title>
            </Stack>
          </Card>

          {resultFragment}
        </Stack>
      </Container>
    </main>
  );
}

export default ClientAllCategories;
