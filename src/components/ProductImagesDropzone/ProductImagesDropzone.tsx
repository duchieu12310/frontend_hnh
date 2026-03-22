import React, { useEffect, useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Check, CirclePlus, Photo, Upload, X } from 'tabler-icons-react';
import { Dialog } from '@headlessui/react';
import { FileWithPreview } from 'types';
import { ImageResponse } from 'models/Image';
import produce from 'immer';

interface ProductImagesDropzoneProps {
  imageFiles: FileWithPreview[];
  setImageFiles: React.Dispatch<React.SetStateAction<FileWithPreview[]>>;
  thumbnailName: string,
  setThumbnailName: React.Dispatch<React.SetStateAction<string>>,
  imageResponses?: ImageResponse[],
  setImageResponses?: (imageResponses: ImageResponse[]) => void;
}

function ProductImagesDropzone({
  imageFiles,
  setImageFiles,
  thumbnailName,
  setThumbnailName,
  imageResponses,
  setImageResponses,
}: ProductImagesDropzoneProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [dropzoneStatus, setDropzoneStatus] = useState<'idle' | 'accepted' | 'rejected'>('idle');

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      setDropzoneStatus('rejected');
      setTimeout(() => setDropzoneStatus('idle'), 2000);
      return;
    }

    if (acceptedFiles.length > 0) {
      setDropzoneStatus('accepted');
      setTimeout(() => setDropzoneStatus('idle'), 2000);
      
      if ((imageResponses || []).every((imageResponse) => imageResponse.isEliminated)) {
        setThumbnailName(acceptedFiles[0].name);
      }
      setImageFiles(acceptedFiles.map((file) => Object.assign(file, { preview: URL.createObjectURL(file) })));
    }
  }, [imageResponses, setImageFiles, setThumbnailName]);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxSize: 5 * 1024 ** 2,
  });

  const handleDeleteAllImagesButton = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDeleteAll = () => {
    if (imageFiles.some(imageFile => imageFile.name === thumbnailName) && imageResponses && setImageResponses) {
      const currentImageResponses = produce(imageResponses, draft => {
        for (const imageResponse of draft) {
          if (!imageResponse.isEliminated) {
            imageResponse.isThumbnail = true;
            setThumbnailName(imageResponse.name);
            break;
          }
        }
      });
      setImageResponses(currentImageResponses);
    }
    setImageFiles([]);
    setIsDeleteModalOpen(false);
  };

  const handleDeleteImageButton = (imageIndex: number, arrayName: string) => {
    if (arrayName === 'imageFiles') {
      const currentImageFiles = imageFiles.filter((_, index) => index !== imageIndex);
      if (imageFiles[imageIndex].name === thumbnailName && currentImageFiles.length > 0) {
        setThumbnailName(currentImageFiles[0].name);
      }
      if (currentImageFiles.length === 0) {
        setThumbnailName('');
        if (imageResponses && setImageResponses) {
          const currentImageResponses = produce(imageResponses, draft => {
            for (const imageResponse of draft) {
              if (!imageResponse.isEliminated) {
                imageResponse.isThumbnail = true;
                setThumbnailName(imageResponse.name);
                break;
              }
            }
          });
          setImageResponses(currentImageResponses);
        }
      }
      setImageFiles(currentImageFiles);
    }

    if (arrayName === 'imageResponses' && imageResponses && setImageResponses) {
      const currentImageResponses = produce(imageResponses, draft => {
        draft[imageIndex].isEliminated = true;
        if (draft[imageIndex].isThumbnail) {
          draft[imageIndex].isThumbnail = false;
          for (const imageResponse of draft) {
            if (!imageResponse.isEliminated) {
              imageResponse.isThumbnail = true;
              setThumbnailName(imageResponse.name);
              break;
            }
          }
        }
      });
      if (currentImageResponses.every((imageResponse) => imageResponse.isEliminated)) {
        if (imageFiles.length > 0) {
          setThumbnailName(imageFiles[0].name);
        } else {
          setThumbnailName('');
        }
      }
      setImageResponses(currentImageResponses);
    }
  };

  const handleSelectThumbnailButton = (imageIndex: number, arrayName: string) => {
    if (arrayName === 'imageFiles') {
      setThumbnailName(imageFiles[imageIndex].name);
      if (imageResponses && setImageResponses) {
        const currentImageResponses = produce(imageResponses, draft => {
          for (const imageResponse of draft) {
            if (imageResponse.isThumbnail) {
              imageResponse.isThumbnail = false;
              break;
            }
          }
        });
        setImageResponses(currentImageResponses);
      }
    }

    if (arrayName === 'imageResponses' && imageResponses && setImageResponses) {
      setThumbnailName(imageResponses[imageIndex].name);
      const currentImageResponses = produce(imageResponses, draft => {
        for (const imageResponse of draft) {
          if (imageResponse.isThumbnail) {
            imageResponse.isThumbnail = false;
            break;
          }
        }
        draft[imageIndex].isThumbnail = true;
      });
      setImageResponses(currentImageResponses);
    }
  };

  const getIconColor = () => {
    if (isDragAccept || dropzoneStatus === 'accepted') return 'text-blue-600 dark:text-blue-400';
    if (isDragReject || dropzoneStatus === 'rejected') return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const ImageUploadIcon = isDragAccept || dropzoneStatus === 'accepted' ? Upload : (isDragReject || dropzoneStatus === 'rejected' ? X : Photo);

  const imageResponsesFragment = (imageResponses || []).map((imageResponse, index) => {
    if (!imageResponse.isEliminated) {
      const isThumbnail = imageResponse.name === thumbnailName;
      return (
        <div key={imageResponse.name} className="flex flex-col gap-2">
          <div className="relative">
            <img
              src={imageResponse.path}
              alt={imageResponse.name}
              title={imageResponse.name}
              className={`w-[115px] h-[115px] object-cover rounded-md ${
                isThumbnail ? 'ring-4 ring-teal-500 dark:ring-teal-400' : ''
              }`}
            />
          </div>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => handleSelectThumbnailButton(index, 'imageResponses')}
              disabled={isThumbnail}
              title="Chọn làm hình đại điện"
              className={`p-1.5 rounded transition-colors ${
                isThumbnail
                  ? 'opacity-50 cursor-not-allowed'
                  : 'text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20'
              }`}
            >
              <Check size={18}/>
            </button>
            <button
              onClick={() => handleDeleteImageButton(index, 'imageResponses')}
              title="Xóa hình này"
              className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
            >
              <X size={18}/>
            </button>
          </div>
        </div>
      );
    }
    return null;
  });

  const imageFilesFragment = imageFiles.map((imageFile, index) => {
    const isThumbnail = imageFile.name === thumbnailName;
    return (
      <div key={imageFile.name} className="flex flex-col gap-2">
        <div className="relative">
          <img
            src={imageFile.preview}
            alt={imageFile.name}
            title={imageFile.name}
            onLoad={() => URL.revokeObjectURL(imageFile.preview)}
            className={`w-[115px] h-[115px] object-cover rounded-md ${
              isThumbnail ? 'ring-4 ring-teal-500 dark:ring-teal-400' : ''
            }`}
          />
        </div>
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => handleSelectThumbnailButton(index, 'imageFiles')}
            disabled={isThumbnail}
            title="Chọn làm hình đại điện"
            className={`p-1.5 rounded transition-colors ${
              isThumbnail
                ? 'opacity-50 cursor-not-allowed'
                : 'text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20'
            }`}
          >
            <Check size={18}/>
          </button>
          <button
            onClick={() => handleDeleteImageButton(index, 'imageFiles')}
            title="Xóa hình này"
            className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
          >
            <X size={18}/>
          </button>
        </div>
      </div>
    );
  });

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => imageFiles.forEach((imageFile) => URL.revokeObjectURL(imageFile.preview));
  }, [imageFiles]);

  return (
    <>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? isDragAccept
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-red-500 bg-red-50 dark:bg-red-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-4 min-h-[125px] pointer-events-none">
          <ImageUploadIcon className={getIconColor()} size={80}/>
          <div>
            <p className="text-xl font-medium text-gray-900 dark:text-gray-100">
              Kéo thả hoặc bấm để chọn hình
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Dung lượng mỗi tập tin không quá 5 MB
            </p>
          </div>
        </div>
      </div>
      {(imageResponses || []).some((imageResponse) => !imageResponse.isEliminated) && (
        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-md flex flex-wrap gap-3">
          {imageResponsesFragment}
        </div>
      )}
      {imageFiles.length > 0 && (
        <>
          <div className="my-3 flex items-center gap-2">
            <div className="flex-1 border-t border-dashed border-gray-300 dark:border-gray-600"></div>
            <div className="flex items-center gap-2 px-3 text-sm text-gray-600 dark:text-gray-400">
              <CirclePlus size={12}/>
              <span>Hình mới thêm, chưa được lưu</span>
            </div>
            <div className="flex-1 border-t border-dashed border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md flex flex-wrap gap-3">
            {imageFilesFragment}
          </div>
          <button
            onClick={handleDeleteAllImagesButton}
            className="mt-3 px-4 py-2 text-sm font-medium text-pink-700 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/20 hover:bg-pink-100 dark:hover:bg-pink-900/30 rounded-md transition-colors"
          >
            Xóa tất cả hình
          </button>
        </>
      )}
      <Dialog open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-xs bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
            <Dialog.Title className="text-lg font-semibold mb-2">Xác nhận xóa</Dialog.Title>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Xóa tất cả hình?</p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
              >
                Không xóa
              </button>
              <button
                onClick={handleConfirmDeleteAll}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
              >
                Xóa
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}

export default ProductImagesDropzone;
