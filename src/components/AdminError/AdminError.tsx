import React from 'react';

function AdminError() {
  return (
    <div className="flex flex-col gap-6 text-center">
      <p className="text-[120px] font-bold text-gray-300 dark:text-gray-700">
        Oops...
      </p>
      <h1 className="text-2xl font-semibold">Đã có lỗi xảy ra</h1>
    </div>
  );
}

export default AdminError;
