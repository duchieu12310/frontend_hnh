import React from 'react';
import useTitle from 'hooks/use-title';
import { ElectroLogo } from 'components';
import { X } from 'tabler-icons-react';

function ClientPaymentCancel() {
  useTitle();

  const handleCloseWindow = () => {
    // eslint-disable-next-line no-restricted-globals
    // @ts-ignore
    window.open(location, '_self')?.close();
  };

  return (
    <div className="flex flex-col items-center gap-8 my-12">
      <ElectroLogo />
      <div className="flex flex-col items-center gap-4 text-pink-600 dark:text-pink-400">
        <X size={100} strokeWidth={1} />
        <p className="font-medium text-lg">Đã hủy thanh toán PayPal</p>
      </div>
      <button
        onClick={handleCloseWindow}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
      >
        Đóng cửa sổ này
      </button>
    </div>
  );
}

export default ClientPaymentCancel;
