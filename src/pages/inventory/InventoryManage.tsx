import React, { useState } from 'react';
import { ManageHeader, ManageHeaderTitle, ManageMain, ManagePagination } from 'components';
import InventoryConfigs from 'pages/inventory/InventoryConfigs';
import PageConfigs from 'pages/PageConfigs';
import { ListResponse } from 'utils/FetchUtils';
import useGetAllApi from 'hooks/use-get-all-api';
import { ProductInventoryResponse } from 'models/ProductInventory';
import useResetManagePageState from 'hooks/use-reset-manage-page-state';
import { Plus } from 'tabler-icons-react';
import { DocketVariantExtendedResponse } from 'models/DocketVariantExtended';
import DateUtils from 'utils/DateUtils';
import { Dialog } from '@headlessui/react';
import { useColorScheme } from 'hooks/use-color-scheme';

function InventoryManage() {
  useResetManagePageState();

  const { colorScheme } = useColorScheme();
  const [selectedProductName, setSelectedProductName] = useState<string | null>(null);
  const [selectedTransactions, setSelectedTransactions] = useState<DocketVariantExtendedResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    isLoading,
    data: listResponse = PageConfigs.initialListResponse as ListResponse<ProductInventoryResponse>,
  } = useGetAllApi<ProductInventoryResponse>(
    InventoryConfigs.productInventoryResourceUrl,
    InventoryConfigs.productInventoryResourceKey
  );

  const handleTransactionsAnchor = (productName: string, transactions: DocketVariantExtendedResponse[]) => {
    setSelectedProductName(productName);
    setSelectedTransactions(transactions);
    setIsModalOpen(true);
  };

  const entitiesTableHeadsFragment = (
    <tr>
      <th>Mã sản phẩm</th>
      <th>Tên sản phẩm</th>
      <th>Nhãn hiệu</th>
      <th>Nhà cung cấp</th>
      <th>Tồn thực tế</th>
      <th>Chờ xuất</th>
      <th>Có thể bán</th>
      <th>Sắp về</th>
      <th>Theo dõi</th>
      <th>Lịch sử</th>
    </tr>
  );

  const entitiesTableRowsFragment = listResponse.content.map((entity) => (
    <tr key={entity.product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
      <td>{entity.product.code}</td>
      <td>{entity.product.name}</td>
      <td>{entity.product.brand?.name}</td>
      <td>{entity.product.supplier?.displayName}</td>
      <td>{entity.inventory}</td>
      <td>{entity.waitingForDelivery}</td>
      <td>{entity.canBeSold}</td>
      <td>{entity.areComing}</td>
      <td>
        <button
          className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 rounded transition-colors"
          title="Thiết lập định mức tồn kho cho sản phẩm"
        >
          <Plus size={20}/>
        </button>
      </td>
      <td>
        <button
          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline"
          onClick={() => handleTransactionsAnchor(entity.product.name, entity.transactions)}
        >
          Giao dịch
        </button>
      </td>
    </tr>
  ));

  return (
    <>
      <div className="flex flex-col gap-4">
        <ManageHeader>
          <ManageHeaderTitle
            titleLinks={InventoryConfigs.manageTitleLinks}
            title={InventoryConfigs.manageTitle}
          />
        </ManageHeader>

        <ManageMain
          listResponse={listResponse}
          isLoading={isLoading}
        >
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                {entitiesTableHeadsFragment}
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {entitiesTableRowsFragment}
              </tbody>
            </table>
          </div>
        </ManageMain>

        <ManagePagination listResponse={listResponse}/>
      </div>

      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30 dark:bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-6xl bg-white dark:bg-gray-800 rounded-lg shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
            <Dialog.Title className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 font-semibold text-lg">
              Lịch sử nhập xuất của sản phẩm &quot;{selectedProductName}&quot;
            </Dialog.Title>
            <div className="flex-1 overflow-auto p-6">
              <ProductInventoryTransactionsModal transactions={selectedTransactions}/>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Đóng
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}

function ProductInventoryTransactionsModal({ transactions }: { transactions: DocketVariantExtendedResponse[] }) {
  const docketTypeBadgeFragment = (type: number) => {
    switch (type) {
    case 1:
      return <span className="px-2 py-1 text-xs font-medium bg-blue-500 text-white rounded">Nhập</span>;
    case 2:
      return <span className="px-2 py-1 text-xs font-medium bg-orange-500 text-white rounded">Xuất</span>;
    }
  };

  const docketStatusBadgeFragment = (status: number) => {
    switch (status) {
    case 1:
      return <span className="px-2 py-1 text-xs font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded">Mới</span>;
    case 2:
      return <span className="px-2 py-1 text-xs font-medium border border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-400 rounded">Đang xử lý</span>;
    case 3:
      return <span className="px-2 py-1 text-xs font-medium border border-green-300 dark:border-green-600 text-green-700 dark:text-green-400 rounded">Hoàn thành</span>;
    case 4:
      return <span className="px-2 py-1 text-xs font-medium border border-red-300 dark:border-red-600 text-red-700 dark:text-red-400 rounded">Hủy bỏ</span>;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-2 py-2">Phiếu</th>
            <th className="px-2 py-2">Ngày tạo</th>
            <th className="px-2 py-2">Lý do</th>
            <th className="px-2 py-2">Số lượng</th>
            <th className="px-2 py-2">SKU</th>
            <th className="px-2 py-2">Kho</th>
            <th className="px-2 py-2">Trạng thái</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {transactions.map(transaction => (
            <tr key={transaction.docket.code} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="px-2 py-2">{docketTypeBadgeFragment(transaction.docket.type)}</td>
              <td className="px-2 py-2">{DateUtils.isoDateToString(transaction.docket.createdAt)}</td>
              <td className="px-2 py-2">{transaction.docket.reason.name}</td>
              <td className="px-2 py-2">{transaction.quantity}</td>
              <td className="px-2 py-2">{transaction.variant.sku}</td>
              <td className="px-2 py-2">{transaction.docket.warehouse.name}</td>
              <td className="px-2 py-2">{docketStatusBadgeFragment(transaction.docket.status)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InventoryManage;
