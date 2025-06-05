import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
  
  // Define variant classes
  const getVariantClasses = (variant: ButtonVariant, customClassName: string) => {
    // Check if custom className contains color classes
    const hasCustomTextColor = customClassName.includes('text-');
    const hasCustomBgColor = customClassName.includes('bg-');
    const hasCustomBorder = customClassName.includes('border-');

    const variantStyles = {
      primary: `${!hasCustomBgColor ? 'bg-primary-600 hover:bg-primary-700' : ''} ${!hasCustomTextColor ? 'text-white' : ''} ${!hasCustomBorder ? 'focus-visible:ring-primary-500' : ''}`,
      secondary: `${!hasCustomBgColor ? 'bg-secondary-600 hover:bg-secondary-700' : ''} ${!hasCustomTextColor ? 'text-white' : ''} ${!hasCustomBorder ? 'focus-visible:ring-secondary-500' : ''}`,
      outline: `${!hasCustomBgColor ? 'bg-transparent hover:bg-gray-50' : ''} ${!hasCustomTextColor ? 'text-gray-700' : ''} ${!hasCustomBorder ? 'border border-gray-300 focus-visible:ring-primary-500' : ''}`,
      ghost: `${!hasCustomBgColor ? 'bg-transparent hover:bg-gray-100' : ''} ${!hasCustomTextColor ? 'text-gray-700' : ''} ${!hasCustomBorder ? 'focus-visible:ring-primary-500' : ''}`,
      danger: `${!hasCustomBgColor ? 'bg-red-600 hover:bg-red-700' : ''} ${!hasCustomTextColor ? 'text-white' : ''} ${!hasCustomBorder ? 'focus-visible:ring-red-500' : ''}`,
    };

    return variantStyles[variant];
  };
  
  const sizeClasses = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 py-2',
    lg: 'h-11 px-6 text-lg',
  };

  const variantClasses = getVariantClasses(variant, className);

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${sizeClasses[size]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
          <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : icon ? (
        <span className="mr-2">{icon}</span>
      ) : null}
      {children}
    </button>
  );
};

export default Button;