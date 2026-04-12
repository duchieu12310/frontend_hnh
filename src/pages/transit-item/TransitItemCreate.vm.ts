import { useForm, zodResolver } from '@mantine/form';
import TransitItemConfigs from 'pages/transit-item/TransitItemConfigs';
import { TransitItemRequest, TransitItemResponse } from 'models/TransitItem';
import useCreateApi from 'hooks/use-create-api';
import { SelectOption } from 'types';
import useGetAllApi from 'hooks/use-get-all-api';
import { TransitWarehouseResponse } from 'models/TransitWarehouse';
import TransitWarehouseConfigs from 'pages/transit-warehouse/TransitWarehouseConfigs';
import { CategoryResponse } from 'models/Category';
import CategoryConfigs from 'pages/category/CategoryConfigs';
import { ProductResponse } from 'models/Product';
import ProductConfigs from 'pages/product/ProductConfigs';
import { useState } from 'react';

function useTransitItemCreateViewModel() {
  const form = useForm({
    initialValues: TransitItemConfigs.initialCreateUpdateFormValues,
    schema: zodResolver(TransitItemConfigs.createUpdateFormSchema),
  });

  const createApi = useCreateApi<TransitItemRequest, TransitItemResponse>(
    TransitItemConfigs.resourceUrl
  );

  const [transitWarehouseSelectList, setTransitWarehouseSelectList] = useState<SelectOption[]>([]);
  const [categorySelectList, setCategorySelectList] = useState<SelectOption[]>([]);
  const [productSelectList, setProductSelectList] = useState<SelectOption[]>([]);
  const [variantSelectList, setVariantSelectList] = useState<SelectOption[]>([]);

  useGetAllApi<TransitWarehouseResponse>(
    TransitWarehouseConfigs.resourceUrl,
    TransitWarehouseConfigs.resourceKey,
    { all: 1 },
    (response) => {
      setTransitWarehouseSelectList(response.content.map(item => ({
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
                    label: v.sku,
                })));
            }
        }
    }
  );

  const handleFormSubmit = form.onSubmit((formValues) => {
    const requestBody: TransitItemRequest = {
      transitWarehouseId: Number(formValues.transitWarehouseId),
      category: { id: Number(formValues.categoryId) },
      product: { id: Number(formValues.productId) },
      variants: formValues.variants.map(v => ({
        id: v.id,
        sku: v.sku,
        quantity: v.quantity,
        properties: v.properties,
      })),
    };
    createApi.mutate(requestBody);
  });

  return {
    form,
    handleFormSubmit,
    transitWarehouseSelectList,
    categorySelectList,
    productSelectList,
    variantSelectList,
    createApi,
  };
}

export default useTransitItemCreateViewModel;
