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
import { Truck, Package, Bookmark, Trash, Plus } from 'tabler-icons-react';
import { CreateUpdateTitle, DefaultPropertyPanel } from 'components';
import TransitItemConfigs from 'pages/transit-item/TransitItemConfigs';
import useTransitItemCreateViewModel from 'pages/transit-item/TransitItemCreate.vm';

function TransitItemCreate() {
  const {
    form,
    handleFormSubmit,
    transitWarehouseSelectList,
    categorySelectList,
    productSelectList,
    variantSelectList,
    createApi,
  } = useTransitItemCreateViewModel();

  const addVariant = (variantId: string) => {
    const variant = variantSelectList.find(v => v.value === variantId);
    if (variant && !form.values.variants.some((v: any) => String(v.id) === variantId)) {
        const newVariants = [
            ...form.values.variants,
            {
              id: Number(variantId),
              sku: variant.label,
              quantity: 1,
              properties: {}, 
            }
        ];
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
        managerPath={TransitItemConfigs.managerPath}
        title={TransitItemConfigs.createTitle}
      />

      <DefaultPropertyPanel />

      <form onSubmit={handleFormSubmit}>
        <Stack spacing="xl">
          {/* Destination */}
          <Paper withBorder p="md" radius="md">
            <Group position="apart" mb="md">
              <Group spacing="xs">
                <Truck size={20} color="orange" />
                <Text weight={600}>Điểm đến luân chuyển</Text>
              </Group>
            </Group>
            <Select
              label="Trạm trung chuyển nhận hàng"
              placeholder="Chọn trạm trung chuyển"
              data={transitWarehouseSelectList}
              {...form.getInputProps('transitWarehouseId')}
              searchable
              required
            />
          </Paper>

          {/* Product Selection */}
          <Paper withBorder p="md" radius="md">
            <Group position="apart" mb="md">
              <Group spacing="xs">
                <Package size={20} color="blue" />
                <Text weight={600}>Lô hàng luân chuyển</Text>
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

              <Divider my="sm" label="Thêm phiên bản vào lô" labelPosition="center" />

              <Select
                label="Chọn ISBN/MSKU"
                placeholder="Chọn các phiên bản sách để chuyển"
                data={variantSelectList}
                searchable
                disabled={!form.values.productId}
                onChange={(val) => val && addVariant(val)}
                value={null}
                icon={<Plus size={14} />}
              />
            </Stack>
          </Paper>

          {/* Selected Variants List */}
          <Paper withBorder p="md" radius="md">
            <Group position="apart" mb="md">
              <Group spacing="xs">
                <Bookmark size={20} color="purple" />
                <Text weight={600}>Danh sách phiên bản trong lô</Text>
              </Group>
              <Badge color="orange" size="lg" variant="filled">
                {`${form.values.variants.length} items`}
              </Badge>
            </Group>

            {form.values.variants.length === 0 ? (
              <Text align="center" color="dimmed" py="xl">
                Chưa có phiên bản nào được chọn để luân chuyển.
              </Text>
            ) : (
              <Stack spacing="xs">
                <Group spacing="sm" px="xs" py="xs" className="bg-gray-100 rounded font-bold text-xs uppercase tracking-wider">
                  <Text style={{ flex: 1 }}>Sách / Phiên bản</Text>
                  <Text style={{ width: 150 }}>Số lượng chuyển</Text>
                  <div style={{ width: 34 }}></div>
                </Group>
                {form.values.variants.map((v: any, index: number) => (
                  <Paper key={v.id} withBorder p="sm" radius="md">
                    <Group spacing="sm">
                      <Stack spacing={2} style={{ flex: 1 }}>
                        <Text size="sm" weight={700}>{v.sku}</Text>
                        <Group spacing={4}>
                          {v.properties && Object.entries(v.properties).map(([key, value]) => (
                              <Badge key={key} size="xs" variant="outline" color="gray">{`${key}: ${value}`}</Badge>
                          ))}
                        </Group>
                      </Stack>
                      <NumberInput
                        min={1}
                        style={{ width: 150 }}
                        placeholder="Số lượng"
                        value={v.quantity}
                        onChange={(val) => {
                            const newVariants = [...form.values.variants];
                            newVariants[index].quantity = val || 1;
                            form.setFieldValue('variants', newVariants);
                        }}
                      />
                      <ActionIcon
                        color="red"
                        variant="transparent"
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

          <Paper withBorder p="md" radius="md" style={{ backgroundColor: '#f0f7ff' }}>
            <Group spacing="sm">
                <Truck size={20} color="#228be6"/>
                <Stack spacing={0}>
                    <Text weight={600} size="sm">Ghi chú nghiệp vụ</Text>
                    <Text size="xs" color="dimmed">
                      Hệ thống sẽ trừ tồn kho tại kho tổng tương ứng với số lượng trong lô hàng này.
                    </Text>
                </Stack>
            </Group>
          </Paper>

          <Paper withBorder p="md" radius="md">
            <Group position="right">
              <Button variant="default" onClick={() => form.reset()}>Mặc định</Button>
              <Button type="submit" loading={createApi.isLoading}>Tạo lô hàng luân chuyển</Button>
            </Group>
          </Paper>
        </Stack>
      </form>
    </Stack>
  );
}

export default TransitItemCreate;
