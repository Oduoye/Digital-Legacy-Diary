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

// Helper function to check if error is related to invalid refresh token
const isRefreshTokenError = (error: any): boolean => {
  if (!error) return false;
  
  const errorMessage = error.message?.toLowerCase() || '';
  const errorCode = error.code?.toLowerCase() || '';
  
  return (
    errorMessage.includes('refresh token not found') ||
    errorMessage.includes('invalid refresh token') ||
    errorCode === 'refresh_token_not_found' ||
    errorCode === 'invalid_grant'
  );
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
  const [sessionInitialized, setSessionInitialized] = useState(false);

  // Helper function to handle auth errors and clear session
  const handleAuthError = async (error: any, context: string) => {
    console.error(`❌ ${context} error:`, error);
    
    if (isRefreshTokenError(error)) {
      console.log('🔄 Invalid refresh token detected, clearing session...');
      try {
        await supabase.auth.signOut();
        setCurrentUser(null);
      } catch (signOutError) {
        console.error('❌ Error during signOut:', signOutError);
        setCurrentUser(null);
      }
    }
  };

  useEffect(() => {
    let mounted = true;

    // Initialize session and set up auth listener
    const initializeAuth = async () => {
      try {
        console.log('🔄 Initializing authentication...');
        setLoading(true);
        
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          await handleAuthError(error, 'Session initialization');
          if (mounted) {
            setSessionInitialized(true);
            setLoading(false);
          }
          return;
        }

        console.log('📋 Initial session:', session ? 'Found' : 'None');
        
        if (session?.user) {
          console.log('👤 Session user found, fetching profile...');
          await fetchUserProfile(session.user.id);
        }
      } catch (error) {
        await handleAuthError(error, 'Auth initialization');
      } finally {
        if (mounted) {
          setSessionInitialized(true);
          setLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log('🔄 Auth state change:', event, session?.user?.id);
      
      try {
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('✅ User signed in, fetching profile');
          setLoading(true);
          await fetchUserProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          console.log('👋 User signed out');
          setCurrentUser(null);
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          console.log('🔄 Token refreshed');
          if (!currentUser) {
            await fetchUserProfile(session.user.id);
          }
        }
      } catch (error) {
        await handleAuthError(error, 'Auth state change');
      } finally {
        if (mounted) {
          setLoading(false);
        }
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
      console.log('📡 Fetching user profile for:', userId);
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ Error fetching user profile:', error);
        
        if (isRefreshTokenError(error)) {
          await handleAuthError(error, 'Profile fetch');
          return;
        }
        
        if (error.code === 'PGRST116') {
          console.log('⚠️ User not found in users table, they may need to complete registration');
          setCurrentUser(null);
        }
        return;
      }

      if (data) {
        console.log('✅ User profile fetched successfully');
        setCurrentUser(convertDbUserToAppUser(data));
      }
    } catch (error) {
      console.error('❌ Error in fetchUserProfile:', error);
      
      if (isRefreshTokenError(error)) {
        await handleAuthError(error, 'Profile fetch');
        return;
      }
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log('🔄 Attempting login for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Login error:', error);
        
        // Handle specific error cases
        if (error.message?.includes('Email not confirmed')) {
          throw new Error('Please verify your email address before signing in. Check your inbox for a verification link.');
        } else if (error.message?.includes('Invalid login credentials')) {
          throw new Error('The email or password you entered is incorrect.');
        } else {
          throw new Error(error.message);
        }
      }

      if (data.user) {
        console.log('✅ Login successful, user:', data.user.id);
        
        // Check if user has confirmed email
        if (!data.user.email_confirmed_at) {
          throw new Error('Please verify your email address before signing in. Check your inbox for a verification link.');
        }
        
        // Fetch user profile
        await fetchUserProfile(data.user.id);
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, subscriptionTier: string) => {
    setLoading(true);
    try {
      console.log('🔄 Attempting registration for:', email);
      
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
        console.error('❌ Registration error:', error);
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

      // If user is immediately confirmed, create profile and fetch it
      if (data.user && data.user.email_confirmed_at && data.session) {
        console.log('✅ User immediately confirmed, creating profile');
        
        // Create user profile
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            name,
            email,
            subscription_tier: subscriptionTier,
          });

        if (profileError && profileError.code !== '23505') { // Ignore duplicate key errors
          console.error('❌ Profile creation error:', profileError);
        }

        // Fetch the profile
        await fetchUserProfile(data.user.id);
        return { emailConfirmationRequired: false };
      }

      return { emailConfirmationRequired: true };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new Error(error.message);
      }
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
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
    isAuthenticated: !!currentUser && sessionInitialized,
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