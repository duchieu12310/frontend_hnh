import { useState, useEffect } from 'react';
import { useForm, zodResolver } from '@mantine/form';
import PromotionConfigs, { AddProductMode } from 'pages/promotion/PromotionConfigs';
import { PromotionRequest, PromotionResponse } from 'models/Promotion';
import useUpdateApi from 'hooks/use-update-api';
import useGetByIdApi from 'hooks/use-get-by-id-api';
import { ProductResponse } from 'models/Product';
import { SelectOption, CollectionWrapper, ClientCategoryResponse } from 'types';
import { useQuery } from 'react-query';
import FetchUtils, { ErrorMessage } from 'utils/FetchUtils';
import ResourceURL from 'constants/ResourceURL';

function usePromotionUpdateViewModel(id: number) {
  const form = useForm({
    initialValues: PromotionConfigs.initialCreateUpdateFormValues,
    schema: zodResolver(PromotionConfigs.createUpdateFormSchema),
  });

  const [promotion, setPromotion] = useState<PromotionResponse>();
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [addProductMode, setAddProductMode] = useState<AddProductMode>(AddProductMode.PRODUCT);

  // 3-Tier Cascading Category Select States
  const [selectedL1, setSelectedL1] = useState<string | null>(null);
  const [selectedL2, setSelectedL2] = useState<string | null>(null);
  const [selectedL3, setSelectedL3] = useState<string | null>(null);
  
  // Checked Product IDs inside the Category Live Preview panel
  const [checkedProductIds, setCheckedProductIds] = useState<Set<number>>(new Set());

  // Fetch the full recursive category tree
  const { data: categoryTreeResponse } = useQuery<CollectionWrapper<ClientCategoryResponse>, ErrorMessage>(
    ['client-api', 'categories', 'updateTreeSelect'],
    () => FetchUtils.get(ResourceURL.CLIENT_CATEGORY),
    {
      refetchOnWindowFocus: false,
    }
  );

  const categoriesTree = categoryTreeResponse?.content || [];

  // Active slug selected for real-time product preview
  const activePreviewSlug = selectedL3 || selectedL2 || selectedL1;

  // Real-time preview of products belonging to the selected category (recursively)
  const { data: previewProductsData, isLoading: isLoadingPreviewProducts } = useQuery<any, ErrorMessage>(
    ['client-api', 'products', 'preview-by-category-update', activePreviewSlug],
    () => FetchUtils.get(`${ResourceURL.CLIENT_PRODUCT}/category/${activePreviewSlug}`, { page: 1, size: 100 }),
    {
      enabled: !!activePreviewSlug,
      refetchOnWindowFocus: false,
    }
  );

  const previewProducts = previewProductsData?.content || [];

  // Automatically check all previewed products when the category selection loads/changes
  useEffect(() => {
    const list = (previewProductsData?.content || []).filter(
      (p: any) => !p.productPromotion || p.productPromotion.promotionId === id
    );
    if (list.length > 0) {
      const newChecked = new Set<number>();
      list.forEach((p: any) => {
        newChecked.add(p.productId);
      });
      setCheckedProductIds(newChecked);
    } else {
      setCheckedProductIds(new Set());
    }
  }, [previewProductsData, id]);

  const handleToggleProductChecked = (productId: number) => {
    setCheckedProductIds(prev => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  };

  const handleToggleSelectAll = (checked: boolean) => {
    if (checked) {
      const newChecked = new Set<number>();
      previewProducts.forEach((p: any) => {
        if (!p.productPromotion || p.productPromotion.promotionId === id) {
          newChecked.add(p.productId);
        }
      });
      setCheckedProductIds(newChecked);
    } else {
      setCheckedProductIds(new Set());
    }
  };

  const handleAddSelectedCategory = () => {
    if (checkedProductIds.size === 0) return;
    
    // Filter out previewed products that are currently checked
    const checkedProducts = previewProducts.filter((p: any) => checkedProductIds.has(p.productId));
    
    // Map them to ProductResponse format to feed into Mantine selections
    const newProducts: ProductResponse[] = checkedProducts.map((p: any) => ({
      id: p.productId,
      name: p.productName,
      code: p.productSlug,
      categories: p.productCategories?.map((c: any) => ({
        id: c.categoryId,
        name: c.categoryName,
        slug: c.categorySlug,
        level: 1,
        parentCategory: null,
        status: 1,
        children: []
      })) || [],
      createdAt: '',
      updatedAt: '',
      status: 1
    }));

    // Merge in unique checked products to the active promotion
    const uniqueProductIds = Array.from(new Set([...form.values.productIds, ...newProducts.map(p => p.id)]));
    form.setFieldValue('productIds', uniqueProductIds);
    
    setProducts(prevProducts => {
      const existingIds = new Set(prevProducts.map(p => p.id));
      const filteredNew = newProducts.filter(p => !existingIds.has(p.id));
      return [...prevProducts, ...filteredNew].sort((a, b) => a.id - b.id);
    });

    // Reset selectors
    setSelectedL1(null);
    setSelectedL2(null);
    setSelectedL3(null);
    setCheckedProductIds(new Set());
  };

  // --- "Sản phẩm" Tab Search & Checkbox States ---
  const [productSearch, setProductSearch] = useState<string>('');
  const [checkedTabProductIds, setCheckedTabProductIds] = useState<Set<number>>(new Set());

  // Query all products in the database with search parameter support (max 100 items per search)
  const { data: allProductsData, isLoading: isLoadingAllProducts } = useQuery<any, ErrorMessage>(
    ['client-api', 'products', 'search-all-update', productSearch],
    () => FetchUtils.get(ResourceURL.CLIENT_PRODUCT, { page: 1, size: 100, search: productSearch }),
    {
      refetchOnWindowFocus: false,
    }
  );

  const allProductsList = allProductsData?.content || [];

  // Reset checked product selection inside "Sản phẩm" tab whenever search results change
  useEffect(() => {
    setCheckedTabProductIds(new Set());
  }, [allProductsData]);

  const handleToggleTabProductChecked = (productId: number) => {
    setCheckedTabProductIds(prev => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  };

  const handleToggleTabSelectAll = (checked: boolean) => {
    if (checked) {
      const newChecked = new Set<number>();
      allProductsList.forEach((p: any) => {
        if (!p.productPromotion || p.productPromotion.promotionId === id) {
          newChecked.add(p.productId);
        }
      });
      setCheckedTabProductIds(newChecked);
    } else {
      setCheckedTabProductIds(new Set());
    }
  };

  const handleAddSelectedTabProducts = () => {
    if (checkedTabProductIds.size === 0) return;
    
    const checkedProducts = allProductsList.filter((p: any) => checkedTabProductIds.has(p.productId));
    
    const newProducts: ProductResponse[] = checkedProducts.map((p: any) => ({
      id: p.productId,
      name: p.productName,
      code: p.productSlug,
      categories: p.productCategories?.map((c: any) => ({
        id: c.categoryId,
        name: c.categoryName,
        slug: c.categorySlug,
        level: 1,
        parentCategory: null,
        status: 1,
        children: []
      })) || [],
      createdAt: '',
      updatedAt: '',
      status: 1
    }));

    const uniqueProductIds = Array.from(new Set([...form.values.productIds, ...newProducts.map(p => p.id)]));
    form.setFieldValue('productIds', uniqueProductIds);
    
    setProducts(prevProducts => {
      const existingIds = new Set(prevProducts.map(p => p.id));
      const filteredNew = newProducts.filter(p => !existingIds.has(p.id));
      return [...prevProducts, ...filteredNew].sort((a, b) => a.id - b.id);
    });

    setCheckedTabProductIds(new Set());
    setProductSearch('');
  };

  const updateApi = useUpdateApi<PromotionRequest, PromotionResponse>(PromotionConfigs.resourceUrl, PromotionConfigs.resourceKey, id);
  
  useGetByIdApi<PromotionResponse>(PromotionConfigs.resourceUrl, PromotionConfigs.resourceKey, id,
    (promotionResponse) => {
      setPromotion(promotionResponse);
      const formValues: typeof form.values = {
        name: promotionResponse.name,
        range: [
          new Date(promotionResponse.startDate),
          new Date(promotionResponse.endDate),
        ],
        percent: promotionResponse.percent,
        status: String(promotionResponse.status),
        productIds: promotionResponse.products.map(product => product.id),
        categoryIds: [],
      };
      form.setValues(formValues);
      setProducts(promotionResponse.products.sort((a, b) => a.id - b.id));
    }
  );

  const handleFormSubmit = form.onSubmit((formValues) => {
    if (formValues.productIds.length === 0) {
      form.setFieldError('productIds', 'Vui lòng chọn ít nhất 1 sản phẩm áp dụng khuyến mãi');
    } else {
      const requestBody: PromotionRequest = {
        name: formValues.name,
        startDate: formValues.range[0]!.toISOString(),
        endDate: formValues.range[1]!.toISOString(),
        percent: formValues.percent,
        status: Number(formValues.status),
        productIds: formValues.productIds,
        categoryIds: [],
      };
      updateApi.mutate(requestBody);
    }
  });

  const handleAddProductFinder = (productResponse: ProductResponse) => {
    form.setFieldValue('productIds', [...form.values.productIds, productResponse.id]);
    setProducts(products => [...products, productResponse]);
  };

  const handleDeleteProductFinder = (productResponse: ProductResponse) => {
    form.setFieldValue('productIds', form.values.productIds.filter(productId => productId !== productResponse.id));
    setProducts(products => products.filter(product => product.id !== productResponse.id));
  };

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
    promotion,
    form,
    handleFormSubmit,
    statusSelectList,
    setAddProductMode,
    products, setProducts,
    handleAddProductFinder,
    handleDeleteProductFinder,
    // Category Cascading Selector Properties
    categoriesTree,
    selectedL1, setSelectedL1,
    selectedL2, setSelectedL2,
    selectedL3, setSelectedL3,
    handleAddSelectedCategory,
    previewProducts,
    isLoadingPreviewProducts,
    activePreviewSlug,
    // Checkbox Properties
    checkedProductIds,
    handleToggleProductChecked,
    handleToggleSelectAll,
    // "Sản phẩm" Tab Checkbox Properties
    productSearch, setProductSearch,
    allProductsList,
    isLoadingAllProducts,
    checkedTabProductIds,
    handleToggleTabProductChecked,
    handleToggleTabSelectAll,
    handleAddSelectedTabProducts
  };
}

export default usePromotionUpdateViewModel;
