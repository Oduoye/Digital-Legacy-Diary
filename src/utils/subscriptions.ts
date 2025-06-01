import { SubscriptionTier } from '../types';

export const subscriptionTiers: SubscriptionTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    features: [
      'Basic journaling features',
      'Up to 5 diary entries per month',
      'Limited storage (100MB)',
      'Basic writing prompts',
      'Up to 3 trusted contacts'
    ],
    storageLimit: 100,
    contactsLimit: 3,
    hasAds: true,
    aiFeatures: false,
    priority: 1
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 9.99,
    features: [
      'Unlimited diary entries',
      'Enhanced storage (5GB)',
      'Advanced writing prompts',
      'Up to 10 trusted contacts',
      'Ad-free experience',
      'Priority support'
    ],
    storageLimit: 5000,
    contactsLimit: 10,
    hasAds: false,
    aiFeatures: false,
    priority: 2
  },
  {
    id: 'gold',
    name: 'Gold',
    price: 19.99,
    features: [
      'Everything in Premium',
      'Unlimited storage',
      'Unlimited trusted contacts',
      'AI-powered writing assistance',
      'Advanced memory preservation',
      'Legacy planning tools',
      'Premium support'
    ],
    storageLimit: Infinity,
    contactsLimit: Infinity,
    hasAds: false,
    aiFeatures: true,
    priority: 3
  }
];

export const getSubscriptionTier = (tierId: SubscriptionTier['id']): SubscriptionTier => {
  return subscriptionTiers.find(tier => tier.id === tierId) || subscriptionTiers[0];
};