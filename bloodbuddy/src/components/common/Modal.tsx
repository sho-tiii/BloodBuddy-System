import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  id?: string;
  preventClose?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md',
  id,
  preventClose = false,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !preventClose) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, preventClose]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-3xl',
  };

  return (
    <div
      id={id}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#292525]/40 backdrop-blur-[2px] transition-opacity"
        onClick={() => {
          if (!preventClose) onClose();
        }}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id || 'modal'}-title`}
        className={`relative w-full ${maxWidthStyles[maxWidth]} bg-white border border-[#E6DDD7] rounded-[18px] shadow-[0_16px_40px_rgba(41,37,37,0.12)] p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#E6DDD7] mb-5">
          <div>
            <h2
              id={`${id || 'modal'}-title`}
              className="font-heading text-xl sm:text-2xl font-bold text-[#292525]"
            >
              {title}
            </h2>
            {description && (
              <p className="text-xs sm:text-sm text-[#746C68] mt-1 leading-relaxed">
                {description}
              </p>
            )}
          </div>
          {!preventClose && (
            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="text-[#958B86] hover:text-[#292525] p-1.5 rounded-full hover:bg-[#FAF7F2] transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
};
