import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from 'react-query';
import { Empty, ResetPasswordRequest } from 'types';
import FetchUtils, { ErrorMessage } from 'utils/FetchUtils';
import ResourceURL from 'constants/ResourceURL';
import NotifyUtils from 'utils/NotifyUtils';
import { useForm, zodResolver } from '@mantine/form';
import { z } from 'zod';
import MessageUtils from 'utils/MessageUtils';
import MiscUtils from 'utils/MiscUtils';
import { Eye, EyeOff } from 'tabler-icons-react';

function ClientChangePassword() {
  const [searchParams] = useSearchParams();

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordAgain, setShowPasswordAgain] = useState(false);

  useEffect(() => {
    if (!token || !email) {
      navigate('/');
    }
  }, [email, navigate, token]);

  const formSchema = z.object({
    newPassword: z.string({ invalid_type_error: 'Vui lòng không bỏ trống' })
      .min(1, MessageUtils.min('Mật khẩu', 1)),
    newPasswordAgain: z.string({ invalid_type_error: 'Vui lòng không bỏ trống' })
      .min(1, MessageUtils.min('Mật khẩu', 1)),
  });

  const initialFormValues = {
    newPassword: '',
    newPasswordAgain: '',
  };

  const form = useForm({
    initialValues: initialFormValues,
    schema: zodResolver(formSchema),
  });

  const resetPasswordApi = useMutation<Empty, ErrorMessage, ResetPasswordRequest>(
    (requestBody) => FetchUtils.put(ResourceURL.CLIENT_RESET_PASSWORD, requestBody),
    {
      onSuccess: () => {
        NotifyUtils.simpleSuccess('Đổi mật khẩu mới thành công');
      },
      onError: () => NotifyUtils.simpleFailed('Đổi mật khẩu không thành công'),
    }
  );

  const handleFormSubmit = form.onSubmit((formValues) => {
    if (formValues.newPassword !== formValues.newPasswordAgain) {
      form.setFieldError('newPasswordAgain', 'Mật khẩu không trùng khớp');
    } else if (token && email) {
      const requestBody: ResetPasswordRequest = {
        token: token,
        email: email,
        password: formValues.newPassword,
      };

      resetPasswordApi.mutate(requestBody);
    }
  });

  return (
    <main>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Đổi mật khẩu</h2>

          <div className="w-full max-w-md mt-5 p-8 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md bg-white dark:bg-gray-800">
            <form onSubmit={handleFormSubmit}>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Mật khẩu mới <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Nhập mật khẩu mới"
                      className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      {...form.getInputProps('newPassword')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {form.errors.newPassword && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors.newPassword}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nhập lại mật khẩu mới <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswordAgain ? 'text' : 'password'}
                      required
                      placeholder="Nhập lại mật khẩu mới"
                      className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      {...form.getInputProps('newPasswordAgain')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordAgain(!showPasswordAgain)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPasswordAgain ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {form.errors.newPasswordAgain && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors.newPasswordAgain}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={MiscUtils.isEquals(initialFormValues, form.values) || resetPasswordApi.isLoading}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-md transition-colors"
                >
                  Đổi mật khẩu
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ClientChangePassword;
