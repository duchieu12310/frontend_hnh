import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useTitle from 'hooks/use-title';
import { z } from 'zod';
import MessageUtils from 'utils/MessageUtils';
import { useForm, zodResolver } from '@mantine/form';
import { JwtResponse, LoginRequest } from 'models/Authentication';
import { useMutation } from 'react-query';
import FetchUtils, { ErrorMessage } from 'utils/FetchUtils';
import ResourceURL from 'constants/ResourceURL';
import NotifyUtils from 'utils/NotifyUtils';
import useAuthStore from 'stores/use-auth-store';
import { UserResponse } from 'models/User';
import { AlertCircle, Eye, EyeOff, ArrowLeft } from 'tabler-icons-react';
import { ClientCartResponse, Empty } from 'types';
import booksBg from 'assets/auth/books_bg.png';

const initialFormValues = {
  username: '',
  password: '',
};

const formSchema = z.object({
  username: z.string({ invalid_type_error: 'Vui lòng không bỏ trống' })
    .min(2, MessageUtils.min('Tên tài khoản', 2)),
  password: z.string({ invalid_type_error: 'Vui lòng không bỏ trống' })
    .min(1, MessageUtils.min('Mật khẩu', 1)),
});

function ClientSignin() {
  useTitle();

  const {
    user,
    updateJwtToken,
    updateUser,
    resetAuthState,
    updateCurrentCartId,
    updateCurrentTotalCartItems,
  } = useAuthStore();

  const [counter, setCounter] = useState(1);
  const [openedAlert, setOpenedAlert] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const form = useForm({
    initialValues: initialFormValues,
    schema: zodResolver(formSchema),
  });

  const loginApi = useMutation<JwtResponse, ErrorMessage, LoginRequest>(
    (requestBody) => FetchUtils.post(ResourceURL.LOGIN, requestBody)
  );

  const userInfoApi = useMutation<UserResponse, ErrorMessage>(
    _ => FetchUtils.getWithToken(ResourceURL.CLIENT_USER_INFO, undefined, false)
  );

  const cartApi = useMutation<ClientCartResponse | Empty, ErrorMessage>(
    _ => FetchUtils.getWithToken(ResourceURL.CLIENT_CART, undefined, false)
  );

  useEffect(() => {
    if (openedAlert && user && counter > 0) {
      setTimeout(() => setCounter(counter - 1), 1000);
    }

    if (counter === 0) {
      navigate('/');
    }
  }, [counter, navigate, openedAlert, user]);

  const handleFormSubmit = form.onSubmit(async (formValues) => {
    if (!user) {
      const loginRequest: LoginRequest = {
        username: formValues.username,
        password: formValues.password,
      };

      try {
        const jwtResponse = await loginApi.mutateAsync(loginRequest);
        updateJwtToken(jwtResponse.token);

        const userResponse = await userInfoApi.mutateAsync();
        updateUser(userResponse);

        const cartResponse = await cartApi.mutateAsync();
        // Reference: https://stackoverflow.com/a/136411
        if (Object.hasOwn(cartResponse, 'cartId')) {
          updateCurrentCartId(cartResponse.cartId);
          updateCurrentTotalCartItems(cartResponse.cartItems.length);
        } else {
          updateCurrentCartId(null);
          updateCurrentTotalCartItems(0);
        }

        NotifyUtils.simpleSuccess('Đăng nhập thành công');
        setOpenedAlert(true);
      } catch (e) {
        resetAuthState();
        NotifyUtils.simpleFailed('Đăng nhập thất bại');
      }
    }
  });

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Back to Home Button */}
      <Link
        to="/"
        className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 hover:shadow-lg transition-all duration-200 z-50"
      >
        <ArrowLeft size={18} />
        Trở về trang chủ
      </Link>
      <div className="w-full max-w-6xl">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden grid md:grid-cols-2 min-h-[600px]">
          {/* Left side - Form */}
          <div className="flex flex-col justify-center p-8 sm:p-12">
            <div className="w-full max-w-md mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Đăng nhập
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Chào mừng bạn trở lại!
                </p>
              </div>

              {openedAlert && (
                <div
                  className={`mb-6 p-4 rounded-lg bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 border border-teal-200 dark:border-teal-800 transition-all duration-500 ${openedAlert ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
                    }`}
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle size={20} className="text-teal-600 dark:text-teal-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-teal-900 dark:text-teal-100">Bạn đã đăng nhập thành công!</p>
                      <p className="text-sm text-teal-800 dark:text-teal-200 mt-1">
                        Trở về trang chủ trong vòng {counter} giây...
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Tên tài khoản <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nhập tên tài khoản của bạn"
                    disabled={!!user}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                    {...form.getInputProps('username')}
                  />
                  {form.errors.username && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <span>•</span> {form.errors.username}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Mật khẩu <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Nhập mật khẩu của bạn"
                      disabled={!!user}
                      className="w-full px-4 py-3 pr-12 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                      {...form.getInputProps('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={!!user}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {form.errors.password && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <span>•</span> {form.errors.password}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <Link
                    to="/forgot"
                    className="text-sm font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={!!user || loginApi.isLoading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:transform-none"
                >
                  {loginApi.isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  Không có tài khoản?{' '}
                  <Link
                    to="/signup"
                    className="font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
                  >
                    Đăng ký ngay
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Right side - Image/Decoration */}
          <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-12 relative overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-60"
              style={{ backgroundImage: `url(${booksBg})` }}
            ></div>
            <div className="relative z-10 text-center text-white">
              <div className="mb-6">
                <div className="inline-block p-4 bg-white/20 backdrop-blur-md rounded-2xl mb-4">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
              <h3 className="text-4xl font-extrabold mb-4 tracking-tight">Thế Giới Sách</h3>
              <p className="text-lg text-white/90 max-w-md font-medium leading-relaxed">
                Khám phá tri thức mênh mông qua từng trang sách tinh tuyển
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ClientSignin;
