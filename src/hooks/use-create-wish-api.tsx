import { useMutation } from 'react-query';
import { ClientWishRequest, ClientWishResponse } from 'types';
import FetchUtils, { ErrorMessage } from 'utils/FetchUtils';
import ResourceURL from 'constants/ResourceURL';
import NotifyUtils from 'utils/NotifyUtils';

function useCreateWishApi() {
  return useMutation<ClientWishResponse, ErrorMessage, ClientWishRequest>(
    (requestBody) => FetchUtils.postWithToken(ResourceURL.CLIENT_WISH, requestBody),
    {
      onSuccess: (response) =>
        NotifyUtils.simpleSuccess(`Đã thêm sản phẩm ${response.wishProduct.productName} vào danh sách yêu thích`),
      onError: (error) => {
        if (error.statusCode === 409) {
          NotifyUtils.simpleWarning(error.message || 'Sản phẩm đã có trong danh sách yêu thích');
        } else {
          NotifyUtils.simpleFailed(error.message || 'Không thêm được sản phẩm vào danh sách yêu thích');
        }
      },
    }
  );
}

export default useCreateWishApi;
