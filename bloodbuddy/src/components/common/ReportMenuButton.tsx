import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Flag } from 'lucide-react';

interface ReportMenuButtonProps {
  onOpenReport: () => void;
  label?: string; // e.g. "Report an Issue" or "Report Request"
  id?: string;
  align?: 'left' | 'right';
}

export const ReportMenuButton: React.FC<ReportMenuButtonProps> = ({
  onOpenReport,
  label = 'Report an Issue',
  id = 'report-menu-btn',
  align = 'right',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        id={id}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="More options"
        aria-expanded={isOpen}
        className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#E6DDD7] bg-white text-[#746C68] hover:text-[#292525] hover:bg-[#FAF7F2] transition-colors focus:outline-none"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {isOpen && (
        <div
          className={`absolute ${
            align === 'right' ? 'right-0' : 'left-0'
          } mt-1.5 w-48 bg-white border border-[#E6DDD7] rounded-xl shadow-[0_8px_24px_rgba(41,37,37,0.08)] py-1.5 z-40 animate-in fade-in slide-in-from-top-1`}
        >
          <button
            type="button"
            id={`${id}-action`}
            onClick={() => {
              setIsOpen(false);
              onOpenReport();
            }}
            className="w-full text-left px-3.5 py-2 text-xs font-medium text-[#746C68] hover:text-[#8F272D] hover:bg-[#FAF7F2] flex items-center gap-2 transition-colors"
          >
            <Flag className="w-3.5 h-3.5 text-[#958B86]" />
            <span>{label}</span>
          </button>
        </div>
      )}
    </div>
  );
};
