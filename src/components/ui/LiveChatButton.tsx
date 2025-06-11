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
    };
  }
}

const LiveChatButton: React.FC<LiveChatButtonProps> = ({ variant = 'floating' }) => {
  const [isTawkLoaded, setIsTawkLoaded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Check if Tawk.to is loaded
    const checkTawkLoaded = () => {
      if (window.Tawk_API) {
        setIsTawkLoaded(true);
        
        // Hide the default Tawk.to widget since we're using our custom button
        if (window.Tawk_API.hideWidget) {
          window.Tawk_API.hideWidget();
        }
      }
    };

    // Check immediately
    checkTawkLoaded();

    // Set up Tawk.to onLoad callback
    if (window.Tawk_API) {
      window.Tawk_API.onLoad = () => {
        setIsTawkLoaded(true);
        // Hide the default widget
        if (window.Tawk_API?.hideWidget) {
          window.Tawk_API.hideWidget();
        }
      };
    }

    // Fallback: check periodically if Tawk.to is loaded
    const interval = setInterval(() => {
      if (window.Tawk_API && !isTawkLoaded) {
        checkTawkLoaded();
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isTawkLoaded]);

  const handleChatClick = () => {
    if (window.Tawk_API && window.Tawk_API.toggle) {
      // Toggle the Tawk.to chat widget
      window.Tawk_API.toggle();
    } else {
      // Fallback if Tawk.to isn't loaded yet
      console.warn('Tawk.to is not loaded yet. Please try again in a moment.');
      alert('Live chat is loading... Please try again in a moment.');
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