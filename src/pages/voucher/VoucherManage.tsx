import React from 'react';
import { CurrencyDollar } from 'tabler-icons-react';

function VoucherManage() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <CurrencyDollar size={200} strokeWidth={1} className="text-gray-300 dark:text-gray-600" />
        <p className="text-lg text-gray-700 dark:text-gray-300">Sổ quỹ là chức năng quản lý dòng tiền của hệ thống</p>
        <p className="text-gray-600 dark:text-gray-400">
          Tham khảo:{' '}
          <a
            href="https://www.teamcrop.com/ho-tro/module-so-quy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Module sổ quỹ của Teamcrop
          </a>
        </p>
      </div>
    </div>
  );
}

export default VoucherManage;
