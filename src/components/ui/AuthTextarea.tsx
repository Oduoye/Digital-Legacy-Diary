import React from 'react';

interface AuthTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const AuthTextarea: React.FC<AuthTextareaProps> = ({
  label,
  error,
  className = '',
  id,
  ...props
}) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substring(2, 9)}`;
  
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-white mb-1"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={`
          w-full rounded-md border border-white/20 shadow-sm px-4 py-2 bg-white/10 backdrop-blur-sm text-white placeholder-white/60
          focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400
          ${error ? 'border-red-400' : ''}
          ${className}
        `}
        rows={4}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-300">{error}</p>}
    </div>
  );
};

export default AuthTextarea;