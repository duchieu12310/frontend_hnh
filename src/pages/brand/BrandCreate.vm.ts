import { useForm, zodResolver } from '@mantine/form';
import BrandConfigs from 'pages/brand/BrandConfigs';
import { BrandRequest, BrandResponse } from 'models/Brand';
import useCreateApi from 'hooks/use-create-api';
import { SelectOption } from 'types';
import { useSmartImport } from 'hooks/use-smart-import';

function useBrandCreateViewModel() {
  const form = useForm({
    initialValues: BrandConfigs.initialCreateUpdateFormValues,
    schema: zodResolver(BrandConfigs.createUpdateFormSchema),
  });

  const { smartImport, isAutoFilling } = useSmartImport({
    endpoint: 'brand',
    onSuccess: (suggestions) => {
      if (suggestions.name) form.setFieldValue('name', suggestions.name);
      if (suggestions.code) form.setFieldValue('code', suggestions.code);
      if (suggestions.description) form.setFieldValue('description', suggestions.description);
    }
  });

  const createApi = useCreateApi<BrandRequest, BrandResponse>(BrandConfigs.resourceUrl, BrandConfigs.resourceKey);

  const handleFormSubmit = form.onSubmit((formValues) => {
    const requestBody: BrandRequest = {
      name: formValues.name,
      code: formValues.code,
      description: formValues.description || null,
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
    statusSelectList,
    smartImport,
    isAutoFilling,
  };
}

export default useBrandCreateViewModel;
