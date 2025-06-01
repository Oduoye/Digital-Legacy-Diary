import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  gradientFrom?: string;
  gradientTo?: string;
  gradientDirection?: 'tr' | 'br' | 'r' | 'bl' | 'tl' | 'l' | 't' | 'b';
  border?: boolean;
  hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '',
  onClick,
  gradientFrom,
  gradientTo,
  gradientDirection = 'br',
  border = true,
  hoverable = true,
}) => {
  const gradientClasses = gradientFrom && gradientTo
    ? `bg-gradient-to-${gradientDirection} from-${gradientFrom} to-${gradientTo}`
    : 'bg-white';

  const hoverClasses = hoverable
    ? 'transition-all duration-200 hover:shadow-lg hover:translate-y-[-2px]'
    : '';

  const borderClasses = border
    ? 'border border-gray-200'
    : '';

  return (
    <div 
      className={`
        rounded-lg shadow-md overflow-hidden
        ${gradientClasses}
        ${hoverClasses}
        ${borderClasses}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return <div className={`p-4 border-b border-gray-200/20 ${className}`}>{children}</div>;
};

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return <div className={`p-4 ${className}`}>{children}</div>;
};

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return <div className={`p-4 border-t border-gray-200/20 bg-black/5 ${className}`}>{children}</div>;
};

export default Card;