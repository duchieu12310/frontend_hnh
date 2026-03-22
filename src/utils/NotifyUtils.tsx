import React from 'react';
import toast from 'react-hot-toast';
import { Check, X, AlertCircle, InfoCircle } from 'tabler-icons-react';

type ToastMessage = string | React.ReactNode;

class NotifyUtils {
  private static renderToast(message: ToastMessage, icon: React.ReactNode, bgColor: string) {
    return toast((t) => (
      <div className="flex items-center justify-between gap-3 min-w-[200px]">
        <div className="flex items-center gap-2">
          {icon}
          <span>{message}</span>
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
      duration: 1000,
      style: {
        background: bgColor,
        color: '#fff',
        maxWidth: '500px',
      },
    });
  }

  static simple = (message: ToastMessage) => {
    this.renderToast(message, <InfoCircle size={18}/>, '#3b82f6');
  };

  static simpleSuccess = (message: ToastMessage) => {
    this.renderToast(message, <Check size={18}/>, '#10b981');
  };

  static simpleFailed = (message: ToastMessage) => {
    this.renderToast(message, <X size={18}/>, '#ef4444');
  };

  static simpleWarning = (message: ToastMessage) => {
    this.renderToast(message, <AlertCircle size={18}/>, '#f59e0b');
  };

  static simpleInfo = (message: ToastMessage) => {
    this.renderToast(message, <InfoCircle size={18}/>, '#3b82f6');
  };
}

export default NotifyUtils;
