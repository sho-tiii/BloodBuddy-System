import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold transition-all duration-150 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A92F35]/20 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap select-none';

  const sizeStyles = {
    sm: 'text-xs py-2 px-3.5 gap-1.5 h-9',
    md: 'text-sm py-3 px-5 gap-2 h-12',
    lg: 'text-base py-3.5 px-6 gap-2.5 h-[52px]',
  };

  const variantStyles = {
    primary:
      'bg-[#A92F35] text-white hover:bg-[#8F272D] active:bg-[#7D2227] shadow-xs',
    secondary:
      'bg-[#F7EAE7] text-[#A92F35] hover:bg-[#F2DFDC] active:bg-[#EBD2CE]',
    outline:
      'bg-white border border-[#E6DDD7] text-[#292525] hover:bg-[#FAF7F2] hover:border-[#D8CCC5]',
    ghost:
      'bg-transparent text-[#746C68] hover:text-[#292525] hover:bg-[#FAF7F2]',
    danger:
      'bg-white border border-red-200 text-[#8F272D] hover:bg-red-50',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
};
