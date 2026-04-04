import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import FetchUtils, { ErrorMessage } from 'utils/FetchUtils';
import NotifyUtils from 'utils/NotifyUtils';

function useUpdateApi<I, O>(resourceUrl: string, resourceKey: string, entityId: number) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<O, ErrorMessage, I>(
    (requestBody) => FetchUtils.update<I, O>(resourceUrl, entityId, requestBody),
    {
      onSuccess: () => {
        NotifyUtils.simpleSuccess('Cập nhật thành công');
        void queryClient.invalidateQueries([resourceKey, 'getById', entityId]);
        void queryClient.invalidateQueries([resourceKey, 'getAll']);
        navigate(-1);
      },
      onError: () => NotifyUtils.simpleFailed('Cập nhật không thành công'),
    }
  );
}

export default useUpdateApi;
