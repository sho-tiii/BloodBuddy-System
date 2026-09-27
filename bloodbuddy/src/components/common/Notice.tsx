import React from 'react';
import { ShieldAlert, Info, AlertTriangle, Lock } from 'lucide-react';

interface NoticeProps {
  type?: 'clinical' | 'privacy' | 'info' | 'warning';
  title?: string;
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const Notice: React.FC<NoticeProps> = ({
  type = 'clinical',
  title,
  children,
  className = '',
  id,
}) => {
  const configs = {
    clinical: {
      icon: ShieldAlert,
      bg: 'bg-[#FDF9F7]',
      border: 'border-[#F2DDD9]',
      text: 'text-[#8F272D]',
      bodyText: 'text-[#6D4744]',
      defaultTitle: 'Clinical Responsibility Notice',
    },
    privacy: {
      icon: Lock,
      bg: 'bg-[#F9F7F5]',
      border: 'border-[#E6DDD7]',
      text: 'text-[#292525]',
      bodyText: 'text-[#746C68]',
      defaultTitle: 'Privacy & Safety Protected',
    },
    info: {
      icon: Info,
      bg: 'bg-[#FAF7F2]',
      border: 'border-[#E6DDD7]',
      text: 'text-[#292525]',
      bodyText: 'text-[#746C68]',
      defaultTitle: 'Important Information',
    },
    warning: {
      icon: AlertTriangle,
      bg: 'bg-[#FFF9EE]',
      border: 'border-[#F3E2B8]',
      text: 'text-[#8C6418]',
      bodyText: 'text-[#6B5325]',
      defaultTitle: 'Please Note',
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div
      id={id}
      className={`rounded-[14px] p-4 border ${config.bg} ${config.border} flex items-start gap-3 text-xs sm:text-sm leading-relaxed ${className}`}
    >
      <div className={`p-1 rounded-full flex-shrink-0 mt-0.5 ${config.text}`}>
        <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
      </div>
      <div className="flex-1">
        {(title || config.defaultTitle) && (
          <h4 className={`font-semibold mb-1 ${config.text}`}>
            {title || config.defaultTitle}
          </h4>
        )}
        <div className={config.bodyText}>{children}</div>
      </div>
    </div>
  );
};
