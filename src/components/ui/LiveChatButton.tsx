import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

interface LiveChatButtonProps {
  variant?: 'floating' | 'inline';
}

// Extend the Window interface to include Tawk_API
declare global {
  interface Window {
    Tawk_API?: {
      toggle: () => void;
      maximize: () => void;
      minimize: () => void;
      hideWidget: () => void;
      showWidget: () => void;
      onLoad?: () => void;
      onStatusChange?: (status: string) => void;
      isChatMaximized: () => boolean;
      isChatMinimized: () => boolean;
      isChatHidden: () => boolean;
      isChatOngoing: () => boolean;
      isVisitorEngaged: () => boolean;
      getWindowType: () => string;
      getStatus: () => string;
      setAttributes: (attributes: any, callback?: () => void) => void;
      popup: () => void;
    };
  }
}

const LiveChatButton: React.FC<LiveChatButtonProps> = ({ variant = 'floating' }) => {
  const [isTawkLoaded, setIsTawkLoaded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [chatStatus, setChatStatus] = useState('loading');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let checkInterval: NodeJS.Timeout;
    let timeoutId: NodeJS.Timeout;
    
    const checkTawkLoaded = () => {
      if (window.Tawk_API) {
        console.log('🔍 Tawk_API found, setting up handlers...');
        setIsTawkLoaded(true);
        setChatStatus('ready');
        
        // Ensure the default widget is hidden
        if (window.Tawk_API.hideWidget) {
          window.Tawk_API.hideWidget();
          console.log('🙈 Ensured default widget is hidden');
        }
        
        clearInterval(checkInterval);
        clearTimeout(timeoutId);
      }
    };

    // Check immediately
    checkTawkLoaded();

    // Set up interval to check periodically
    checkInterval = setInterval(checkTawkLoaded, 500);

    // Set timeout to stop checking after 30 seconds
    timeoutId = setTimeout(() => {
      clearInterval(checkInterval);
      if (!isTawkLoaded) {
        console.warn('⚠️ Tawk.to failed to load within 30 seconds');
        setChatStatus('failed');
      }
    }, 30000);

    // Cleanup
    return () => {
      if (checkInterval) clearInterval(checkInterval);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isTawkLoaded]);

  const createFadeInChatPopup = () => {
    // Remove any existing fallback chat
    const existingChat = document.getElementById('fallback-chat');
    if (existingChat) {
      // Fade out existing chat
      existingChat.style.animation = 'fadeOut 0.3s ease-out forwards';
      setTimeout(() => {
        existingChat.remove();
      }, 300);
      return;
    }
    
    // Create fade-in chat container
    const chatContainer = document.createElement('div');
    chatContainer.id = 'fallback-chat';
    chatContainer.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 350px;
      height: 500px;
      border: none;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.15), 0 8px 32px rgba(0,0,0,0.1);
      z-index: 9999;
      background: white;
      overflow: hidden;
      opacity: 0;
      animation: fadeIn 0.4s ease-out forwards;
    `;
    
    // Create iframe for embedded chat
    const iframe = document.createElement('iframe');
    iframe.src = 'https://tawk.to/chat/68495a4c2061f3190a9644ee/1itf8hfev';
    iframe.style.cssText = `
      width: 100%;
      height: 100%;
      border: none;
      border-radius: 16px;
      opacity: 0;
      animation: fadeIn 0.3s ease-out 0.2s forwards;
    `;
    iframe.allow = 'microphone; camera';
    
    // Add fade-in close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
      position: absolute;
      top: 12px;
      right: 12px;
      width: 28px;
      height: 28px;
      border: none;
      border-radius: 50%;
      background: rgba(0,0,0,0.6);
      color: white;
      font-size: 18px;
      font-weight: bold;
      cursor: pointer;
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      opacity: 0;
      animation: fadeIn 0.3s ease-out 0.3s forwards;
    `;
    
    closeBtn.onmouseenter = () => {
      closeBtn.style.background = 'rgba(255,0,0,0.8)';
      closeBtn.style.transform = 'scale(1.1)';
    };
    
    closeBtn.onmouseleave = () => {
      closeBtn.style.background = 'rgba(0,0,0,0.6)';
      closeBtn.style.transform = 'scale(1)';
    };
    
    closeBtn.onclick = () => {
      // Fade out
      chatContainer.style.animation = 'fadeOut 0.3s ease-out forwards';
      setTimeout(() => {
        chatContainer.remove();
      }, 300);
    };
    
    // Add header with fade-in
    const header = document.createElement('div');
    header.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 50px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      padding: 0 16px;
      color: white;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-weight: 600;
      font-size: 14px;
      z-index: 10001;
      opacity: 0;
      animation: fadeIn 0.3s ease-out 0.1s forwards;
    `;
    header.textContent = '💬 Live Support Chat';
    
    // Adjust iframe to account for header
    iframe.style.marginTop = '50px';
    iframe.style.height = 'calc(100% - 50px)';
    
    chatContainer.appendChild(header);
    chatContainer.appendChild(iframe);
    chatContainer.appendChild(closeBtn);
    document.body.appendChild(chatContainer);
    
    console.log('✅ Fade-in chat popup created');
  };

  const handleChatClick = () => {
    console.log('🖱️ Custom chat button clicked, Tawk_API available:', !!window.Tawk_API);
    
    if (!window.Tawk_API) {
      console.warn('⚠️ Tawk_API not available yet');
      if (retryCount < 3) {
        setRetryCount(prev => prev + 1);
        setTimeout(handleChatClick, 1000);
      } else {
        alert('Live chat is still loading. Please wait a moment and try again.');
      }
      return;
    }

    try {
      console.log('🚀 Opening chat via custom button...');
      
      // Method 1: Try to maximize directly (most reliable for embedded chat)
      if (window.Tawk_API.maximize) {
        console.log('📈 Using maximize method...');
        window.Tawk_API.maximize();
      } else if (window.Tawk_API.toggle) {
        console.log('🔄 Using toggle method...');
        window.Tawk_API.toggle();
      } else if (window.Tawk_API.popup) {
        console.log('🪟 Using popup method...');
        window.Tawk_API.popup();
      }
      
      console.log('✅ Chat opened successfully via custom button');
      
    } catch (error) {
      console.error('❌ Error opening chat via custom button:', error);
      
      // Fallback: Create fade-in embedded chat
      console.log('🔄 Creating fade-in fallback chat...');
      createFadeInChatPopup();
    }
  };

  // Add CSS animations to the document
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        0% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
      }
      
      @keyframes fadeOut {
        0% {
          opacity: 1;
        }
        100% {
          opacity: 0;
        }
      }
      
      @keyframes pulseGlow {
        0%, 100% {
          box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
        }
        50% {
          box-shadow: 0 0 0 8px rgba(59, 130, 246, 0);
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (variant === 'inline') {
    return (
      <button
        onClick={handleChatClick}
        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
        title={isTawkLoaded ? "Start live chat" : "Live chat is loading..."}
      >
        <MessageCircle className="h-5 w-5" />
        <span>Live Support</span>
        {!isTawkLoaded && (
          <span className="text-xs text-gray-500">(Loading...)</span>
        )}
      </button>
    );
  }

  return (
    <div className="fixed bottom-8 right-8 z-40">
      <button
        onClick={handleChatClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`
          bg-primary-600 text-white rounded-full p-4 shadow-lg 
          transform transition-all duration-300 hover:scale-110 hover:rotate-12 
          hover:bg-primary-700 active:scale-95 group relative
          ${!isTawkLoaded ? 'opacity-75' : ''}
          ${chatStatus === 'failed' ? 'bg-red-500' : ''}
          ${isTawkLoaded ? 'hover:shadow-xl' : ''}
        `}
        style={{
          animation: isTawkLoaded ? 'pulseGlow 2s infinite' : 'none'
        }}
        title={
          chatStatus === 'failed' ? "Chat failed to load" :
          isTawkLoaded ? "Start live chat" : "Live chat is loading..."
        }
      >
        <MessageCircle className="h-6 w-6" />
        
        {/* Enhanced status indicators with animations */}
        {!isTawkLoaded && chatStatus !== 'failed' && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
        )}
        
        {isTawkLoaded && chatStatus === 'ready' && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-bounce" />
        )}
        
        {chatStatus === 'failed' && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-pulse" />
        )}
        
        {/* Enhanced tooltip with fade-in animation */}
        {showTooltip && (
          <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-sm whitespace-nowrap shadow-lg animate-fade-in">
            {chatStatus === 'failed' ? 'Chat Failed to Load' :
             isTawkLoaded ? 'Start Live Chat' : 'Live Chat Loading...'}
            <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-900" />
          </div>
        )}
      </button>
    </div>
  );
};

export default LiveChatButton;