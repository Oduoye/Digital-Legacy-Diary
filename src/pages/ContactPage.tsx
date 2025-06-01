import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Mail, MessageSquare, Send } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Textarea from '../components/ui/Textarea';

const ContactPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-6">Contact Us</h1>
          <p className="text-xl text-gray-600">We'd love to hear from you</p>
          <div className="w-24 h-1 bg-primary-600 mx-auto mt-6"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="animate-fade-in-up">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Get in Touch</h2>
              
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-600">
                    Thank you for reaching out. We'll get back to you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    label="Name"
                    required
                    placeholder="Your name"
                  />
                  
                  <Input
                    label="Email"
                    type="email"
                    required
                    placeholder="your.email@example.com"
                    icon={<Mail className="h-5 w-5 text-gray-400" />}
                  />
                  
                  <Textarea
                    label="Message"
                    required
                    placeholder="How can we help you?"
                    rows={5}
                    icon={<MessageSquare className="h-5 w-5 text-gray-400" />}
                  />
                  
                  <Button 
                    type="submit" 
                    isLoading={isSubmitting}
                    className="w-full"
                  >
                    Send Message
                  </Button>
                </form>
              )}
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-gradient-to-br from-primary-50 to-white rounded-xl p-8 animate-fade-in-up [animation-delay:200ms]">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">Support Hours</h2>
              <p className="text-gray-700 mb-4">
                Our team is available to assist you:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>Monday - Friday: 9:00 AM - 6:00 PM EST</li>
                <li>Saturday: 10:00 AM - 4:00 PM EST</li>
                <li>Sunday: Closed</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-accent-50 to-white rounded-xl p-8 animate-fade-in-up [animation-delay:400ms]">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">FAQ</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">How secure is my data?</h3>
                  <p className="text-gray-600">Your data is encrypted and stored securely with industry-standard protocols.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Can I export my diary entries?</h3>
                  <p className="text-gray-600">Yes, you can export your entries in various formats for backup or printing.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">How do I share with family?</h3>
                  <p className="text-gray-600">You can designate trusted contacts who will receive access to your legacy.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;