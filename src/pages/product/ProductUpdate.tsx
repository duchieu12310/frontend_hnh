import React, { useState } from 'react';
import {
  Button,
  MultiSelect,
  Select,
  Tabs,
  Textarea,
  TextInput,
} from '@mantine/core';
import { useParams } from 'react-router-dom';
import {
  CreateUpdateTitle,
  DefaultPropertyPanel,
  ProductImagesDropzone,
  ProductProperties,
  ProductSpecifications,
  ProductVariantsForUpdate,
} from 'components';
import ProductConfigs from 'pages/product/ProductConfigs';
import useProductUpdateViewModel from 'pages/product/ProductUpdate.vm';
import MiscUtils from 'utils/MiscUtils';
import { ImageResponse } from 'models/Image';

const TabsTab = Tabs.Tab as any;

function ProductUpdate() {
  const { id } = useParams();
  const {
    product,
    form,
    prevFormValues,
    handleFormSubmit,
    statusSelectList,
    categorySelectList,
    brandSelectList,
    supplierSelectList,
    unitSelectList,
    tagSelectList,
    guaranteeSelectList,
    imageFiles, setImageFiles,
    thumbnailName, setThumbnailName,
    specificationSelectList, setSpecificationSelectList,
    productPropertySelectList, setProductPropertySelectList,
    selectedVariantIndexes, setSelectedVariantIndexes,
    resetForm,
  } = useProductUpdateViewModel(Number(id));

  const [showVariants, setShowVariants] = useState(true);

  if (!product) {
    return null;
  }

  const isActive = String(form.values.status) === '1';
  const isDisabled = MiscUtils.isEquals(form.values, prevFormValues)
    && selectedVariantIndexes.length === product.variants.length
    && imageFiles.length === 0;

  return (
    <div className="flex flex-col gap-4" style={{ maxWidth: 1200 }}>
      <CreateUpdateTitle managerPath={ProductConfigs.managerPath} title={ProductConfigs.updateTitle} />
      <DefaultPropertyPanel
        id={product.id}
        createdAt={product.createdAt}
        updatedAt={product.updatedAt}
        createdBy="1"
        updatedBy="1"
      />

      <form onSubmit={handleFormSubmit}>
        <div className="flex gap-5 items-start">

          {/* ===== CỘT TRÁI 70% ===== */}
          <div className="flex flex-col gap-4" style={{ flex: '0 0 68%' }}>

            {/* Card: Thông tin cơ bản */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Thông tin cơ bản</p>
              <div className="flex flex-col gap-3">
                <TextInput required label={ProductConfigs.properties.name.label} {...form.getInputProps('name')} />
                <div className="grid grid-cols-2 gap-3">
                  <TextInput required label={ProductConfigs.properties.code.label} {...form.getInputProps('code')} />
                  <TextInput required label={ProductConfigs.properties.slug.label} {...form.getInputProps('slug')} />
                </div>
                <Textarea minRows={2} label={ProductConfigs.properties.shortDescription.label} {...form.getInputProps('shortDescription')} />
                <Textarea minRows={3} label={ProductConfigs.properties.description.label} {...form.getInputProps('description')} />
              </div>
            </div>

            {/* Card: Hình ảnh */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Hình sản phẩm</p>
              <p className="text-xs text-slate-400 mb-3">Kéo thả hoặc chọn ảnh. Ảnh đầu tiên sẽ là ảnh đại diện.</p>
              <ProductImagesDropzone
                imageFiles={imageFiles}
                setImageFiles={setImageFiles}
                thumbnailName={thumbnailName}
                setThumbnailName={setThumbnailName}
                imageResponses={form.values.images as ImageResponse[]}
                setImageResponses={(imageResponses) => form.setFieldValue('images', imageResponses)}
              />
            </div>

            {/* Card: Thông số & Thuộc tính (Tabs) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <Tabs variant="pills">
                <TabsTab tabKey="specifications" label="📐 Thông số kỹ thuật">
                  <div className="pt-3">
                    <ProductSpecifications
                      specifications={form.values.specifications}
                      setSpecifications={(s) => form.setFieldValue('specifications', s)}
                      specificationSelectList={specificationSelectList}
                      setSpecificationSelectList={setSpecificationSelectList}
                    />
                  </div>
                </TabsTab>
                <TabsTab tabKey="properties" label="🏷️ Thuộc tính">
                  <div className="pt-3">
                    <ProductProperties
                      productProperties={form.values.properties}
                      setProductProperties={(p) => form.setFieldValue('properties', p)}
                      productPropertySelectList={productPropertySelectList}
                      setProductPropertySelectList={setProductPropertySelectList}
                    />
                  </div>
                </TabsTab>
              </Tabs>
            </div>

            {/* Card: Phiên bản (ẩn/hiện) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Phiên bản sản phẩm</p>
                  <p className="text-xs text-slate-400">Quản lý SKU, giá và số lượng theo biến thể</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowVariants(!showVariants)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${showVariants ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-slate-300 text-slate-500 hover:border-blue-400 hover:text-blue-500'}`}
                >
                  {showVariants ? '▲ Thu gọn' : '▼ Mở rộng phiên bản'}
                </button>
              </div>
              {showVariants && (
                <ProductVariantsForUpdate
                  variants={form.values.variants}
                  setVariants={(v) => form.setFieldValue('variants', v)}
                  productProperties={form.values.properties}
                  setProductProperties={(p) => form.setFieldValue('properties', p)}
                  selectedVariantIndexes={selectedVariantIndexes}
                  setSelectedVariantIndexes={setSelectedVariantIndexes}
                />
              )}
            </div>

          </div>

          {/* ===== CỘT PHẢI 30% ===== */}
          <div className="flex flex-col gap-4" style={{ flex: '0 0 30%' }}>

            {/* Card: Trạng thái */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Trạng thái</p>
              <div
                className="flex items-center gap-3 cursor-pointer p-3 rounded-lg bg-slate-50 border border-slate-200 hover:border-blue-300 transition-colors"
                onClick={() => form.setFieldValue('status', isActive ? '0' : '1')}
              >
                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${isActive ? 'bg-blue-600' : 'bg-gray-300'}`}>
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${isActive ? 'translate-x-[22px]' : 'translate-x-[2px]'}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">{isActive ? 'Đang hiển thị' : 'Đã ẩn'}</p>
                  <p className="text-xs text-slate-400">{isActive ? 'Sản phẩm có thể mua' : 'Khách hàng không thấy'}</p>
                </div>
              </div>
            </div>

            {/* Card: Phân loại */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Phân loại</p>
              <div className="flex flex-col gap-3">
                <Select
                  label={ProductConfigs.properties.categoryId.label}
                  placeholder="-- Chọn danh mục --"
                  clearable searchable
                  data={categorySelectList}
                  {...form.getInputProps('categoryId')}
                />
                <Select
                  label={ProductConfigs.properties.brandId.label}
                  placeholder="-- Chọn thương hiệu --"
                  clearable searchable
                  data={brandSelectList}
                  {...form.getInputProps('brandId')}
                />
                <Select
                  label={ProductConfigs.properties.supplierId.label}
                  placeholder="-- Chọn nhà cung cấp --"
                  clearable searchable
                  data={supplierSelectList}
                  {...form.getInputProps('supplierId')}
                />
                <Select
                  label={ProductConfigs.properties.unitId.label}
                  placeholder="-- Chọn đơn vị --"
                  clearable
                  data={unitSelectList}
                  {...form.getInputProps('unitId')}
                />
                <Select
                  label={ProductConfigs.properties.guaranteeId.label}
                  placeholder="-- Chọn bảo hành --"
                  clearable
                  data={guaranteeSelectList}
                  {...form.getInputProps('guaranteeId')}
                />
                <MultiSelect
                  label={ProductConfigs.properties.tags.label}
                  placeholder="-- Thêm tag --"
                  clearable searchable creatable
                  data={tagSelectList}
                  getCreateLabel={(tagName) => `+ Tạo tag "${tagName}"`}
                  {...form.getInputProps('tags')}
                />
              </div>
            </div>

            {/* Card: Hành động */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex gap-2">
              <Button variant="default" onClick={resetForm} fullWidth>Đặt lại</Button>
              <Button type="submit" disabled={isDisabled} fullWidth>Cập nhật</Button>
            </div>

          </div>
        </div>
      </form>
    </div>
  );
}

export default ProductUpdate;
