import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Book, Users, Calendar, Plus, ArrowRight, Tag, Sparkles, Network, Bot, Mail, Phone, MessageSquare, CheckCircle, FileText, Shield, Clock, AlertTriangle, Award, ChevronRight, Crown, Star } from 'lucide-react';
import { useDiary } from '../context/DiaryContext';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import FloatingContactButton from '../components/ui/FloatingContactButton';
import ComingSoonModal from '../components/ui/ComingSoonModal';
import { getRandomPrompt } from '../utils/writingPrompts';

const DashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { entries, trustedContacts, wills } = useDiary();
  const [currentDate] = useState(new Date());
  const [randomPrompt, setRandomPrompt] = useState(getRandomPrompt());
  const [showKYCModal, setShowKYCModal] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setRandomPrompt(getRandomPrompt());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  const totalEntries = entries.length;
  const recentEntries = entries.slice(0, 1); // Show only the latest entry
  const allTags = entries.flatMap(entry => entry.tags);
  const uniqueTags = [...new Set(allTags)].slice(0, 4); // Show only first 4 tags
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const entriesThisMonth = entries.filter(entry => {
    const entryDate = new Date(entry.createdAt);
    return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
  }).length;

  // Get subscription tier info for badge
  const getSubscriptionBadge = (tier: string = 'free') => {
    switch (tier) {
      case 'premium':
        return {
          icon: <Shield className="h-2.5 w-2.5" />,
          text: 'Premium',
          bgColor: 'bg-blue-500',
          textColor: 'text-white'
        };
      case 'gold':
        return {
          icon: <Crown className="h-2.5 w-2.5" />,
          text: 'Gold',
          bgColor: 'bg-yellow-500',
          textColor: 'text-white'
        };
      default:
        return {
          icon: <Star className="h-2.5 w-2.5" />,
          text: 'Free',
          bgColor: 'bg-gray-500',
          textColor: 'text-white'
        };
    }
  };

  const subscriptionBadge = getSubscriptionBadge(currentUser?.subscription_tier);

  const dashboardCards = [
    {
      icon: Book,
      title: "New Entry",
      description: "Record your thoughts and memories.",
      link: "/journal/new",
      buttonText: "Create Entry",
      gradient: "from-blue-400 to-cyan-400",
      bgGradient: "from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700",
      variant: "primary"
    },
    {
      icon: Users,
      title: "Contacts",
      description: "Manage your trusted contacts.",
      link: "/contacts",
      buttonText: "View Contacts",
      gradient: "from-purple-400 to-pink-400",
      bgGradient: "from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700",
      variant: "secondary"
    },
    {
      icon: Calendar,
      title: "Journal",
      description: "Browse your past entries.",
      link: "/journal",
      buttonText: "View Journal",
      gradient: "from-green-400 to-cyan-400",
      variant: "outline"
    },
    {
      icon: FileText,
      title: "Wills",
      description: "Manage your legal documents.",
      link: "/wills",
      buttonText: "View Wills",
      gradient: "from-indigo-400 to-purple-400",
      variant: "outline"
    },
    {
      icon: Sparkles,
      title: "Life Story",
      description: "View AI-powered insights.",
      link: "/life-story",
      buttonText: "View Insights",
      gradient: "from-yellow-400 to-orange-400",
      variant: "outline"
    },
    {
      icon: Network,
      title: "Memory Map",
      description: "Explore your memory constellation.",
      link: "/memory-constellation",
      buttonText: "View Map",
      gradient: "from-purple-400 to-indigo-500",
      variant: "outline",
      bgClass: "backdrop-blur-xl bg-white/10 border border-white/20"
    },
    {
      icon: Bot,
      title: "Legacy Scribe",
      description: "Chat with your personal memory companion.",
      link: "/wisdom-chatbot",
      buttonText: "Start Chat",
      gradient: "from-pink-400 to-purple-500",
      variant: "outline",
      bgClass: "backdrop-blur-xl bg-white/10 border border-white/20"
    }
  ];

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
        <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-white/3 to-transparent" />
        
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-10" 
             style={{
               backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px),
                                radial-gradient(circle at 75% 75%, white 2px, transparent 2px)`,
               backgroundSize: '100px 100px'
             }} />
      </div>

      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          {/* Header Section - Removed scrolling animation */}
          <div className="flex justify-between items-start mb-8">
            <div>
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
              <div className="relative">
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
                
                {/* Dashboard Subscription Badge - Much smaller and better positioned */}
                <div className={`absolute -bottom-1 -right-1 ${subscriptionBadge.bgColor} ${subscriptionBadge.textColor} rounded-full p-1 shadow-lg border border-white flex items-center justify-center w-6 h-6`}>
                  {subscriptionBadge.icon}
                </div>
              </div>
            </Link>
          </div>

          {/* Professional KYC Verification Card - Removed scrolling animation */}
          <div className="mb-8">
            <Card className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl relative overflow-hidden">
              {/* Professional header stripe */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
              
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-white">
                        Identity Verification
                      </h3>
                      <p className="text-white/80 text-sm leading-relaxed">
                        Enhanced security verification to protect your digital legacy.
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <Button
                      onClick={() => setShowKYCModal(true)}
                      variant="outline"
                      size="sm"
                      className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm group"
                    >
                      <span className="text-sm">Learn More</span>
                      <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Dashboard Cards - Removed scrolling animations */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {dashboardCards.map((card, index) => (
              <Card 
                key={index}
                className={`backdrop-blur-xl ${card.bgClass || 'bg-white/10'} border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1`}
              >
                <CardContent className="flex flex-col items-start py-6">
                  <div className={`bg-gradient-to-r ${card.gradient} p-3 rounded-full mb-4 shadow-lg`}>
                    <card.icon className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-xl font-serif font-semibold text-white mb-2">{card.title}</h2>
                  <p className="text-white/80 mb-4">{card.description}</p>
                  <Link to={card.link}>
                    <Button 
                      variant={card.variant as any}
                      icon={<ArrowRight size={16} />}
                      className={card.bgGradient ? `bg-gradient-to-r ${card.bgGradient} shadow-xl` : "border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"}
                    >
                      {card.buttonText}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Writing Prompt Section - Removed scrolling animation */}
          <div className="mb-10 backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl">
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
          
          {/* Stats and Recent Entries - Removed scrolling animation */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                      <div className="flex justify-between items-center pb-2 border-b border-white/20">
                        <span className="text-white/80">Wills</span>
                        <span className="text-2xl font-semibold text-green-400">{wills.length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">
                  <CardHeader className="flex justify-between items-center">
                    <h2 className="text-xl font-serif font-semibold text-white flex items-center">
                      <Tag className="mr-2 h-5 w-5 text-cyan-400" />
                      Your Tags
                    </h2>
                    {[...new Set(allTags)].length > 4 && (
                      <Link to="/journal" className="text-sm text-cyan-400 hover:text-cyan-300 font-medium">
                        View All ({[...new Set(allTags)].length})
                      </Link>
                    )}
                  </CardHeader>
                  <CardContent>
                    {uniqueTags.length > 0 ? (
                      <div className="space-y-3">
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
                        {[...new Set(allTags)].length > 4 && (
                          <p className="text-xs text-white/60 text-center">
                            +{[...new Set(allTags)].length - 4} more tags
                          </p>
                        )}
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
                  {entries.length > 1 && (
                    <Link to="/journal" className="text-sm text-cyan-400 hover:text-cyan-300 font-medium">
                      View All ({entries.length})
                    </Link>
                  )}
                </CardHeader>
                <CardContent>
                  {recentEntries.length > 0 ? (
                    <div className="space-y-4">
                      {recentEntries.map((entry, index) => (
                        <Link key={entry.id} to={`/journal/${entry.id}`}>
                          <div className="p-4 rounded-lg hover:bg-white/10 transition-all duration-500 border border-white/20 backdrop-blur-sm transform">
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
                      {entries.length > 1 && (
                        <div className="text-center pt-4 border-t border-white/20">
                          <Link to="/journal">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-white/30 text-white hover:bg-white/10"
                            >
                              View All {entries.length} Entries
                            </Button>
                          </Link>
                        </div>
                      )}
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

          {/* KYC Coming Soon Modal */}
          <ComingSoonModal
            isOpen={showKYCModal}
            onClose={() => setShowKYCModal(false)}
            title="Identity Verification Coming Soon!"
            message="We're developing advanced identity verification features to enhance security for your digital legacy. This will include document verification, biometric authentication, and enhanced heir verification processes to ensure your legacy reaches the right people securely."
          />
        </div>

        {/* Floating Contact Button */}
        <FloatingContactButton variant="floating" />
      </Layout>
    </div>
  );
};

export default DashboardPage;