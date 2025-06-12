import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Heart, Check, Crown, Shield, Zap } from 'lucide-react';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import { subscriptionTiers } from '../utils/subscriptions';
import Button from '../components/ui/Button';
import ComingSoonModal from '../components/ui/ComingSoonModal';

const AuthPages: React.FC = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const [selectedTier, setSelectedTier] = useState(subscriptionTiers[0].id);
  const [showSubscription, setShowSubscription] = useState(!isLoginPage);
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentForm, setCurrentForm] = useState(isLoginPage ? 'login' : 'register');

  useEffect(() => {
    const newForm = isLoginPage ? 'login' : 'register';
    if (newForm !== currentForm) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentForm(newForm);
        setShowSubscription(!isLoginPage);
        if (isLoginPage) {
          setSelectedTier(subscriptionTiers[0].id);
        }
        setIsTransitioning(false);
      }, 150); // Half of the transition duration
    }
  }, [location.pathname, isLoginPage, currentForm]);

  const handleTierSelect = (tierId: string) => {
    if (tierId !== 'free') {
      setShowComingSoonModal(true);
    } else {
      setSelectedTier(tierId);
      setIsTransitioning(true);
      setTimeout(() => {
        setShowSubscription(false);
        setIsTransitioning(false);
      }, 150);
    }
  };

  const getTierIcon = (tierId: string) => {
    switch (tierId) {
      case 'premium':
        return <Shield className="h-4 w-4 md:h-5 md:w-5" />;
      case 'gold':
        return <Crown className="h-4 w-4 md:h-5 md:w-5" />;
      default:
        return <Zap className="h-4 w-4 md:h-5 md:w-5" />;
    }
  };

  const getTierColor = (tierId: string) => {
    switch (tierId) {
      case 'premium':
        return 'from-blue-500 to-purple-600';
      case 'gold':
        return 'from-yellow-400 to-orange-500';
      default:
        return 'from-green-500 to-blue-500';
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative overflow-hidden">
      {/* Premium Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 animate-gradient-x" 
             style={{ backgroundSize: '400% 400%' }} />
        
        {/* Floating Orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400/30 to-purple-600/30 rounded-full blur-3xl animate-float" 
             style={{ animationDelay: '0s', animationDuration: '6s' }} />
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-pink-400/20 to-red-600/20 rounded-full blur-3xl animate-float" 
             style={{ animationDelay: '2s', animationDuration: '8s' }} />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-cyan-400/25 to-blue-600/25 rounded-full blur-3xl animate-float" 
             style={{ animationDelay: '4s', animationDuration: '7s' }} />
        
        {/* Mesh Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-white/3 to-transparent" />
        
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-10" 
             style={{
               backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px),
                                radial-gradient(circle at 75% 75%, white 2px, transparent 2px)`,
               backgroundSize: '100px 100px'
             }} />
      </div>

      {/* Left side - Form (Mobile: Full width, Desktop: 50%) */}
      <div className="w-full md:w-1/2 min-h-screen flex items-center justify-center p-4 md:p-6 relative z-10">
        <div className="w-full max-w-md">
          {/* Glass morphism container */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 md:p-7 shadow-2xl">
            <div className="text-center mb-6 animate-fade-in-up [animation-delay:200ms]">
              <Link to="/" className="inline-flex items-center justify-center">
                <div className="h-12 w-12 md:h-14 md:w-14 bg-black rounded-full flex items-center justify-center p-2 shadow-2xl border border-white/20">
                  <img 
                    src="/DLD Logo with Navy Blue and Silver_20250601_034009_0000.png" 
                    alt="Digital Legacy Diary"
                    className="h-full w-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = '<span class="text-2xl md:text-3xl font-serif font-bold text-white">D</span>';
                      }
                    }}
                  />
                </div>
              </Link>
              <div className="relative mt-3">
                <h1 className="text-xl md:text-2xl font-serif font-bold text-white mb-2">
                  Digital Legacy Diary
                </h1>
                <div className="h-1 w-16 md:w-20 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mx-auto rounded-full animate-pulse" />
              </div>
              <h2 className="mt-3 text-lg md:text-xl font-serif font-bold text-white">
                {currentForm === 'login' ? 'Welcome Back' : (showSubscription ? 'Choose Your Plan' : 'Create Your Account')}
              </h2>
              <p className="mt-2 text-sm text-white/80">
                {currentForm === 'login' 
                  ? 'Sign in to continue your legacy journey' 
                  : (showSubscription ? 'Select a plan to begin your journey' : 'Start preserving your memories and wisdom')}
              </p>
            </div>

            {/* Form content with transition */}
            <div 
              className={`transition-all duration-300 ease-in-out ${
                isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
              }`}
            >
              {currentForm === 'login' ? (
                <LoginForm />
              ) : showSubscription ? (
                <div className="space-y-4">
                  {/* Compact Desktop Layout - Horizontal cards */}
                  <div className="hidden md:block">
                    <div className="grid grid-cols-3 gap-3">
                      {subscriptionTiers.map((tier, index) => (
                        <div
                          key={tier.id}
                          className={`relative p-3 rounded-lg border-2 cursor-pointer transition-all duration-300 animate-fade-in-up hover:scale-105 transform backdrop-blur-sm ${
                            selectedTier === tier.id
                              ? 'border-cyan-400 bg-white/20 shadow-xl shadow-cyan-500/25'
                              : 'border-white/20 hover:border-cyan-300/50 hover:shadow-lg hover:bg-white/15'
                          }`}
                          style={{ animationDelay: `${400 + index * 100}ms` }}
                          onClick={() => handleTierSelect(tier.id)}
                        >
                          {tier.id === 'gold' && (
                            <div className="absolute -top-1 -right-1">
                              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-1.5 py-0.5 rounded-full text-xs font-medium flex items-center shadow-lg">
                                <Crown className="h-2.5 w-2.5 mr-0.5" />
                                <span>Hot</span>
                              </div>
                            </div>
                          )}
                          
                          <div className="text-center">
                            <div className={`p-1.5 rounded-md bg-gradient-to-r ${getTierColor(tier.id)} text-white shadow-md mx-auto w-fit mb-2`}>
                              {getTierIcon(tier.id)}
                            </div>
                            <h3 className="font-bold text-sm text-white mb-1">{tier.name}</h3>
                            <p className="text-xs text-white/70 mb-2">
                              ${tier.price}{tier.price > 0 ? '/mo' : ''}
                            </p>
                            
                            {/* Compact features list */}
                            <div className="space-y-1 mb-3">
                              {tier.features.slice(0, 2).map((feature, index) => (
                                <div key={index} className="flex items-center justify-center text-xs text-white/80">
                                  <Check className="h-2.5 w-2.5 text-cyan-400 mr-1 flex-shrink-0" />
                                  <span className="truncate text-center">{feature}</span>
                                </div>
                              ))}
                              {tier.features.length > 2 && (
                                <p className="text-xs text-white/60 italic">
                                  +{tier.features.length - 2} more
                                </p>
                              )}
                            </div>
                            
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors mx-auto ${
                              selectedTier === tier.id
                                ? 'border-cyan-400 bg-cyan-400'
                                : 'border-white/40'
                            }`}>
                              {selectedTier === tier.id && (
                                <Check className="h-2.5 w-2.5 text-white" />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mobile Layout - Vertical cards */}
                  <div className="md:hidden">
                    <div className="grid grid-cols-1 gap-3">
                      {subscriptionTiers.map((tier, index) => (
                        <div
                          key={tier.id}
                          className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 animate-fade-in-up hover:scale-105 transform backdrop-blur-sm ${
                            selectedTier === tier.id
                              ? 'border-cyan-400 bg-white/20 shadow-2xl shadow-cyan-500/25'
                              : 'border-white/20 hover:border-cyan-300/50 hover:shadow-xl hover:bg-white/15'
                          }`}
                          style={{ animationDelay: `${400 + index * 100}ms` }}
                          onClick={() => handleTierSelect(tier.id)}
                        >
                          {tier.id === 'gold' && (
                            <div className="absolute -top-2 -right-2">
                              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-0.5 rounded-full text-xs font-medium flex items-center shadow-lg">
                                <Crown className="h-3 w-3 mr-1" />
                                <span>Popular</span>
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-lg bg-gradient-to-r ${getTierColor(tier.id)} text-white shadow-lg`}>
                                {getTierIcon(tier.id)}
                              </div>
                              <div>
                                <h3 className="font-bold text-base text-white">{tier.name}</h3>
                                <p className="text-sm text-white/70">
                                  ${tier.price}{tier.price > 0 ? '/month' : ' forever'}
                                </p>
                              </div>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                              selectedTier === tier.id
                                ? 'border-cyan-400 bg-cyan-400'
                                : 'border-white/40'
                            }`}>
                              {selectedTier === tier.id && (
                                <Check className="h-3 w-3 text-white" />
                              )}
                            </div>
                          </div>
                          
                          <ul className="space-y-1 mt-3">
                            {tier.features.slice(0, 3).map((feature, index) => (
                              <li key={index} className="text-xs text-white/80 flex items-center">
                                <Check className="h-3 w-3 text-cyan-400 mr-2 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                            {tier.features.length > 3 && (
                              <li className="text-xs text-white/60 italic">
                                +{tier.features.length - 3} more features
                              </li>
                            )}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-3 animate-fade-in-up [animation-delay:700ms]">
                    <Button 
                      onClick={() => {
                        setIsTransitioning(true);
                        setTimeout(() => {
                          setShowSubscription(false);
                          setIsTransitioning(false);
                        }, 150);
                      }}
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 transform transition-all duration-200 hover:scale-105 active:scale-95 shadow-xl"
                    >
                      Continue with {subscriptionTiers.find(t => t.id === selectedTier)?.name}
                    </Button>
                    <button
                      type="button"
                      className="text-sm text-white/70 hover:text-white transition-colors"
                      onClick={() => {
                        setIsTransitioning(true);
                        setTimeout(() => {
                          setShowSubscription(false);
                          setIsTransitioning(false);
                        }, 150);
                      }}
                    >
                      Skip plan selection
                    </button>
                  </div>
                </div>
              ) : (
                <RegisterForm selectedTier={selectedTier} />
              )}
            </div>

            <div className="mt-6 text-center animate-fade-in-up [animation-delay:400ms]">
              <p className="text-sm text-white/70">
                {currentForm === 'login' 
                  ? "Don't have an account?" 
                  : "Already have an account?"}
                {' '}
                <Link
                  to={currentForm === 'login' ? '/register' : '/login'}
                  className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                >
                  {currentForm === 'login' ? 'Sign Up' : 'Sign In'}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Enhanced content (Desktop only) */}
      <div className="hidden md:block w-1/2 relative z-10 overflow-hidden">
        <div className="h-full flex items-center justify-center p-6 lg:p-8">
          <div className="max-w-lg text-white text-center">
            {/* Glass morphism content container */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 lg:p-8 shadow-2xl animate-fade-in-up [animation-delay:500ms]">
              <h2 className="text-2xl lg:text-3xl font-serif font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Your Story Deserves to Be Remembered
              </h2>
              <p className="text-base lg:text-lg mb-6 text-white/90 leading-relaxed">
                Digital Legacy Diary helps you preserve your memories, wisdom, and final wishes for your loved ones, ensuring your legacy lives on forever.
              </p>
              
              {/* Compact Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="backdrop-blur-sm bg-white/10 p-4 rounded-2xl border border-white/20 animate-fade-in-up [animation-delay:600ms]">
                  <p className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    {Math.floor(Math.random() * 50000) + 10000}
                  </p>
                  <p className="text-sm text-white/80">Stories Preserved</p>
                </div>
                <div className="backdrop-blur-sm bg-white/10 p-4 rounded-2xl border border-white/20 animate-fade-in-up [animation-delay:700ms]">
                  <p className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {Math.floor(Math.random() * 5000) + 1000}
                  </p>
                  <p className="text-sm text-white/80">Families Connected</p>
                </div>
              </div>
              
              {/* Compact Features List */}
              <div className="space-y-3 animate-fade-in-up [animation-delay:800ms]">
                <div className="flex items-center space-x-3 text-left backdrop-blur-sm bg-white/5 p-3 rounded-xl border border-white/10">
                  <div className="w-7 h-7 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full flex items-center justify-center">
                    <Check className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-sm text-white/90">Bank-level security for your memories</span>
                </div>
                <div className="flex items-center space-x-3 text-left backdrop-blur-sm bg-white/5 p-3 rounded-xl border border-white/10">
                  <div className="w-7 h-7 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                    <Check className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-sm text-white/90">AI-powered writing assistance</span>
                </div>
                <div className="flex items-center space-x-3 text-left backdrop-blur-sm bg-white/5 p-3 rounded-xl border border-white/10">
                  <div className="w-7 h-7 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                    <Check className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-sm text-white/90">Seamless legacy transfer</span>
                </div>
              </div>

              {/* Compact Trust indicators */}
              <div className="mt-6 pt-4 border-t border-white/20 animate-fade-in-up [animation-delay:900ms]">
                <div className="flex items-center justify-center space-x-4 text-white/70">
                  <div className="flex items-center space-x-1">
                    <Shield className="h-3.5 w-3.5" />
                    <span className="text-xs">Secure</span>
                  </div>
                  <div className="w-1 h-1 bg-white/40 rounded-full"></div>
                  <div className="flex items-center space-x-1">
                    <Heart className="h-3.5 w-3.5" />
                    <span className="text-xs">Trusted</span>
                  </div>
                  <div className="w-1 h-1 bg-white/40 rounded-full"></div>
                  <div className="flex items-center space-x-1">
                    <Check className="h-3.5 w-3.5" />
                    <span className="text-xs">Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Modal */}
      <ComingSoonModal
        isOpen={showComingSoonModal}
        onClose={() => setShowComingSoonModal(false)}
        title="Premium Plans Coming Soon!"
        message="We're working hard to bring you our premium subscription plans with advanced features like unlimited storage, AI assistance, and premium support. Stay tuned for exciting updates!"
      />
    </div>
  );
};

export default AuthPages;