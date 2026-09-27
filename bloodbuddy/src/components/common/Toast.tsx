import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id?: string;
  type?: 'success' | 'info' | 'error';
  title: string;
  description?: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  toast,
  onClose,
  duration = 5000,
}) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [toast, onClose, duration]);

  if (!toast) return null;

  const type = toast.type || 'info';

  const iconBg = {
    success: 'bg-[#EDF4EE] text-[#557A61]',
    error: 'bg-[#F7EAE7] text-[#A92F35]',
    info: 'bg-[#FAF7F2] text-[#746C68]',
  }[type];

  return (
    <div
      id={toast.id || 'bloodbuddy-toast'}
      role="status"
      aria-live="polite"
      className="fixed top-20 right-6 z-50 max-w-sm w-full bg-white border border-[#E6DDD7] rounded-2xl shadow-[0_12px_32px_rgba(41,37,37,0.12)] p-4 animate-in fade-in slide-in-from-top-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${iconBg}`}
          >
            {type === 'success' && <CheckCircle2 className="w-4 h-4" />}
            {type === 'error' && <AlertCircle className="w-4 h-4" />}
            {type === 'info' && <Info className="w-4 h-4" />}
          </div>
          <div className="space-y-0.5">
            <h5 className="font-semibold text-[#292525] text-xs sm:text-sm">
              {toast.title}
            </h5>
            {toast.description && (
              <p className="text-[#746C68] text-xs leading-relaxed">
                {toast.description}
              </p>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss message"
          className="text-[#958B86] hover:text-[#292525] p-1 rounded-lg hover:bg-[#FAF7F2] transition-colors flex-shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
