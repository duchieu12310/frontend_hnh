import React from 'react';
import { useParams } from 'react-router-dom';
import { CreateUpdateTitle, DefaultPropertyPanel } from 'components';
import ProvinceConfigs from 'pages/province/ProvinceConfigs';
import useProvinceUpdateViewModel from 'pages/province/ProvinceUpdate.vm';

function ProvinceUpdate() {
  const { id } = useParams();
  const {
    province,
    form,
    handleFormSubmit,
  } = useProvinceUpdateViewModel(Number(id));

  if (!province) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 max-w-4xl">
      <CreateUpdateTitle
        managerPath={ProvinceConfigs.managerPath}
        title={ProvinceConfigs.updateTitle}
      />

      <DefaultPropertyPanel
        id={province.id}
        createdAt={province.createdAt}
        updatedAt={province.updatedAt}
        createdBy="1"
        updatedBy="1"
      />

      <form onSubmit={handleFormSubmit}>
        <div className="p-4 rounded-md shadow-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col gap-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {ProvinceConfigs.properties.name.label} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  {...form.getInputProps('name')}
                />
                {form.errors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {ProvinceConfigs.properties.code.label} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  {...form.getInputProps('code')}
                />
                {form.errors.code && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors.code}</p>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 mt-2"></div>

            <div className="flex items-center justify-between p-2">
              <button
                type="button"
                onClick={form.reset}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Mặc định
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ProvinceUpdate;
