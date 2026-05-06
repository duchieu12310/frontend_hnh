import { useForm, zodResolver } from '@mantine/form';
import SpecificationConfigs from 'pages/specification/SpecificationConfigs';
import { SpecificationRequest, SpecificationResponse } from 'models/Specification';
import useCreateApi from 'hooks/use-create-api';
import { SelectOption } from 'types';
import { useSmartImport } from 'hooks/use-smart-import';

function useSpecificationCreateViewModel() {
  const form = useForm({
    initialValues: SpecificationConfigs.initialCreateUpdateFormValues,
    schema: zodResolver(SpecificationConfigs.createUpdateFormSchema),
  });

  const { smartImport, isAutoFilling } = useSmartImport({
    endpoint: 'specification',
    onSuccess: (suggestions) => {
      if (suggestions.name) form.setFieldValue('name', suggestions.name);
      if (suggestions.code) form.setFieldValue('code', suggestions.code);
      if (suggestions.description) form.setFieldValue('description', suggestions.description);
    }
  });

  const createApi = useCreateApi<SpecificationRequest, SpecificationResponse>(SpecificationConfigs.resourceUrl, SpecificationConfigs.resourceKey);

  const handleFormSubmit = form.onSubmit((formValues) => {
    const requestBody: SpecificationRequest = {
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

export default useSpecificationCreateViewModel;
