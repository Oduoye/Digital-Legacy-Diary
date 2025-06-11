import React, { useState, useEffect, useRef } from 'react';
import { X, MessageCircle, Minimize2, Maximize2, Users, Mail, Phone, Clock } from 'lucide-react';

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
  const [iframeLoaded, setIframeLoaded] = useState(false);
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
          console.log('📊 Tawk.to status:', status);
        } catch (error) {
          console.warn('⚠️ Could not get Tawk.to status:', error);
          setTawkStatus('offline');
        }

        // Set up status change listener
        const originalOnStatusChange = window.Tawk_API.onStatusChange;
        window.Tawk_API.onStatusChange = function(status: string) {
          console.log('📊 Tawk.to status changed to:', status);
          setTawkStatus(status as any);
          
          // Ensure default widget stays hidden
          if (window.Tawk_API?.hideWidget) {
            window.Tawk_API.hideWidget();
          }
          
          if (originalOnStatusChange) originalOnStatusChange(status);
        };
      }
    };

    // Check immediately and set up interval
    checkTawkStatus();
    const interval = setInterval(checkTawkStatus, 2000);

    // Clean up
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsAnimating(true);
      setIsMinimized(false);
      setIframeLoaded(false);
      
      const animationTimer = setTimeout(() => {
        setIsAnimating(false);
      }, 600);
      
      return () => {
        clearTimeout(animationTimer);
      };
    } else {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setIsAnimating(false);
        setIframeLoaded(false);
      }, 400);
      
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

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleIframeLoad = () => {
    console.log('✅ Chat iframe loaded successfully');
    setIframeLoaded(true);
    
    // Small delay to ensure iframe content is ready
    setTimeout(() => {
      setTawkStatus(prev => prev === 'connecting' ? 'online' : prev);
    }, 1000);
  };

  // Don't render if not visible
  if (!isVisible) return null;

  const isAgentsOnline = tawkStatus === 'online';
  const isConnecting = !tawkLoaded || !iframeLoaded || tawkStatus === 'connecting';

  return (
    <>
      {/* Backdrop with enhanced blur effect */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-md z-[9998] transition-all duration-400 ${
          isOpen && !isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleBackdropClick}
      />
      
      {/* Chat Modal - Enhanced positioning and animations */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none chat-modal-container">
        <div
          ref={modalRef}
          className={`pointer-events-auto transition-all duration-600 ease-out transform ${
            isOpen && !isAnimating
              ? 'translate-y-0 scale-100 opacity-100 rotate-0'
              : 'translate-y-12 scale-90 opacity-0 rotate-1'
          } ${
            isMinimized ? 'h-16' : 'h-[600px]'
          }`}
          style={{
            width: isMinimized ? '320px' : '440px',
            maxWidth: 'calc(100vw - 32px)',
            maxHeight: 'calc(100vh - 32px)',
            filter: isAnimating ? 'blur(1px)' : 'blur(0px)',
          }}
        >
          {/* Modal Container with enhanced styling */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 h-full flex flex-col relative">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 pointer-events-none" />
            
            {/* Header with enhanced design */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 px-4 py-3 flex items-center justify-between text-white relative overflow-hidden">
              {/* Animated background elements */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent animate-pulse" />
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 animate-gradient-x" />
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl animate-float" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-white/5 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }} />
              </div>
              
              <div className="flex items-center space-x-3 relative z-10">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-lg">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-base">Digital Legacy Support</h3>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2.5 h-2.5 rounded-full shadow-sm ${
                      isConnecting ? 'bg-yellow-400 animate-pulse' :
                      isAgentsOnline ? 'bg-green-400 animate-bounce' :
                      tawkStatus === 'away' ? 'bg-orange-400' :
                      'bg-red-400'
                    }`} />
                    <p className="text-xs text-white/90 font-medium">
                      {isConnecting ? 'Connecting to support...' :
                       isAgentsOnline ? 'Support agents online' :
                       tawkStatus === 'away' ? 'Agents away - leave message' :
                       'Offline - leave message'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 relative z-10">
                {/* Minimize/Maximize Button */}
                <button
                  onClick={toggleMinimize}
                  className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all duration-200 hover:scale-110 backdrop-blur-sm border border-white/20"
                  title={isMinimized ? 'Maximize chat' : 'Minimize chat'}
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
                  className="w-9 h-9 rounded-full bg-white/20 hover:bg-red-500 flex items-center justify-center transition-all duration-200 hover:scale-110 backdrop-blur-sm border border-white/20"
                  title="Close chat"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {/* Chat Content */}
            {!isMinimized && (
              <div className="flex-1 relative overflow-hidden bg-gray-50">
                {/* Enhanced Loading State */}
                {isConnecting && (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center z-10">
                    <div className="text-center max-w-sm px-6">
                      <div className="relative mb-8">
                        <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <MessageCircle className="h-8 w-8 text-blue-600 animate-pulse" />
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">Connecting to Support</h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">
                        We're connecting you to our support team. This usually takes just a few seconds.
                      </p>
                      <div className="flex justify-center space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Chat Interface */}
                {!isConnecting && (
                  <div className="h-full flex flex-col">
                    {/* Enhanced Status Header */}
                    <div className={`border-b p-4 transition-all duration-300 ${
                      isAgentsOnline 
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
                        : tawkStatus === 'away'
                        ? 'bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200'
                        : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isAgentsOnline ? 'bg-green-100' :
                          tawkStatus === 'away' ? 'bg-orange-100' :
                          'bg-red-100'
                        }`}>
                          {isAgentsOnline ? (
                            <Users className="h-5 w-5 text-green-600" />
                          ) : tawkStatus === 'away' ? (
                            <Clock className="h-5 w-5 text-orange-600" />
                          ) : (
                            <Mail className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-semibold text-sm ${
                            isAgentsOnline ? 'text-green-800' :
                            tawkStatus === 'away' ? 'text-orange-800' :
                            'text-red-800'
                          }`}>
                            {isAgentsOnline ? 'Support Team Online' :
                             tawkStatus === 'away' ? 'Support Team Away' :
                             'Support Team Offline'}
                          </h4>
                          <p className={`text-xs ${
                            isAgentsOnline ? 'text-green-600' :
                            tawkStatus === 'away' ? 'text-orange-600' :
                            'text-red-600'
                          }`}>
                            {isAgentsOnline 
                              ? "You'll be connected to an agent shortly" 
                              : tawkStatus === 'away'
                              ? "Agents are away but will respond soon"
                              : "Leave a message and we'll get back to you"}
                          </p>
                        </div>
                        {isAgentsOnline && (
                          <div className="flex items-center space-x-1">
                            <Phone className="h-4 w-4 text-green-600" />
                            <span className="text-xs text-green-600 font-medium">Live</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Tawk.to Iframe Container */}
                    <div className="flex-1 relative">
                      <iframe
                        ref={iframeRef}
                        src="https://tawk.to/chat/68495a4c2061f3190a9644ee/1itf8hfev"
                        className="w-full h-full border-none bg-white"
                        allow="microphone; camera; fullscreen"
                        title="Digital Legacy Diary Support Chat"
                        onLoad={handleIframeLoad}
                        style={{
                          minHeight: '400px',
                          backgroundColor: '#ffffff'
                        }}
                      />
                      
                      {/* Iframe loading overlay */}
                      {!iframeLoaded && (
                        <div className="absolute inset-0 bg-white flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-2"></div>
                            <p className="text-sm text-gray-600">Loading chat interface...</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Enhanced Minimized State */}
            {isMinimized && (
              <div className="flex-1 flex items-center justify-between px-4 bg-gradient-to-r from-blue-50 via-white to-purple-50 border-t">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    isConnecting ? 'bg-yellow-400 animate-pulse' :
                    isAgentsOnline ? 'bg-green-400 animate-bounce' :
                    'bg-orange-400'
                  }`} />
                  <p className="text-gray-700 text-sm font-medium">
                    {isConnecting ? 'Connecting to support...' :
                     isAgentsOnline ? 'Live chat active' :
                     'Message pending response'}
                  </p>
                </div>
                <button
                  onClick={toggleMinimize}
                  className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded hover:bg-blue-50"
                  title="Expand chat"
                >
                  <Maximize2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
          
          {/* Enhanced glow effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-blue-400/10 blur-2xl -z-10 opacity-60 animate-pulse"></div>
        </div>
      </div>
    </>
  );
};

export default AnimatedChatModal;