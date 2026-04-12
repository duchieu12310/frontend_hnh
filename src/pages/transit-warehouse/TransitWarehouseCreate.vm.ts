import { useState } from 'react';
import { useForm, zodResolver } from '@mantine/form';
import TransitWarehouseConfigs from 'pages/transit-warehouse/TransitWarehouseConfigs';
import { TransitWarehouseRequest, TransitWarehouseResponse } from 'models/TransitWarehouse';
import useCreateApi from 'hooks/use-create-api';
import { SelectOption } from 'types';
import useGetAllApi from 'hooks/use-get-all-api';
import { ProvinceResponse } from 'models/Province';
import ProvinceConfigs from 'pages/province/ProvinceConfigs';
import { DistrictResponse } from 'models/District';
import DistrictConfigs from 'pages/district/DistrictConfigs';
import { WardResponse } from 'models/Ward';
import WardConfigs from 'pages/ward/WardConfigs';
import { AddressRequest } from 'models/Address';
import { WarehouseResponse } from 'models/Warehouse';
import WarehouseConfigs from 'pages/warehouse/WarehouseConfigs';
import { CategoryResponse } from 'models/Category';
import { ProductResponse } from 'models/Product';
import CategoryConfigs from 'pages/category/CategoryConfigs';
import ProductConfigs from 'pages/product/ProductConfigs';

function useTransitWarehouseCreateViewModel() {
  const form = useForm({
    initialValues: TransitWarehouseConfigs.initialCreateUpdateFormValues,
    schema: zodResolver(TransitWarehouseConfigs.createUpdateFormSchema),
  });

  const createApi = useCreateApi<TransitWarehouseRequest, TransitWarehouseResponse>(
    TransitWarehouseConfigs.resourceUrl
  );

  const [provinceSelectList, setProvinceSelectList] = useState<SelectOption[]>([]);
  const [districtSelectList, setDistrictSelectList] = useState<SelectOption[]>([]);
  const [wardSelectList, setWardSelectList] = useState<SelectOption[]>([]);
  const [parentWarehouseSelectList, setParentWarehouseSelectList] = useState<SelectOption[]>([]);
  const [categorySelectList, setCategorySelectList] = useState<SelectOption[]>([]);
  const [productSelectList, setProductSelectList] = useState<SelectOption[]>([]);

  useGetAllApi<ProvinceResponse>(ProvinceConfigs.resourceUrl, ProvinceConfigs.resourceKey, { all: 1 }, (response) => {
    setProvinceSelectList(response.content.map(p => ({ value: String(p.id), label: p.name })));
  });

  const provinceId = form.values['address.provinceId'];
  useGetAllApi<DistrictResponse>(DistrictConfigs.resourceUrl, DistrictConfigs.resourceKey, 
    { all: 1, filter: provinceId ? `province.id==${provinceId}` : undefined }, 
    (response) => {
      setDistrictSelectList(response.content.map(d => ({ value: String(d.id), label: d.name })));
    }
  );

  const districtId = form.values['address.districtId'];
  useGetAllApi<WardResponse>(WardConfigs.resourceUrl, WardConfigs.resourceKey, 
    { all: 1, filter: districtId ? `district.id==${districtId}` : undefined }, 
    (response) => {
      setWardSelectList(response.content.map(w => ({ value: String(w.id), label: w.name })));
    }
  );

  useGetAllApi<WarehouseResponse>(WarehouseConfigs.resourceUrl, WarehouseConfigs.resourceKey, { all: 1 }, (response) => {
    setParentWarehouseSelectList(response.content.map(w => ({ value: String(w.id), label: w.name })));
  });

  useGetAllApi<CategoryResponse>(CategoryConfigs.resourceUrl, CategoryConfigs.resourceKey, { all: 1 }, (response) => {
    setCategorySelectList(response.content.map(c => ({ value: String(c.id), label: c.name })));
  });

  useGetAllApi<ProductResponse>(ProductConfigs.resourceUrl, ProductConfigs.resourceKey, { all: 1 }, (response) => {
    setProductSelectList(response.content.map(p => ({ value: String(p.id), label: p.name, code: p.code })));
  });

  const handleFormSubmit = form.onSubmit((formValues) => {
    const addressRequest: AddressRequest = {
      line: formValues['address.line'] || null,
      provinceId: Number(formValues['address.provinceId']) || null,
      districtId: Number(formValues['address.districtId']) || null,
      wardId: Number(formValues['address.wardId']) || null,
    };

    const requestBody: TransitWarehouseRequest = {
      name: formValues.name,
      parentWarehouse: { id: Number(formValues.parentWarehouseId) },
      address: addressRequest,
      categories: formValues.categories.map((c: any) => ({
        id: c.id,
        products: c.products.map((p: any) => ({ id: p.id })),
      })),
    };

    createApi.mutate(requestBody);
  });

  return {
    form,
    handleFormSubmit,
    provinceSelectList,
    districtSelectList,
    wardSelectList,
    parentWarehouseSelectList,
    categorySelectList,
    productSelectList,
    createApi,
  };
}

export default useTransitWarehouseCreateViewModel;
