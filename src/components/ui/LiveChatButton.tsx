import React, { useState } from 'react';
import { MessageCircle, X, Send, Mail, User } from 'lucide-react';
import Button from './Button';
import Input from './Input';
import Textarea from './Textarea';

interface LiveChatButtonProps {
  variant?: 'floating' | 'inline';
}

const LiveChatButton: React.FC<LiveChatButtonProps> = ({ variant = 'floating' }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setShowContactModal(false);
      setFormData({ name: '', email: '', message: '' });
    }, 3000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (variant === 'inline') {
    return (
      <>
        <button
          onClick={() => setShowContactModal(true)}
          className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
        >
          <MessageCircle className="h-5 w-5" />
          <span>Contact Support</span>
        </button>
        
        {/* Contact Modal */}
        {showContactModal && (
          <ContactModal
            isOpen={showContactModal}
            onClose={() => setShowContactModal(false)}
            onSubmit={handleSubmit}
            formData={formData}
            onInputChange={handleInputChange}
            isSubmitting={isSubmitting}
            isSubmitted={isSubmitted}
          />
        )}
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
          <MessageCircle className="h-6 w-6" />
          
          {/* Status indicator */}
          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-400 animate-bounce" />
          
          {/* Tooltip */}
          {showTooltip && (
            <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-sm whitespace-nowrap shadow-lg animate-fade-in">
              Contact Support
              <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-900" />
            </div>
          )}
        </button>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <ContactModal
          isOpen={showContactModal}
          onClose={() => setShowContactModal(false)}
          onSubmit={handleSubmit}
          formData={formData}
          onInputChange={handleInputChange}
          isSubmitting={isSubmitting}
          isSubmitted={isSubmitted}
        />
      )}
    </>
  );
};

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: { name: string; email: string; message: string };
  onInputChange: (field: string, value: string) => void;
  isSubmitting: boolean;
  isSubmitted: boolean;
}

const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onInputChange,
  isSubmitting,
  isSubmitted
}) => {
  if (!isOpen) return null;

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl max-w-md w-full p-6 animate-scale-in shadow-2xl">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-green-400/30">
              <MessageCircle className="h-8 w-8 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Message Sent Successfully!
            </h3>
            <p className="text-white/80">
              Thank you for reaching out. We'll get back to you as soon as possible.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl max-w-lg w-full p-6 animate-scale-in shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-serif font-semibold text-white">Contact Support</h3>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => onInputChange('name', e.target.value)}
            placeholder="Your name"
            icon={<User className="h-5 w-5 text-gray-400" />}
            required
            disabled={isSubmitting}
          />
          
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => onInputChange('email', e.target.value)}
            placeholder="your.email@example.com"
            icon={<Mail className="h-5 w-5 text-gray-400" />}
            required
            disabled={isSubmitting}
          />
          
          <Textarea
            label="Message"
            value={formData.message}
            onChange={(e) => onInputChange('message', e.target.value)}
            placeholder="How can we help you?"
            required
            disabled={isSubmitting}
            className="h-32"
          />
          
          <div className="flex justify-end space-x-3">
            <Button 
              type="button"
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
              className="border-white/30 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              isLoading={isSubmitting}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-xl"
              icon={<Send className="h-4 w-4 mr-2" />}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LiveChatButton;