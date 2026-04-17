import { useForm, zodResolver } from '@mantine/form';
import CategoryConfigs from 'pages/category/CategoryConfigs';
import { CategoryRequest, CategoryResponse } from 'models/Category';
import useCreateApi from 'hooks/use-create-api';
import useGetAllApi from 'hooks/use-get-all-api';
import { useState } from 'react';
import { SelectOption } from 'types';
import { useQueryClient } from 'react-query';
import { useSearchParams } from 'react-router-dom';

function useCategoryCreateViewModel() {
  const [searchParams] = useSearchParams();
  const parentCategoryIdParam = searchParams.get('parentCategoryId');

  const form = useForm({
    initialValues: {
      ...CategoryConfigs.initialCreateUpdateFormValues,
      parentCategoryId: parentCategoryIdParam || null,
    },
    schema: zodResolver(CategoryConfigs.createUpdateFormSchema),
  });

  const [categorySelectList, setCategorySelectList] = useState<SelectOption[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);

  const queryClient = useQueryClient();
  const createApi = useCreateApi<CategoryRequest, CategoryResponse>(CategoryConfigs.resourceUrl, CategoryConfigs.resourceKey);
  useGetAllApi<CategoryResponse>(CategoryConfigs.resourceUrl, CategoryConfigs.resourceKey,
    { all: 1 },
    (categoryListResponse) => {
      setCategories(categoryListResponse.content);
      const selectList: SelectOption[] = categoryListResponse.content.map((item) => ({
        value: String(item.id),
        label: item.parentCategory ? item.name + ' ← ' + item.parentCategory.name : item.name,
      }));
      setCategorySelectList(selectList);
    },
    { activeOnly: true }
  );

  const handleFormSubmit = form.onSubmit((formValues) => {
    const parentId = Number(formValues.parentCategoryId) || null;
    let computedLevel = 1;
    if (parentId) {
      const parentCat = categories.find(c => c.id === parentId);
      if (parentCat) {
        computedLevel = parentCat.level + 1;
      }
    }

    const requestBody: CategoryRequest = {
      name: formValues.name,
      slug: formValues.slug,
      level: computedLevel,
      parentCategoryId: parentId,
      status: Number(formValues.status),
    };
    createApi.mutate(requestBody, {
      onSuccess: () => queryClient.invalidateQueries([CategoryConfigs.resourceKey, 'getAll']),
    });
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
    categorySelectList,
    statusSelectList,
  };
}

export default useCategoryCreateViewModel;
