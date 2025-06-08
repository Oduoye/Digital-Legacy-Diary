import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from '../types';
import { supabase } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const initializeAuth = async () => {
      try {
        console.log('🔄 Initializing auth...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error getting session:', error);
          if (mounted) {
            setLoading(false);
          }
          return;
        }

        console.log('📋 Initial session:', session ? 'Found' : 'None');
        if (session?.user && mounted) {
          console.log('👤 User found in session:', session.user.email);
          await fetchUserProfile(session.user);
        } else if (mounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error('❌ Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log('🔔 Auth state changed:', event, session?.user?.email || 'No user');

      if (event === 'SIGNED_IN' && session?.user) {
        console.log('✅ User signed in:', session.user.email);
        await fetchUserProfile(session.user);
      } else if (event === 'SIGNED_OUT') {
        console.log('👋 User signed out');
        setCurrentUser(null);
        setLoading(false);
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        console.log('🔄 Token refreshed for:', session.user.email);
        await fetchUserProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      console.log('📊 Fetching user profile for:', supabaseUser.id, supabaseUser.email);
      
      // Check if user profile exists
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUser.id)
        .maybeSingle();

      if (error) {
        console.error('❌ Error fetching user profile:', error);
        setCurrentUser(null);
        setLoading(false);
        return;
      }

      if (data) {
        console.log('✅ User profile found:', data.email);
        // Profile exists, set user
        setCurrentUser({
          ...data,
          created_at: new Date(data.created_at),
          updated_at: new Date(data.updated_at),
          lifeStory: data.life_story_narrative ? {
            lastGenerated: new Date(data.life_story_last_generated),
            narrative: data.life_story_narrative,
            themes: data.life_story_themes || [],
            timeline: data.life_story_timeline || [],
            relationships: data.life_story_relationships || [],
            values: data.life_story_values || [],
          } : undefined,
        });
      } else {
        console.log('⚠️ No user profile found, creating one...');
        // Profile doesn't exist, create it
        const { data: newProfile, error: insertError } = await supabase
          .from('users')
          .insert({
            id: supabaseUser.id,
            name: supabaseUser.user_metadata?.name || 'User',
            email: supabaseUser.email || '',
            subscription_tier: supabaseUser.user_metadata?.subscription_tier || 'free',
            subscription_start_date: new Date().toISOString(),
          })
          .select()
          .single();

        if (insertError) {
          console.error('❌ Error creating user profile:', insertError);
          setCurrentUser(null);
        } else {
          console.log('✅ User profile created:', newProfile.email);
          setCurrentUser({
            ...newProfile,
            created_at: new Date(newProfile.created_at),
            updated_at: new Date(newProfile.updated_at),
          });
        }
      }
    } catch (error) {
      console.error('❌ Error in fetchUserProfile:', error);
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('🔐 Attempting login for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        console.error('❌ Login error:', error);
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please check your credentials and try again.');
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('Please verify your email address before signing in. Check your inbox for a verification link.');
        } else if (error.message.includes('Email link is invalid or has expired')) {
          throw new Error('Your verification link has expired. Please request a new one.');
        } else {
          throw new Error(error.message || 'Login failed. Please try again.');
        }
      }

      console.log('✅ Login successful for:', data.user?.email);
      // The auth state change listener will handle fetching the profile
    } catch (error: any) {
      console.error('❌ Login error:', error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, subscriptionTier: string) => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanName = name.trim();

      console.log('📝 Attempting registration for:', cleanEmail);

      // Get the current origin for redirect URL - NO /login path for SPA
      const redirectTo = `${window.location.origin}`;
      console.log('🔗 Redirect URL:', redirectTo);

      // Create auth user with metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          emailRedirectTo: redirectTo,
          data: {
            name: cleanName,
            subscription_tier: subscriptionTier,
          }
        }
      });

      if (authError) {
        console.error('❌ Registration error:', authError);
        if (authError.message.includes('User already registered')) {
          throw new Error('An account with this email already exists. Please sign in instead.');
        } else {
          throw new Error(authError.message || 'Registration failed. Please try again.');
        }
      }

      if (!authData.user) {
        throw new Error('Failed to create user account. Please try again.');
      }

      console.log('✅ Registration successful:', authData.user.email, 'Session:', !!authData.session);

      // If user is immediately confirmed (no email verification required)
      if (authData.session) {
        console.log('🎯 User immediately confirmed, creating profile...');
        // Create user profile
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            name: cleanName,
            email: cleanEmail,
            subscription_tier: subscriptionTier,
            subscription_start_date: new Date().toISOString(),
          });

        if (profileError) {
          console.error('⚠️ Profile creation error:', profileError);
          // Don't throw here - the user account was created successfully
        }
      } else {
        console.log('📧 Email verification required');
      }

      return { emailConfirmationRequired: !authData.session };
      
    } catch (error: any) {
      console.error('❌ Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    console.log('👋 Logging out...');
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setCurrentUser(null);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!currentUser) throw new Error('No user logged in');

    const { error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', currentUser.id);

    if (error) throw error;

    setCurrentUser(prev => prev ? { ...prev, ...updates, updated_at: new Date() } : null);
  };

  const updateEmail = async (newEmail: string) => {
    const { error } = await supabase.auth.updateUser({ 
      email: newEmail.trim().toLowerCase() 
    });
    if (error) throw error;
    
    await updateProfile({ email: newEmail.trim().toLowerCase() });
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      {
        redirectTo: `${window.location.origin}/reset-password`,
      }
    );
    if (error) throw error;
  };

  const resendVerificationEmail = async (email?: string) => {
    try {
      let targetEmail = email;
      
      if (!targetEmail) {
        const { data: { user } } = await supabase.auth.getUser();
        targetEmail = user?.email;
      }
      
      if (!targetEmail) {
        throw new Error('No email address found');
      }

      console.log('📧 Resending verification email to:', targetEmail);

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: targetEmail,
        options: {
          emailRedirectTo: `${window.location.origin}`,
        }
      });

      if (error) {
        console.error('❌ Error resending verification:', error);
        throw error;
      }

      console.log('✅ Verification email resent successfully');
    } catch (error: any) {
      console.error('❌ Resend verification error:', error);
      throw error;
    }
  };

  const deactivateAccount = async () => {
    await logout();
  };

  const deleteAccount = async () => {
    if (!currentUser) throw new Error('No user logged in');

    // Delete user data from public.users table
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', currentUser.id);

    if (error) throw error;

    // Sign out the user
    await logout();
  };

  const updateSubscription = async (tierId: string) => {
    await updateProfile({ 
      subscription_tier: tierId,
      subscription_start_date: new Date(),
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