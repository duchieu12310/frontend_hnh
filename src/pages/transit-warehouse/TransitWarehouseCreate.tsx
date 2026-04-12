import React from 'react';
import {
  TextInput,
  Select,
  Button,
  Group,
  Stack,
  ActionIcon,
  Text,
  Paper,
  Divider,
  Badge,
  Accordion,
  MultiSelect,
} from '@mantine/core';
import { Plus, Trash, Home, MapPin, Bookmark } from 'tabler-icons-react';
import { CreateUpdateTitle, DefaultPropertyPanel } from 'components';
import TransitWarehouseConfigs from 'pages/transit-warehouse/TransitWarehouseConfigs';
import useTransitWarehouseCreateViewModel from 'pages/transit-warehouse/TransitWarehouseCreate.vm';

function TransitWarehouseCreate() {
  const {
    form,
    handleFormSubmit,
    provinceSelectList,
    districtSelectList,
    wardSelectList,
    parentWarehouseSelectList,
    categorySelectList,
    productSelectList,
    createApi,
  } = useTransitWarehouseCreateViewModel();

  const addCategory = (categoryId: string) => {
    const category = categorySelectList.find(c => c.value === categoryId);
    if (category && !form.values.categories.some((c: any) => String(c.id) === categoryId)) {
        const newCategories = [
            ...form.values.categories,
            {
              id: Number(categoryId),
              name: category.label,
              products: [],
            }
        ];
        form.setFieldValue('categories', newCategories);
    }
  };

  const removeCategory = (index: number) => {
    const newCategories = form.values.categories.filter((_: any, i: number) => i !== index);
    form.setFieldValue('categories', newCategories);
  };

  const handleProductChange = (categoryIndex: number, productIds: string[]) => {
    const updatedProducts = productIds.map(id => {
      const product = productSelectList.find(p => p.value === id);
      return {
        id: Number(id),
        name: product?.label || '',
        code: (product as any)?.code || '',
      };
    });
    const newCategories = [...form.values.categories];
    newCategories[categoryIndex].products = updatedProducts;
    form.setFieldValue('categories', newCategories);
  };

  return (
    <Stack spacing="xl" pb={50}>
      <CreateUpdateTitle
        managerPath={TransitWarehouseConfigs.managerPath}
        title={TransitWarehouseConfigs.createTitle}
      />

      <DefaultPropertyPanel />

      <form onSubmit={handleFormSubmit}>
        <Stack spacing="xl">
          {/* Basic Info */}
          <Paper withBorder p="md" radius="md">
            <Group position="apart" mb="md">
              <Group spacing="xs">
                <Home size={20} color="blue" />
                <Text weight={600}>Thông tin trạm trung chuyển</Text>
              </Group>
            </Group>
            <Stack spacing="sm">
              <TextInput
                label="Tên trạm trung chuyển"
                placeholder="Nhập tên trạm"
                {...form.getInputProps('name')}
                required
              />
              <Select
                label="Kho tổng quản lý"
                placeholder="Chọn kho tổng"
                data={parentWarehouseSelectList}
                {...form.getInputProps('parentWarehouseId')}
                searchable
                required
              />
            </Stack>
          </Paper>

          {/* Address */}
          <Paper withBorder p="md" radius="md">
            <Group position="apart" mb="md">
              <Group spacing="xs">
                <MapPin size={20} color="red" />
                <Text weight={600}>Địa chỉ bưu cục</Text>
              </Group>
            </Group>
            <Stack spacing="sm">
              <TextInput
                  label="Số nhà, tên đường"
                  placeholder="Ví dụ: 123 Xuân Thủy"
                  {...form.getInputProps('address.line')}
              />
              <Group grow spacing="sm">
                <Select
                  label="Tỉnh / Thành phố"
                  placeholder="Chọn tỉnh thành"
                  data={provinceSelectList}
                  {...form.getInputProps('address.provinceId')}
                  searchable
                />
                <Select
                  label="Quận / Huyện"
                  placeholder="Chọn quận huyện"
                  data={districtSelectList}
                  {...form.getInputProps('address.districtId')}
                  searchable
                  disabled={!form.values['address.provinceId']}
                />
                <Select
                  label="Phường / Xã"
                  placeholder="Chọn phường xã"
                  data={wardSelectList}
                  {...form.getInputProps('address.wardId')}
                  searchable
                  disabled={!form.values['address.districtId']}
                />
              </Group>
            </Stack>
          </Paper>

          {/* Categories and Products */}
          <Paper withBorder p="md" radius="md">
            <Group position="apart" mb="md">
              <Group spacing="xs">
                <Bookmark size={20} color="green" />
                <Text weight={600}>Phân loại hàng hóa xử lý</Text>
              </Group>
              <Select
                placeholder="Thêm danh mục"
                data={categorySelectList}
                onChange={(val) => val && addCategory(val)}
                value={null}
                size="xs"
                searchable
                icon={<Plus size={14} />}
                style={{ width: 200 }}
              />
            </Group>

            {form.values.categories.length === 0 ? (
              <Text align="center" color="dimmed" py="xl">
                Chưa có danh mục nào được gán cho trạm này.
              </Text>
            ) : (
              <Accordion>
                {form.values.categories.map((category: any, index: number) => (
                  <Accordion.Item 
                    key={category.id} 
                    label={
                        <Group position="apart" style={{ width: '100%' }}>
                            <Group spacing="sm">
                                <Bookmark size={16} color="green" />
                                <Text size="sm" weight={600}>{category.name}</Text>
                                <Badge size="xs" variant="outline">{`${category.products.length} sản phẩm`}</Badge>
                            </Group>
                        </Group>
                    }
                  >
                    <Stack spacing="md" p="md">
                      <MultiSelect
                        label="Gán sản phẩm thuộc danh mục này"
                        placeholder="Chọn các loại sách bưu cục này sẽ xử lý"
                        data={productSelectList}
                        value={category.products.map((p: any) => String(p.id))}
                        onChange={(vals) => handleProductChange(index, vals)}
                        searchable
                        nothingFound="Không tìm thấy sách nào"
                      />
                      <Divider variant="dashed" />
                      <Group position="right">
                         <Button 
                            variant="light" 
                            color="red" 
                            size="xs"
                            onClick={() => removeCategory(index)}
                         >
                            Gỡ danh mục này
                         </Button>
                      </Group>
                    </Stack>
                  </Accordion.Item>
                ))}
              </Accordion>
            )}
          </Paper>

          <Paper withBorder p="md" radius="md">
            <Group position="right">
              <Button variant="default" onClick={() => form.reset()}>Mặc định</Button>
              <Button type="submit" loading={createApi.isLoading}>Thêm trạm trung chuyển</Button>
            </Group>
          </Paper>
        </Stack>
      </form>
    </Stack>
  );
}

export default TransitWarehouseCreate;
