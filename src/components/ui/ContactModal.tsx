import React, { useState } from 'react';
import { X, Mail, Phone, User, MessageSquare, CheckCircle } from 'lucide-react';
import { useForm, ValidationError } from '@formspree/react';
import Button from './Button';
import Input from './Input';
import Textarea from './Textarea';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [state, handleSubmit] = useForm("mldbqpgy");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  if (!isOpen) return null;

  // Handle successful form submission
  if (state.succeeded && !showSuccessModal) {
    setShowSuccessModal(true);
  }

  const handleClose = () => {
    onClose();
    // Reset success modal state when closing
    setShowSuccessModal(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60] animate-fade-in">
      <div 
        className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl max-w-lg w-full p-6 animate-scale-in shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-400/10 via-cyan-400/5 to-purple-500/10 animate-gradient-x" />
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-xl animate-float" />
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-purple-400/15 to-pink-400/15 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }} />
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors z-10 p-1 rounded-full hover:bg-white/10"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative z-10">
          {showSuccessModal ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-green-400/30 animate-pulse">
                <CheckCircle className="h-10 w-10 text-green-400 animate-scale-in" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-white mb-3 animate-fade-in-up">
                Message Sent Successfully!
              </h3>
              <p className="text-white/90 leading-relaxed animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                Thank you for reaching out. We'll get back to you as soon as possible.
              </p>
              
              <div className="mt-6 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                <div className="w-full bg-white/20 rounded-full h-1 overflow-hidden backdrop-blur-sm">
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400 rounded-full animate-shrink-width"
                    style={{ 
                      animation: `shrinkWidth 3000ms linear forwards`
                    }}
                  />
                </div>
                <p className="text-xs text-white/60 mt-2">
                  Closing automatically...
                </p>
              </div>
              
              {/* Auto-close after 3 seconds */}
              {setTimeout(() => {
                if (showSuccessModal) {
                  handleClose();
                }
              }, 3000)}
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-blue-400/30">
                  <MessageSquare className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-white mb-2">
                  Get in Touch
                </h3>
                <p className="text-white/80">
                  We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    label="Name"
                    name="name"
                    placeholder="Your full name"
                    icon={<User className="h-5 w-5 text-gray-400" />}
                    required
                  />
                  <ValidationError 
                    prefix="Name" 
                    field="name"
                    errors={state.errors}
                    className="text-red-300 text-sm mt-1"
                  />
                </div>
                
                <div>
                  <Input
                    label="Email"
                    type="email"
                    name="email"
                    placeholder="your.email@example.com"
                    icon={<Mail className="h-5 w-5 text-gray-400" />}
                    required
                  />
                  <ValidationError 
                    prefix="Email" 
                    field="email"
                    errors={state.errors}
                    className="text-red-300 text-sm mt-1"
                  />
                </div>
                
                <div>
                  <Input
                    label="Phone (Optional)"
                    type="tel"
                    name="phone"
                    placeholder="Your phone number"
                    icon={<Phone className="h-5 w-5 text-gray-400" />}
                  />
                  <ValidationError 
                    prefix="Phone" 
                    field="phone"
                    errors={state.errors}
                    className="text-red-300 text-sm mt-1"
                  />
                </div>
                
                <div>
                  <Textarea
                    label="Message"
                    name="message"
                    placeholder="How can we help you?"
                    className="h-32"
                    required
                  />
                  <ValidationError 
                    prefix="Message" 
                    field="message"
                    errors={state.errors}
                    className="text-red-300 text-sm mt-1"
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={handleClose}
                    disabled={state.submitting}
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={state.submitting}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-xl"
                  >
                    {state.submitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactModal;

export default ContactModal