import React, { useState } from 'react';
import { CreateUpdateTitle, DefaultPropertyPanel } from 'components';
import UserConfigs from 'pages/user/UserConfigs';
import useUserCreateViewModel from 'pages/user/UserCreate.vm';
import { Eye, EyeOff } from 'tabler-icons-react';

function UserCreate() {
  const {
    form,
    handleFormSubmit,
    genderSelectList,
    provinceSelectList,
    districtSelectList,
    statusSelectList,
    roleSelectList,
  } = useUserCreateViewModel();

  const [showPassword, setShowPassword] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>(form.values.roles || []);

  const handleRoleToggle = (roleValue: string) => {
    const newRoles = selectedRoles.includes(roleValue)
      ? selectedRoles.filter(r => r !== roleValue)
      : [...selectedRoles, roleValue];
    setSelectedRoles(newRoles);
    form.setFieldValue('roles', newRoles);
  };

  return (
    <div className="flex flex-col gap-4 max-w-4xl">
      <CreateUpdateTitle
        managerPath={UserConfigs.managerPath}
        title={UserConfigs.createTitle}
      />

      <DefaultPropertyPanel/>

      <form onSubmit={handleFormSubmit}>
        <div className="p-4 rounded-md shadow-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col gap-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {UserConfigs.properties.username.label} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  {...form.getInputProps('username')}
                />
                {form.errors.username && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors.username}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {UserConfigs.properties.password.label} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    {...form.getInputProps('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {form.errors.password && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors.password}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {UserConfigs.properties.fullname.label} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  {...form.getInputProps('fullname')}
                />
                {form.errors.fullname && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors.fullname}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {UserConfigs.properties.email.label} <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  {...form.getInputProps('email')}
                />
                {form.errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {UserConfigs.properties.phone.label} <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  {...form.getInputProps('phone')}
                />
                {form.errors.phone && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors.phone}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {UserConfigs.properties.gender.label} <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  {...form.getInputProps('gender')}
                >
                  <option value="">--</option>
                  {genderSelectList.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {form.errors.gender && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors.gender}</p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {UserConfigs.properties['address.line'].label} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  {...form.getInputProps('address.line')}
                />
                {form.errors['address.line'] && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors['address.line']}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {UserConfigs.properties['address.provinceId'].label} <span className="text-red-500">*</span>
                </label>
                <select
                  required
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
                  {UserConfigs.properties['address.districtId'].label} <span className="text-red-500">*</span>
                </label>
                <select
                  required
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
                  {UserConfigs.properties.avatar.label}
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  {...form.getInputProps('avatar')}
                />
                {form.errors.avatar && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors.avatar}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {UserConfigs.properties.status.label} <span className="text-red-500">*</span>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {UserConfigs.properties.roles.label} <span className="text-red-500">*</span>
                </label>
                <div className="border border-gray-300 dark:border-gray-600 rounded-md p-2 min-h-[42px] bg-white dark:bg-gray-800">
                  <div className="flex flex-wrap gap-2">
                    {roleSelectList.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedRoles.includes(option.value)}
                          onChange={() => handleRoleToggle(option.value)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {form.errors.roles && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors.roles}</p>
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

export default UserCreate;
