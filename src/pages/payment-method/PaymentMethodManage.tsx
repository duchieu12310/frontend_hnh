import React from 'react';
import PageConfigs from 'pages/PageConfigs';
import FetchUtils, { ErrorMessage, ListResponse } from 'utils/FetchUtils';
import useGetAllApi from 'hooks/use-get-all-api';
import { PaymentMethodRequest, PaymentMethodResponse } from 'models/PaymentMethod';
import PaymentMethodConfigs from 'pages/payment-method/PaymentMethodConfigs';
import useResetManagePageState from 'hooks/use-reset-manage-page-state';
import { ManageHeader, ManageHeaderTitle } from 'components';
import { AlertCircle } from 'tabler-icons-react';
import { formList, useForm } from '@mantine/form';
import MiscUtils from 'utils/MiscUtils';
import { useMutation, useQueryClient } from 'react-query';
import NotifyUtils from 'utils/NotifyUtils';

function PaymentMethodManage() {
  const queryClient = useQueryClient();

  useResetManagePageState();

  const form = useForm({
    initialValues: {
      paymentMethods: formList([] as Array<{ status: boolean }>),
    },
  });

  const {
    isLoading,
    data: listResponse = PageConfigs.initialListResponse as ListResponse<PaymentMethodResponse>,
  } = useGetAllApi<PaymentMethodResponse>(
    PaymentMethodConfigs.resourceUrl,
    PaymentMethodConfigs.resourceKey,
    { all: 1, sort: 'id,asc' },
    (data) =>
      form.setFieldValue('paymentMethods', formList(data.content.map(entity => ({ status: entity.status === 1 })))),
    { refetchOnWindowFocus: false }
  );

  const updatePaymentMethodApi = useUpdatePaymentMethodApi();

  const handleUpdateButton = async () => {
    if (!form.values.paymentMethods.every(p => !p.status)) {
      try {
        const updatePaymentMethodRequests: UpdatePaymentMethodRequest[] = [];

        listResponse.content.forEach((entity, index) => {
          const currentStatus = form.values.paymentMethods[index].status ? 1 : 2;

          if (currentStatus !== entity.status) {
            updatePaymentMethodRequests.push({
              id: entity.id,
              body: { status: currentStatus },
            });
          }
        });

        await Promise.all(updatePaymentMethodRequests.map(async (request) => {
          await updatePaymentMethodApi.mutateAsync(request);
        }));

        NotifyUtils.simpleSuccess('Cập nhật thành công');
        void queryClient.invalidateQueries([PaymentMethodConfigs.resourceKey, 'getAll']);
      } catch (e) {
        NotifyUtils.simpleFailed('Cập nhật không thành công');
      }
    }
  };

  const paymentMethodStatusBadgeFragment = (status: number) => {
    switch (status) {
    case 1:
      return <span className="px-2 py-1 text-xs font-medium bg-blue-500 text-white rounded">Đang sử dụng</span>;
    case 2:
      return <span className="px-2 py-1 text-xs font-medium bg-pink-500 text-white rounded">Không sử dụng</span>;
    }
  };

  const entitiesTableHeadsFragment = (
    <tr>
      <th>Kích hoạt</th>
      <th>Hình thức thanh toán</th>
      <th>Mã</th>
      <th>Trạng thái</th>
    </tr>
  );

  const entitiesTableRowsFragment = listResponse.content.map((entity, index) => {
    const PaymentMethodIcon = PageConfigs.paymentMethodIconMap[entity.code];

    return (
      <tr key={entity.id}>
        <td>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={form.values.paymentMethods[index]?.status || false}
              onChange={(e) => {
                const newList = [...form.values.paymentMethods];
                newList[index] = { ...newList[index], status: e.target.checked };
                form.setFieldValue('paymentMethods', formList(newList));
              }}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </td>
        <td>
          <div className="flex items-center gap-2">
            <PaymentMethodIcon/>
            <span>{entity.name}</span>
          </div>
        </td>
        <td>{entity.code}</td>
        <td>{paymentMethodStatusBadgeFragment(entity.status)}</td>
      </tr>
    );
  });

  const disabledUpdateButton = MiscUtils.isEquals(
    listResponse.content.map(entity => ({ status: entity.status === 1 })),
    form.values.paymentMethods
  ) || form.values.paymentMethods.every(p => !p.status);

  return (
    <div className="flex flex-col gap-4 max-w-4xl">
      <ManageHeader>
        <ManageHeaderTitle
          titleLinks={PaymentMethodConfigs.manageTitleLinks}
          title={PaymentMethodConfigs.manageTitle}
        />
      </ManageHeader>

      <div className="flex items-start gap-3 p-4 bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800 rounded-lg">
        <AlertCircle size={20} className="text-pink-600 dark:text-pink-400 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-pink-900 dark:text-pink-200 mb-1">Thông báo</h4>
          <p className="text-sm text-pink-800 dark:text-pink-300">
            Kích hoạt một vài hoặc tất cả các hình thức thanh toán, luôn phải có ít nhất một hình thức thanh toán được chọn.
          </p>
        </div>
      </div>

      <div className="relative bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden" style={{ minHeight: listResponse.content.length === 0 ? 170 : 'auto' }}>
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 z-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            {entitiesTableHeadsFragment}
          </thead>
          <tbody>{entitiesTableRowsFragment}</tbody>
        </table>
      </div>

      <button
        className="w-fit px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        disabled={disabledUpdateButton}
        onClick={handleUpdateButton}
      >
        Cập nhật
      </button>
    </div>
  );
}

type UpdatePaymentMethodRequest = { id: number, body: PaymentMethodRequest };

function useUpdatePaymentMethodApi() {
  return useMutation<PaymentMethodResponse, ErrorMessage, UpdatePaymentMethodRequest>(
    (request) => FetchUtils.update(PaymentMethodConfigs.resourceUrl, request.id, request.body)
  );
}

export default PaymentMethodManage;
