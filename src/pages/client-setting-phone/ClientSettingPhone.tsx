import React from 'react';
import useTitle from 'hooks/use-title';
import { ClientUserNavbar } from 'components';
import MiscUtils from 'utils/MiscUtils';
import { z } from 'zod';
import useAuthStore from 'stores/use-auth-store';
import { useForm, zodResolver } from '@mantine/form';
import { useMutation } from 'react-query';
import FetchUtils, { ErrorMessage } from 'utils/FetchUtils';
import ResourceURL from 'constants/ResourceURL';
import NotifyUtils from 'utils/NotifyUtils';
import { UserResponse } from 'models/User';
import { ClientPhoneSettingUserRequest } from 'types';

const formSchema = z.object({
  // Source: https://fozg.net/blog/validate-vietnamese-phone-number
  phone: z.string({ invalid_type_error: 'Vui lòng không bỏ trống' })
    .regex(/(((\+|)84)|0)[1-9][0-9]{8}\b/, { message: 'Nhập số điện thoại đúng định dạng' }),
});

function ClientSettingPhone() {
  useTitle();

  const { user, updateUser } = useAuthStore();

  const initialFormValues = {
    phone: user?.phone as string,
  };

  const form = useForm({
    initialValues: initialFormValues,
    schema: zodResolver(formSchema),
  });

  const updatePhoneSettingApi = useMutation<UserResponse, ErrorMessage, ClientPhoneSettingUserRequest>(
    (requestBody) => FetchUtils.postWithToken(ResourceURL.CLIENT_USER_PHONE_SETTING, requestBody),
    {
      onSuccess: (userResponse) => {
        updateUser(userResponse);
        NotifyUtils.simpleSuccess('Cập nhật thành công');
      },
      onError: () => NotifyUtils.simpleFailed('Cập nhật không thành công'),
    }
  );

  const handleFormSubmit = form.onSubmit((formValues) => {
    const requestBody: ClientPhoneSettingUserRequest = {
      phone: formValues.phone,
    };

    updatePhoneSettingApi.mutate(requestBody);
  });

  return (
    <main>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-3">
            <ClientUserNavbar />
          </div>

          <div className="md:col-span-9">
            <div className="p-6 rounded-md shadow-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col gap-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Cập nhật số điện thoại
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <form onSubmit={handleFormSubmit}>
                    <div className="flex flex-col gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Số điện thoại <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="Nhập số điện thoại của bạn"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          {...form.getInputProps('phone')}
                        />
                        {form.errors.phone && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors.phone}</p>
                        )}
                      </div>
                      <button
                        type="submit"
                        disabled={MiscUtils.isEquals(initialFormValues, form.values) || updatePhoneSettingApi.isLoading}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-md transition-colors"
                      >
                        Cập nhật
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ClientSettingPhone;
