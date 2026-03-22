import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import useResetManagePageState from 'hooks/use-reset-manage-page-state';
import { useForm, zodResolver } from '@mantine/form';
import { ManageHeader, ManageHeaderTitle } from 'components';
import RewardStrategyConfigs from 'pages/reward-strategy/RewardStrategyConfigs';
import { MathFunction } from 'tabler-icons-react';
import { RewardStrategyRequest, RewardStrategyResponse } from 'models/RewardStrategy';
import { useMutation, useQueryClient } from 'react-query';
import PageConfigs from 'pages/PageConfigs';
import FetchUtils, { ErrorMessage, ListResponse } from 'utils/FetchUtils';
import useGetAllApi from 'hooks/use-get-all-api';
import MiscUtils from 'utils/MiscUtils';
import NotifyUtils from 'utils/NotifyUtils';
import { z } from 'zod';

function RewardStrategyManage() {
  const queryClient = useQueryClient();

  useResetManagePageState();

  const [rewardStrategies, setRewardStrategies] = useState<Array<{ status: boolean }>>([]);
  const [updateFormulaModalRewardStrategy, setUpdateFormulaModalRewardStrategy] = useState<RewardStrategyResponse | null>(null);

  const {
    isLoading,
    data: listResponse = PageConfigs.initialListResponse as ListResponse<RewardStrategyResponse>,
  } = useGetAllApi<RewardStrategyResponse>(
    RewardStrategyConfigs.resourceUrl,
    RewardStrategyConfigs.resourceKey,
    { all: 1, sort: 'id,asc' },
    (data) => {
      setRewardStrategies(data.content.map(entity => ({ status: entity.status === 1 })));
    },
    { refetchOnWindowFocus: false }
  );

  const updateRewardStrategyApi = useUpdateRewardStrategyApi();

  const handleUpdateButton = async () => {
    try {
      const updateRewardStrategyRequests: UpdateRewardStrategyRequest[] = [];

      listResponse.content.forEach((entity, index) => {
        const currentStatus = rewardStrategies[index].status ? 1 : 2;

        if (currentStatus !== entity.status) {
          updateRewardStrategyRequests.push({
            id: entity.id,
            body: { formula: null, status: currentStatus },
          });
        }
      });

      await Promise.all(updateRewardStrategyRequests.map(async (request) => {
        await updateRewardStrategyApi.mutateAsync(request);
      }));

      NotifyUtils.simpleSuccess('Cập nhật thành công');
      void queryClient.invalidateQueries([RewardStrategyConfigs.resourceKey, 'getAll']);
    } catch (e) {
      NotifyUtils.simpleFailed('Cập nhật không thành công');
    }
  };

  const handleUpdateFormulaButton = (rewardStrategy: RewardStrategyResponse) => {
    setUpdateFormulaModalRewardStrategy(rewardStrategy);
  };

  const handleToggleStatus = (index: number) => {
    const newRewardStrategies = [...rewardStrategies];
    newRewardStrategies[index] = { ...newRewardStrategies[index], status: !newRewardStrategies[index].status };
    setRewardStrategies(newRewardStrategies);
  };

  const rewardStrategyStatusBadgeFragment = (status: number) => {
    switch (status) {
    case 1:
      return <span className="px-2 py-1 text-xs font-medium bg-blue-500 text-white rounded">Đang kích hoạt</span>;
    case 2:
      return <span className="px-2 py-1 text-xs font-medium bg-pink-500 text-white rounded">Không kích hoạt</span>;
    }
  };

  const entitiesTableHeadsFragment = (
    <tr>
      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Kích hoạt</th>
      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Chiến lược điểm thưởng</th>
      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Mã</th>
      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Công thức tính</th>
      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Trạng thái</th>
    </tr>
  );

  const entitiesTableRowsFragment = listResponse.content.map((entity, index) => (
    <tr key={entity.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
      <td className="px-4 py-2">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={rewardStrategies[index]?.status || false}
            onChange={() => handleToggleStatus(index)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        </label>
      </td>
      <td className="px-4 py-2">{entity.name}</td>
      <td className="px-4 py-2">
        <span className="text-sm font-mono">{entity.code}</span>
      </td>
      <td className="px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-mono">{entity.formula}</span>
          <button
            onClick={() => handleUpdateFormulaButton(entity)}
            className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
            title="Cập nhật công thức mới"
          >
            <MathFunction size={15} strokeWidth={1.5}/>
          </button>
        </div>
      </td>
      <td className="px-4 py-2">{rewardStrategyStatusBadgeFragment(entity.status)}</td>
    </tr>
  ));

  const disabledUpdateButton = MiscUtils.isEquals(
    listResponse.content.map(entity => ({ status: entity.status === 1 })),
    rewardStrategies
  );

  return (
    <div className="flex flex-col gap-4 max-w-4xl">
      <ManageHeader>
        <ManageHeaderTitle
          titleLinks={RewardStrategyConfigs.manageTitleLinks}
          title={RewardStrategyConfigs.manageTitle}
        />
      </ManageHeader>

      <div className="relative p-4 rounded-md shadow-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700" style={{ minHeight: listResponse.content.length === 0 ? 170 : 'auto' }}>
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-md">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              {entitiesTableHeadsFragment}
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {entitiesTableRowsFragment}
            </tbody>
          </table>
        </div>
      </div>

      <button
        className="w-fit px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={disabledUpdateButton}
        onClick={handleUpdateButton}
      >
        Cập nhật
      </button>

      {/* Update Formula Modal */}
      {updateFormulaModalRewardStrategy && (
        <UpdateFormulaModal
          rewardStrategy={updateFormulaModalRewardStrategy}
          onClose={() => setUpdateFormulaModalRewardStrategy(null)}
        />
      )}
    </div>
  );
}

function UpdateFormulaModal({ rewardStrategy, onClose }: { rewardStrategy: RewardStrategyResponse, onClose: () => void }) {
  const queryClient = useQueryClient();

  const [currentFormula, setCurrentFormula] = useState(rewardStrategy.formula);

  const form = useForm({
    initialValues: { formula: currentFormula },
    schema: zodResolver(z.object({ formula: z.string() })),
  });

  const updateRewardStrategyApi = useUpdateRewardStrategyApi();

  const handleFormSubmit = form.onSubmit(async (formValues) => {
    const requestBody: RewardStrategyRequest = {
      formula: formValues.formula,
      status: null,
    };

    try {
      await updateRewardStrategyApi.mutateAsync({ id: rewardStrategy.id, body: requestBody });
      NotifyUtils.simpleSuccess('Cập nhật thành công');
      void queryClient.invalidateQueries([RewardStrategyConfigs.resourceKey, 'getAll']);
      setCurrentFormula(formValues.formula);
      onClose();
    } catch (e) {
      NotifyUtils.simpleFailed('Cập nhật không thành công');
    }
  });

  return (
    <Dialog open={true} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
          <Dialog.Title className="text-lg font-semibold mb-4">Sửa công thức tính</Dialog.Title>
          <form onSubmit={handleFormSubmit}>
            <div className="flex flex-col gap-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Công thức tính của chiến lược &quot;{rewardStrategy.name}&quot;
              </p>
              <input
                type="text"
                autoFocus
                required
                placeholder="Nhập công thức tính"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                {...form.getInputProps('formula')}
              />
              {form.errors.formula && (
                <p className="text-sm text-red-600 dark:text-red-400">{form.errors.formula}</p>
              )}
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  disabled={MiscUtils.isEquals(form.values, { formula: currentFormula })}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cập nhật
                </button>
              </div>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

type UpdateRewardStrategyRequest = { id: number, body: RewardStrategyRequest };

function useUpdateRewardStrategyApi() {
  return useMutation<RewardStrategyResponse, ErrorMessage, UpdateRewardStrategyRequest>(
    (request) => FetchUtils.update(RewardStrategyConfigs.resourceUrl, request.id, request.body)
  );
}

export default RewardStrategyManage;
