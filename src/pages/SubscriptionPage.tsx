import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowLeft, Crown, Shield, AlertTriangle } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import { subscriptionTiers, getSubscriptionTier } from '../utils/subscriptions';
import { useAuth } from '../context/AuthContext';

const SubscriptionPage: React.FC = () => {
  const { currentUser, updateSubscription } = useAuth();
  const currentPlan = getSubscriptionTier(currentUser?.subscription_tier || 'free');
  const [showUpgradeModal, setShowUpgradeModal] = React.useState(false);
  const [selectedTier, setSelectedTier] = React.useState<string | null>(null);

  const handleSubscribe = (tierId: string) => {
    const targetTier = getSubscriptionTier(tierId);
    if (targetTier.priority > currentPlan.priority) {
      setSelectedTier(tierId);
      setShowUpgradeModal(true);
    } else {
      updateSubscription(tierId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400/15 to-purple-600/15 rounded-full blur-3xl animate-float" 
             style={{ animationDelay: '0s', animationDuration: '6s' }} />
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-pink-400/10 to-red-600/10 rounded-full blur-3xl animate-float" 
             style={{ animationDelay: '2s', animationDuration: '8s' }} />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-cyan-400/15 to-blue-600/15 rounded-full blur-3xl animate-float" 
             style={{ animationDelay: '4s', animationDuration: '7s' }} />
      </div>

      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in relative z-10">
          <div className="mb-6">
            <Link 
              to="/dashboard" 
              className="inline-flex items-center text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>

          <div className="mb-12">
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4">
                Your Subscription Plan
              </h1>
              <p className="text-white/80 max-w-2xl mx-auto">
                Choose the plan that best fits your needs. Upgrade anytime to unlock more features and storage.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {subscriptionTiers.map((tier, index) => {
              const isCurrentPlan = currentUser?.subscription_tier === tier.id;
              const isUpgrade = tier.priority > currentPlan.priority;
              
              return (
                <Card 
                  key={tier.id}
                  className={`relative backdrop-blur-xl bg-white/10 border border-white/20 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-fade-in-up ${
                    isCurrentPlan ? 'border-2 border-primary-400 ring-2 ring-primary-400 shadow-lg' : ''
                  } ${tier.id === 'gold' ? 'border-2 border-yellow-400' : ''}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {tier.id === 'gold' && (
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-50">
                      <div className="bg-yellow-400 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center shadow-md">
                        <Crown className="h-4 w-4 mr-1" />
                        Most Popular
                      </div>
                    </div>
                  )}
                  
                  {isCurrentPlan && (
                    <div className="absolute -top-4 right-4">
                      <div className="bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-medium animate-pulse">
                        Current Plan
                      </div>
                    </div>
                  )}
                  
                  <CardHeader>
                    <h3 className="text-2xl font-serif font-bold text-white">{tier.name}</h3>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-white">${tier.price}</span>
                      <span className="text-white/70">/month</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <ul className="space-y-4 mb-8">
                      {tier.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-green-400 mr-2 flex-shrink-0" />
                          <span className="text-white/80">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button
                      onClick={() => handleSubscribe(tier.id)}
                      className={`w-full ${
                        isCurrentPlan ? 'bg-primary-100 text-primary-700 hover:bg-primary-200 cursor-default' :
                        tier.id === 'gold'
                          ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600'
                          : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-xl'
                      }`}
                      variant={tier.id === 'free' ? 'outline' : 'primary'}
                      disabled={isCurrentPlan}
                    >
                      {isCurrentPlan ? (
                        'Current Plan'
                      ) : currentUser?.subscription_tier === 'free' && tier.id !== 'free' ? (
                        'Upgrade Now'
                      ) : tier.id === 'free' ? (
                        'Basic Plan'
                      ) : (
                        'Switch Plan'
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-12 backdrop-blur-xl bg-white/10 border border-white/20 rounded-lg p-8 animate-fade-in-up [animation-delay:600ms]">
            <div className="flex items-start space-x-4">
              <div className="rounded-full bg-primary-100 p-3">
                <Shield className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  100% Satisfaction Guarantee
                </h3>
                <p className="text-white/80">
                  Try any paid plan risk-free for 30 days. If you're not completely satisfied, we'll refund your payment. No questions asked.
                </p>
              </div>
            </div>
          </div>

          {/* Upgrade Modal */}
          {showUpgradeModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-md w-full p-6 animate-fade-in">
                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="h-6 w-6 text-yellow-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Coming Soon!
                  </h3>
                  <p className="text-gray-600 mb-6">
                    We're working hard to bring you this exciting new plan. Stay tuned for updates!
                  </p>
                  <Button onClick={() => setShowUpgradeModal(false)}>
                    Got It
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </div>
  );
};

export default SubscriptionPage;