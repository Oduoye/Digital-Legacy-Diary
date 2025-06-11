import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import ComingSoonModal from './ComingSoonModal';

interface LiveChatButtonProps {
  variant?: 'floating' | 'inline';
}

const LiveChatButton: React.FC<LiveChatButtonProps> = ({ variant = 'floating' }) => {
  const [showComingSoon, setShowComingSoon] = useState(false);

  const handleClick = () => {
    setShowComingSoon(true);
  };

  if (variant === 'inline') {
    return (
      <>
        <button
          onClick={handleClick}
          className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
        >
          <MessageCircle className="h-5 w-5" />
          <span>Live Support</span>
        </button>
        
        <ComingSoonModal
          isOpen={showComingSoon}
          onClose={() => setShowComingSoon(false)}
          title="Live Chat Coming Soon!"
          message="We're working on implementing live chat support to better assist you. Stay tuned for this exciting feature!"
        />
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleClick}
        className="fixed bottom-8 right-8 bg-primary-600 text-white rounded-full p-4 shadow-lg transform transition-all duration-300 hover:scale-110 hover:rotate-12 hover:bg-primary-700 active:scale-95 z-40"
        style={{ zIndex: 40 }} // Lower z-index than modals
      >
        <MessageCircle className="h-6 w-6" />
      </button>
      
      <ComingSoonModal
        isOpen={showComingSoon}
        onClose={() => setShowComingSoon(false)}
        title="Live Chat Coming Soon!"
        message="We're working on implementing live chat support to better assist you. Stay tuned for this exciting feature!"
      />
    </>
  );
};

export default LiveChatButton;