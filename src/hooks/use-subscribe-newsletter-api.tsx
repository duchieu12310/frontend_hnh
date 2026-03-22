// TODO: TẠM THỜI COMMENT - ĐĂNG KÝ NHẬN KM
/*import { useMutation } from 'react-query';
import { ClientNewsletterSubscriptionRequest, ClientNewsletterSubscriptionResponse } from 'types';
import FetchUtils, { ErrorMessage } from 'utils/FetchUtils';
import ResourceURL from 'constants/ResourceURL';
import NotifyUtils from 'utils/NotifyUtils';

function useSubscribeNewsletterApi() {
  return useMutation<ClientNewsletterSubscriptionResponse, ErrorMessage, ClientNewsletterSubscriptionRequest>(
    (requestBody) => FetchUtils.post(ResourceURL.CLIENT_NEWSLETTER_SUBSCRIBE, requestBody),
    {
      onSuccess: () =>
        NotifyUtils.simpleSuccess('Đăng ký nhận tin thành công! Chúng tôi đã gửi email xác nhận đến bạn.'),
      onError: (error) => {
        if (error.statusCode === 409) {
          NotifyUtils.simpleWarning(error.message || 'Email này đã được đăng ký nhận tin');
        } else {
          NotifyUtils.simpleFailed(error.message || 'Đăng ký nhận tin không thành công. Vui lòng thử lại.');
        }
      },
    }
  );
}

export default useSubscribeNewsletterApi;*/

// TODO: TẠM THỜI COMMENT - ĐĂNG KÝ NHẬN KM
function useSubscribeNewsletterApi() {
  return {
    mutate: () => {},
    isLoading: false,
  };
}

export default useSubscribeNewsletterApi;

