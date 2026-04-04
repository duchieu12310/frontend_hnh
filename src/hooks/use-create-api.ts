import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import FetchUtils, { ErrorMessage } from 'utils/FetchUtils';
import NotifyUtils from 'utils/NotifyUtils';

function useCreateApi<I, O>(resourceUrl: string) {
  const navigate = useNavigate();

  return useMutation<O, ErrorMessage, I>(
    (requestBody) => FetchUtils.create<I, O>(resourceUrl, requestBody),
    {
      onSuccess: () => {
        NotifyUtils.simpleSuccess('Tạo thành công');
        navigate(-1);
      },
      onError: () => NotifyUtils.simpleFailed('Tạo không thành công'),
    }
  );
}

export default useCreateApi;
