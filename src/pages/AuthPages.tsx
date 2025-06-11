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

  useEffect(() => {
    setShowSubscription(!isLoginPage);
    if (isLoginPage) {
      setSelectedTier(subscriptionTiers[0].id);
    }
  }, [location.pathname, isLoginPage]);

  const handleTierSelect = (tierId: string) => {
    if (tierId !== 'free') {
      setShowComingSoonModal(true);
    } else {
      setSelectedTier(tierId);
      setShowSubscription(false);
    }
  };

  const getTierIcon = (tierId: string) => {
    switch (tierId) {
      case 'premium':
        return <Shield className="h-4 w-4" />;
      case 'gold':
        return <Crown className="h-4 w-4" />;
      default:
        return <Zap className="h-4 w-4" />;
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

      {/* Left side (form) */}
      <div className="w-full md:w-1/2 min-h-screen flex items-center justify-center p-6 md:p-12 relative z-10">
        <div className="w-full max-w-md">
          {/* Glass morphism container */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-8 animate-fade-in-up [animation-delay:200ms]">
              <Link to="/" className="inline-flex items-center justify-center">
                <div className="h-16 w-16 bg-black rounded-full flex items-center justify-center p-2 shadow-2xl border border-white/20">
                  <img 
                    src="/DLD Logo with Navy Blue and Silver_20250601_034009_0000.png" 
                    alt="Digital Legacy Diary"
                    className="h-full w-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = '<span class="text-3xl font-serif font-bold text-white">D</span>';
                      }
                    }}
                  />
                </div>
              </Link>
              <div className="relative mt-4">
                <h1 className="text-3xl font-serif font-bold text-white mb-2">
                  Digital Legacy Diary
                </h1>
                <div className="h-1 w-24 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mx-auto rounded-full animate-pulse" />
              </div>
              <h2 className="mt-4 text-2xl font-serif font-bold text-white">
                {isLoginPage ? 'Welcome Back' : (showSubscription ? 'Choose Your Plan' : 'Create Your Account')}
              </h2>
              <p className="mt-2 text-white/80">
                {isLoginPage 
                  ? 'Sign in to continue your legacy journey' 
                  : (showSubscription ? 'Select a plan to begin your journey' : 'Start preserving your memories and wisdom')}
              </p>
            </div>

            <div className="animate-fade-in-up [animation-delay:300ms]">
              {isLoginPage ? (
                <LoginForm />
              ) : showSubscription ? (
                <div className="space-y-4">
                  <div className="grid gap-3">
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
                              Popular
                            </div>
                          </div>
                        )}
                        
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center space-x-2">
                            <div className={`p-1.5 rounded-lg bg-gradient-to-r ${getTierColor(tier.id)} text-white shadow-lg`}>
                              {getTierIcon(tier.id)}
                            </div>
                            <div>
                              <h3 className="font-bold text-base text-white">{tier.name}</h3>
                              <p className="text-xs text-white/70">
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
                        
                        <ul className="space-y-1">
                          {tier.features.slice(0, 3).map((feature, index) => (
                            <li key={index} className="text-xs text-white/80 flex items-center">
                              <Check className="h-3 w-3 text-cyan-400 mr-1.5 flex-shrink-0" />
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
                  
                  <div className="flex flex-col space-y-3 animate-fade-in-up [animation-delay:700ms]">
                    <Button 
                      onClick={() => setShowSubscription(false)}
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 transform transition-all duration-200 hover:scale-105 active:scale-95 shadow-xl"
                    >
                      Continue with {subscriptionTiers.find(t => t.id === selectedTier)?.name}
                    </Button>
                    <button
                      type="button"
                      className="text-sm text-white/70 hover:text-white transition-colors"
                      onClick={() => setShowSubscription(false)}
                    >
                      Skip plan selection
                    </button>
                  </div>
                </div>
              ) : (
                <RegisterForm selectedTier={selectedTier} />
              )}
            </div>

            <div className="mt-8 text-center animate-fade-in-up [animation-delay:400ms]">
              <p className="text-sm text-white/70">
                {isLoginPage 
                  ? "Don't have an account?" 
                  : "Already have an account?"}
                {' '}
                <Link
                  to={isLoginPage ? '/register' : '/login'}
                  className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                >
                  {isLoginPage ? 'Sign Up' : 'Sign In'}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side (enhanced content) */}
      <div className="hidden md:block w-1/2 relative z-10 overflow-hidden">
        <div className="h-full flex items-center justify-center p-12">
          <div className="max-w-md text-white text-center">
            {/* Glass morphism content container */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl animate-fade-in-up [animation-delay:500ms]">
              <h2 className="text-4xl font-serif font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Your Story Deserves to Be Remembered
              </h2>
              <p className="text-lg mb-8 text-white/90 leading-relaxed">
                Digital Legacy Diary helps you preserve your memories, wisdom, and final wishes for your loved ones, ensuring your legacy lives on forever.
              </p>
              
              {/* Enhanced Stats */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="backdrop-blur-sm bg-white/10 p-4 rounded-2xl border border-white/20 animate-fade-in-up [animation-delay:600ms]">
                  <p className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    {Math.floor(Math.random() * 50000) + 10000}
                  </p>
                  <p className="text-sm text-white/80">Stories Preserved</p>
                </div>
                <div className="backdrop-blur-sm bg-white/10 p-4 rounded-2xl border border-white/20 animate-fade-in-up [animation-delay:700ms]">
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {Math.floor(Math.random() * 5000) + 1000}
                  </p>
                  <p className="text-sm text-white/80">Families Connected</p>
                </div>
              </div>
              
              {/* Enhanced Features */}
              <div className="space-y-4 animate-fade-in-up [animation-delay:800ms]">
                <div className="flex items-center space-x-3 text-left backdrop-blur-sm bg-white/5 p-3 rounded-xl border border-white/10">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm text-white/90">Bank-level security for your memories</span>
                </div>
                <div className="flex items-center space-x-3 text-left backdrop-blur-sm bg-white/5 p-3 rounded-xl border border-white/10">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm text-white/90">AI-powered writing assistance</span>
                </div>
                <div className="flex items-center space-x-3 text-left backdrop-blur-sm bg-white/5 p-3 rounded-xl border border-white/10">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm text-white/90">Seamless legacy transfer</span>
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