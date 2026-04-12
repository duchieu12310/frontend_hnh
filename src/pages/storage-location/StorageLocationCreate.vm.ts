import { useForm, zodResolver } from '@mantine/form';
import StorageLocationConfigs from 'pages/storage-location/StorageLocationConfigs';
import { StorageLocationRequest, StorageLocationResponse } from 'models/StorageLocation';
import useCreateApi from 'hooks/use-create-api';
import { SelectOption } from 'types';
import useGetAllApi from 'hooks/use-get-all-api';
import { WarehouseResponse } from 'models/Warehouse';
import WarehouseConfigs from 'pages/warehouse/WarehouseConfigs';
import { CategoryResponse } from 'models/Category';
import CategoryConfigs from 'pages/category/CategoryConfigs';
import { ProductResponse } from 'models/Product';
import ProductConfigs from 'pages/product/ProductConfigs';
import { useState } from 'react';

function useStorageLocationCreateViewModel() {
  const form = useForm({
    initialValues: StorageLocationConfigs.initialCreateUpdateFormValues,
    schema: zodResolver(StorageLocationConfigs.createUpdateFormSchema),
  });

  const createApi = useCreateApi<StorageLocationRequest, StorageLocationResponse>(
    StorageLocationConfigs.resourceUrl
  );

  const [warehouseSelectList, setWarehouseSelectList] = useState<SelectOption[]>([]);
  const [categorySelectList, setCategorySelectList] = useState<SelectOption[]>([]);
  const [productSelectList, setProductSelectList] = useState<SelectOption[]>([]);
  const [variantSelectList, setVariantSelectList] = useState<SelectOption[]>([]);

  useGetAllApi<WarehouseResponse>(
    WarehouseConfigs.resourceUrl,
    WarehouseConfigs.resourceKey,
    { all: 1 },
    (response) => {
      setWarehouseSelectList(response.content.map(item => ({
        value: String(item.id),
        label: item.name,
      })));
    }
  );

  useGetAllApi<CategoryResponse>(
    CategoryConfigs.resourceUrl,
    CategoryConfigs.resourceKey,
    { all: 1 },
    (response) => {
      setCategorySelectList(response.content.map(item => ({
        value: String(item.id),
        label: item.name,
      })));
    }
  );

  const categoryId = form.values.categoryId;
  useGetAllApi<ProductResponse>(
    ProductConfigs.resourceUrl,
    ProductConfigs.resourceKey,
    { all: 1, filter: categoryId ? `category.id==${categoryId}` : undefined },
    (response) => {
      setProductSelectList(response.content.map(item => ({
        value: String(item.id),
        label: item.name,
      })));
    }
  );

  const productId = form.values.productId;
  useGetAllApi<ProductResponse>(
    ProductConfigs.resourceUrl,
    ProductConfigs.resourceKey,
    { all: 1, filter: productId ? `id==${productId}` : undefined },
    (response) => {
        if (productId) {
            const product = response.content.find(p => String(p.id) === productId);
            if (product) {
                setVariantSelectList(product.variants.map(v => ({
                    value: String(v.id),
                    label: `${v.sku}`,
                })));
            }
        }
    }
  );

  const handleFormSubmit = form.onSubmit((formValues) => {
    const requestBody: StorageLocationRequest = {
      warehouseId: Number(formValues.warehouseId),
      aisle: formValues.aisle,
      shelf: formValues.shelf,
      bin: formValues.bin,
      categoryIds: formValues.categoryId ? [Number(formValues.categoryId)] : [],
      productIds: formValues.productId ? [Number(formValues.productId)] : [],
      items: formValues.variants.map(v => ({
        productId: Number(formValues.productId),
        variantId: v.id,
        sku: v.sku,
        quantity: v.quantity,
      })),
    };
    createApi.mutate(requestBody);
  });

  return {
    form,
    handleFormSubmit,
    warehouseSelectList,
    categorySelectList,
    productSelectList,
    variantSelectList,
    createApi,
  };
}

export default useStorageLocationCreateViewModel;
