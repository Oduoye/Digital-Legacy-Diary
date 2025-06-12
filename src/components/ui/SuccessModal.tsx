import React from 'react';
import { CheckCircle, X, Sparkles } from 'lucide-react';
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60] animate-fade-in">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl max-w-md w-full p-6 animate-scale-in shadow-2xl relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-400/10 via-cyan-400/5 to-blue-500/10 animate-gradient-x" />
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-green-400/20 to-cyan-400/20 rounded-full blur-xl animate-float" />
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-blue-400/15 to-purple-400/15 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }} />
        </div>

        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors z-10 p-1 rounded-full hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        )}
        
        <div className="text-center relative z-10">
          {/* Success icon with enhanced animation */}
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm border border-green-400/30 animate-pulse">
              <CheckCircle className="h-10 w-10 text-green-400 animate-scale-in" style={{ animationDelay: '200ms' }} />
            </div>
            {/* Sparkle effects */}
            <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-400 animate-float" style={{ animationDelay: '500ms' }} />
            <Sparkles className="absolute -bottom-1 -left-2 h-4 w-4 text-cyan-400 animate-float" style={{ animationDelay: '800ms' }} />
            <Sparkles className="absolute top-1/2 -right-4 h-5 w-5 text-purple-400 animate-float" style={{ animationDelay: '1100ms' }} />
          </div>

          <h3 className="text-xl font-semibold text-white mb-3 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            {title}
          </h3>
          <p className="text-white/80 leading-relaxed animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            {message}
          </p>
          
          {autoClose && (
            <div className="mt-6 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
              <div className="w-full bg-white/20 rounded-full h-1 overflow-hidden backdrop-blur-sm">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400 rounded-full animate-shrink-width"
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

          {!autoClose && (
            <div className="mt-6 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
              <Button
                onClick={onClose}
                className="bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white shadow-xl transform transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Continue
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;