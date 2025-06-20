import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Mail, MessageSquare, Send, User, Phone, Home } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Textarea from '../components/ui/Textarea';
import { useForm, ValidationError } from '@formspree/react';

const ContactPage: React.FC = () => {
  const [state, handleSubmit] = useForm("mldbqpgy");

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
                    <h3 className="text-xl font-semibold text-white mb-2">Thank You!</h3>
                    <p className="text-white/80 mb-6">
                      Thank you for reaching out. We'll get back to you as soon as possible.
                    </p>
                    <Link to="/">
                      <Button 
                        icon={<Home className="h-5 w-5 mr-2" />}
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-xl"
                      >
                        Back to Homepage
                      </Button>
                    </Link>
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
        </div>
      </Layout>
    </div>
  );
};

export default ContactPage;