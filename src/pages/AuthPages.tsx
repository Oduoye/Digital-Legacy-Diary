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
        return <Shield className="h-5 w-5" />;
      case 'gold':
        return <Crown className="h-5 w-5" />;
      default:
        return <Zap className="h-5 w-5" />;
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
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side (form) */}
      <div className="w-full md:w-1/2 min-h-screen flex items-center justify-center p-6 md:p-12 bg-white animate-fade-in">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 animate-fade-in-up [animation-delay:200ms]">
            <Link to="/" className="inline-flex items-center justify-center">
              <div className="h-16 w-16 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-3xl font-serif font-bold text-white">D</span>
              </div>
            </Link>
            <div className="relative mt-4">
              <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
                Digital Legacy Diary
              </h1>
              <div className="h-1 w-24 bg-gradient-to-r from-primary-500 to-accent-500 mx-auto rounded-full animate-pulse" />
            </div>
            <h2 className="mt-4 text-2xl font-serif font-bold text-gray-900">
              {isLoginPage ? 'Welcome Back' : (showSubscription ? 'Choose Your Plan' : 'Create Your Account')}
            </h2>
            <p className="mt-2 text-gray-600">
              {isLoginPage 
                ? 'Sign in to continue your legacy journey' 
                : (showSubscription ? 'Select a plan to begin your journey' : 'Start preserving your memories and wisdom')}
            </p>
          </div>

          <div className="animate-fade-in-up [animation-delay:300ms]">
            {isLoginPage ? (
              <LoginForm />
            ) : showSubscription ? (
              <div className="space-y-6">
                <div className="grid gap-4">
                  {subscriptionTiers.map((tier, index) => (
                    <div
                      key={tier.id}
                      className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 animate-fade-in-up hover:scale-105 transform ${
                        selectedTier === tier.id
                          ? 'border-primary-600 bg-primary-50 shadow-lg'
                          : 'border-gray-200 hover:border-primary-300 hover:shadow-md'
                      }`}
                      style={{ animationDelay: `${400 + index * 100}ms` }}
                      onClick={() => handleTierSelect(tier.id)}
                    >
                      {tier.id === 'gold' && (
                        <div className="absolute -top-3 -right-3">
                          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center shadow-lg">
                            <Crown className="h-3 w-3 mr-1" />
                            Most Popular
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${getTierColor(tier.id)} text-white`}>
                            {getTierIcon(tier.id)}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-gray-900">{tier.name}</h3>
                            <p className="text-sm text-gray-500">
                              ${tier.price}{tier.price > 0 ? '/month' : ' forever'}
                            </p>
                          </div>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          selectedTier === tier.id
                            ? 'border-primary-600 bg-primary-600'
                            : 'border-gray-300'
                        }`}>
                          {selectedTier === tier.id && (
                            <Check className="h-4 w-4 text-white" />
                          )}
                        </div>
                      </div>
                      
                      <ul className="space-y-2">
                        {tier.features.slice(0, 4).map((feature, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                        {tier.features.length > 4 && (
                          <li className="text-sm text-gray-500 italic">
                            +{tier.features.length - 4} more features
                          </li>
                        )}
                      </ul>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-col space-y-4 animate-fade-in-up [animation-delay:700ms]">
                  <Button 
                    onClick={() => setShowSubscription(false)}
                    className="w-full bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 transform transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    Continue with {subscriptionTiers.find(t => t.id === selectedTier)?.name}
                  </Button>
                  <button
                    type="button"
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
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
            <p className="text-sm text-gray-600">
              {isLoginPage 
                ? "Don't have an account?" 
                : "Already have an account?"}
              {' '}
              <Link
                to={isLoginPage ? '/register' : '/login'}
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                {isLoginPage ? 'Sign Up' : 'Sign In'}
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side (image/content) */}
      <div className="hidden md:block w-1/2 bg-gradient-to-br from-primary-600 to-accent-600 text-white relative overflow-hidden animate-fade-in">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_-100px,rgba(255,255,255,0.1),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_80%_600px,rgba(255,255,255,0.1),transparent)]" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-md text-white text-center animate-fade-in-up [animation-delay:500ms]">
            <h2 className="text-3xl font-serif font-bold mb-6">
              Your Story Deserves to Be Remembered
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Digital Legacy Diary helps you preserve your memories, wisdom, and final wishes for your loved ones, ensuring your legacy lives on.
            </p>
            <div className="flex justify-center space-x-4">
              <div className="bg-white bg-opacity-20 p-4 rounded-lg backdrop-blur-sm animate-fade-in-up [animation-delay:600ms]">
                <p className="text-2xl font-bold">{Math.floor(Math.random() * 50000) + 10000}</p>
                <p className="text-sm">Stories Preserved</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-lg backdrop-blur-sm animate-fade-in-up [animation-delay:700ms]">
                <p className="text-2xl font-bold">{Math.floor(Math.random() * 5000) + 1000}</p>
                <p className="text-sm">Families Connected</p>
              </div>
            </div>
            
            <div className="mt-8 space-y-4 animate-fade-in-up [animation-delay:800ms]">
              <div className="flex items-center space-x-3 text-left">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Check className="h-4 w-4" />
                </div>
                <span className="text-sm">Bank-level security for your memories</span>
              </div>
              <div className="flex items-center space-x-3 text-left">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Check className="h-4 w-4" />
                </div>
                <span className="text-sm">AI-powered writing assistance</span>
              </div>
              <div className="flex items-center space-x-3 text-left">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Check className="h-4 w-4" />
                </div>
                <span className="text-sm">Seamless legacy transfer</span>
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