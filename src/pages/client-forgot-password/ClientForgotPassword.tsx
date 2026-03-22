import React from 'react';
import useTitle from 'hooks/use-title';
import MiscUtils from 'utils/MiscUtils';
import { z } from 'zod';
import { useForm, zodResolver } from '@mantine/form';
import { useMutation } from 'react-query';
import { Empty } from 'types';
import FetchUtils, { ErrorMessage } from 'utils/FetchUtils';
import ResourceURL from 'constants/ResourceURL';
import NotifyUtils from 'utils/NotifyUtils';

function ClientForgotPassword() {
  useTitle();

  const initialFormValues = {
    email: '',
  };

  const formSchema = z.object({
    email: z.string({ invalid_type_error: 'Vui lòng không bỏ trống' })
      .email({ message: 'Nhập email đúng định dạng' }),
  });

  const form = useForm({
    initialValues: initialFormValues,
    schema: zodResolver(formSchema),
  });

  const forgotPasswordApi = useMutation<Empty, ErrorMessage, { email: string }>(
    (request) => FetchUtils.get(ResourceURL.CLIENT_FORGOT_PASSWORD, { email: request.email }),
    {
      onSuccess: () => NotifyUtils.simpleSuccess('Đã gửi email đổi mật khẩu thành công'),
      onError: () => NotifyUtils.simpleFailed('Gửi email không thành công'),
    }
  );

  const handleFormSubmit = form.onSubmit((formValues) => {
    forgotPasswordApi.mutate({ email: formValues.email });
  });

  return (
    <main>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Yêu cầu cấp lại mật khẩu</h2>

          <p className="text-sm text-gray-600 dark:text-gray-400">Nhập email của bạn để nhận thư chứa đường dẫn thay đổi mật khẩu</p>

          <div className="w-full max-w-md mt-5 p-8 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md bg-white dark:bg-gray-800">
            <form onSubmit={handleFormSubmit}>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="Nhập email của bạn"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    {...form.getInputProps('email')}
                  />
                  {form.errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors.email}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={MiscUtils.isEquals(initialFormValues, form.values) || forgotPasswordApi.isLoading}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-md transition-colors"
                >
                  Yêu cầu
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ClientForgotPassword;
