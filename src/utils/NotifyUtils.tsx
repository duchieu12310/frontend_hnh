import React from 'react';
import toast from 'react-hot-toast';
import { Check, X, AlertCircle, InfoCircle } from 'tabler-icons-react';
import { ErrorMessage } from 'utils/FetchUtils';

type ToastMessage = string | React.ReactNode;

class NotifyUtils {
  private static renderToast(message: ToastMessage, icon: React.ReactNode, bgColor: string, duration: number = 3000) {
    return toast((t) => (
      <div className="flex items-center justify-between gap-3 min-w-[200px]">
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0">{icon}</div>
          <span className="text-sm font-medium leading-tight">{message}</span>
        </div>
        <button 
          onClick={() => toast.dismiss(t.id)}
          className="p-1 hover:bg-black/10 rounded-full transition-colors flex-shrink-0"
          title="Đóng nhận thông báo"
        >
          <X size={14} />
        </button>
      </div>
    ), {
      duration: duration,
      style: {
        background: bgColor,
        color: '#fff',
        maxWidth: '500px',
        borderRadius: '12px',
        padding: '12px 16px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    });
  }

  static simple = (message: ToastMessage) => {
    this.renderToast(message, <InfoCircle size={18}/>, '#3b82f6');
  };

  static simpleSuccess = (message: ToastMessage) => {
    this.renderToast(message, <Check size={18}/>, '#10b981', 2000);
  };

  /**
   * Hiển thị thông báo lỗi chi tiết.
   * Chấp nhận chuỗi thông báo hoặc đối tượng ErrorMessage từ API.
   */
  static simpleFailed = (error: ToastMessage | ErrorMessage | any, fallbackMessage: string = 'Thao tác không thành công') => {
    let finalMessage: ToastMessage;
    let detailMessage: string = '';

    if (typeof error === 'object' && error !== null) {
      // 1. Lấy message gốc
      detailMessage = error.message || error.description || '';

      // 2. Kiểm tra nếu message lại là một chuỗi JSON lồng nhau (Nested JSON)
      if (typeof detailMessage === 'string' && detailMessage.trim().startsWith('{')) {
        try {
          const nestedError = JSON.parse(detailMessage);
          detailMessage = nestedError.message || detailMessage;
        } catch (e) {
          // Nếu không parse được thì giữ nguyên
        }
      }

      // 3. Tối ưu thông báo lỗi liên kết ràng buộc (ConstraintViolationException) khi xóa
      if (typeof detailMessage === 'string' && (
        detailMessage.includes('ConstraintViolationException') ||
        detailMessage.includes('constraint') ||
        detailMessage.includes('foreign key') ||
        detailMessage.includes('could not execute statement')
      )) {
        detailMessage = 'Dữ liệu này đã được liên kết với các mục khác trong hệ thống (như đơn hàng, hóa đơn, sản phẩm...), không thể xóa.';
      }

      finalMessage = (
        <div className="flex flex-col gap-0.5">
          <span className="font-bold">{fallbackMessage}</span>
          <span className="text-xs opacity-90">{detailMessage}</span>
        </div>
      );
    } else {
      let errorStr = String(error);
      if (
        errorStr.includes('ConstraintViolationException') ||
        errorStr.includes('constraint') ||
        errorStr.includes('foreign key') ||
        errorStr.includes('could not execute statement')
      ) {
        errorStr = 'Dữ liệu này đã được liên kết với các mục khác trong hệ thống (như đơn hàng, hóa đơn, sản phẩm...), không thể xóa.';
      }
      finalMessage = errorStr;
    }

    this.renderToast(finalMessage, <X size={20}/>, '#ef4444', 5000);
  };

  static simpleWarning = (message: ToastMessage) => {
    this.renderToast(message, <AlertCircle size={18}/>, '#f59e0b', 4000);
  };

  static simpleInfo = (message: ToastMessage) => {
    this.renderToast(message, <InfoCircle size={18}/>, '#3b82f6', 3000);
  };
}

export default NotifyUtils;
