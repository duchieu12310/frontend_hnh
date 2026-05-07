import React from 'react';
import { 
  TextInput, 
  Textarea, 
  Button, 
  Group, 
  Stack, 
  Grid, 
  Card, 
  Tabs, 
  Text, 
  ActionIcon, 
  Title, 
  Select, 
  NumberInput, 
  MultiSelect,
  Box,
  Divider,
  LoadingOverlay,
  Switch
} from '@mantine/core';
import { 
  ArrowLeft, 
  DeviceFloppy, 
  Photo, 
  Settings, 
  Box as BoxIcon, 
  Tag, 
  ListDetails, 
  InfoCircle,
  Package
} from 'tabler-icons-react';
import { useNavigate } from 'react-router-dom';
import { 
  ProductImagesDropzone, 
  ProductSpecifications, 
  ProductProperties, 
  ProductVariantsForUpdate,
  CategoryCascadingSelector
} from 'components';
import { useProductEditorViewModel } from './ProductEditor.vm';
import useGetAllApi from 'hooks/use-get-all-api';
import { BrandResponse } from 'models/Brand';
import BrandConfigs from 'pages/brand/BrandConfigs';
import { SupplierResponse } from 'models/Supplier';
import SupplierConfigs from 'pages/supplier/SupplierConfigs';
import { UnitResponse } from 'models/Unit';
import UnitConfigs from 'pages/unit/UnitConfigs';
import { GuaranteeResponse } from 'models/Guarantee';
import GuaranteeConfigs from 'pages/guarantee/GuaranteeConfigs';
import { TagResponse } from 'models/Tag';
import TagConfigs from 'pages/tag/TagConfigs';
import ManagerPath from 'constants/ManagerPath';
import './ProductEditor.css';
import { SelectOption } from 'types';

const Tab = Tabs.Tab as any;

const ProductEditor: React.FC = () => {
  const navigate = useNavigate();
  const {
    form,
    isUpdateMode,
    imageFiles,
    setImageFiles,
    thumbnailName,
    setThumbnailName,
    selectedVariantIndexes,
    setSelectedVariantIndexes,
    specificationSelectList,
    setSpecificationSelectList,
    productPropertySelectList,
    setProductPropertySelectList,
    handleFormSubmit,
    isSaving
  } = useProductEditorViewModel();

  const [brandOptions, setBrandOptions] = React.useState<SelectOption[]>([]);
  const [supplierOptions, setSupplierOptions] = React.useState<SelectOption[]>([]);
  const [unitOptions, setUnitOptions] = React.useState<SelectOption[]>([]);
  const [guaranteeOptions, setGuaranteeOptions] = React.useState<SelectOption[]>([]);
  const [tagOptions, setTagOptions] = React.useState<SelectOption[]>([]);

  useGetAllApi<BrandResponse>(BrandConfigs.resourceUrl, BrandConfigs.resourceKey, { all: 1 }, (res) => {
    setBrandOptions(res.content.map(b => ({ value: String(b.id), label: b.name })));
  }, { activeOnly: true });

  useGetAllApi<SupplierResponse>(SupplierConfigs.resourceUrl, SupplierConfigs.resourceKey, { all: 1 }, (res) => {
    setSupplierOptions(res.content.map(s => ({ value: String(s.id), label: s.displayName })));
  }, { activeOnly: true });

  useGetAllApi<UnitResponse>(UnitConfigs.resourceUrl, UnitConfigs.resourceKey, { all: 1 }, (res) => {
    setUnitOptions(res.content.map(u => ({ value: String(u.id), label: u.name })));
  }, { activeOnly: true });

  useGetAllApi<GuaranteeResponse>(GuaranteeConfigs.resourceUrl, GuaranteeConfigs.resourceKey, { all: 1 }, (res) => {
    setGuaranteeOptions(res.content.map(g => ({ value: String(g.id), label: g.name })));
  }, { activeOnly: true });

  useGetAllApi<TagResponse>(TagConfigs.resourceUrl, TagConfigs.resourceKey, { all: 1 }, (res) => {
    setTagOptions(res.content.map(t => ({ value: String(t.id) + '#ORIGINAL', label: t.name })));
  }, { activeOnly: true });

  return (
    <Box className="product-editor-container" sx={{ position: 'relative' }}>
      <LoadingOverlay visible={isSaving} />
      
      {/* Header */}
      <div className="editor-header">
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <Group position="apart">
            <Group>
              <ActionIcon 
                variant="light" 
                color="gray" 
                size="lg" 
                onClick={() => navigate(ManagerPath.PRODUCT)}
                className="glass-card"
              >
                <ArrowLeft size={20} />
              </ActionIcon>
              <div>
                <Title order={3} sx={{ fontSize: '1.5rem', fontWeight: 800 }}>
                  {isUpdateMode ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
                </Title>
              </div>
            </Group>
            <Group>
              <Button 
                variant="light" 
                color="gray" 
                onClick={() => navigate(ManagerPath.PRODUCT)}
                disabled={isSaving}
              >
                Hủy bỏ
              </Button>
              <Button 
                leftIcon={<DeviceFloppy size={18} />} 
                color="teal" 
                size="md"
                onClick={form.onSubmit(handleFormSubmit)}
                loading={isSaving}
                sx={{ borderRadius: 10, boxShadow: '0 4px 12px rgba(18, 184, 134, 0.3)' }}
              >
                {isUpdateMode ? 'Lưu thay đổi' : 'Tạo sản phẩm'}
              </Button>
            </Group>
          </Group>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
        <Grid gutter="xl">
          {/* Main Content */}
          <Grid.Col md={8}>
            <Tabs variant="pills" color="teal" className="tab-list">
              <Tab label="Thông tin chung" icon={<InfoCircle size={16} />}>
                <Card className="glass-card" p="xl" mt="md">
                  <Text className="section-title"><InfoCircle size={20} /> Nội dung sản phẩm</Text>
                  <Stack spacing="lg">
                    <Grid gutter="md">
                      <Grid.Col span={8}>
                        <TextInput
                          label="Tên sản phẩm"
                          placeholder="Ví dụ: Laptop Apple MacBook Air M2 2022"
                          required
                          {...form.getInputProps('name')}
                        />
                      </Grid.Col>
                      <Grid.Col span={4}>
                        <TextInput
                          label="Mã sản phẩm (Code)"
                          placeholder="Vd: SKU-123"
                          required
                          {...form.getInputProps('code')}
                        />
                      </Grid.Col>
                    </Grid>

                    <TextInput
                      label="Đường dẫn (Slug)"
                      placeholder="vd: laptop-apple-macbook-air-m2"
                      required
                      {...form.getInputProps('slug')}
                    />

                    <Textarea
                      label="Mô tả ngắn"
                      placeholder="Tóm tắt những điểm nổi bật của sản phẩm..."
                      minRows={3}
                      {...form.getInputProps('shortDescription')}
                    />

                    <Textarea
                      label="Mô tả chi tiết"
                      placeholder="Nội dung đầy đủ về thông số, tính năng..."
                      minRows={8}
                      {...form.getInputProps('description')}
                    />
                  </Stack>
                </Card>
              </Tab>

              <Tab label="Hình ảnh" icon={<Photo size={16} />}>
                <Card className="glass-card" p="xl" mt="md">
                  <Text className="section-title"><Photo size={20} /> Album hình ảnh</Text>
                  <ProductImagesDropzone
                    imageFiles={imageFiles}
                    setImageFiles={setImageFiles}
                    thumbnailName={thumbnailName}
                    setThumbnailName={setThumbnailName}
                    imageResponses={form.values.images}
                    setImageResponses={(imgs) => form.setFieldValue('images', imgs)}
                  />
                </Card>
              </Tab>

              <Tab label="Phiên bản & Giá" icon={<Package size={16} />}>
                <Card className="glass-card" p="xl" mt="md">
                  <Text className="section-title"><Package size={20} /> Quản lý các phiên bản</Text>
                  <ProductVariantsForUpdate
                    variants={form.values.variants}
                    setVariants={(v) => form.setFieldValue('variants', v)}
                    productProperties={form.values.properties}
                    setProductProperties={(p) => form.setFieldValue('properties', p)}
                    selectedVariantIndexes={selectedVariantIndexes}
                    setSelectedVariantIndexes={setSelectedVariantIndexes}
                  />
                </Card>
              </Tab>

              <Tab label="Thuộc tính" icon={<ListDetails size={16} />}>
                <Stack spacing="xl" mt="md">
                  <Card className="glass-card" p="xl">
                    <Text className="section-title"><ListDetails size={20} /> Thông số kỹ thuật</Text>
                    <ProductSpecifications
                      specifications={form.values.specifications}
                      setSpecifications={(s) => form.setFieldValue('specifications', s)}
                      specificationSelectList={specificationSelectList}
                      setSpecificationSelectList={setSpecificationSelectList}
                    />
                  </Card>

                  <Card className="glass-card" p="xl">
                    <Text className="section-title"><Settings size={20} /> Thuộc tính tùy chọn</Text>
                    <ProductProperties
                      productProperties={form.values.properties}
                      setProductProperties={(p) => form.setFieldValue('properties', p)}
                      productPropertySelectList={productPropertySelectList}
                      setProductPropertySelectList={setProductPropertySelectList}
                    />
                  </Card>
                </Stack>
              </Tab>
            </Tabs>
          </Grid.Col>

          {/* Sidebar */}
          <Grid.Col md={4}>
            <Stack spacing="xl" className="sticky-sidebar">
              <Card className="glass-card" p="xl">
                <Text className="section-title"><Tag size={20} /> Phân loại</Text>
                <Stack spacing="md">
                  <Box>
                    <Text className="form-label">Danh mục sản phẩm</Text>
                    <CategoryCascadingSelector
                      categories={[]}
                      selectedId={form.values.categoryIds[0] || null}
                      onChange={(id) => form.setFieldValue('categoryIds', id ? [id] : [])}
                    />
                  </Box>

                  <Select
                    label="Thương hiệu"
                    placeholder="Chọn thương hiệu"
                    data={brandOptions}
                    searchable
                    clearable
                    {...form.getInputProps('brandId')}
                  />

                  <Select
                    label="Nhà cung cấp"
                    placeholder="Chọn nhà cung cấp"
                    data={supplierOptions}
                    searchable
                    clearable
                    {...form.getInputProps('supplierId')}
                  />

                  <Grid gutter="sm">
                    <Grid.Col span={6}>
                      <Select
                        label="Đơn vị tính"
                        data={unitOptions}
                        {...form.getInputProps('unitId')}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <NumberInput
                        label="Cân nặng (kg)"
                        precision={2}
                        step={0.1}
                        {...form.getInputProps('weight')}
                      />
                    </Grid.Col>
                  </Grid>

                  <Select
                    label="Bảo hành"
                    placeholder="Chọn thời gian bảo hành"
                    data={guaranteeOptions}
                    {...form.getInputProps('guaranteeId')}
                  />

                  <MultiSelect
                    label="Tags / Nhãn"
                    placeholder="Gắn thẻ cho sản phẩm"
                    data={tagOptions}
                    searchable
                    creatable
                    getCreateLabel={(query) => `+ Tạo thẻ "${query}"`}
                    {...form.getInputProps('tags')}
                  />
                </Stack>
              </Card>

              <Card className="glass-card" p="xl">
                <Text className="section-title"><Settings size={20} /> Trạng thái & Hiển thị</Text>
                <Group position="apart">
                  <Text size="sm" weight={500}>Trạng thái kinh doanh</Text>
                  <Switch
                    checked={form.values.status === '1'}
                    onChange={(event) => form.setFieldValue('status', event.currentTarget.checked ? '1' : '2')}
                    color="teal"
                  />
                </Group>
                <Divider my="md" />
                <Text size="xs" color="dimmed">
                  Lưu ý: Chỉ những sản phẩm ở trạng thái "Hoạt động" mới hiển thị trên website bán hàng.
                </Text>
              </Card>
            </Stack>
          </Grid.Col>
        </Grid>
      </div>
    </Box>
  );
};

export default ProductEditor;
