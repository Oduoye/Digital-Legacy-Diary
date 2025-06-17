import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Mail, MessageSquare, Send, User, Phone, CheckCircle } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Textarea from '../components/ui/Textarea';
import { useForm, ValidationError } from '@formspree/react';

const ContactPage: React.FC = () => {
  const [state, handleSubmit] = useForm("mldbqpgy");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Show success modal when form is successfully submitted
  React.useEffect(() => {
    if (state.succeeded && !showSuccessModal) {
      setShowSuccessModal(true);
    }
  }, [state.succeeded, showSuccessModal]);

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400/15 to-purple-600/15 rounded-full blur-3xl animate-float" 
             style={{ animationDelay: '0s', animationDuration: '6s' }} />
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-pink-400/10 to-red-600/10 rounded-full blur-3xl animate-float" 
             style={{ animationDelay: '2s', animationDuration: '8s' }} />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-cyan-400/15 to-blue-600/15 rounded-full blur-3xl animate-float" 
             style={{ animationDelay: '4s', animationDuration: '7s' }} />
        
        {/* Mesh Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/2 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-white/1 to-transparent" />
      </div>

      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-serif font-bold text-white mb-6">Contact Us</h1>
            <p className="text-xl text-white/80">We'd love to hear from you</p>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto mt-6"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="animate-fade-in-up">
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl shadow-2xl p-8">
                <h2 className="text-2xl font-serif font-bold text-white mb-6">Get in Touch</h2>
                
                {state.succeeded ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-green-400/30">
                      <Send className="h-8 w-8 text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Message Sent!</h3>
                    <p className="text-white/80">
                      Thank you for reaching out. We'll get back to you soon.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Input
                        label="Name"
                        name="name"
                        required
                        placeholder="Your name"
                        icon={<User className="h-5 w-5 text-gray-400" />}
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
                        required
                        placeholder="your.email@example.com"
                        icon={<Mail className="h-5 w-5 text-gray-400" />}
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
                        required
                        placeholder="How can we help you?"
                        rows={5}
                      />
                      <ValidationError 
                        prefix="Message" 
                        field="message"
                        errors={state.errors}
                        className="text-red-300 text-sm mt-1"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      disabled={state.submitting}
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-xl"
                    >
                      {state.submitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                )}
              </div>
            </div>

            <div className="space-y-8">
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-8 animate-fade-in-up [animation-delay:200ms]">
                <h2 className="text-2xl font-serif font-bold text-white mb-4">Support Hours</h2>
                <p className="text-white/80 mb-4">
                  Our team is available to assist you:
                </p>
                <ul className="space-y-2 text-white/70">
                  <li>Monday - Friday: 9:00 AM - 6:00 PM EST</li>
                  <li>Saturday: 10:00 AM - 4:00 PM EST</li>
                  <li>Sunday: Closed</li>
                </ul>
              </div>

              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-8 animate-fade-in-up [animation-delay:400ms]">
                <h2 className="text-2xl font-serif font-bold text-white mb-4">FAQ</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-white mb-2">How secure is my data?</h3>
                    <p className="text-white/70">Your data is encrypted and stored securely with industry-standard protocols.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">Can I export my diary entries?</h3>
                    <p className="text-white/70">Yes, you can export your entries in various formats for backup or printing.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">How do I share with family?</h3>
                    <p className="text-white/70">You can designate trusted contacts who will receive access to your legacy.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Success Modal */}
          {showSuccessModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[200] animate-fade-in">
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl max-w-md w-full p-6 animate-scale-in shadow-2xl relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-400/10 via-cyan-400/5 to-blue-500/10 animate-gradient-x" />
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-green-400/20 to-cyan-400/20 rounded-full blur-xl animate-float" />
                  <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-blue-400/15 to-purple-400/15 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }} />
                </div>

                <div className="text-center relative z-10">
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
                      handleSuccessClose();
                    }
                  }, 3000)}
                </div>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </div>
  );
};

export default ContactPage;