import React from 'react';
import {
  TextInput,
  Select,
  Button,
  Group,
  Stack,
  ActionIcon,
  NumberInput,
  Text,
  Paper,
  Divider,
  Badge,
} from '@mantine/core';
import { Trash, LayoutGrid, Package, MapPin } from 'tabler-icons-react';
import { CreateUpdateTitle, DefaultPropertyPanel } from 'components';
import StorageLocationConfigs from 'pages/storage-location/StorageLocationConfigs';
import useStorageLocationCreateViewModel from 'pages/storage-location/StorageLocationCreate.vm';

function StorageLocationCreate() {
  const {
    form,
    handleFormSubmit,
    warehouseSelectList,
    categorySelectList,
    productSelectList,
    variantSelectList,
    createApi,
  } = useStorageLocationCreateViewModel();

  const addVariant = (variantId: string) => {
    const variant = variantSelectList.find(v => v.value === variantId);
    if (variant && !form.values.variants.some((v: any) => String(v.id) === variantId)) {
        const newVariants = [...form.values.variants, {
            id: Number(variantId),
            sku: variant.label,
            quantity: 1,
        }];
        form.setFieldValue('variants', newVariants);
    }
  };

  const removeVariant = (index: number) => {
    const newVariants = form.values.variants.filter((_: any, i: number) => i !== index);
    form.setFieldValue('variants', newVariants);
  };

  return (
    <Stack spacing="xl" pb={50}>
      <CreateUpdateTitle
        managerPath={StorageLocationConfigs.managerPath}
        title={StorageLocationConfigs.createTitle}
      />

      <DefaultPropertyPanel />

      <form onSubmit={handleFormSubmit}>
        <Stack spacing="xl">
          {/* Warehouse and Basic Info */}
          <Paper withBorder p="md" radius="md">
            <Group position="apart" mb="md">
              <Group spacing="xs">
                <MapPin size={20} color="blue" />
                <Text weight={600}>Thông tin cơ bản</Text>
              </Group>
            </Group>
            <Stack spacing="sm">
              <Select
                label={StorageLocationConfigs.properties.warehouseId.label}
                placeholder="Chọn nhà kho"
                data={warehouseSelectList}
                {...form.getInputProps('warehouseId')}
                searchable
                required
              />
              <Group grow spacing="sm">
                <TextInput
                  label={StorageLocationConfigs.properties.aisle.label}
                  placeholder="Ví dụ: Dãy A"
                  {...form.getInputProps('aisle')}
                  required
                />
                <TextInput
                  label={StorageLocationConfigs.properties.shelf.label}
                  placeholder="Ví dụ: Kệ 03"
                  {...form.getInputProps('shelf')}
                  required
                />
                <TextInput
                  label={StorageLocationConfigs.properties.bin.label}
                  placeholder="Ví dụ: Ô 12"
                  {...form.getInputProps('bin')}
                  required
                />
              </Group>
            </Stack>
          </Paper>

          {/* Product Selection */}
          <Paper withBorder p="md" radius="md">
            <Group position="apart" mb="md">
              <Group spacing="xs">
                <Package size={20} color="green" />
                <Text weight={600}>Chọn sản phẩm & phiên bản</Text>
              </Group>
            </Group>
            <Stack spacing="sm">
              <Group grow spacing="sm">
                <Select
                  label="Danh mục"
                  placeholder="Chọn danh mục"
                  data={categorySelectList}
                  {...form.getInputProps('categoryId')}
                  searchable
                  clearable
                />
                <Select
                  label="Sách"
                  placeholder="Chọn sách"
                  data={productSelectList}
                  {...form.getInputProps('productId')}
                  searchable
                  disabled={!form.values.categoryId}
                  clearable
                />
              </Group>

              <Divider my="sm" label="Thêm phiên bản" labelPosition="center" />

              <Group align="flex-end" spacing="sm">
                <Select
                  label="Chọn phiên bản để thêm"
                  placeholder="Chọn SKU"
                  data={variantSelectList}
                  className="flex-1"
                  searchable
                  disabled={!form.values.productId}
                  onChange={(val) => val && addVariant(val)}
                  value={null}
                />
              </Group>
            </Stack>
          </Paper>

          {/* Variants List */}
          <Paper withBorder p="md" radius="md">
            <Group position="apart" mb="md">
              <Group spacing="xs">
                <LayoutGrid size={20} color="purple" />
                <Text weight={600}>Danh sách phiên bản nhập vị trí</Text>
              </Group>
              <Badge color="blue" size="lg" variant="filled">
                {form.values.variants.length} phiên bản
              </Badge>
            </Group>

            {form.values.variants.length === 0 ? (
              <Text align="center" color="dimmed" py="xl">
                Chưa có phiên bản nào được chọn. Hãy chọn sản phẩm ở trên để thêm vào.
              </Text>
            ) : (
              <Stack spacing="xs">
                <Group spacing="sm" px="xs" py="xs" className="bg-gray-100 rounded font-bold text-xs uppercase">
                  <Text style={{ flex: 1 }}>MSKU / Tên phiên bản</Text>
                  <Text style={{ width: 120 }}>Số lượng nhập</Text>
                  <div style={{ width: 34 }}></div>
                </Group>
                {form.values.variants.map((v: any, index: number) => (
                  <Paper key={v.id} withBorder p="xs" radius="sm">
                    <Group spacing="sm">
                      <Stack spacing={2} style={{ flex: 1 }}>
                        <Text size="sm" weight={600}>{v.sku}</Text>
                        <Text size="xs" color="dimmed">ID: {v.id}</Text>
                      </Stack>
                      <NumberInput
                        min={1}
                        placeholder="Số lượng"
                        style={{ width: 120 }}
                        value={v.quantity}
                        onChange={(val) => {
                            const newVariants = [...form.values.variants];
                            newVariants[index].quantity = val || 1;
                            form.setFieldValue('variants', newVariants);
                        }}
                      />
                      <ActionIcon
                        color="red"
                        variant="light"
                        onClick={() => removeVariant(index)}
                        size="lg"
                      >
                        <Trash size={18} />
                      </ActionIcon>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            )}
            {form.errors.variants && (
              <Text color="red" size="xs" mt="sm">
                {form.errors.variants}
              </Text>
            )}
          </Paper>

          <Paper withBorder p="md" radius="md">
            <Group position="right">
              <Button variant="default" onClick={() => form.reset()}>Mặc định</Button>
              <Button type="submit" loading={createApi.isLoading}>Thêm vị trí lưu trữ</Button>
            </Group>
          </Paper>
        </Stack>
      </form>
    </Stack>
  );
}

export default StorageLocationCreate;
