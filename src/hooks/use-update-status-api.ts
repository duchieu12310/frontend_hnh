import { useMutation, useQueryClient } from 'react-query';
import NotifyUtils from 'utils/NotifyUtils';

export default function useUpdateStatusApi(resourceUrl: string, resourceKey: string) {
  const queryClient = useQueryClient();
  return useMutation(
    (params: { id: number; status: number }) => {
      return fetch(`${resourceUrl}/${params.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('electro-admin-auth-store') || '{}').state?.jwtToken || ''}`
        },
        body: JSON.stringify({ status: params.status })
      }).then(async res => {
        if (!res.ok) throw await res.json();
      });
    },
    {
      onSuccess: () => {
        NotifyUtils.simpleSuccess('Cập nhật trạng thái thành công');
        void queryClient.invalidateQueries([resourceKey, 'getAll']);
        void queryClient.invalidateQueries([resourceKey, 'getById']);
      },
      onError: () => NotifyUtils.simpleFailed('Cập nhật trạng thái không thành công'),
    }
  );
}

