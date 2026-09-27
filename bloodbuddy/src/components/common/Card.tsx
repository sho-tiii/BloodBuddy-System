import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  padding = 'md',
  className = '',
  id,
  ...props
}) => {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      id={id}
      className={`bg-white border border-[#E6DDD7] rounded-[16px] shadow-[0_2px_8px_rgba(41,37,37,0.03)] transition-all duration-150 ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
