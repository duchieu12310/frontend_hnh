// TODO: TẠM THỜI COMMENT - ĐĂNG KÝ NHẬN KM
/*import React, { useState } from 'react';
import { At, Mailbox } from 'tabler-icons-react';
import { ClientNewsletterSubscriptionRequest } from 'types';
import useSubscribeNewsletterApi from 'hooks/use-subscribe-newsletter-api';

function ClientHomeNewsletter() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const subscribeNewsletterApi = useSubscribeNewsletterApi();

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setEmail(value);
    // Clear error when user types
    if (emailError) {
      setEmailError('');
    }
  };

  const validateEmail = (email: string): boolean => {
    if (!email.trim()) {
      setEmailError('Vui lòng nhập địa chỉ email');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Email không hợp lệ');
      return false;
    }
    return true;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateEmail(email)) {
      return;
    }

    const request: ClientNewsletterSubscriptionRequest = {
      email: email.trim(),
    };

    subscribeNewsletterApi.mutate(request, {
      onSuccess: () => {
        setEmail(''); // Clear email on success
      },
    });
  };

  return (
    <div className="rounded-md shadow-sm p-6 bg-blue-600 dark:bg-blue-900 text-white">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <Mailbox size={40} strokeWidth={1} />
          <p className="text-xl font-medium">Đăng ký nhận tin</p>
          <p className="text-base">và cập nhật khuyến mãi liên tục...</p>
        </div>
        <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-[450px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <At size={16} className="text-white/70" />
            </div>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Địa chỉ email"
              disabled={subscribeNewsletterApi.isLoading}
              className={`w-full pl-10 pr-3 py-2 rounded-md border-none bg-white/25 text-white placeholder:text-white/50 focus:ring-2 focus:ring-white/50 focus:outline-none ${
                emailError ? 'ring-2 ring-red-300' : ''
              }`}
            />
            {emailError && (
              <p className="absolute top-full left-0 mt-1 text-xs text-red-200">{emailError}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={subscribeNewsletterApi.isLoading}
            className="px-4 py-2 bg-[#14372fe4] hover:bg-[#14372fd4] disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors whitespace-nowrap"
          >
            {subscribeNewsletterApi.isLoading ? 'Đang gửi...' : 'Gửi'}
          </button>
        </form>
      </div>
    </div>
  );
}*/

// TODO: TẠM THỜI COMMENT - ĐĂNG KÝ NHẬN KM
function ClientHomeNewsletter() {
  return null;
}

export default ClientHomeNewsletter;
