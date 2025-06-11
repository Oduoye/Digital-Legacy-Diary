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
  loading: true,
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
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('🔄 Initializing authentication...');
        
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Session error:', error);
          if (mounted) {
            setCurrentUser(null);
            setLoading(false);
          }
          return;
        }

        // If we have a session with a confirmed user, fetch their profile
        if (session?.user) {
          console.log('✅ Found user session, fetching profile...');
          await fetchUserProfile(session.user.id);
        } else {
          console.log('⚠️ No user session found');
          if (mounted) {
            setCurrentUser(null);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('❌ Auth initialization error:', error);
        if (mounted) {
          setCurrentUser(null);
          setLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state change:', event);
      
      if (!mounted) return;

      try {
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('✅ User signed in, fetching profile...');
          await fetchUserProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          console.log('👋 User signed out');
          setCurrentUser(null);
          setLoading(false);
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          console.log('🔄 Token refreshed');
          // Only fetch profile if we don't have a current user
          if (!currentUser) {
            await fetchUserProfile(session.user.id);
          } else {
            setLoading(false);
          }
        } else {
          console.log('⚠️ Auth event without user session');
          setCurrentUser(null);
          setLoading(false);
        }
      } catch (error) {
        console.error('❌ Auth state change error:', error);
        setCurrentUser(null);
        setLoading(false);
      }
    });

    // Initialize auth
    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('📡 Fetching profile for user:', userId);
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ Profile fetch error:', error);
        // Don't throw error, just set user to null and continue
        setCurrentUser(null);
        setLoading(false);
        return;
      }

      if (data) {
        console.log('✅ Profile loaded successfully');
        setCurrentUser(convertDbUserToAppUser(data));
      } else {
        console.log('⚠️ No profile data found');
        setCurrentUser(null);
      }
    } catch (error) {
      console.error('❌ Profile fetch exception:', error);
      setCurrentUser(null);
    } finally {
      // Always set loading to false
      setLoading(false);
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
      console.log('✅ Login successful');
      // Don't fetch profile here, let the auth state change handle it
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
        },
        emailRedirectTo: getRedirectUrl('/auth/callback')
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    const emailConfirmationRequired = !data.user?.email_confirmed_at && data.user && !data.session;
    
    console.log('📋 Registration result:', {
      emailConfirmationRequired,
      emailConfirmed: !!data.user?.email_confirmed_at,
    });

    if (data.user?.email_confirmed_at && data.session) {
      console.log('✅ Registration with immediate confirmation');
      // Don't fetch profile here, let the auth state change handle it
      return { emailConfirmationRequired: false };
    }

    return { emailConfirmationRequired: true };
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
    // Don't set user to null here, let the auth state change handle it
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