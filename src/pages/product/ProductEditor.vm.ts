import { useEffect, useState } from 'react';
import { useForm, zodResolver } from '@mantine/form';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import toast from 'react-hot-toast';
import ProductConfigs from './ProductConfigs';
import { ProductRequest, ProductResponse, SpecificationItem, ProductRequest_TagRequest } from 'models/Product';
import useCreateApi from 'hooks/use-create-api';
import useUpdateApi from 'hooks/use-update-api';
import useGetByIdApi from 'hooks/use-get-by-id-api';
import useUploadMultipleImagesApi from 'hooks/use-upload-multiple-images-api';
import useGetAllApi from 'hooks/use-get-all-api';
import ManagerPath from 'constants/ManagerPath';
import { FileWithPreview, CollectionWrapper, SelectOption } from 'types';
import { ImageRequest, UploadedImageResponse } from 'models/Image';
import { ProductPropertyItem } from 'models/Product';
import { VariantRequest } from 'models/Variant';
import NotifyUtils from 'utils/NotifyUtils';
import MiscUtils from 'utils/MiscUtils';
import { SpecificationResponse } from 'models/Specification';
import SpecificationConfigs from 'pages/specification/SpecificationConfigs';
import { PropertyResponse } from 'models/Property';
import PropertyConfigs from 'pages/property/PropertyConfigs';

export function useProductEditorViewModel() {
  const { id } = useParams();
  const entityId = id ? Number(id) : null;
  const isUpdateMode = !!entityId;
  const navigate = useNavigate();
  
  const createApi = useCreateApi<ProductRequest, ProductResponse>(ProductConfigs.resourceUrl, ProductConfigs.resourceKey);
  const updateApi = useUpdateApi<ProductRequest, ProductResponse>(ProductConfigs.resourceUrl, ProductConfigs.resourceKey, entityId || 0);
  const uploadApi = useUploadMultipleImagesApi();

  const [imageFiles, setImageFiles] = useState<FileWithPreview[]>([]);
  const [thumbnailName, setThumbnailName] = useState('');
  const [selectedVariantIndexes, setSelectedVariantIndexes] = useState<number[]>([0]);
  
  const [specificationSelectList, setSpecificationSelectList] = useState<SelectOption[]>([]);
  const [productPropertySelectList, setProductPropertySelectList] = useState<SelectOption[]>([]);

  const form = useForm({
    initialValues: ProductConfigs.initialCreateUpdateFormValues,
    schema: zodResolver(ProductConfigs.createUpdateFormSchema),
  });

  // Fetch product data if in update mode
  useGetByIdApi<ProductResponse>(
    ProductConfigs.resourceUrl, 
    ProductConfigs.resourceKey, 
    entityId || 0,
    (data) => {
      const formValues = {
        ...data,
        brandId: data.brand ? String(data.brand.id) : null,
        supplierId: data.supplier ? String(data.supplier.id) : null,
        unitId: data.unit ? String(data.unit.id) : null,
        guaranteeId: data.guarantee ? String(data.guarantee.id) : null,
        categoryIds: data.categories.map((c) => c.id),
        tags: data.tags.map((t) => String(t.id) + '#ORIGINAL'),
        status: String(data.status),
        shortDescription: data.shortDescription || '',
        description: data.description || '',
      };
      form.setValues(formValues);
      setSelectedVariantIndexes(data.variants.map((_, index) => index));
      const thumbnail = data.images.find(img => img.isThumbnail);
      if (thumbnail) setThumbnailName(thumbnail.name);
    },
    { enabled: isUpdateMode }
  );

  // Fetch Select Lists
  useGetAllApi<SpecificationResponse>(SpecificationConfigs.resourceUrl, SpecificationConfigs.resourceKey,
    { all: 1 },
    (res) => {
      const selectList: SelectOption[] = res.content.map((item) => ({
        value: JSON.stringify({ id: item.id, name: item.name, code: item.code }),
        label: item.name,
      }));
      setSpecificationSelectList(selectList);
    },
    { activeOnly: true }
  );

  useGetAllApi<PropertyResponse>(PropertyConfigs.resourceUrl, PropertyConfigs.resourceKey,
    { all: 1 },
    (res) => {
      const selectList: SelectOption[] = res.content.map((item) => ({
        value: JSON.stringify({ id: item.id, name: item.name, code: item.code }),
        label: item.name,
      }));
      setProductPropertySelectList(selectList);
    },
    { activeOnly: true }
  );

  const transformTags = (tags: string[]): ProductRequest_TagRequest[] => tags.map((tagIdOrName) => {
    if (tagIdOrName.includes('#ORIGINAL')) {
      return { id: Number(tagIdOrName.split('#')[0]) };
    }
    return {
      name: tagIdOrName.trim(),
      slug: MiscUtils.convertToSlug(tagIdOrName),
      status: 1,
    };
  });

  const handleFormSubmit = async (formValues: typeof ProductConfigs.initialCreateUpdateFormValues) => {
    const saveProduct = async (uploadedImages?: UploadedImageResponse[]) => {
      const transformImages = (newImages: UploadedImageResponse[]): ImageRequest[] => {
        const thumbIdx = imageFiles.findIndex(f => f.name === thumbnailName);
        return newImages.map((img, idx) => ({
          ...img,
          id: null,
          group: 'P',
          isThumbnail: idx === thumbIdx,
          isEliminated: false,
        }));
      };

      const finalImages = [
        ...formValues.images.map(img => ({
          ...img,
          isThumbnail: img.name === thumbnailName,
        })),
        ...(uploadedImages ? transformImages(uploadedImages) : []),
      ];

      const requestBody: ProductRequest = {
        ...formValues,
        brandId: Number(formValues.brandId) || null,
        supplierId: Number(formValues.supplierId) || null,
        unitId: Number(formValues.unitId) || null,
        guaranteeId: Number(formValues.guaranteeId) || null,
        status: Number(formValues.status),
        images: finalImages,
        tags: transformTags(formValues.tags),
        variants: formValues.variants.filter((_, idx) => selectedVariantIndexes.includes(idx)),
        specifications: formValues.specifications,
        properties: formValues.properties,
      };

      try {
        if (isUpdateMode) {
          await updateApi.mutateAsync(requestBody);
          toast.success('Cập nhật sản phẩm thành công');
        } else {
          await createApi.mutateAsync(requestBody);
          toast.success('Thêm sản phẩm thành công');
        }
        navigate(ManagerPath.PRODUCT);
      } catch (error: any) {
        NotifyUtils.simpleFailed(error);
      }
    };

    if (imageFiles.length > 0) {
      uploadApi.mutate(imageFiles, {
        onSuccess: (res) => saveProduct(res.content),
      });
    } else {
      saveProduct();
    }
  };

  return {
    form,
    isUpdateMode,
    imageFiles, setImageFiles,
    thumbnailName, setThumbnailName,
    selectedVariantIndexes, setSelectedVariantIndexes,
    specificationSelectList, setSpecificationSelectList,
    productPropertySelectList, setProductPropertySelectList,
    handleFormSubmit,
    isSaving: createApi.isLoading || updateApi.isLoading || uploadApi.isLoading,
  };
}
