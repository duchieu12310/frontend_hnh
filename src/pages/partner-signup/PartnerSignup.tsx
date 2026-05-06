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
import { Check, MailOpened, ShieldCheck, UserCheck, Eye, EyeOff, ArrowLeft, Building, Refresh, Edit, Trash } from 'tabler-icons-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import MiscUtils from 'utils/MiscUtils';
import { Dialog } from '@headlessui/react';
import { useColorScheme } from 'hooks/use-color-scheme';

const genderSelectList: SelectOption[] = [
  { value: 'M', label: 'Nam' },
  { value: 'F', label: 'Nữ' },
];

const roleSelectList: SelectOption[] = [
  { value: '2', label: 'Quản lý (Manager)' },
  { value: '3', label: 'Nhân viên vận hành (Operator)' },
];

function PartnerSignup() {
  useTitle('Đăng ký đối tác');

  const { user, currentSignupUserId } = useAuthStore();
  const [searchParams] = useSearchParams();
  const userIdFromUrl = searchParams.get('userId');
  const userId = userIdFromUrl || currentSignupUserId;
  const currentStep = userId ? 1 : 0;
  const [active, setActive] = useState(currentStep);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [navigate, user]);

  const nextStep = () => setActive((current) => current < 1 ? current + 1 : (current === 1 ? 3 : current));

  const steps = [
    { icon: UserCheck, label: 'Bước 1', description: 'Thông tin đối tác' },
    { icon: MailOpened, label: 'Bước 2', description: 'Xác nhận email' },
    { icon: ShieldCheck, label: 'Bước 3', description: 'Chờ phê duyệt' },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8 relative">
      <Link
        to="/"
        className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-lg transition-all duration-200 z-50"
      >
        <ArrowLeft size={18} />
        Trở về trang chủ
      </Link>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2 italic">Đăng ký Đối tác hệ thống</h2>
          <p className="text-gray-600 dark:text-gray-400">Trở thành một phần của đội ngũ quản lý và vận hành</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 sm:p-12 border-t-4 border-blue-600">
          {/* Stepper */}
          <div className="mb-12">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 -z-0">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500"
                  style={{ width: `${(active / (steps.length - 1)) * 100}%` }}
                />
              </div>
              
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = active === index;
                const isCompleted = active > index;

                return (
                  <React.Fragment key={index}>
                    <div className="flex flex-col items-center flex-1 relative z-10">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                          isActive
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 border-blue-600 text-white shadow-lg scale-110'
                            : isCompleted
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 border-blue-600 text-white shadow-md'
                            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400'
                        }`}
                      >
                        <Icon size={20} />
                      </div>
                      <div className="mt-3 text-center">
                        <p className={`text-sm font-semibold transition-colors ${isActive || isCompleted ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
                          {step.label}
                        </p>
                        <p className={`text-xs mt-1 transition-colors ${isActive ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-500'}`}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          <div className="pt-8">
            {active === 0 && <PartnerSignupStepOne nextStep={nextStep} />}
            {active === 1 && <PartnerSignupStepTwo nextStep={nextStep} userId={Number(userId) || null} setActive={setActive} />}
            {active === 2 && <PartnerSignupStepThree />}
          </div>
        </div>
      </div>
    </main>
  );
}

function PartnerSignupStepOne({ nextStep }: { nextStep: () => void }) {
  const { updateCurrentSignupUserId } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const initialFormValues = {
    username: '',
    password: '',
    fullname: '',
    email: '',
    phone: '',
    gender: 'M' as 'M' | 'F',
    roleId: '2',
    'address.line': '',
    'address.provinceId': null as string | null,
    'address.districtId': null as string | null,
    'address.wardId': null as string | null,
  };

  const formSchema = z.object({
    username: z.string().min(2, MessageUtils.min('Tên tài khoản', 2)),
    password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{6,})/, 'Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường và ký tự đặc biệt'),
    fullname: z.string().min(1, 'Vui lòng nhập họ tên'),
    email: z.string().email('Nhập email đúng định dạng'),
    phone: z.string().regex(/(((\+|)84)|0)[1-9][0-9]{8}\b/, 'Nhập số điện thoại đúng định dạng'),
    gender: z.string(),
    roleId: z.string(),
    'address.line': z.string().min(1, 'Vui lòng nhập địa chỉ'),
    'address.provinceId': z.string().min(1, 'Vui lòng chọn tỉnh thành'),
    'address.districtId': z.string().min(1, 'Vui lòng chọn quận huyện'),
    'address.wardId': z.string().min(1, 'Vui lòng chọn phường xã'),
  });

  const form = useForm({
    initialValues: initialFormValues,
    schema: zodResolver(formSchema),
  });

  useSelectAddress(form, 'address.provinceId', 'address.districtId', 'address.wardId');

  const [provinceSelectList, setProvinceSelectList] = useState<SelectOption[]>([]);
  const [districtSelectList, setDistrictSelectList] = useState<SelectOption[]>([]);
  const [wardSelectList, setWardSelectList] = useState<SelectOption[]>([]);

  useGetAllApi<ProvinceResponse>(ProvinceConfigs.resourceUrl, ProvinceConfigs.resourceKey, { all: 1 }, (res) => {
    setProvinceSelectList(res.content.map(i => ({ value: String(i.id), label: i.name })));
  });
  useGetAllApi<DistrictResponse>(DistrictConfigs.resourceUrl, DistrictConfigs.resourceKey, { all: 1, filter: `province.id==${form.values['address.provinceId'] || 0}` }, (res) => {
    setDistrictSelectList(res.content.map(i => ({ value: String(i.id), label: i.name })));
  });
  useGetAllApi<WardResponse>(WardConfigs.resourceUrl, WardConfigs.resourceKey, { all: 1, filter: `district.id==${form.values['address.districtId'] || 0}` }, (res) => {
    setWardSelectList(res.content.map(i => ({ value: String(i.id), label: i.name })));
  });

  const registerApi = useMutation<RegistrationResponse, ErrorMessage, UserRequest>(
    (body) => FetchUtils.post(ResourceURL.PARTNER_REGISTRATION, body),
    {
      onSuccess: (res) => {
        NotifyUtils.simpleSuccess('Tạo yêu cầu đăng ký thành công');
        updateCurrentSignupUserId(res.userId);
        nextStep();
      },
      onError: (err) => NotifyUtils.simpleFailed(err.message || 'Lỗi đăng ký'),
    }
  );

  const handleFormSubmit = form.onSubmit((values) => {
    const body: UserRequest = {
      username: values.username,
      password: values.password,
      fullname: values.fullname,
      email: values.email,
      phone: values.phone,
      gender: values.gender,
      address: {
        line: values['address.line'],
        provinceId: Number(values['address.provinceId']),
        districtId: Number(values['address.districtId']),
        wardId: Number(values['address.wardId']),
      },
      avatar: null,
      status: 2,
      roles: [{ id: Number(values.roleId) }],
    };
    registerApi.mutate(body);
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleFormSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Vai trò đối tác <span className="text-red-500">*</span></label>
            <select className="w-full px-4 py-3 border-2 border-blue-100 dark:border-gray-700 rounded-xl bg-blue-50/30 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" {...form.getInputProps('roleId')}>
              {roleSelectList.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tên tài khoản <span className="text-red-500">*</span></label>
            <input type="text" required placeholder="Tên đăng nhập" className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 transition-all" {...form.getInputProps('username')} />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Mật khẩu <span className="text-red-500">*</span></label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} required placeholder="Mật khẩu bảo mật" className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 transition-all" {...form.getInputProps('password')} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600">{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
            </div>
            {form.errors.password && <p className="mt-1 text-xs text-red-500">{form.errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Họ và tên <span className="text-red-500">*</span></label>
            <input type="text" required placeholder="Họ và tên" className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all" {...form.getInputProps('fullname')} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email <span className="text-red-500">*</span></label>
            <input type="email" required placeholder="Email liên hệ" className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all" {...form.getInputProps('email')} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Số điện thoại <span className="text-red-500">*</span></label>
            <input type="tel" required placeholder="Số điện thoại" className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all" {...form.getInputProps('phone')} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Giới tính <span className="text-red-500">*</span></label>
            <select className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all" {...form.getInputProps('gender')}>
              <option value="">Chọn giới tính</option>
              {genderSelectList.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tỉnh thành <span className="text-red-500">*</span></label>
            <select className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all" {...form.getInputProps('address.provinceId')}>
              <option value="">Chọn tỉnh thành</option>
              {provinceSelectList.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Quận huyện <span className="text-red-500">*</span></label>
            <select disabled={!form.values['address.provinceId']} className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl disabled:opacity-50 focus:ring-2 focus:ring-blue-500 transition-all" {...form.getInputProps('address.districtId')}>
              <option value="">Chọn quận huyện</option>
              {districtSelectList.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Phường xã <span className="text-red-500">*</span></label>
            <select disabled={!form.values['address.districtId']} className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl disabled:opacity-50 focus:ring-2 focus:ring-blue-500 transition-all" {...form.getInputProps('address.wardId')}>
              <option value="">Chọn phường xã</option>
              {wardSelectList.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Địa chỉ cụ thể <span className="text-red-500">*</span></label>
            <input type="text" required placeholder="Số nhà, tên đường..." className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all" {...form.getInputProps('address.line')} />
          </div>

          <div className="md:col-span-2">
            <button type="submit" disabled={registerApi.isLoading} className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-400 text-white font-bold rounded-xl shadow-lg transition-all">
              {registerApi.isLoading ? 'Đang gửi...' : 'Đăng ký tài khoản'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function PartnerSignupStepTwo({ nextStep, userId, setActive }: { nextStep: () => void, userId: number | null, setActive: (v: any) => void }) {
  const { updateCurrentSignupUserId } = useAuthStore();
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [countdown, setCountdown] = useState(0);

  const form = useForm({ 
    initialValues: { token: '' }, 
    schema: zodResolver(z.object({ token: z.string().min(1, 'Nhập mã xác nhận') })) 
  });

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const confirmApi = useMutation<void, ErrorMessage, RegistrationRequest>(
    (body) => FetchUtils.post(ResourceURL.CLIENT_REGISTRATION_CONFIRM, body),
    {
      onSuccess: () => {
        NotifyUtils.simpleSuccess('Xác nhận email thành công');
        nextStep();
      },
      onError: (err) => NotifyUtils.simpleFailed(err.message),
    }
  );

  const resendApi = useMutation<void, ErrorMessage>(
    () => FetchUtils.get(`${ResourceURL.CLIENT_REGISTRATION}/${userId}/resend-token`),
    {
      onSuccess: () => {
        NotifyUtils.simpleSuccess('Đã gửi lại mã xác nhận mới');
        setCountdown(60);
      },
      onError: (err) => NotifyUtils.simpleFailed(err.message),
    }
  );

  const changeEmailApi = useMutation<void, ErrorMessage, string>(
    (email) => FetchUtils.put(`${ResourceURL.CLIENT_REGISTRATION}/${userId}/change-email?email=${email}`, {}),
    {
      onSuccess: () => {
        NotifyUtils.simpleSuccess('Đã cập nhật email và gửi mã xác nhận mới');
        setIsChangingEmail(false);
        setCountdown(60);
      },
      onError: (err) => NotifyUtils.simpleFailed(err.message),
    }
  );

  const cancelApi = useMutation<void, ErrorMessage>(
    () => FetchUtils.post(`${ResourceURL.CLIENT_REGISTRATION}/${userId}/cancel`, {}),
    {
      onSuccess: () => {
        NotifyUtils.simpleSuccess('Đã hủy yêu cầu đăng ký');
        updateCurrentSignupUserId(null);
        setActive(0);
      },
      onError: (err) => {
        // Handle case where user is already deleted/cancelled
        if (err.message === 'User not found') {
          NotifyUtils.simpleSuccess('Đã hủy yêu cầu đăng ký');
          updateCurrentSignupUserId(null);
          setActive(0);
        } else {
          NotifyUtils.simpleFailed(err.message);
        }
      },
    }
  );

  const handleFormSubmit = form.onSubmit((v) => {
    if (userId) confirmApi.mutate({ userId, token: v.token });
  });

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full mb-4">
          <MailOpened size={32} className="text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Xác thực Email</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 px-4">Chúng tôi đã gửi mã xác nhận 4 chữ số đến email của bạn. Vui lòng kiểm tra và nhập vào bên dưới.</p>
      </div>

      {!isChangingEmail ? (
        <form onSubmit={handleFormSubmit} className="space-y-8">
          <div className="relative">
            <input 
              type="text" 
              required 
              placeholder="0 0 0 0" 
              className="w-full px-4 py-4 text-center text-3xl font-bold tracking-[0.5em] border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none bg-white dark:bg-gray-900" 
              {...form.getInputProps('token')} 
            />
          </div>

          <button 
            type="submit" 
            disabled={confirmApi.isLoading} 
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] disabled:bg-gray-400"
          >
            {confirmApi.isLoading ? 'Đang xác thực...' : 'Xác thực ngay'}
          </button>

          <div className="pt-6 border-t border-gray-100 dark:border-gray-800 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {countdown > 0 ? (
                <div className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-xs font-bold text-gray-500">
                  Gửi lại ({countdown}s)
                </div>
              ) : (
                <button 
                  type="button" 
                  onClick={() => resendApi.mutate()}
                  disabled={resendApi.isLoading}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 transition-all"
                >
                  <Refresh size={16} />
                  Gửi lại mã
                </button>
              )}

              <button 
                type="button" 
                onClick={() => setIsChangingEmail(true)}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 transition-all"
              >
                <Edit size={16} />
                Thay đổi email
              </button>
            </div>
            
            <div className="text-center">
              <button 
                type="button" 
                onClick={() => {
                  if (window.confirm('Bạn có chắc chắn muốn hủy yêu cầu đăng ký? Thông tin của bạn sẽ bị xóa.')) {
                    cancelApi.mutate();
                  }
                }}
                disabled={cancelApi.isLoading}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-600 transition-colors py-1 border-b border-transparent hover:border-red-500"
              >
                <Trash size={14} />
                Tôi muốn hủy yêu cầu đăng ký này
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="space-y-6 animate-fade-in bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Nhập địa chỉ email mới</label>
            <input 
              type="email" 
              placeholder="example@gmail.com"
              className="w-full px-4 py-3 border-2 border-white dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm bg-white dark:bg-gray-900"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <button 
              type="button" 
              onClick={() => setIsChangingEmail(false)}
              className="flex-1 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold rounded-xl text-sm border border-gray-200 dark:border-gray-700"
            >
              Quay lại
            </button>
            <button 
              type="button" 
              onClick={() => changeEmailApi.mutate(newEmail)}
              disabled={changeEmailApi.isLoading || !newEmail}
              className="flex-1 px-4 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-md hover:bg-blue-700 disabled:bg-gray-400 transition-all"
            >
              {changeEmailApi.isLoading ? 'Đang cập nhật...' : 'Cập nhật'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function PartnerSignupStepThree() {
  return (
    <div className="flex flex-col items-center gap-6 py-8 text-center animate-fade-in">
      <div className="relative">
        <div className="absolute inset-0 bg-blue-200 rounded-full animate-ping opacity-20"></div>
        <div className="relative bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full p-6 shadow-lg">
          <Building size={64} className="text-white" />
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Đăng ký hoàn tất!</h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-sm">
          Yêu cầu của bạn đã được gửi đến quản trị viên. Chúng tôi sẽ kiểm tra và phản hồi qua email của bạn trong thời gian sớm nhất.
        </p>
        <div className="mt-6 p-4 bg-blue-50 dark:bg-gray-700/50 rounded-xl text-sm text-blue-700 dark:text-blue-300">
          Trạng thái hiện tại: <strong>Đang chờ phê duyệt</strong>
        </div>
      </div>
      <Link to="/" className="mt-4 px-8 py-3 bg-gray-900 dark:bg-white dark:text-gray-900 text-white font-semibold rounded-xl hover:shadow-xl transition-all">
        Quay về trang chủ
      </Link>
    </div>
  );
}

export { PartnerSignup };
export default PartnerSignup;
