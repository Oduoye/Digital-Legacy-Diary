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
  subscription_tier?: string;
  created_at: Date;
  updated_at: Date;
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
  hasAccess?: boolean;
  accessGrantedAt?: Date;
  notificationSent?: boolean;
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
  accessibleToHeirs?: boolean;
  heirAccessCode?: string;
}

export interface WillAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  downloadable?: boolean;
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

export interface LegacyAccess {
  id: string;
  userId: string;
  contactId: string;
  accessCode: string;
  isActive: boolean;
  accessGrantedAt?: Date;
  lastAccessedAt?: Date;
  expiresAt?: Date;
  accessType: 'full' | 'limited' | 'view-only';
  allowedContent: string[]; // array of content types: 'diary', 'wills', 'photos', etc.
}

export interface HeirRegistration {
  id: string;
  accessCode: string;
  email: string;
  name: string;
  relationship: string;
  registeredAt: Date;
  isVerified: boolean;
  originalUserId: string;
  originalUserName: string;
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

// New interfaces for chat history
export interface ChatMessage {
  id: string;
  userId: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  sessionId?: string;
  context?: string; // Additional context for the message
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  lastMessageAt: Date;
  messageCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}