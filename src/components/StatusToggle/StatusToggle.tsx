import React, { useState, useEffect } from 'react';
import useUpdateStatusApi from 'hooks/use-update-status-api';

interface StatusToggleProps {
  status: number;
  entityId: number;
  resourceUrl: string;
  resourceKey: string;
}

export default function StatusToggle({ status, entityId, resourceUrl, resourceKey }: StatusToggleProps) {
  const updateStatusApi = useUpdateStatusApi(resourceUrl, resourceKey);

  // Optimistic local state — toggle ngay lập tức, không chờ server
  const [localStatus, setLocalStatus] = useState(status === 1);

  // Sync lại nếu prop thay đổi (sau khi server phản hồi và cache được refresh)
  useEffect(() => {
    setLocalStatus(status === 1);
  }, [status]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (updateStatusApi.isLoading) return;

    const newStatus = localStatus ? 0 : 1;
    setLocalStatus(!localStatus); // optimistic update
    updateStatusApi.mutate(
      { id: entityId, status: newStatus },
      {
        onError: () => {
          // Rollback nếu lỗi
          setLocalStatus(localStatus);
        },
      }
    );
  };

  return (
    <div
      className={`inline-flex items-center gap-2 select-none ${
        updateStatusApi.isLoading ? 'cursor-wait' : 'cursor-pointer'
      }`}
      onClick={handleToggle}
      title={localStatus ? 'Đang bật — Nhấn để tắt' : 'Đang tắt — Nhấn để bật'}
    >
      {/* Track */}
      <div
        className={`relative inline-flex h-5 w-10 items-center rounded-full transition-all duration-200 ${
          localStatus
            ? 'bg-blue-500 shadow-[0_0_0_2px_rgba(59,130,246,0.2)]'
            : 'bg-gray-300 dark:bg-gray-600'
        } ${updateStatusApi.isLoading ? 'opacity-60' : ''}`}
      >
        {/* Thumb */}
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
            localStatus ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </div>
      {/* Label */}
      <span
        className={`text-xs font-medium ${
          localStatus
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-gray-400 dark:text-gray-500'
        }`}
      >
        {localStatus ? 'Bật' : 'Tắt'}
      </span>
    </div>
  );
}
