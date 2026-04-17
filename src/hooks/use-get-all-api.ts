import { useQuery } from 'react-query';
import useAppStore from 'stores/use-app-store';
import FilterUtils from 'utils/FilterUtils';
import FetchUtils, { ErrorMessage, ListResponse, RequestParams } from 'utils/FetchUtils';
import NotifyUtils from 'utils/NotifyUtils';
import { UseQueryOptions } from 'react-query/types/react/types';

function useGetAllApi<O>(
  resourceUrl: string,
  resourceKey: string,
  requestParams?: RequestParams,
  successCallback?: (data: ListResponse<O>) => void,
  options?: UseQueryOptions<ListResponse<O>, ErrorMessage> & { activeOnly?: boolean }
) {
  const {
    activePage,
    activePageSize,
    activeFilter,
    searchToken,
  } = useAppStore();

  const isAddressResource = resourceUrl.includes('/provinces') || resourceUrl.includes('/districts') || resourceUrl.includes('/wards');
  const shouldForceActive = !isAddressResource && (options?.activeOnly || resourceUrl.includes('/client-api'));

  if (requestParams) {
    // Nếu là yêu cầu có sẵn params (thường là lookup hoặc client page), 
    // đảm bảo status == 1 nếu được yêu cầu hoặc là Client API
    if (shouldForceActive) {
      if (!requestParams.filter?.includes('status')) {
        requestParams.filter = requestParams.filter 
          ? `${requestParams.filter};status==1` 
          : 'status==1';
      }
      // Đảm bảo cả tham số status ở mức cao nhất cũng là 1
      if (requestParams.status === undefined) {
        requestParams.status = 1;
      }
    }
  } else {
    requestParams = {
      page: activePage,
      size: activePageSize,
      sort: FilterUtils.convertToSortRSQL(activeFilter),
      filter: FilterUtils.convertToFilterRSQL(activeFilter),
      search: searchToken,
    };
  }

  const queryKey = [resourceKey, 'getAll', requestParams];

  return useQuery<ListResponse<O>, ErrorMessage>(
    queryKey,
    () => FetchUtils.getAllWithToken<O>(resourceUrl, requestParams),
    {
      keepPreviousData: true,
      onSuccess: successCallback,
      onError: (error) => NotifyUtils.simpleFailed(`Lỗi ${error.statusCode || 'chưa biết'}: Lấy dữ liệu không thành công`),
      ...options,
    }
  );
}

export default useGetAllApi;
