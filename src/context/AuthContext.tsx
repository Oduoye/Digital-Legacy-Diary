import React, { createContext, useState, useContext, useEffect } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, subscriptionTier: string) => Promise<{ emailConfirmationRequired: boolean }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  updateEmail: (newEmail: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  deactivateAccount: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  updateSubscription: (tierId: string) => Promise<void>;
  resendVerificationEmail: (email?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: false,
  login: async () => {},
  register: async () => ({ emailConfirmationRequired: false }),
  logout: async () => {},
  isAuthenticated: false,
  updateProfile: async () => {},
  updateEmail: async () => {},
  updatePassword: async () => {},
  resetPassword: async () => {},
  deactivateAccount: async () => {},
  deleteAccount: async () => {},
  updateSubscription: async () => {},
  resendVerificationEmail: async () => {},
});

export const useAuth = () => useContext(AuthContext);

// Get the correct redirect URL based on environment
const getRedirectUrl = (path: string = '/auth/callback') => {
  // Check if we're in production (Netlify)
  if (window.location.hostname === 'digitallegacydiary.netlify.app') {
    return `https://digitallegacydiary.netlify.app${path}`;
  }
  
  // Check for other production domains
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return `${window.location.origin}${path}`;
  }
  
  // Default to current origin for development
  return `${window.location.origin}${path}`;
};

// Helper function to convert database user to app user
const convertDbUserToAppUser = (dbUser: any): User => {
  return {
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    profilePicture: dbUser.profile_picture,
    bio: dbUser.bio,
    socialLinks: dbUser.social_links || {},
    subscription_tier: dbUser.subscription_tier || 'free',
    created_at: new Date(dbUser.created_at),
    updated_at: new Date(dbUser.updated_at),
    lifeStory: dbUser.life_story_narrative ? {
      lastGenerated: new Date(dbUser.life_story_last_generated),
      narrative: dbUser.life_story_narrative,
      themes: dbUser.life_story_themes || [],
      timeline: dbUser.life_story_timeline || [],
      relationships: dbUser.life_story_relationships || [],
      values: dbUser.life_story_values || [],
    } : undefined,
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Initial session:', session);
        
        if (session?.user) {
          // Always try to fetch user profile if we have a session
          await fetchUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.id);
      
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('User signed in, fetching profile');
        await fetchUserProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        setCurrentUser(null);
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        // Handle token refresh - maintain user state
        if (!currentUser) {
          await fetchUserProfile(session.user.id);
        }
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [currentUser]);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        // If user doesn't exist in our users table, they might need to complete registration
        if (error.code === 'PGRST116') {
          console.log('User not found in users table, they may need to complete registration');
          setCurrentUser(null);
        }
        return;
      }

      if (data) {
        console.log('User profile fetched:', data);
        setCurrentUser(convertDbUserToAppUser(data));
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (data.user) {
      console.log('Login successful, fetching profile');
      await fetchUserProfile(data.user.id);
    }
  };

  const register = async (name: string, email: string, password: string, subscriptionTier: string) => {
    // First, sign up the user with correct redirect URL
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          subscription_tier: subscriptionTier,
        },
        // Use the correct production URL for email verification
        emailRedirectTo: getRedirectUrl('/auth/callback')
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    // Check if email confirmation is required
    const emailConfirmationRequired = !data.user?.email_confirmed_at && data.user && !data.session;
    
    console.log('Registration result:', {
      user: data.user,
      session: data.session,
      emailConfirmationRequired,
      email_confirmed_at: data.user?.email_confirmed_at,
      redirectUrl: getRedirectUrl('/auth/callback')
    });

    // If user is immediately confirmed or email confirmation is disabled, fetch their profile
    if (data.user && (data.user.email_confirmed_at || data.session)) {
      // Wait a moment for the database trigger to create the user profile
      setTimeout(async () => {
        await fetchUserProfile(data.user!.id);
      }, 1000);
      return { emailConfirmationRequired: false };
    }

    return { emailConfirmationRequired: true };
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
    setCurrentUser(null);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!currentUser) throw new Error('No user logged in');

    const dbUpdates: any = {
      updated_at: new Date().toISOString(),
    };

    // Map app user fields to database fields
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.email !== undefined) dbUpdates.email = updates.email;
    if (updates.profilePicture !== undefined) dbUpdates.profile_picture = updates.profilePicture;
    if (updates.bio !== undefined) dbUpdates.bio = updates.bio;
    if (updates.socialLinks !== undefined) dbUpdates.social_links = updates.socialLinks;
    if (updates.subscription_tier !== undefined) dbUpdates.subscription_tier = updates.subscription_tier;
    
    if (updates.lifeStory !== undefined) {
      dbUpdates.life_story_last_generated = updates.lifeStory.lastGenerated.toISOString();
      dbUpdates.life_story_narrative = updates.lifeStory.narrative;
      dbUpdates.life_story_themes = updates.lifeStory.themes;
      dbUpdates.life_story_timeline = updates.lifeStory.timeline;
      dbUpdates.life_story_relationships = updates.lifeStory.relationships;
      dbUpdates.life_story_values = updates.lifeStory.values;
    }

    const { error } = await supabase
      .from('users')
      .update(dbUpdates)
      .eq('id', currentUser.id);

    if (error) {
      throw new Error(error.message);
    }

    // Update local state
    setCurrentUser(prev => prev ? { ...prev, ...updates, updated_at: new Date() } : null);
  };

  const updateEmail = async (newEmail: string) => {
    const { error } = await supabase.auth.updateUser({
      email: newEmail,
    });

    if (error) {
      throw new Error(error.message);
    }

    await updateProfile({ email: newEmail });
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw new Error(error.message);
    }
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: getRedirectUrl('/reset-password'),
    });

    if (error) {
      throw new Error(error.message);
    }
  };

  const resendVerificationEmail = async (email?: string) => {
    if (!email) {
      throw new Error('Email is required to resend verification');
    }

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: getRedirectUrl('/auth/callback')
      }
    });

    if (error) {
      throw new Error(error.message);
    }
  };

  const deactivateAccount = async () => {
    await logout();
  };

  const deleteAccount = async () => {
    if (!currentUser) throw new Error('No user logged in');

    // Delete user data from our tables (cascading deletes will handle related data)
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('id', currentUser.id);

    if (deleteError) {
      throw new Error(deleteError.message);
    }

    await logout();
  };

  const updateSubscription = async (tierId: string) => {
    await updateProfile({ 
      subscription_tier: tierId,
    });
  };

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!currentUser,
    updateProfile,
    updateEmail,
    updatePassword,
    resetPassword,
    deactivateAccount,
    deleteAccount,
    updateSubscription,
    resendVerificationEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};