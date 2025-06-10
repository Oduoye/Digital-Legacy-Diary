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
        if (session?.user) {
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
      if (event === 'SIGNED_IN' && session?.user) {
        await fetchUserProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      if (data) {
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
      await fetchUserProfile(data.user.id);
    }
  };

  const register = async (name: string, email: string, password: string, subscriptionTier: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          subscription_tier: subscriptionTier,
        }
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    // The user profile will be created automatically by the trigger
    // If user is immediately confirmed, fetch their profile
    if (data.user && !data.user.email_confirmed_at) {
      return { emailConfirmationRequired: true };
    }

    if (data.user) {
      await fetchUserProfile(data.user.id);
    }

    return { emailConfirmationRequired: false };
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
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      throw new Error(error.message);
    }
  };

  const resendVerificationEmail = async (email?: string) => {
    if (!email && !currentUser?.email) {
      throw new Error('No email provided');
    }

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email || currentUser!.email,
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