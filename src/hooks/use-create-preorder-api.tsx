import { useMutation } from 'react-query';
import { ClientPreorderRequest, ClientPreorderResponse } from 'types';
import FetchUtils, { ErrorMessage } from 'utils/FetchUtils';
import ResourceURL from 'constants/ResourceURL';
import NotifyUtils from 'utils/NotifyUtils';

function useCreatePreorderApi() {
  return useMutation<ClientPreorderResponse, ErrorMessage, ClientPreorderRequest>(
    (requestBody) => FetchUtils.postWithToken(ResourceURL.CLIENT_PREORDER, requestBody),
    {
      onSuccess: (response) =>
        NotifyUtils.simpleSuccess(`Đã thêm sản phẩm ${response.preorderProduct.productName} vào danh sách đặt trước`),
      onError: () => NotifyUtils.simpleFailed('Không thêm được sản phẩm vào danh sách đặt trước'),
    }
  );
}

export default useCreatePreorderApi;
