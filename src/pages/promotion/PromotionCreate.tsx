import React, { useState } from 'react';
import { Switch,  Button, Divider, Grid, Group, NumberInput, Paper, Select, Stack, Tabs, Text, TextInput, Badge, Checkbox  } from '@mantine/core';
import { CreateUpdateTitle, DefaultPropertyPanel, EntityFinder } from 'components';
import PromotionConfigs, { AddProductMode } from 'pages/promotion/PromotionConfigs';
import usePromotionCreateViewModel from 'pages/promotion/PromotionCreate.vm';
import { DatePicker } from '@mantine/dates';
import DateUtils from 'utils/DateUtils';
import { CategoryResponse } from 'models/Category';
import CategoryConfigs from 'pages/category/CategoryConfigs';
import { ProductResponse } from 'models/Product';
import ProductConfigs from 'pages/product/ProductConfigs';
const TabsTab =Tabs.Tab as any;

function PromotionCreate() {
  const {
    form,
    handleFormSubmit,
    statusSelectList,
    setAddProductMode,
    products, setProducts,
    handleAddProductFinder,
    handleDeleteProductFinder,
    // Category Cascading Selector Properties
    categoriesTree,
    selectedL1, setSelectedL1,
    selectedL2, setSelectedL2,
    selectedL3, setSelectedL3,
    handleAddSelectedCategory,
    previewProducts,
    isLoadingPreviewProducts,
    activePreviewSlug,
    // Checkbox Properties
    checkedProductIds,
    handleToggleProductChecked,
    handleToggleSelectAll,
    // "Sản phẩm" Tab Checkbox Properties
    productSearch, setProductSearch,
    allProductsList,
    isLoadingAllProducts,
    checkedTabProductIds,
    handleToggleTabProductChecked,
    handleToggleTabSelectAll,
    handleAddSelectedTabProducts
  } = usePromotionCreateViewModel();

  const [activeTab, setActiveTab] = useState(0);

  const onTabChange = (active: number, tabKey: AddProductMode) => {
    setActiveTab(active);
    setAddProductMode(tabKey);
    form.setFieldValue('categoryIds', []);
    form.setFieldValue('productIds', []);
    setProducts([]);
  };

  const resetForm = () => {
    form.reset();
    setProducts([]);
  };

  return (
    <Stack pb={50}>
      <CreateUpdateTitle
        managerPath={PromotionConfigs.managerPath}
        title={PromotionConfigs.createTitle}
      />

      <DefaultPropertyPanel/>

      <Grid>
        <Grid.Col xs={8}>
          <Paper shadow="xs" p="sm">
            <Tabs variant="pills" active={activeTab} onTabChange={onTabChange}>
              <TabsTab tabKey={AddProductMode.CATEGORY} label="Danh mục">
                <Stack spacing="md" mt="sm">
                  {/* Cascading Dropdowns */}
                  <Grid grow>
                    <Grid.Col span={4}>
                      <Select
                        label="Danh mục cấp 1"
                        placeholder="Chọn danh mục chính"
                        clearable
                        searchable
                        value={selectedL1}
                        onChange={(val) => {
                          setSelectedL1(val);
                          setSelectedL2(null);
                          setSelectedL3(null);
                        }}
                        data={categoriesTree.map((c: any) => ({ value: c.categorySlug, label: c.categoryName }))}
                      />
                    </Grid.Col>
                    <Grid.Col span={4}>
                      <Select
                        label="Danh mục cấp 2"
                        placeholder="Chọn danh mục con"
                        clearable
                        searchable
                        disabled={!selectedL1}
                        value={selectedL2}
                        onChange={(val) => {
                          setSelectedL2(val);
                          setSelectedL3(null);
                        }}
                        data={(() => {
                          const activeL1Obj = categoriesTree.find((c: any) => c.categorySlug === selectedL1);
                          return activeL1Obj?.categoryChildren?.map((c: any) => ({ value: c.categorySlug, label: c.categoryName })) || [];
                        })()}
                      />
                    </Grid.Col>
                    <Grid.Col span={4}>
                      <Select
                        label="Danh mục cấp 3"
                        placeholder="Chọn thể loại chi tiết"
                        clearable
                        searchable
                        disabled={!selectedL2}
                        value={selectedL3}
                        onChange={(val) => {
                          setSelectedL3(val);
                        }}
                        data={(() => {
                          const activeL1Obj = categoriesTree.find((c: any) => c.categorySlug === selectedL1);
                          const activeL2Obj = activeL1Obj?.categoryChildren?.find((c: any) => c.categorySlug === selectedL2);
                          return activeL2Obj?.categoryChildren?.map((c: any) => ({ value: c.categorySlug, label: c.categoryName })) || [];
                        })()}
                      />
                    </Grid.Col>
                  </Grid>

                  {/* Add Button */}
                  <Group position="right">
                    <Button 
                      disabled={checkedProductIds.size === 0}
                      onClick={handleAddSelectedCategory}
                      variant="light"
                      color="pink"
                    >
                      Thêm {checkedProductIds.size} sản phẩm đã chọn
                    </Button>
                  </Group>

                  {/* Live Product Preview with Multi-select Checkboxes */}
                  {activePreviewSlug && (
                    <Paper p="sm" withBorder style={{ background: '#f8f9fa' }}>
                      <Group position="apart" mb="xs">
                        <Text size="sm" weight={700} color="dimmed">
                          🔍 Sản phẩm trong danh mục này (Tích chọn hoặc Chọn tất cả):
                        </Text>
                        {isLoadingPreviewProducts && <Text size="xs" color="blue">Đang tải preview...</Text>}
                      </Group>
                      
                      {!isLoadingPreviewProducts && previewProducts.length === 0 ? (
                        <Text size="xs" color="dimmed" align="center" py="md">
                          Không tìm thấy sản phẩm nào trong danh mục này.
                        </Text>
                      ) : (
                        <Stack spacing="xs">
                          {previewProducts.length > 0 && (
                            <Checkbox 
                              label={`Chọn tất cả (${previewProducts.length} sản phẩm)`}
                              checked={checkedProductIds.size === previewProducts.length}
                              indeterminate={checkedProductIds.size > 0 && checkedProductIds.size < previewProducts.length}
                              onChange={(e) => handleToggleSelectAll(e.currentTarget.checked)}
                              styles={{ label: { fontSize: '12px', fontWeight: 600 } }}
                            />
                          )}
                          <Divider />
                          <div style={{ maxHeight: '420px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {previewProducts.map((p: any) => (
                              <Group key={p.productId} position="apart" p="xs" style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e9ecef' }}>
                                <Group spacing="sm">
                                  <Checkbox 
                                    checked={checkedProductIds.has(p.productId)}
                                    onChange={() => handleToggleProductChecked(p.productId)}
                                  />
                                  {p.productThumbnail && (
                                    <img 
                                      src={p.productThumbnail} 
                                      alt={p.productName} 
                                      style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '4px' }}
                                    />
                                  )}
                                  <div>
                                    <Text size="xs" weight={600} lineClamp={1}>{p.productName}</Text>
                                    <Text size="xs" style={{ fontSize: '10px' }} color="dimmed">Slug: {p.productSlug}</Text>
                                  </div>
                                </Group>
                                <Badge size="xs" color="green">Sẵn sàng</Badge>
                              </Group>
                            ))}
                          </div>
                        </Stack>
                      )}
                    </Paper>
                  )}
                </Stack>
              </TabsTab>
              <TabsTab tabKey={AddProductMode.PRODUCT} label="Sản phẩm">
                <Stack spacing="md" mt="sm">
                  {/* Product Search Input */}
                  <TextInput 
                    label="Tìm kiếm sản phẩm"
                    placeholder="Nhập tên sản phẩm để lọc nhanh..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.currentTarget.value)}
                  />

                  {/* Add Button */}
                  <Group position="right">
                    <Button 
                      disabled={checkedTabProductIds.size === 0}
                      onClick={handleAddSelectedTabProducts}
                      variant="light"
                      color="blue"
                    >
                      Thêm {checkedTabProductIds.size} sản phẩm đã chọn
                    </Button>
                  </Group>

                  {/* All Products Checklist Preview */}
                  <Paper p="sm" withBorder style={{ background: '#f8f9fa' }}>
                    <Group position="apart" mb="xs">
                      <Text size="sm" weight={700} color="dimmed">
                        📦 Danh sách sản phẩm cửa hàng:
                      </Text>
                      {isLoadingAllProducts && <Text size="xs" color="blue">Đang tải...</Text>}
                    </Group>
                    
                    {!isLoadingAllProducts && allProductsList.length === 0 ? (
                      <Text size="xs" color="dimmed" align="center" py="md">
                        Không tìm thấy sản phẩm nào.
                      </Text>
                    ) : (
                      <Stack spacing="xs">
                        {allProductsList.length > 0 && (
                          <Checkbox 
                            label={`Chọn tất cả (${allProductsList.length} sản phẩm đang hiển thị)`}
                            checked={checkedTabProductIds.size === allProductsList.length && allProductsList.length > 0}
                            indeterminate={checkedTabProductIds.size > 0 && checkedTabProductIds.size < allProductsList.length}
                            onChange={(e) => handleToggleTabSelectAll(e.currentTarget.checked)}
                            styles={{ label: { fontSize: '12px', fontWeight: 600 } }}
                          />
                        )}
                        <Divider />
                        <div style={{ maxHeight: '420px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {allProductsList.map((p: any) => (
                            <Group key={p.productId} position="apart" p="xs" style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e9ecef' }}>
                              <Group spacing="sm">
                                <Checkbox 
                                  checked={checkedTabProductIds.has(p.productId)}
                                  onChange={() => handleToggleTabProductChecked(p.productId)}
                                />
                                {p.productThumbnail && (
                                  <img 
                                    src={p.productThumbnail} 
                                    alt={p.productName} 
                                    style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '4px' }}
                                  />
                                )}
                                <div>
                                  <Text size="xs" weight={600} lineClamp={1}>{p.productName}</Text>
                                  <Text size="xs" style={{ fontSize: '10px' }} color="dimmed">Slug: {p.productSlug}</Text>
                                </div>
                              </Group>
                              <Badge size="xs" color="green">Sẵn sàng</Badge>
                            </Group>
                          ))}
                        </div>
                      </Stack>
                    )}
                  </Paper>
                </Stack>
              </TabsTab>
            </Tabs>
          </Paper>

          {/* Selected Products List for Deletion */}
          {products.length > 0 && (
            <Paper shadow="xs" p="sm" mt="md" withBorder style={{ borderColor: '#ffe3e3', background: '#fff5f5' }}>
              <Group position="apart" mb="sm">
                <Text size="sm" weight={700} color="red">
                  🔥 Sản phẩm đã chọn áp dụng khuyến mãi ({products.length}):
                </Text>
                <Button 
                  size="xs" 
                  variant="subtle" 
                  color="red" 
                  onClick={() => {
                    form.setFieldValue('productIds', []);
                    setProducts([]);
                  }}
                >
                  Xóa tất cả
                </Button>
              </Group>

              <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {products.map((p) => (
                  <Group key={p.id} position="apart" p="xs" style={{ background: '#fff', borderRadius: '8px', border: '1px solid #ffe3e3' }}>
                    <Group spacing="sm">
                      {p.categories && p.categories[0]?.name ? (
                        <Badge size="xs" color="pink" variant="light">
                          {p.categories[0].name}
                        </Badge>
                      ) : null}
                      <div>
                        <Text size="xs" weight={600} lineClamp={1}>{p.name}</Text>
                        <Text size="xs" style={{ fontSize: '10px' }} color="dimmed">ID: {p.id} | Slug: {p.code}</Text>
                      </div>
                    </Group>
                    <Button 
                      size="xs" 
                      color="red" 
                      variant="light" 
                      radius="xl"
                      compact
                      onClick={() => handleDeleteProductFinder(p)}
                    >
                      Xóa ✕
                    </Button>
                  </Group>
                ))}
              </div>
            </Paper>
          )}
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
                      error={form.errors['range.0'] || form.errors.range}
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
                      error={form.errors['range.1'] || form.errors.range}
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
                    <Switch
                  size="md"
                  label={PromotionConfigs.properties.status.label}
                  checked={form.values.status === '1'}
                  onChange={(event) => form.setFieldValue('status', event.currentTarget.checked ? '1' : '0')}
                />
                  </Grid.Col>
                </Grid>

                {form.errors.productIds && (
                  <Paper p="xs" mx="sm" withBorder style={{ borderColor: '#ffc9c9', backgroundColor: '#fff5f5' }}>
                    <Text size="xs" color="red" weight={600} align="center">
                      ⚠️ {form.errors.productIds}
                    </Text>
                  </Paper>
                )}

                <Divider mt="xs"/>

                <Group position="apart" p="sm">
                  <Button variant="default" onClick={resetForm}>Mặc định</Button>
                  <Button type="submit">Thêm</Button>
                </Group>
              </Stack>
            </Paper>
          </form>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}

export default PromotionCreate;
