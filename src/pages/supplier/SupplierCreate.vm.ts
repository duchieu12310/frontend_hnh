import { useForm, zodResolver } from '@mantine/form';
import SupplierConfigs from 'pages/supplier/SupplierConfigs';
import { SupplierRequest, SupplierResponse } from 'models/Supplier';
import useCreateApi from 'hooks/use-create-api';
import { useState } from 'react';
import { SelectOption } from 'types';
import useGetAllApi from 'hooks/use-get-all-api';
import { ProvinceResponse } from 'models/Province';
import ProvinceConfigs from 'pages/province/ProvinceConfigs';
import { DistrictResponse } from 'models/District';
import DistrictConfigs from 'pages/district/DistrictConfigs';
import { AddressRequest } from 'models/Address';
import { useSmartImport } from 'hooks/use-smart-import';

function useSupplierCreateViewModel() {
  const form = useForm({
    initialValues: SupplierConfigs.initialCreateUpdateFormValues,
    schema: zodResolver(SupplierConfigs.createUpdateFormSchema),
  });

  const { smartImport, isAutoFilling } = useSmartImport({
    endpoint: 'supplier',
    onSuccess: (suggestions) => {
      if (suggestions.displayName) form.setFieldValue('displayName', suggestions.displayName);
      if (suggestions.code) form.setFieldValue('code', suggestions.code);
      if (suggestions.contactFullname) form.setFieldValue('contactFullname', suggestions.contactFullname);
      if (suggestions.contactEmail) form.setFieldValue('contactEmail', suggestions.contactEmail);
      if (suggestions.contactPhone) form.setFieldValue('contactPhone', suggestions.contactPhone);
      if (suggestions.companyName) form.setFieldValue('companyName', suggestions.companyName);
      if (suggestions.taxCode) form.setFieldValue('taxCode', suggestions.taxCode);
      if (suggestions.email) form.setFieldValue('email', suggestions.email);
      if (suggestions.phone) form.setFieldValue('phone', suggestions.phone);
      if (suggestions.fax) form.setFieldValue('fax', suggestions.fax);
      if (suggestions.website) form.setFieldValue('website', suggestions.website);
      if (suggestions.addressLine) form.setFieldValue('address.line', suggestions.addressLine);
      if (suggestions.description) form.setFieldValue('description', suggestions.description);
      if (suggestions.note) form.setFieldValue('note', suggestions.note);

      // Tìm và khớp Tỉnh/Thành phố nếu AI trả về (giả định suggestions có province hoặc city)
      if (suggestions.province && provinceSelectList.length > 0) {
        const foundProvince = provinceSelectList.find(p => p.label.toLowerCase().includes(suggestions.province.toLowerCase()));
        if (foundProvince) form.setFieldValue('address.provinceId', foundProvince.value);
      }
    }
  });

  const [provinceSelectList, setProvinceSelectList] = useState<SelectOption[]>([]);
  const [districtSelectList, setDistrictSelectList] = useState<SelectOption[]>([]);

  const createApi = useCreateApi<SupplierRequest, SupplierResponse>(SupplierConfigs.resourceUrl, SupplierConfigs.resourceKey);
  useGetAllApi<ProvinceResponse>(ProvinceConfigs.resourceUrl, ProvinceConfigs.resourceKey,
    { all: 1 },
    (provinceListResponse) => {
      const selectList: SelectOption[] = provinceListResponse.content.map((item) => ({
        value: String(item.id),
        label: item.name,
      }));
      setProvinceSelectList(selectList);
    }
  );
  useGetAllApi<DistrictResponse>(DistrictConfigs.resourceUrl, DistrictConfigs.resourceKey,
    { all: 1 },
    (districtListResponse) => {
      const selectList: SelectOption[] = districtListResponse.content.map((item) => ({
        value: String(item.id),
        label: item.name,
      }));
      setDistrictSelectList(selectList);
    }
  );

  const handleFormSubmit = form.onSubmit((formValues) => {
    const addressRequest: AddressRequest = {
      line: formValues['address.line'] || null,
      provinceId: Number(formValues['address.provinceId']) || null,
      districtId: Number(formValues['address.districtId']) || null,
      wardId: null,
    };
    const requestBody: SupplierRequest = {
      displayName: formValues.displayName,
      code: formValues.code,
      contactFullname: formValues.contactFullname || null,
      contactEmail: formValues.contactEmail || null,
      contactPhone: formValues.contactPhone || null,
      companyName: formValues.companyName || null,
      taxCode: formValues.taxCode || null,
      email: formValues.email || null,
      phone: formValues.phone || null,
      fax: formValues.fax || null,
      website: formValues.website || null,
      address: Object.values(addressRequest).every(value => value === null) ? null : addressRequest,
      description: formValues.description || null,
      note: formValues.note || null,
      status: Number(formValues.status),
    };
    createApi.mutate(requestBody);
  });

  const statusSelectList: SelectOption[] = [
    {
      value: '1',
      label: 'Có hiệu lực',
    },
    {
      value: '2',
      label: 'Vô hiệu lực',
    },
  ];

  return {
    form,
    handleFormSubmit,
    provinceSelectList,
    districtSelectList,
    statusSelectList,
    smartImport,
    isAutoFilling,
  };
}

export default useSupplierCreateViewModel;
