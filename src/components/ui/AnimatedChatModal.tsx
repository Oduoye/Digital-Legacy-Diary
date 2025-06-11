import React, { useState, useEffect, useRef } from 'react';
import { X, MessageCircle, Minimize2, Maximize2 } from 'lucide-react';

interface AnimatedChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AnimatedChatModal: React.FC<AnimatedChatModalProps> = ({ isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsAnimating(true);
      // Reset minimized state when opening
      setIsMinimized(false);
      
      // End animation after duration
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 500);
      
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(true);
      // Start close animation
      const timer = setTimeout(() => {
        setIsVisible(false);
        setIsAnimating(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(true);
    onClose();
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // Don't render if not visible
  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop with fade animation */}
      <div 
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998] transition-all duration-300 ${
          isOpen && !isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />
      
      {/* Chat Modal */}
      <div
        ref={modalRef}
        className={`fixed bottom-6 right-6 z-[9999] transition-all duration-500 ease-out transform ${
          isOpen && !isAnimating
            ? 'translate-y-0 scale-100 opacity-100'
            : 'translate-y-8 scale-95 opacity-0'
        } ${
          isMinimized ? 'h-16' : 'h-[600px]'
        }`}
        style={{
          width: isMinimized ? '280px' : '400px',
          maxWidth: 'calc(100vw - 32px)',
          maxHeight: 'calc(100vh - 32px)',
        }}
      >
        {/* Modal Container */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 h-full flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 flex items-center justify-between text-white relative overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse" />
            </div>
            
            <div className="flex items-center space-x-3 relative z-10">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <MessageCircle className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Live Support</h3>
                <p className="text-xs text-white/80">We're here to help!</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 relative z-10">
              {/* Minimize/Maximize Button */}
              <button
                onClick={toggleMinimize}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all duration-200 hover:scale-110"
                title={isMinimized ? 'Maximize' : 'Minimize'}
              >
                {isMinimized ? (
                  <Maximize2 className="h-4 w-4" />
                ) : (
                  <Minimize2 className="h-4 w-4" />
                )}
              </button>
              
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-red-500 flex items-center justify-center transition-all duration-200 hover:scale-110"
                title="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* Chat Content */}
          {!isMinimized && (
            <div className="flex-1 relative overflow-hidden">
              {/* Loading State */}
              <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600 text-sm">Connecting to support...</p>
                </div>
              </div>
              
              {/* Tawk.to Iframe */}
              <iframe
                ref={iframeRef}
                src="https://tawk.to/chat/68495a4c2061f3190a9644ee/1itf8hfev"
                className="w-full h-full border-none"
                allow="microphone; camera"
                title="Live Chat Support"
                onLoad={() => {
                  console.log('✅ Chat iframe loaded successfully');
                }}
                onError={() => {
                  console.error('❌ Chat iframe failed to load');
                }}
              />
            </div>
          )}
          
          {/* Minimized State Content */}
          {isMinimized && (
            <div className="flex-1 flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50">
              <p className="text-gray-600 text-sm font-medium">Chat minimized</p>
            </div>
          )}
        </div>
        
        {/* Resize Handle (optional) */}
        {!isMinimized && (
          <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize opacity-50 hover:opacity-100 transition-opacity">
            <div className="w-full h-full bg-gradient-to-br from-transparent to-gray-400 rounded-tl-lg"></div>
          </div>
        )}
      </div>
    </>
  );
};

export default AnimatedChatModal;