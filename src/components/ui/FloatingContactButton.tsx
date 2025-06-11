import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import ContactModal from './ContactModal';

interface FloatingContactButtonProps {
  variant?: 'floating' | 'inline';
}

const FloatingContactButton: React.FC<FloatingContactButtonProps> = ({ variant = 'floating' }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  const handleContactSubmit = (data: any) => {
    console.log('Contact form submitted:', data);
    // Handle form submission here
  };

  if (variant === 'inline') {
    return (
      <>
        <button
          onClick={() => setShowContactModal(true)}
          className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
        >
          <MessageSquare className="h-5 w-5" />
          <span>Contact Support</span>
        </button>
        
        <ContactModal
          isOpen={showContactModal}
          onClose={() => setShowContactModal(false)}
          onSubmit={handleContactSubmit}
        />
      </>
    );
  }

  return (
    <>
      <div className="fixed bottom-8 right-8 z-40">
        <button
          onClick={() => setShowContactModal(true)}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="bg-primary-600 text-white rounded-full p-4 shadow-lg transform transition-all duration-300 hover:scale-110 hover:rotate-12 hover:bg-primary-700 active:scale-95 group relative"
        >
          <MessageSquare className="h-6 w-6" />
          
          {/* Enhanced tooltip with fade-in animation */}
          {showTooltip && (
            <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-sm whitespace-nowrap shadow-lg animate-fade-in">
              Get in Touch
              <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-900" />
            </div>
          )}
        </button>
      </div>

      <ContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        onSubmit={handleContactSubmit}
      />
    </>
  );
};

export default FloatingContactButton;