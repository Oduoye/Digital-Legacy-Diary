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
    };
  }
}

const LiveChatButton: React.FC<LiveChatButtonProps> = ({ variant = 'floating' }) => {
  const [isTawkLoaded, setIsTawkLoaded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [chatStatus, setChatStatus] = useState('loading');

  useEffect(() => {
    let checkInterval: NodeJS.Timeout;
    
    const checkTawkLoaded = () => {
      if (window.Tawk_API) {
        console.log('Tawk_API found:', window.Tawk_API);
        setIsTawkLoaded(true);
        setChatStatus('ready');
        
        // Set up event handlers
        if (window.Tawk_API.onLoad) {
          const originalOnLoad = window.Tawk_API.onLoad;
          window.Tawk_API.onLoad = function() {
            console.log('Tawk.to widget loaded');
            setIsTawkLoaded(true);
            setChatStatus('ready');
            // Hide the default widget
            if (window.Tawk_API?.hideWidget) {
              window.Tawk_API.hideWidget();
            }
            if (originalOnLoad) originalOnLoad();
          };
        } else {
          window.Tawk_API.onLoad = function() {
            console.log('Tawk.to widget loaded');
            setIsTawkLoaded(true);
            setChatStatus('ready');
            // Hide the default widget
            if (window.Tawk_API?.hideWidget) {
              window.Tawk_API.hideWidget();
            }
          };
        }

        // Set up status change handler
        if (window.Tawk_API.onStatusChange) {
          const originalOnStatusChange = window.Tawk_API.onStatusChange;
          window.Tawk_API.onStatusChange = function(status: string) {
            console.log('Tawk.to status changed:', status);
            setChatStatus(status);
            if (originalOnStatusChange) originalOnStatusChange(status);
          };
        } else {
          window.Tawk_API.onStatusChange = function(status: string) {
            console.log('Tawk.to status changed:', status);
            setChatStatus(status);
          };
        }

        // If already loaded, hide the widget immediately
        if (window.Tawk_API.hideWidget) {
          window.Tawk_API.hideWidget();
        }
        
        clearInterval(checkInterval);
      }
    };

    // Check immediately
    checkTawkLoaded();

    // Set up interval to check periodically
    checkInterval = setInterval(checkTawkLoaded, 1000);

    // Cleanup
    return () => {
      if (checkInterval) {
        clearInterval(checkInterval);
      }
    };
  }, []);

  const handleChatClick = () => {
    console.log('Chat button clicked, Tawk_API available:', !!window.Tawk_API);
    
    if (window.Tawk_API) {
      try {
        // First show the widget if it's hidden
        if (window.Tawk_API.showWidget) {
          window.Tawk_API.showWidget();
        }
        
        // Then maximize/toggle it
        if (window.Tawk_API.maximize) {
          window.Tawk_API.maximize();
        } else if (window.Tawk_API.toggle) {
          window.Tawk_API.toggle();
        }
        
        console.log('Tawk.to chat opened successfully');
      } catch (error) {
        console.error('Error opening Tawk.to chat:', error);
        // Fallback: try to open the direct chat URL
        window.open('https://tawk.to/chat/68495a4c2061f3190a9644ee/1itf8hfev', '_blank', 'width=400,height=600');
      }
    } else {
      console.warn('Tawk_API not available yet');
      // Show a message or try to load Tawk.to
      alert('Live chat is still loading. Please wait a moment and try again.');
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
        `}
        title={isTawkLoaded ? "Start live chat" : "Live chat is loading..."}
      >
        <MessageCircle className="h-6 w-6" />
        
        {/* Loading indicator */}
        {!isTawkLoaded && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
        )}
        
        {/* Ready indicator */}
        {isTawkLoaded && chatStatus === 'ready' && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full" />
        )}
        
        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-1.5 rounded text-sm whitespace-nowrap animate-fade-in">
            {isTawkLoaded ? 'Start Live Chat' : 'Live Chat Loading...'}
            <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-900" />
          </div>
        )}
      </button>
    </div>
  );
};

export default LiveChatButton;