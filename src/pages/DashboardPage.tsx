import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Book, Users, Calendar, Plus, ArrowRight, Tag, Sparkles, Network, Bot, Mail, Phone, MessageSquare, CheckCircle } from 'lucide-react';
import { useDiary } from '../context/DiaryContext';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import LiveChatButton from '../components/ui/LiveChatButton';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import { getRandomPrompt } from '../utils/writingPrompts';

const DashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { entries, trustedContacts } = useDiary();
  const [currentDate] = useState(new Date());
  const [randomPrompt, setRandomPrompt] = useState(getRandomPrompt());
  const [showContactModal, setShowContactModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setRandomPrompt(getRandomPrompt());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowContactModal(false);
      }
    };

    if (showContactModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showContactModal]);
  
  const totalEntries = entries.length;
  const recentEntries = entries.slice(0, 3);
  const allTags = entries.flatMap(entry => entry.tags);
  const uniqueTags = [...new Set(allTags)].slice(0, 8);
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const entriesThisMonth = entries.filter(entry => {
    const entryDate = new Date(entry.createdAt);
    return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
  }).length;

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    setShowContactModal(false);
    setShowSuccessModal(true);
    setTimeout(() => {
      setShowSuccessModal(false);
    }, 3000);
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <div className="flex justify-between items-start mb-8">
            <div className="animate-fade-in">
              <h2 className="text-lg text-white/80">Welcome back,</h2>
              <h1 className="text-2xl font-serif font-bold text-white">{currentUser?.name}</h1>
              <p className="text-sm text-white/70 mt-1">{format(currentDate, 'EEEE, MMMM d, yyyy')}</p>
              {currentUser?.subscription_tier === 'free' && (
                <Link to="/subscription" className="mt-4 inline-block">
                  <div className="relative">
                    <div className="absolute -top-px left-1/2 -translate-x-1/2 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
                    <div className="bg-cyan-500/20 text-cyan-300 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-cyan-500/30 transition-colors backdrop-blur-sm border border-cyan-400/30">
                      Upgrade to Premium
                    </div>
                  </div>
                </Link>
              )}
            </div>

            <Link 
              to="/profile" 
              className="group relative"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden bg-white/10 ring-4 ring-cyan-400 shadow-2xl transform transition-transform group-hover:scale-105 backdrop-blur-sm">
                {currentUser?.profilePicture ? (
                  <img 
                    src={currentUser.profilePicture} 
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-400/20 to-blue-500/20">
                    <span className="text-2xl font-serif text-white">
                      {currentUser?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 animate-fade-in">
            <Card className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardContent className="flex flex-col items-start py-6">
                <div className="bg-gradient-to-r from-blue-400 to-cyan-400 p-3 rounded-full mb-4 shadow-lg">
                  <Book className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-serif font-semibold text-white mb-2">New Entry</h2>
                <p className="text-white/80 mb-4">Record your thoughts and memories.</p>
                <Link to="/journal/new">
                  <Button variant="primary" icon={<Plus size={16} />} className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-xl">
                    Create Entry
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardContent className="flex flex-col items-start py-6">
                <div className="bg-gradient-to-r from-purple-400 to-pink-400 p-3 rounded-full mb-4 shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-serif font-semibold text-white mb-2">Contacts</h2>
                <p className="text-white/80 mb-4">Manage your trusted contacts.</p>
                <Link to="/contacts">
                  <Button 
                    variant="secondary" 
                    icon={<ArrowRight size={16} />}
                    className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-xl"
                  >
                    View Contacts
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardContent className="flex flex-col items-start py-6">
                <div className="bg-gradient-to-r from-green-400 to-cyan-400 p-3 rounded-full mb-4 shadow-lg">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-serif font-semibold text-white mb-2">Journal</h2>
                <p className="text-white/80 mb-4">Browse your past entries.</p>
                <Link to="/journal">
                  <Button 
                    variant="outline" 
                    className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                    icon={<ArrowRight size={16} />}
                  >
                    View Journal
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardContent className="flex flex-col items-start py-6">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-3 rounded-full mb-4 shadow-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-serif font-semibold text-white mb-2">Life Story</h2>
                <p className="text-white/80 mb-4">View AI-powered insights.</p>
                <Link to="/life-story">
                  <Button 
                    variant="outline" 
                    className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                    icon={<ArrowRight size={16} />}
                  >
                    View Insights
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-gradient-to-br from-purple-500/20 to-indigo-600/20 border border-purple-400/30 shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardContent className="flex flex-col items-start py-6">
                <div className="bg-gradient-to-r from-purple-400 to-indigo-500 p-3 rounded-full mb-4 shadow-lg">
                  <Network className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-serif font-semibold text-white mb-2">Memory Map</h2>
                <p className="text-white/80 mb-4">Explore your memory constellation.</p>
                <Link to="/memory-constellation">
                  <Button 
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                    icon={<ArrowRight size={16} />}
                  >
                    View Map
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-gradient-to-br from-pink-500/20 to-purple-600/20 border border-pink-400/30 shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardContent className="flex flex-col items-start py-6">
                <div className="bg-gradient-to-r from-pink-400 to-purple-500 p-3 rounded-full mb-4 shadow-lg">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-serif font-semibold text-white mb-2">AI Assistant</h2>
                <p className="text-white/80 mb-4">Chat with your wisdom assistant.</p>
                <Link to="/wisdom-chatbot">
                  <Button 
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                    icon={<ArrowRight size={16} />}
                  >
                    Start Chat
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="mb-10 backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl animate-slide-up">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h2 className="text-xl font-serif font-semibold text-white mb-2 flex items-center">
                  <span className="mr-2">✨</span> Today's Writing Prompt
                </h2>
                <p className="text-white/90 font-medium italic">{randomPrompt.text}</p>
              </div>
              <Link to="/journal/new" className="self-start">
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-xl">Write About This</Button>
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            <div className="lg:col-span-1">
              <div className="grid grid-cols-1 gap-6">
                <Card className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">
                  <CardHeader>
                    <h2 className="text-xl font-serif font-semibold text-white">Your Journey</h2>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-white/20">
                        <span className="text-white/80">Total Entries</span>
                        <span className="text-2xl font-semibold text-cyan-400">{totalEntries}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-white/20">
                        <span className="text-white/80">This Month</span>
                        <span className="text-2xl font-semibold text-purple-400">{entriesThisMonth}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-white/20">
                        <span className="text-white/80">Trusted Contacts</span>
                        <span className="text-2xl font-semibold text-pink-400">{trustedContacts.length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">
                  <CardHeader>
                    <h2 className="text-xl font-serif font-semibold text-white flex items-center">
                      <Tag className="mr-2 h-5 w-5 text-cyan-400" />
                      Your Tags
                    </h2>
                  </CardHeader>
                  <CardContent>
                    {uniqueTags.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {uniqueTags.map((tag, index) => (
                          <span 
                            key={index}
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-sm border border-white/30"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-white/70 text-sm">
                        Add tags to your entries to see them here.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <Card className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">
                <CardHeader className="flex justify-between items-center">
                  <h2 className="text-xl font-serif font-semibold text-white">Recent Entries</h2>
                  <Link to="/journal" className="text-sm text-cyan-400 hover:text-cyan-300 font-medium">
                    View All
                  </Link>
                </CardHeader>
                <CardContent>
                  {recentEntries.length > 0 ? (
                    <div className="space-y-4">
                      {recentEntries.map((entry) => (
                        <Link key={entry.id} to={`/journal/${entry.id}`}>
                          <div className="p-4 rounded-lg hover:bg-white/10 transition-colors border border-white/20 backdrop-blur-sm">
                            <div className="flex justify-between items-start mb-1">
                              <h3 className="font-semibold text-white">{entry.title}</h3>
                              <span className="text-xs text-white/70">
                                {format(new Date(entry.createdAt), 'MMM d, yyyy')}
                              </span>
                            </div>
                            <p className="text-white/80 text-sm line-clamp-2">
                              {entry.content.substring(0, 100)}
                              {entry.content.length > 100 ? '...' : ''}
                            </p>
                            {entry.tags.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {entry.tags.slice(0, 3).map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-sm border border-white/30"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                                {entry.tags.length > 3 && (
                                  <span className="text-xs text-white/70">
                                    +{entry.tags.length - 3} more
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <p className="text-white/70 mb-4">You haven't created any entries yet.</p>
                      <Link to="/journal/new">
                        <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-xl">Create Your First Entry</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-8 p-4 backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium text-white">Need Help?</h2>
                <p className="text-sm text-white/80">Our support team is here to assist you</p>
              </div>
              <LiveChatButton variant="inline" />
            </div>
          </div>

          <div className="mt-8 animate-fade-in">
            <Card className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="mb-4 md:mb-0">
                    <h2 className="text-xl font-serif font-semibold text-white flex items-center">
                      <MessageSquare className="h-5 w-5 mr-2 text-cyan-400" />
                      Get in Touch
                    </h2>
                    <p className="text-white/80 mt-1">Have questions or feedback? We'd love to hear from you.</p>
                  </div>
                  <Button 
                    onClick={() => setShowContactModal(true)}
                    className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-xl"
                  >
                    Contact Us
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form Modal */}
          {showContactModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div 
                ref={modalRef}
                className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl max-w-lg w-full p-6 animate-scale-in shadow-2xl"
              >
                <h3 className="text-2xl font-serif font-semibold text-white mb-6">Contact Us</h3>
                <form onSubmit={handleSubmitContact} className="space-y-6">
                  <Input
                    label="Name"
                    placeholder="Your name"
                    icon={<Users className="h-5 w-5 text-white/60" />}
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    placeholder="your.email@example.com"
                    icon={<Mail className="h-5 w-5 text-white/60" />}
                    required
                  />
                  <Input
                    label="Phone"
                    type="tel"
                    placeholder="Your phone number (optional)"
                    icon={<Phone className="h-5 w-5 text-white/60" />}
                  />
                  <Textarea
                    label="Message"
                    placeholder="How can we help you?"
                    required
                    className="h-32"
                  />
                  <div className="flex justify-end space-x-3">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowContactModal(false)}
                      className="border-white/30 text-white hover:bg-white/10"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-xl">
                      Send Message
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Success Message Modal */}
          {showSuccessModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl max-w-md w-full p-6 animate-scale-in shadow-2xl">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-green-400/30">
                    <CheckCircle className="h-8 w-8 text-green-400" />
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
          )}
        </div>
      </Layout>
    </div>
  );
};

export default DashboardPage;