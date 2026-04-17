import { useMutation, useQueryClient } from 'react-query';
import FetchUtils, { ErrorMessage } from 'utils/FetchUtils';
import NotifyUtils from 'utils/NotifyUtils';

function useDeleteByIdsApi<T = number>(resourceUrl: string, resourceKey: string) {
  const queryClient = useQueryClient();

  return useMutation<void, ErrorMessage, T[]>(
    (entityIds) => FetchUtils.deleteWithToken(resourceUrl, entityIds),
    {
      onSuccess: () => {
        NotifyUtils.simpleSuccess('Xóa thành công');
        void queryClient.invalidateQueries([resourceKey, 'getAll']);
      },
      onError: (error) => NotifyUtils.simpleFailed(error, 'Xóa không thành công'),
    }
  );
}

export default useDeleteByIdsApi;
