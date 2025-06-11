import React, { useState, useEffect, useRef } from 'react';
import { X, MessageCircle, Minimize2, Maximize2, Users, Mail } from 'lucide-react';

interface AnimatedChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AnimatedChatModal: React.FC<AnimatedChatModalProps> = ({ isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'offline'>('connecting');
  const [agentsOnline, setAgentsOnline] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsAnimating(true);
      setIsMinimized(false);
      setConnectionStatus('connecting');
      
      // Simulate connection check
      const connectionTimer = setTimeout(() => {
        setConnectionStatus('connected');
        // Simulate checking if agents are online (in real app, this would come from Tawk.to API)
        const isOnline = Math.random() > 0.5; // 50% chance for demo
        setAgentsOnline(isOnline);
      }, 2000);
      
      const animationTimer = setTimeout(() => {
        setIsAnimating(false);
      }, 500);
      
      return () => {
        clearTimeout(connectionTimer);
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

  // Don't render if not visible
  if (!isVisible) return null;

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
                      connectionStatus === 'connecting' ? 'bg-yellow-400 animate-pulse' :
                      connectionStatus === 'connected' && agentsOnline ? 'bg-green-400' :
                      'bg-orange-400'
                    }`} />
                    <p className="text-xs text-white/80">
                      {connectionStatus === 'connecting' ? 'Connecting...' :
                       connectionStatus === 'connected' && agentsOnline ? 'Agents online' :
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
                {connectionStatus === 'connecting' && (
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
                
                {/* Connection Status Display */}
                {connectionStatus === 'connected' && (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white">
                    {agentsOnline ? (
                      // Live Chat Interface
                      <div className="h-full flex flex-col">
                        <div className="bg-green-50 border-b border-green-200 p-3">
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-800">Support agents are online</span>
                          </div>
                          <p className="text-xs text-green-600 mt-1">You'll be connected to the next available agent</p>
                        </div>
                        
                        {/* Tawk.to Iframe for Live Chat */}
                        <div className="flex-1">
                          <iframe
                            ref={iframeRef}
                            src="https://tawk.to/chat/68495a4c2061f3190a9644ee/1itf8hfev"
                            className="w-full h-full border-none"
                            allow="microphone; camera"
                            title="Live Chat Support"
                            onLoad={() => {
                              console.log('✅ Live chat iframe loaded successfully');
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      // Offline Contact Form Interface
                      <div className="h-full flex flex-col">
                        <div className="bg-orange-50 border-b border-orange-200 p-3">
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-orange-600" />
                            <span className="text-sm font-medium text-orange-800">Support agents are offline</span>
                          </div>
                          <p className="text-xs text-orange-600 mt-1">Leave a message and we'll get back to you soon</p>
                        </div>
                        
                        {/* Tawk.to Iframe for Contact Form */}
                        <div className="flex-1">
                          <iframe
                            ref={iframeRef}
                            src="https://tawk.to/chat/68495a4c2061f3190a9644ee/1itf8hfev"
                            className="w-full h-full border-none"
                            allow="microphone; camera"
                            title="Contact Form Support"
                            onLoad={() => {
                              console.log('✅ Contact form iframe loaded successfully');
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* Minimized State Content */}
            {isMinimized && (
              <div className="flex-1 flex items-center justify-between px-4 bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    connectionStatus === 'connecting' ? 'bg-yellow-400 animate-pulse' :
                    connectionStatus === 'connected' && agentsOnline ? 'bg-green-400' :
                    'bg-orange-400'
                  }`} />
                  <p className="text-gray-700 text-sm font-medium">
                    {connectionStatus === 'connecting' ? 'Connecting...' :
                     connectionStatus === 'connected' && agentsOnline ? 'Chat active' :
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