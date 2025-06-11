import React, { useState, useEffect, useRef } from 'react';
import { X, MessageCircle, Minimize2, Maximize2, Users, Mail } from 'lucide-react';

// Extend the Window interface to include Tawk_API
declare global {
  interface Window {
    Tawk_API?: {
      toggle: () => void;
      maximize: () => void;
      minimize: () => void;
      hideWidget: () => void;
      showWidget: () => void;
      getStatus: () => string;
      onLoad?: () => void;
      onStatusChange?: (status: string) => void;
      isChatMaximized: () => boolean;
      isChatMinimized: () => boolean;
      isChatHidden: () => boolean;
      isChatOngoing: () => boolean;
      isVisitorEngaged: () => boolean;
      getWindowType: () => string;
      setAttributes: (attributes: any, callback?: () => void) => void;
      popup: () => void;
    };
  }
}

interface AnimatedChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AnimatedChatModal: React.FC<AnimatedChatModalProps> = ({ isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [tawkStatus, setTawkStatus] = useState<'connecting' | 'online' | 'away' | 'offline'>('connecting');
  const [tawkLoaded, setTawkLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Check Tawk.to API status and set up listeners
  useEffect(() => {
    const checkTawkStatus = () => {
      if (window.Tawk_API) {
        setTawkLoaded(true);
        
        // Get initial status
        try {
          const status = window.Tawk_API.getStatus();
          setTawkStatus(status as any);
          console.log('📊 Initial Tawk.to status:', status);
        } catch (error) {
          console.warn('⚠️ Could not get Tawk.to status:', error);
          setTawkStatus('offline');
        }

        // Set up status change listener
        const originalOnStatusChange = window.Tawk_API.onStatusChange;
        window.Tawk_API.onStatusChange = function(status: string) {
          console.log('📊 Tawk.to status changed to:', status);
          setTawkStatus(status as any);
          
          // Keep widget hidden
          if (window.Tawk_API?.hideWidget) {
            window.Tawk_API.hideWidget();
          }
          
          if (originalOnStatusChange) originalOnStatusChange(status);
        };
      }
    };

    // Check immediately and set up interval
    checkTawkStatus();
    const interval = setInterval(checkTawkStatus, 1000);

    // Clean up
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsAnimating(true);
      setIsMinimized(false);
      
      // When modal opens, ensure Tawk.to widget is maximized within iframe
      if (window.Tawk_API && tawkLoaded) {
        try {
          window.Tawk_API.maximize();
          console.log('🔍 Tawk.to widget maximized for modal');
        } catch (error) {
          console.warn('⚠️ Could not maximize Tawk.to widget:', error);
        }
      }
      
      const animationTimer = setTimeout(() => {
        setIsAnimating(false);
      }, 500);
      
      return () => {
        clearTimeout(animationTimer);
      };
    } else {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setIsAnimating(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, tawkLoaded]);

  const handleClose = () => {
    setIsAnimating(true);
    onClose();
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Don't render if not visible
  if (!isVisible) return null;

  const isAgentsOnline = tawkStatus === 'online';
  const isConnecting = !tawkLoaded || tawkStatus === 'connecting';

  return (
    <>
      {/* Backdrop with fade animation */}
      <div 
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-[9998] transition-all duration-300 ${
          isOpen && !isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleBackdropClick}
      />
      
      {/* Chat Modal - Properly Centered */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
        <div
          ref={modalRef}
          className={`pointer-events-auto transition-all duration-500 ease-out transform ${
            isOpen && !isAnimating
              ? 'translate-y-0 scale-100 opacity-100'
              : 'translate-y-8 scale-95 opacity-0'
          } ${
            isMinimized ? 'h-16' : 'h-[600px]'
          }`}
          style={{
            width: isMinimized ? '320px' : '420px',
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
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 animate-gradient-x" />
              </div>
              
              <div className="flex items-center space-x-3 relative z-10">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <MessageCircle className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Live Support</h3>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      isConnecting ? 'bg-yellow-400 animate-pulse' :
                      isAgentsOnline ? 'bg-green-400' :
                      'bg-orange-400'
                    }`} />
                    <p className="text-xs text-white/80">
                      {isConnecting ? 'Connecting...' :
                       isAgentsOnline ? 'Agents online' :
                       'Leave a message'}
                    </p>
                  </div>
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
                {isConnecting && (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center z-10">
                    <div className="text-center">
                      <div className="relative mb-6">
                        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <MessageCircle className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Connecting to Support</h3>
                      <p className="text-gray-600 text-sm">Please wait while we connect you...</p>
                      <div className="mt-4 flex justify-center space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Tawk.to Interface */}
                {!isConnecting && (
                  <div className="h-full flex flex-col">
                    {/* Status Header */}
                    <div className={`border-b p-3 ${
                      isAgentsOnline 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-orange-50 border-orange-200'
                    }`}>
                      <div className="flex items-center space-x-2">
                        {isAgentsOnline ? (
                          <Users className="h-4 w-4 text-green-600" />
                        ) : (
                          <Mail className="h-4 w-4 text-orange-600" />
                        )}
                        <span className={`text-sm font-medium ${
                          isAgentsOnline ? 'text-green-800' : 'text-orange-800'
                        }`}>
                          {isAgentsOnline ? 'Support agents are online' : 'Support agents are offline'}
                        </span>
                      </div>
                      <p className={`text-xs mt-1 ${
                        isAgentsOnline ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {isAgentsOnline 
                          ? "You'll be connected to the next available agent" 
                          : "Leave a message and we'll get back to you soon"}
                      </p>
                    </div>
                    
                    {/* Single Tawk.to Iframe - handles both online and offline states internally */}
                    <div className="flex-1">
                      <iframe
                        ref={iframeRef}
                        src="https://tawk.to/chat/68495a4c2061f3190a9644ee/1itf8hfev"
                        className="w-full h-full border-none"
                        allow="microphone; camera"
                        title="Tawk.to Support Chat"
                        onLoad={() => {
                          console.log('✅ Tawk.to iframe loaded successfully');
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Minimized State Content */}
            {isMinimized && (
              <div className="flex-1 flex items-center justify-between px-4 bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    isConnecting ? 'bg-yellow-400 animate-pulse' :
                    isAgentsOnline ? 'bg-green-400' :
                    'bg-orange-400'
                  }`} />
                  <p className="text-gray-700 text-sm font-medium">
                    {isConnecting ? 'Connecting...' :
                     isAgentsOnline ? 'Chat active' :
                     'Message pending'}
                  </p>
                </div>
                <button
                  onClick={toggleMinimize}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Maximize2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
          
          {/* Subtle glow effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-xl -z-10 opacity-50"></div>
        </div>
      </div>
    </>
  );
};

export default AnimatedChatModal;