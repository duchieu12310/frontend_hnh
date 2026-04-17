import { useState } from 'react';
import { useForm, zodResolver } from '@mantine/form';
import CategoryConfigs from 'pages/category/CategoryConfigs';
import { CategoryRequest, CategoryResponse } from 'models/Category';
import useUpdateApi from 'hooks/use-update-api';
import useGetByIdApi from 'hooks/use-get-by-id-api';
import MiscUtils from 'utils/MiscUtils';
import useGetAllApi from 'hooks/use-get-all-api';
import { SelectOption } from 'types';
import { useQueryClient } from 'react-query';

function useCategoryUpdateViewModel(id: number) {
  const form = useForm({
    initialValues: CategoryConfigs.initialCreateUpdateFormValues,
    schema: zodResolver(CategoryConfigs.createUpdateFormSchema),
  });

  const [category, setCategory] = useState<CategoryResponse>();
  const [prevFormValues, setPrevFormValues] = useState<typeof form.values>();
  const [categorySelectList, setCategorySelectList] = useState<SelectOption[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);

  const queryClient = useQueryClient();
  const updateApi = useUpdateApi<CategoryRequest, CategoryResponse>(CategoryConfigs.resourceUrl, CategoryConfigs.resourceKey, id);
  useGetByIdApi<CategoryResponse>(CategoryConfigs.resourceUrl, CategoryConfigs.resourceKey, id,
    (categoryResponse) => {
      setCategory(categoryResponse);
      const formValues: typeof form.values = {
        name: categoryResponse.name,
        slug: categoryResponse.slug,
        parentCategoryId: categoryResponse.parentCategory ? String(categoryResponse.parentCategory.id) : null,
        status: String(categoryResponse.status),
        level: categoryResponse.level,
      };
      form.setValues(formValues);
      setPrevFormValues(formValues);
    }
  );
  useGetAllApi<CategoryResponse>(CategoryConfigs.resourceUrl, CategoryConfigs.resourceKey,
    { all: 1 },
    (categoryListResponse) => {
      setCategories(categoryListResponse.content);
      const selectList: SelectOption[] = categoryListResponse.content.map((item) => ({
        value: String(item.id),
        label: item.parentCategory ? item.name + ' ← ' + item.parentCategory.name : item.name,
        disabled: (item.id === id) || (item.parentCategory ? item.parentCategory.id === id : false),
      }));
      setCategorySelectList(selectList);
    },
    { activeOnly: true }
  );

  const handleFormSubmit = form.onSubmit((formValues) => {
    setPrevFormValues(formValues);
    if (!MiscUtils.isEquals(formValues, prevFormValues)) {
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
      updateApi.mutate(requestBody, {
        onSuccess: () => queryClient.invalidateQueries([CategoryConfigs.resourceKey, 'getAll']),
      });
    }
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
    category,
    form,
    handleFormSubmit,
    categorySelectList,
    statusSelectList,
  };
}

export default useCategoryUpdateViewModel;
