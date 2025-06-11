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
      
      // Fallback: Create embedded chat iframe
      console.log('🔄 Trying fallback embedded chat...');
      try {
        // Remove any existing fallback chat
        const existingChat = document.getElementById('fallback-chat');
        if (existingChat) {
          existingChat.remove();
        }
        
        // Create embedded chat container
        const chatContainer = document.createElement('div');
        chatContainer.id = 'fallback-chat';
        chatContainer.style.cssText = `
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 350px;
          height: 500px;
          border: none;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
          z-index: 9999;
          background: white;
          overflow: hidden;
        `;
        
        // Create iframe for embedded chat
        const iframe = document.createElement('iframe');
        iframe.src = 'https://tawk.to/chat/68495a4c2061f3190a9644ee/1itf8hfev';
        iframe.style.cssText = `
          width: 100%;
          height: 100%;
          border: none;
          border-radius: 12px;
        `;
        iframe.allow = 'microphone; camera';
        
        // Add close button
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = `
          position: absolute;
          top: 8px;
          right: 8px;
          width: 24px;
          height: 24px;
          border: none;
          border-radius: 50%;
          background: rgba(0,0,0,0.5);
          color: white;
          font-size: 16px;
          cursor: pointer;
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
        `;
        closeBtn.onclick = () => {
          chatContainer.remove();
        };
        
        chatContainer.appendChild(iframe);
        chatContainer.appendChild(closeBtn);
        document.body.appendChild(chatContainer);
        
        console.log('✅ Fallback embedded chat created');
        
      } catch (fallbackError) {
        console.error('❌ Fallback approach also failed:', fallbackError);
        alert('Unable to open live chat. Please try refreshing the page or contact support directly.');
      }
    }
  };

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
        `}
        title={
          chatStatus === 'failed' ? "Chat failed to load" :
          isTawkLoaded ? "Start live chat" : "Live chat is loading..."
        }
      >
        <MessageCircle className="h-6 w-6" />
        
        {/* Status indicators */}
        {!isTawkLoaded && chatStatus !== 'failed' && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
        )}
        
        {isTawkLoaded && chatStatus === 'ready' && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full" />
        )}
        
        {chatStatus === 'failed' && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full" />
        )}
        
        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-1.5 rounded text-sm whitespace-nowrap animate-fade-in">
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