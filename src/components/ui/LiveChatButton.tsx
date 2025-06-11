import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import AnimatedChatModal from './AnimatedChatModal';

interface LiveChatButtonProps {
  variant?: 'floating' | 'inline';
}

const LiveChatButton: React.FC<LiveChatButtonProps> = ({ variant = 'floating' }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleChatClick = () => {
    console.log('🖱️ Opening custom animated chat modal...');
    setIsChatOpen(true);
  };

  const handleChatClose = () => {
    console.log('🔒 Closing custom animated chat modal...');
    setIsChatOpen(false);
  };

  if (variant === 'inline') {
    return (
      <>
        <button
          onClick={handleChatClick}
          className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          title="Start live chat"
        >
          <MessageCircle className="h-5 w-5" />
          <span>Live Support</span>
          {!isReady && (
            <span className="text-xs text-gray-500">(Loading...)</span>
          )}
        </button>
        
        <AnimatedChatModal 
          isOpen={isChatOpen} 
          onClose={handleChatClose} 
        />
      </>
    );
  }

  return (
    <>
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
          title="Start live chat"
        >
          <MessageCircle className="h-6 w-6" />
          
          {/* Status indicators with animations */}
          {!isReady && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
          )}
          
          {isReady && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-bounce" />
          )}
          
          {/* Enhanced tooltip with fade-in animation */}
          {showTooltip && (
            <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-sm whitespace-nowrap shadow-lg animate-fade-in">
              {isReady ? 'Start Live Chat' : 'Live Chat Loading...'}
              <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-900" />
            </div>
          )}
        </button>
      </div>
      
      {/* Custom Animated Chat Modal */}
      <AnimatedChatModal 
        isOpen={isChatOpen} 
        onClose={handleChatClose} 
      />
    </>
  );
};

export default LiveChatButton;