import React from 'react';
import { Button, Divider, Grid, Group, NumberInput, Paper, Select, Stack, Text, TextInput } from '@mantine/core';
import { useParams } from 'react-router-dom';
import { CreateUpdateTitle, DefaultPropertyPanel, EntityFinder } from 'components';
import PromotionConfigs from 'pages/promotion/PromotionConfigs';
import usePromotionUpdateViewModel from 'pages/promotion/PromotionUpdate.vm';
import { ProductResponse } from 'models/Product';
import ProductConfigs from 'pages/product/ProductConfigs';
import { DatePicker } from '@mantine/dates';
import DateUtils from 'utils/DateUtils';

function PromotionUpdate() {
  const { id } = useParams();
  const {
    promotion,
    form,
    handleFormSubmit,
    statusSelectList,
    products, setProducts,
    handleAddProductFinder,
    handleDeleteProductFinder,
  } = usePromotionUpdateViewModel(Number(id));

  if (!promotion) {
    return null;
  }

  const resetForm = () => {
    form.reset();
    setProducts([]);
  };

  return (
    <Stack pb={50}>
      <CreateUpdateTitle
        managerPath={PromotionConfigs.managerPath}
        title={PromotionConfigs.updateTitle}
      />

      <DefaultPropertyPanel
        id={promotion.id}
        createdAt={promotion.createdAt}
        updatedAt={promotion.updatedAt}
        createdBy="1"
        updatedBy="1"
      />

      <Grid>
        <Grid.Col xs={8}>
          <Paper shadow="xs" p="sm">
            <EntityFinder<ProductResponse>
              selections={products}
              onClickItem={handleAddProductFinder}
              onDeleteItem={handleDeleteProductFinder}
              options={{
                resourceUrl: ProductConfigs.resourceUrl,
                resourceKey: ProductConfigs.resourceKey,
                resultListSize: 5,
                resultFragment: productResponse => (
                  <Stack spacing={2}>
                    <Text size="sm">{productResponse.name}</Text>
                    <Group spacing="xs">
                      <Text size="xs" color="dimmed">Mã: {productResponse.code}</Text>
                      <Text size="xs" color="dimmed">Danh mục: {productResponse.category?.name}</Text>
                    </Group>
                  </Stack>
                ),
                inputLabel: 'Thêm sản phẩm',
                inputPlaceholder: 'Nhập tên sản phẩm',
                selectedFragment: productResponse => (
                  <Stack spacing={2}>
                    <Text size="sm">{productResponse.name}</Text>
                    <Group spacing="xs">
                      <Text size="xs" color="dimmed">Mã: {productResponse.code}</Text>
                      <Text size="xs" color="dimmed">Danh mục: {productResponse.category?.name}</Text>
                    </Group>
                  </Stack>
                ),
                deleteButtonTitle: 'Xóa sản phẩm này',
              }}
              errorSearchInput={form.errors.productIds}
            />
          </Paper>
        </Grid.Col>

        <Grid.Col xs={4}>
          <form onSubmit={handleFormSubmit}>
            <Paper shadow="xs">
              <Stack spacing={0}>
                <Grid p="sm">
                  <Grid.Col>
                    <TextInput
                      required
                      label={PromotionConfigs.properties.name.label}
                      {...form.getInputProps('name')}
                    />
                  </Grid.Col>
                  <Grid.Col>
                    <DatePicker
                      required
                      locale="vi"
                      inputFormat="DD/MM/YYYY"
                      labelFormat="MM/YYYY"
                      clearable={false}
                      minDate={DateUtils.today()}
                      label="Từ ngày"
                      placeholder="Chọn hoặc nhập ngày bắt đầu (DD/MM/YYYY)"
                      value={form.values.range[0]}
                      onChange={value => {
                        const newRange: [Date | null, Date | null] = [value, form.values.range[1]];
                        form.setFieldValue('range', newRange);
                      }}
                      error={form.errors['range.0']}
                      allowFreeInput
                    />
                  </Grid.Col>
                  <Grid.Col>
                    <DatePicker
                      required
                      locale="vi"
                      inputFormat="DD/MM/YYYY"
                      labelFormat="MM/YYYY"
                      clearable={false}
                      minDate={form.values.range[0] || DateUtils.today()}
                      label="Đến ngày"
                      placeholder="Chọn hoặc nhập ngày kết thúc (DD/MM/YYYY)"
                      value={form.values.range[1]}
                      onChange={value => {
                        const newRange: [Date | null, Date | null] = [form.values.range[0], value];
                        form.setFieldValue('range', newRange);
                      }}
                      error={form.errors['range.1']}
                      allowFreeInput
                    />
                  </Grid.Col>
                  <Grid.Col>
                    <NumberInput
                      required
                      label={PromotionConfigs.properties.percent.label}
                      min={1}
                      max={100}
                      {...form.getInputProps('percent')}
                    />
                  </Grid.Col>
                  <Grid.Col>
                    <Select
                      required
                      label={PromotionConfigs.properties.status.label}
                      placeholder="--"
                      data={statusSelectList}
                      {...form.getInputProps('status')}
                    />
                  </Grid.Col>
                </Grid>

                <Divider mt="xs"/>

                <Group position="apart" p="sm">
                  <Button variant="default" onClick={resetForm}>Mặc định</Button>
                  <Button type="submit">Cập nhật</Button>
                </Group>
              </Stack>
            </Paper>
          </form>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}

export default PromotionUpdate;
