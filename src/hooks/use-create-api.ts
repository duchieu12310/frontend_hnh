import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import FetchUtils, { ErrorMessage } from 'utils/FetchUtils';
import NotifyUtils from 'utils/NotifyUtils';

function useCreateApi<I, O>(resourceUrl: string, resourceKey?: string, options: { shouldNavigateBack?: boolean } = { shouldNavigateBack: true }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<O, ErrorMessage, I>(
    (requestBody) => FetchUtils.postWithToken<I, O>(resourceUrl, requestBody),
    {
      onSuccess: () => {
        NotifyUtils.simpleSuccess('Thêm thành công');
        void queryClient.invalidateQueries([resourceKey, 'getAll']);
        if (options.shouldNavigateBack) {
          navigate(-1);
        }
      },
      onError: (error) => NotifyUtils.simpleFailed(error, 'Thêm không thành công'),
    }
  );
}

export default useCreateApi;
