import React, { createContext, useContext, useState, useCallback } from 'react';
import { ToastMessage } from '../../types';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface ToastContextType {
  addToast: (title: string, description: string, type?: 'success' | 'danger' | 'info') => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (title: string, description: string, type: 'success' | 'danger' | 'info' = 'success') => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
      setToasts((prev) => [...prev, { id, title, description, type }]);

      setTimeout(() => {
        removeToast(id);
      }, 4500);
    },
    [removeToast],
  );

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Toast viewport */}
      <aside
        id="toast-viewport"
        aria-live="polite"
        aria-label="Notifications"
        className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-[380px] w-full pointer-events-none"
      >
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success' || !toast.type;
          const isDanger = toast.type === 'danger';

          return (
            <div
              key={toast.id}
              id={toast.id}
              role="status"
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-[16px] bg-white border border-[#E6DDD7] shadow-[0_4px_20px_rgba(41,37,37,0.08)] transition-all animate-in fade-in slide-in-from-top-2 duration-200 ${
                isDanger ? 'border-l-4 border-l-[#A92F35]' : isSuccess ? 'border-l-4 border-l-[#557A61]' : ''
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {isDanger ? (
                  <AlertCircle className="w-5 h-5 text-[#A92F35]" />
                ) : isSuccess ? (
                  <CheckCircle2 className="w-5 h-5 text-[#557A61]" />
                ) : (
                  <Info className="w-5 h-5 text-[#746C68]" />
                )}
              </div>

              <div className="flex-1 min-w-0 pr-1">
                <div className="text-[14px] font-semibold text-[#292525] leading-snug">{toast.title}</div>
                <p className="text-[13px] text-[#746C68] mt-0.5 leading-relaxed">{toast.description}</p>
              </div>

              <button
                type="button"
                id={`close-${toast.id}`}
                onClick={() => removeToast(toast.id)}
                aria-label="Close notification"
                className="shrink-0 text-[#958B86] hover:text-[#292525] p-1 -mr-1 -mt-1 rounded-md transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </aside>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
