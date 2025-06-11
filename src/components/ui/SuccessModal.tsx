import React from 'react';
import { CheckCircle, X } from 'lucide-react';
import Button from './Button';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  autoClose?: boolean;
  autoCloseDelay?: number;
  showCloseButton?: boolean;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  autoClose = true,
  autoCloseDelay = 3000,
  showCloseButton = true,
}) => {
  React.useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, autoCloseDelay, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl max-w-md w-full p-6 animate-scale-in shadow-2xl relative">
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
        
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-green-400/30 animate-pulse">
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2 animate-fade-in-up [animation-delay:200ms]">
            {title}
          </h3>
          <p className="text-white/80 animate-fade-in-up [animation-delay:400ms]">
            {message}
          </p>
          
          {autoClose && (
            <div className="mt-4 animate-fade-in-up [animation-delay:600ms]">
              <div className="w-full bg-white/20 rounded-full h-1 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 to-cyan-400 rounded-full animate-shrink-width"
                  style={{ 
                    animation: `shrinkWidth ${autoCloseDelay}ms linear forwards`
                  }}
                />
              </div>
              <p className="text-xs text-white/60 mt-2">
                Closing automatically...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;