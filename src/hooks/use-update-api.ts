import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import FetchUtils, { ErrorMessage } from 'utils/FetchUtils';
import NotifyUtils from 'utils/NotifyUtils';

function useUpdateApi<I, O>(resourceUrl: string, resourceKey: string, entityId: number, options: { shouldNavigateBack?: boolean } = { shouldNavigateBack: true }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<O, ErrorMessage, I>(
    (requestBody) => FetchUtils.putWithToken<I, O>(resourceUrl + '/' + entityId, requestBody),
    {
      onSuccess: () => {
        NotifyUtils.simpleSuccess('Cập nhật thành công');
        void queryClient.invalidateQueries([resourceKey, 'getById', entityId]);
        void queryClient.invalidateQueries([resourceKey, 'getAll']);
        if (options.shouldNavigateBack) {
          navigate(-1);
        }
      },
      onError: () => NotifyUtils.simpleFailed('Cập nhật không thành công'),
    }
  );
}

export default useUpdateApi;
