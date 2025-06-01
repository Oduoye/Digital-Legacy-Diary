import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Heart, Check, Crown } from 'lucide-react';
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

  // Update showSubscription when route changes
  useEffect(() => {
    setShowSubscription(!isLoginPage);
  }, [location.pathname]);

  const handleTierSelect = (tierId: string) => {
    if (tierId !== 'free') {
      setShowComingSoonModal(true);
    } else {
      setSelectedTier(tierId);
      setShowSubscription(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side (form) */}
      <div className="w-full md:w-1/2 min-h-screen flex items-center justify-center p-6 md:p-12 bg-white animate-fade-in">
        <div className="w-full max-w-md">
          {/* Back to Home Link */}
          <div className="mb-8 animate-fade-in-up [animation-delay:100ms]">
            <Link 
              to="/" 
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
          </div>

          <div className="text-center mb-8 animate-fade-in-up [animation-delay:200ms]">
            <Link to="/" className="inline-flex items-center justify-center">
              <div className="rounded-full bg-black p-2 hover:scale-105 transition-transform">
                <img src="/DLD Logo with Navy Blue and Silver_20250601_034009_0000.png" alt="DLD Logo" className="h-12 w-auto" />
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
                      className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 animate-fade-in-up hover:scale-105 ${
                        selectedTier === tier.id
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-primary-300'
                      }`}
                      style={{ animationDelay: `${400 + index * 100}ms` }}
                      onClick={() => handleTierSelect(tier.id)}
                    >
                      {tier.id === 'gold' && (
                        <div className="absolute -top-3 -right-3">
                          <div className="bg-yellow-400 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center animate-float">
                            <Crown className="h-3 w-3 mr-1" />
                            Popular
                          </div>
                        </div>
                      )}
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">{tier.name}</h3>
                          <p className="text-sm text-gray-500">${tier.price}/month</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          selectedTier === tier.id
                            ? 'border-primary-600 bg-primary-600'
                            : 'border-gray-300'
                        }`}>
                          {selectedTier === tier.id && (
                            <Check className="h-3 w-3 text-white" />
                          )}
                        </div>
                      </div>
                      <ul className="mt-2 space-y-1">
                        {tier.features.slice(0, 3).map((feature, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center">
                            <Check className="h-4 w-4 text-primary-600 mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col space-y-4 animate-fade-in-up [animation-delay:700ms]">
                  <Button onClick={() => setShowSubscription(false)}>
                    Continue with {subscriptionTiers.find(t => t.id === selectedTier)?.name}
                  </Button>
                  <button
                    type="button"
                    className="text-sm text-gray-600 hover:text-gray-900"
                    onClick={() => setShowSubscription(false)}
                  >
                    Back to registration
                  </button>
                </div>
              </div>
            ) : (
              <RegisterForm onComplete={() => setShowSubscription(true)} selectedTier={selectedTier} />
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
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                {isLoginPage ? 'Sign Up' : 'Sign In'}
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side (image/content) */}
      <div className="hidden md:block w-1/2 bg-gradient-to-br from-primary-600 to-accent-700 relative overflow-hidden animate-fade-in">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_-100px,rgba(255,255,255,0.1),transparent)] animate-pulse"></div>
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
          </div>
        </div>
      </div>

      {/* Coming Soon Modal */}
      <ComingSoonModal
        isOpen={showComingSoonModal}
        onClose={() => setShowComingSoonModal(false)}
        title="Premium Plans Coming Soon!"
        message="We're working hard to bring you our premium subscription plans. Stay tuned for exciting features and enhanced capabilities!"
      />
    </div>
  );
};

export default AuthPages;