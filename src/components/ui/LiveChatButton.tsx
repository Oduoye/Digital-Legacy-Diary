import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

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

interface LiveChatButtonProps {
  variant?: 'floating' | 'inline';
}

const LiveChatButton: React.FC<LiveChatButtonProps> = ({ variant = 'floating' }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [tawkStatus, setTawkStatus] = useState<'connecting' | 'online' | 'away' | 'offline'>('connecting');

  useEffect(() => {
    // Check if Tawk.to API is available and ready
    const checkTawkReady = () => {
      if (window.Tawk_API) {
        setIsReady(true);
        
        // Get initial status
        try {
          const status = window.Tawk_API.getStatus();
          setTawkStatus(status as any);
        } catch (error) {
          console.warn('⚠️ Could not get Tawk.to status:', error);
          setTawkStatus('offline');
        }

        // Set up status change listener
        const originalOnStatusChange = window.Tawk_API.onStatusChange;
        window.Tawk_API.onStatusChange = function(status: string) {
          setTawkStatus(status as any);
          if (originalOnStatusChange) originalOnStatusChange(status);
        };

        // Customize Tawk.to widget size and appearance
        window.Tawk_API.onLoad = function() {
          console.log('✅ Tawk.to loaded successfully');
          
          // Customize the widget size and position
          try {
            // Set custom attributes for the widget
            window.Tawk_API?.setAttributes({
              name: 'Digital Legacy Diary User',
              email: '',
              hash: ''
            }, function(error: any) {
              if (error) {
                console.warn('Could not set Tawk.to attributes:', error);
              }
            });
          } catch (error) {
            console.warn('Could not customize Tawk.to widget:', error);
          }
        };
      }
    };

    // Check immediately and set up interval
    checkTawkReady();
    const interval = setInterval(checkTawkReady, 1000);

    // Clean up
    return () => clearInterval(interval);
  }, []);

  const handleChatClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🖱️ Opening Tawk.to chat widget...');
    
    if (window.Tawk_API) {
      try {
        // Show and maximize the Tawk.to widget
        window.Tawk_API.showWidget();
        window.Tawk_API.maximize();
      } catch (error) {
        console.error('Error opening Tawk.to widget:', error);
      }
    } else {
      console.warn('Tawk.to API not available yet');
    }
  };

  const getStatusColor = () => {
    if (!isReady) return 'bg-yellow-400 animate-pulse';
    switch (tawkStatus) {
      case 'online':
        return 'bg-green-400 animate-bounce';
      case 'away':
        return 'bg-orange-400';
      case 'offline':
        return 'bg-red-400';
      default:
        return 'bg-yellow-400 animate-pulse';
    }
  };

  const getTooltipText = () => {
    if (!isReady) return 'Live Chat Loading...';
    switch (tawkStatus) {
      case 'online':
        return 'Start Live Chat - Agents Online';
      case 'away':
        return 'Start Live Chat - Agents Away';
      case 'offline':
        return 'Leave a Message - Agents Offline';
      default:
        return 'Start Live Chat';
    }
  };

  if (variant === 'inline') {
    return (
      <button
        onClick={handleChatClick}
        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
        title={getTooltipText()}
      >
        <MessageCircle className="h-5 w-5" />
        <span>Live Support</span>
        {!isReady && (
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
          ${!isReady ? 'opacity-75' : 'hover:shadow-xl'}
        `}
        title={getTooltipText()}
      >
        <MessageCircle className="h-6 w-6" />
        
        {/* Status indicator with dynamic color */}
        <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getStatusColor()}`} />
        
        {/* Enhanced tooltip with fade-in animation */}
        {showTooltip && (
          <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-sm whitespace-nowrap shadow-lg animate-fade-in">
            {getTooltipText()}
            <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-900" />
          </div>
        )}
      </button>
    </div>
  );
};

export default LiveChatButton;