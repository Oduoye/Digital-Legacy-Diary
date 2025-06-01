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
  const currentPlan = getSubscriptionTier(currentUser?.subscription?.tier || 'free');
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
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <div className="mb-6">
          <Link 
            to="/dashboard" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        <div className="mb-12">
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4">
              Your Subscription Plan
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the plan that best fits your needs. Upgrade anytime to unlock more features and storage.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {subscriptionTiers.map((tier, index) => {
            const isCurrentPlan = currentUser?.subscription?.tier === tier.id;
            const isUpgrade = tier.priority > currentPlan.priority;
            
            return (
              <Card 
                key={tier.id}
                className={`relative bg-white transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-fade-in-up ${
                  isCurrentPlan ? 'border-2 border-primary-600 ring-2 ring-primary-600 shadow-lg' : ''
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
                
                {isCurrentPlan && tier.id !== 'free' && (
                  <div className="absolute -top-4 right-4">
                    <div className="bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-medium animate-pulse">
                      Current Plan
                    </div>
                  </div>
                )}
                
                <CardHeader>
                  <h3 className="text-2xl font-serif font-bold text-gray-900">{tier.name}</h3>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">${tier.price}</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-4 mb-8">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    onClick={() => handleSubscribe(tier.id)}
                    className={`w-full ${
                      tier.id === 'gold'
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600'
                        : ''
                    }`}
                    variant={tier.id === 'free' ? 'outline' : 'primary'}
                    disabled={isCurrentPlan}
                  >
                    {isCurrentPlan ? (
                      'Current Plan'
                    ) : currentUser?.subscription?.tier === 'free' && tier.id !== 'free' ? (
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

        <div className="mt-12 bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg p-8 animate-fade-in-up [animation-delay:600ms]">
          <div className="flex items-start space-x-4">
            <div className="rounded-full bg-primary-100 p-3">
              <Shield className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                100% Satisfaction Guarantee
              </h3>
              <p className="text-gray-600">
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
  );
};

export default SubscriptionPage;