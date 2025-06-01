export interface User {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  bio?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
    instagram?: string;
  };
  subscription?: {
    tier: string;
    startDate: Date;
    endDate?: Date;
  };
  lifeStory?: {
    lastGenerated: Date;
    narrative: string;
    themes: LifeTheme[];
    timeline: LifeEvent[];
    relationships: Relationship[];
    values: PersonalValue[];
  };
}

export interface TrustedContact {
  id: string;
  name: string;
  email: string;
  relationship: string;
  picture?: string;
}

export interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  images: string[];
  userId: string;
}

export interface WritingPrompt {
  id: number;
  text: string;
  category: 'memory' | 'reflection' | 'advice' | 'legacy' | 'general';
}

export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  features: string[];
  storageLimit: number;
  contactsLimit: number;
  hasAds: boolean;
  aiFeatures: boolean;
  priority: number;
}

export interface Will {
  id: string;
  userId: string;
  title: string;
  content: string;
  attachments: WillAttachment[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface WillAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface DeadMansSwitch {
  id: string;
  userId: string;
  status: 'active' | 'paused' | 'triggered';
  checkInInterval: number; // in days
  lastCheckIn: Date;
  nextCheckInDue: Date;
  notificationsSent: number;
  trustedContacts: string[]; // array of contact IDs
  customMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LifeTheme {
  id: string;
  name: string;
  description: string;
  relevance: number;
  relatedEntries: string[];
  timespan: {
    start?: Date;
    end?: Date;
  };
}

export interface LifeEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  importance: number;
  relatedEntries: string[];
  tags: string[];
  emotions: string[];
}

export interface Relationship {
  id: string;
  name: string;
  type: string;
  significance: number;
  firstMentioned: Date;
  lastMentioned: Date;
  relatedEntries: string[];
  description: string;
}

export interface PersonalValue {
  id: string;
  name: string;
  description: string;
  examples: string[];
  relatedEntries: string[];
  confidence: number;
}