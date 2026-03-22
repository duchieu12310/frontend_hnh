import React from 'react';
import { CreateUpdateTitle, DefaultPropertyPanel } from 'components';
import SupplierConfigs from 'pages/supplier/SupplierConfigs';
import useSupplierCreateViewModel from 'pages/supplier/SupplierCreate.vm';

function SupplierCreate() {
  const {
    form,
    handleFormSubmit,
    provinceSelectList,
    districtSelectList,
    statusSelectList,
  } = useSupplierCreateViewModel();

  return (
    <div className="flex flex-col gap-4 max-w-4xl">
      <CreateUpdateTitle
        managerPath={SupplierConfigs.managerPath}
        title={SupplierConfigs.createTitle}
      />

      <DefaultPropertyPanel/>

      <form onSubmit={handleFormSubmit}>
        <div className="p-4 rounded-md shadow-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col gap-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-2">
              <div className="sm:col-span-2">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Thông tin cơ bản</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Một số thông tin chung</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {SupplierConfigs.properties.displayName.label} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  {...form.getInputProps('displayName')}
                />
                {form.errors.displayName && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors.displayName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {SupplierConfigs.properties.code.label} <span className="text-red-500">*</span>
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
              <div className="sm:col-span-2">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Người liên hệ</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Thông tin người liên hệ khi đặt hàng, mua hàng</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {SupplierConfigs.properties.contactFullname.label}
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  {...form.getInputProps('contactFullname')}
                />
                {form.errors.contactFullname && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors.contactFullname}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {SupplierConfigs.properties.contactEmail.label}
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  {...form.getInputProps('contactEmail')}
                />
                {form.errors.contactEmail && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors.contactEmail}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {SupplierConfigs.properties.contactPhone.label}
                </label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  {...form.getInputProps('contactPhone')}
                />
                {form.errors.contactPhone && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors.contactPhone}</p>
                )}
              </div>
              <div className="sm:col-span-2">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Thông tin công ty</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Thông tin chi tiết nhà cung cấp</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {SupplierConfigs.properties.companyName.label}
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  {...form.getInputProps('companyName')}
                />
                {form.errors.companyName && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors.companyName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {SupplierConfigs.properties.taxCode.label}
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  {...form.getInputProps('taxCode')}
                />
                {form.errors.taxCode && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors.taxCode}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {SupplierConfigs.properties.email.label}
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  {...form.getInputProps('email')}
                />
                {form.errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {SupplierConfigs.properties.phone.label}
                </label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  {...form.getInputProps('phone')}
                />
                {form.errors.phone && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors.phone}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {SupplierConfigs.properties.fax.label}
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  {...form.getInputProps('fax')}
                />
                {form.errors.fax && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors.fax}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {SupplierConfigs.properties.website.label}
                </label>
                <input
                  type="url"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  {...form.getInputProps('website')}
                />
                {form.errors.website && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors.website}</p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {SupplierConfigs.properties['address.line'].label}
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  {...form.getInputProps('address.line')}
                />
                {form.errors['address.line'] && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors['address.line']}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {SupplierConfigs.properties['address.provinceId'].label}
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  {...form.getInputProps('address.provinceId')}
                >
                  <option value="">--</option>
                  {provinceSelectList.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {form.errors['address.provinceId'] && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors['address.provinceId']}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {SupplierConfigs.properties['address.districtId'].label}
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  {...form.getInputProps('address.districtId')}
                >
                  <option value="">--</option>
                  {districtSelectList.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {form.errors['address.districtId'] && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors['address.districtId']}</p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {SupplierConfigs.properties.description.label}
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
                  {...form.getInputProps('description')}
                />
                {form.errors.description && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors.description}</p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {SupplierConfigs.properties.note.label}
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
                  {...form.getInputProps('note')}
                />
                {form.errors.note && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors.note}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {SupplierConfigs.properties.status.label} <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  {...form.getInputProps('status')}
                >
                  <option value="">--</option>
                  {statusSelectList.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {form.errors.status && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors.status}</p>
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
                Thêm
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SupplierCreate;
