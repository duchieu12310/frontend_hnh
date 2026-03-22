import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import MessageUtils from 'utils/MessageUtils';
import { useForm, zodResolver } from '@mantine/form';
import { Empty, RegistrationRequest, RegistrationResponse, SelectOption } from 'types';
import useTitle from 'hooks/use-title';
import useSelectAddress from 'hooks/use-select-address';
import useGetAllApi from 'hooks/use-get-all-api';
import { ProvinceResponse } from 'models/Province';
import ProvinceConfigs from 'pages/province/ProvinceConfigs';
import { DistrictResponse } from 'models/District';
import DistrictConfigs from 'pages/district/DistrictConfigs';
import { WardResponse } from 'models/Ward';
import WardConfigs from 'pages/ward/WardConfigs';
import { useMutation } from 'react-query';
import { UserRequest } from 'models/User';
import FetchUtils, { ErrorMessage } from 'utils/FetchUtils';
import ResourceURL from 'constants/ResourceURL';
import NotifyUtils from 'utils/NotifyUtils';
import useAuthStore from 'stores/use-auth-store';
import { Check, MailOpened, ShieldCheck, UserCheck, Eye, EyeOff } from 'tabler-icons-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import MiscUtils from 'utils/MiscUtils';
import { Dialog } from '@headlessui/react';
import { useColorScheme } from 'hooks/use-color-scheme';
const genderSelectList: SelectOption[] = [
  {
    value: 'M',
    label: 'Nam',
  },
  {
    value: 'F',
    label: 'Nữ',
  },
];

function ClientSignup() {
  useTitle();

  const { user, currentSignupUserId } = useAuthStore();

  const [searchParams] = useSearchParams();

  const userId = searchParams.get('userId') || currentSignupUserId;

  const currentStep = userId ? 1 : 0; // Nếu có userId thì nhảy sang bước 2

  const [active, setActive] = useState(currentStep);

  const nextStep = () => setActive((current) => current < 1 ? current + 1 : (current === 1 ? 3 : current));

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [navigate, user]);

  const steps = [
    { icon: UserCheck, label: 'Bước 1', description: 'Tạo tài khoản' },
    { icon: MailOpened, label: 'Bước 2', description: 'Xác nhận email' },
    { icon: ShieldCheck, label: 'Bước 3', description: 'Đăng ký thành công' },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">Đăng ký tài khoản</h2>
          <p className="text-gray-600 dark:text-gray-400">Tạo tài khoản để trải nghiệm tốt nhất</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 sm:p-12">
          {/* Stepper */}
          <div className="mb-12">
            <div className="flex items-center justify-between relative">
              {/* Progress line */}
              <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 -z-0">
                <div 
                  className="h-full bg-gradient-to-r from-teal-600 to-emerald-600 transition-all duration-500"
                  style={{ width: `${(active / (steps.length - 1)) * 100}%` }}
                />
              </div>
              
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = active === index;
                const isCompleted = active > index;
                const isLast = index === steps.length - 1;

                return (
                  <React.Fragment key={index}>
                    <div className="flex flex-col items-center flex-1 relative z-10">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                          isActive
                            ? 'bg-gradient-to-r from-teal-600 to-emerald-600 border-teal-600 text-white shadow-lg scale-110'
                            : isCompleted
                            ? 'bg-gradient-to-r from-teal-600 to-emerald-600 border-teal-600 text-white shadow-md'
                            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400'
                        }`}
                      >
                        <Icon size={20} />
                      </div>
                      <div className="mt-3 text-center">
                        <p className={`text-sm font-semibold transition-colors ${
                          isActive 
                            ? 'text-teal-600 dark:text-teal-400' 
                            : isCompleted
                            ? 'text-teal-600 dark:text-teal-400'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {step.label}
                        </p>
                        <p className={`text-xs mt-1 transition-colors ${
                          isActive 
                            ? 'text-gray-700 dark:text-gray-300' 
                            : 'text-gray-500 dark:text-gray-500'
                        }`}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Step Content */}
          <div className="pt-8">
            {active === 0 && <ClientSignupStepOne nextStep={nextStep} />}
            {active === 1 && <ClientSignupStepTwo nextStep={nextStep} userId={Number(userId) || null} />}
            {active === 2 && <ClientSignupStepThree />}
          </div>
        </div>
      </div>
    </main>
  );
}

function ClientSignupStepOne({ nextStep }: { nextStep: () => void }) {
  const { updateCurrentSignupUserId } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const initialFormValues = {
    username: '',
    password: '',
    fullname: '',
    email: '',
    phone: '',
    gender: 'M' as 'M' | 'F',
    'address.line': '',
    'address.provinceId': null as string | null,
    'address.districtId': null as string | null,
    'address.wardId': null as string | null,
    avatar: null, // Không dùng
    status: '2', // Không dùng
    roles: [] as string[], // Không dùng
  };

  const formSchema = z.object({
    username: z.string({ invalid_type_error: 'Vui lòng không bỏ trống' })
      .min(2, MessageUtils.min('Tên tài khoản', 2)),
    password: z.string({ invalid_type_error: 'Vui lòng không bỏ trống' })
      // .min(1, MessageUtils.min('Mật khẩu', 1)),
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{6,})/,
        'Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường và ký tự đặc biệt'
      ),
    fullname: z.string({ invalid_type_error: 'Vui lòng không bỏ trống' }),
    email: z.string({ invalid_type_error: 'Vui lòng không bỏ trống' })
      .email({ message: 'Nhập email đúng định dạng' }),
    phone: z.string({ invalid_type_error: 'Vui lòng không bỏ trống' })
      .regex(/(((\+|)84)|0)[1-9][0-9]{8}\b/, { message: 'Nhập số điện thoại đúng định dạng' }),
    gender: z.string({ invalid_type_error: 'Vui lòng không bỏ trống' }),
    'address.line': z.string({ invalid_type_error: 'Vui lòng không bỏ trống' }),
    'address.provinceId': z.string({ invalid_type_error: 'Vui lòng không bỏ trống' }),
    'address.districtId': z.string({ invalid_type_error: 'Vui lòng không bỏ trống' }),
    'address.wardId': z.string({ invalid_type_error: 'Vui lòng không bỏ trống' }),
    avatar: z.string().nullable(),
    status: z.string(),
    roles: z.array(z.string()),
  });

  const form = useForm({
    initialValues: initialFormValues,
    schema: zodResolver(formSchema),
  });

  useSelectAddress(form, 'address.provinceId', 'address.districtId', 'address.wardId');

  const [provinceSelectList, setProvinceSelectList] = useState<SelectOption[]>([]);
  const [districtSelectList, setDistrictSelectList] = useState<SelectOption[]>([]);
  const [wardSelectList, setWardSelectList] = useState<SelectOption[]>([]);

  useGetAllApi<ProvinceResponse>(ProvinceConfigs.resourceUrl, ProvinceConfigs.resourceKey,
    { all: 1 },
    (provinceListResponse) => {
      const selectList: SelectOption[] = provinceListResponse.content.map((item) => ({
        value: String(item.id),
        label: item.name,
      }));
      setProvinceSelectList(selectList);
    },
    { refetchOnWindowFocus: false }
  );
  useGetAllApi<DistrictResponse>(DistrictConfigs.resourceUrl, DistrictConfigs.resourceKey,
    { all: 1, filter: `province.id==${form.values['address.provinceId'] || 0}` },
    (districtListResponse) => {
      const selectList: SelectOption[] = districtListResponse.content.map((item) => ({
        value: String(item.id),
        label: item.name,
      }));
      setDistrictSelectList(selectList);
    },
    { refetchOnWindowFocus: false }
  );
  useGetAllApi<WardResponse>(WardConfigs.resourceUrl, WardConfigs.resourceKey,
    { all: 1, filter: `district.id==${form.values['address.districtId'] || 0}` },
    (wardListResponse) => {
      const selectList: SelectOption[] = wardListResponse.content.map((item) => ({
        value: String(item.id),
        label: item.name,
      }));
      setWardSelectList(selectList);
    },
    { refetchOnWindowFocus: false }
  );

  const registerUserApi = useMutation<RegistrationResponse, ErrorMessage, UserRequest>(
    (requestBody) => FetchUtils.post(ResourceURL.CLIENT_REGISTRATION, requestBody),
    {
      onSuccess: (registrationResponse) => {
        NotifyUtils.simpleSuccess('Tạo tài khoản thành công');
        updateCurrentSignupUserId(registrationResponse.userId);
        nextStep();
      },
      onError: () => NotifyUtils.simpleFailed('Tạo tài khoản không thành công'),
    }
  );

  const handleFormSubmit = form.onSubmit((formValues) => {
    const requestBody: UserRequest = {
      username: formValues.username,
      password: formValues.password,
      fullname: formValues.fullname,
      email: formValues.email,
      phone: formValues.phone,
      gender: formValues.gender,
      address: {
        line: formValues['address.line'],
        provinceId: Number(formValues['address.provinceId']),
        districtId: Number(formValues['address.districtId']),
        wardId: Number(formValues['address.wardId']),
      },
      avatar: formValues.avatar,
      status: Number(formValues.status),
      roles: [],
    };

    registerUserApi.mutate(requestBody);
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleFormSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Tên tài khoản <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Nhập tên tài khoản mong muốn"
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
              {...form.getInputProps('username')}
            />
            {form.errors.username && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <span>•</span> {form.errors.username}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Mật khẩu <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Nhập mật khẩu mong muốn"
                className="w-full px-4 py-3 pr-12 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                {...form.getInputProps('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
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

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Nhập họ và tên của bạn"
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
              {...form.getInputProps('fullname')}
            />
            {form.errors.fullname && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <span>•</span> {form.errors.fullname}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              placeholder="Nhập email của bạn"
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
              {...form.getInputProps('email')}
            />
            {form.errors.email && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <span>•</span> {form.errors.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              required
              placeholder="Nhập số điện thoại của bạn"
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
              {...form.getInputProps('phone')}
            />
            {form.errors.phone && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <span>•</span> {form.errors.phone}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Giới tính <span className="text-red-500">*</span>
            </label>
            <select
              required
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
              {...form.getInputProps('gender')}
            >
              <option value="">Chọn giới tính</option>
              {genderSelectList.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {form.errors.gender && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <span>•</span> {form.errors.gender}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Tỉnh thành <span className="text-red-500">*</span>
            </label>
            <select
              required
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
              {...form.getInputProps('address.provinceId')}
            >
              <option value="">Chọn tỉnh thành</option>
              {provinceSelectList.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {form.errors['address.provinceId'] && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <span>•</span> {form.errors['address.provinceId']}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Quận huyện <span className="text-red-500">*</span>
            </label>
            <select
              required
              disabled={form.values['address.provinceId'] === null}
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
              {...form.getInputProps('address.districtId')}
            >
              <option value="">Chọn quận huyện</option>
              {districtSelectList.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {form.errors['address.districtId'] && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <span>•</span> {form.errors['address.districtId']}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Phường xã <span className="text-red-500">*</span>
            </label>
            <select
              required
              disabled={form.values['address.districtId'] === null}
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
              {...form.getInputProps('address.wardId')}
            >
              <option value="">Chọn phường xã</option>
              {wardSelectList.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {form.errors['address.wardId'] && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <span>•</span> {form.errors['address.wardId']}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Địa chỉ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Nhập địa chỉ của bạn"
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
              {...form.getInputProps('address.line')}
            />
            {form.errors['address.line'] && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <span>•</span> {form.errors['address.line']}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={MiscUtils.isEquals(initialFormValues, form.values) || registerUserApi.isLoading}
              className="w-full px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:transform-none"
            >
              {registerUserApi.isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function ClientSignupStepTwo({ nextStep, userId }: { nextStep: () => void, userId: number | null }) {
  const { colorScheme } = useColorScheme();
  const { updateCurrentSignupUserId } = useAuthStore();

  const [resendTokenDialogOpen, setResendTokenDialogOpen] = useState(false);
  const [changeEmailDialogOpen, setChangeEmailDialogOpen] = useState(false);

  const initialFormValues = {
    token: '',
  };

  const formSchema = z.object({
    token: z.string({ invalid_type_error: 'Vui lòng không bỏ trống' }),
  });

  const form = useForm({
    initialValues: initialFormValues,
    schema: zodResolver(formSchema),
  });

  const confirmRegistrationApi = useMutation<void, ErrorMessage, RegistrationRequest>(
    (requestBody) => FetchUtils.post(ResourceURL.CLIENT_REGISTRATION_CONFIRM, requestBody),
    {
      onSuccess: () => {
        NotifyUtils.simpleSuccess('Xác nhận tài khoản thành công');
        updateCurrentSignupUserId(null);
        nextStep();
      },
      onError: () => NotifyUtils.simpleFailed('Xác nhận tài khoản không thành công'),
    }
  );

  const resendRegistrationTokenApi = useMutation<Empty, ErrorMessage, { userId: number }>(
    (request) => FetchUtils.get(ResourceURL.CLIENT_REGISTRATION_RESEND_TOKEN(request.userId)),
    {
      onSuccess: () => {
        NotifyUtils.simpleSuccess('Đã gửi lại mã xác nhận thành công');
        setResendTokenDialogOpen(false);
      },
      onError: () => NotifyUtils.simpleFailed('Gửi lại mã xác nhận không thành công'),
    }
  );

  const handleFormSubmit = form.onSubmit((formValues) => {
    if (userId) {
      const requestBody: RegistrationRequest = {
        userId: userId,
        token: formValues.token,
      };

      confirmRegistrationApi.mutate(requestBody);
    }
  });

  const handleResendTokenButton = () => {
    setResendTokenDialogOpen(true);
  };

  const handleResendTokenWithNewEmailButton = () => {
    setChangeEmailDialogOpen(true);
  };

  return (
    <>
      <div className="w-full max-w-md mx-auto">
        <div className="flex flex-col gap-6">
          <form onSubmit={handleFormSubmit}>
            <div className="flex flex-col gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Mã xác nhận <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nhập mã xác nhận đã gửi"
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                  {...form.getInputProps('token')}
                />
                {form.errors.token && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <span>•</span> {form.errors.token}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={MiscUtils.isEquals(initialFormValues, form.values) || confirmRegistrationApi.isLoading}
                className="w-full px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:transform-none"
              >
                {confirmRegistrationApi.isLoading ? 'Đang xác nhận...' : 'Xác nhận'}
              </button>
            </div>
          </form>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium">hoặc</span>
            </div>
          </div>

          <button
            onClick={handleResendTokenButton}
            className="w-full px-6 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-all duration-200"
          >
            Gửi mã xác nhận lần nữa
          </button>

          <button
            onClick={handleResendTokenWithNewEmailButton}
            className="w-full px-6 py-3 border-2 border-teal-200 dark:border-teal-700 rounded-xl bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/30 font-medium transition-all duration-200"
          >
            Gửi mã xác nhận lần nữa với email mới
          </button>
        </div>
      </div>

      {/* Resend Token Dialog */}
      <Dialog open={resendTokenDialogOpen} onClose={() => setResendTokenDialogOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-2xl">
            <Dialog.Title className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              Gửi lại mã xác nhận
            </Dialog.Title>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Bạn có muốn gửi lại mã xác nhận đến email đã nhập trước đó?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setResendTokenDialogOpen(false)}
                className="px-6 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-all duration-200"
              >
                Đóng
              </button>
              <button
                onClick={() => userId && resendRegistrationTokenApi.mutate({ userId })}
                disabled={resendRegistrationTokenApi.isLoading}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {resendRegistrationTokenApi.isLoading ? 'Đang gửi...' : 'Gửi'}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Change Email Dialog */}
      <Dialog open={changeEmailDialogOpen} onClose={() => setChangeEmailDialogOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-2xl">
            <Dialog.Title className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Thay đổi email
            </Dialog.Title>
            <ChangeEmailModal userId={userId} onClose={() => setChangeEmailDialogOpen(false)} />
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}

function ClientSignupStepThree() {
  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <div className="relative">
        <div className="absolute inset-0 bg-teal-200 dark:bg-teal-800 rounded-full animate-ping opacity-20"></div>
        <div className="relative bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full p-6 shadow-lg">
          <Check size={64} strokeWidth={2.5} className="text-white" />
        </div>
      </div>
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Đăng ký thành công!
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Tài khoản của bạn đã được tạo và xác nhận thành công
        </p>
      </div>
      <Link
        to="/signin"
        className="mt-4 px-8 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
      >
        Đăng nhập ngay
      </Link>
    </div>
  );
}

function ChangeEmailModal({ userId, onClose }: { userId: number | null; onClose: () => void }) {

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

  const changeRegistrationEmailApi = useMutation<Empty, ErrorMessage, { userId: number, email: string }>(
    (request) => FetchUtils.put(
      ResourceURL.CLIENT_REGISTRATION_CHANGE_EMAIL(request.userId),
      {},
      { email: request.email }
    ),
    {
      onSuccess: () => {
        NotifyUtils.simpleSuccess('Đã đổi email thành công và đã gửi lại mã xác nhận mới');
        onClose();
      },
      onError: () => NotifyUtils.simpleFailed('Thay đổi email không thành công'),
    }
  );

  const handleFormSubmit = form.onSubmit((formValues) => {
    if (userId) {
      changeRegistrationEmailApi.mutate({ userId: userId, email: formValues.email });
    }
  });

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="flex flex-col gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Email mới <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            autoFocus
            required
            placeholder="Nhập email mới"
            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
            {...form.getInputProps('email')}
          />
          {form.errors.email && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
              <span>•</span> {form.errors.email}
            </p>
          )}
        </div>
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-all duration-200"
          >
            Đóng
          </button>
          <button
            type="submit"
            disabled={MiscUtils.isEquals(initialFormValues, form.values) || changeRegistrationEmailApi.isLoading}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {changeRegistrationEmailApi.isLoading ? 'Đang xử lý...' : 'Thay đổi và Gửi'}
          </button>
        </div>
      </div>
    </form>
  );
}

export default ClientSignup;
