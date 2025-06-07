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
  resendVerificationEmail: () => Promise<void>;
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
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            setLoading(false);
          }
          return;
        }

        if (session?.user && mounted) {
          await fetchUserProfile(session.user);
        } else if (mounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (!mounted) return;

      if (session?.user) {
        await fetchUserProfile(session.user);
      } else {
        setCurrentUser(null);
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
      console.log('Fetching user profile for:', supabaseUser.id);
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUser.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user profile:', error);
        setCurrentUser(null);
        setLoading(false);
        return;
      }

      if (data) {
        console.log('User profile fetched successfully:', data);
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
        console.log('No user profile found for:', supabaseUser.id);
        setCurrentUser(null);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login for:', email);
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      // Validate password length
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        console.error('Login error:', error);
        // Handle specific Supabase auth errors
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please check your credentials and try again.');
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('Please verify your email address before signing in. Check your inbox for a verification link.');
        } else if (error.message.includes('Too many requests')) {
          throw new Error('Too many login attempts. Please wait a few minutes before trying again.');
        } else {
          throw new Error(error.message || 'Login failed. Please try again.');
        }
      }

      if (data.user) {
        console.log('Login successful for user:', data.user.id);
        // The auth state change listener will handle fetching the profile
      }
    } catch (error: any) {
      console.error('Login process error:', error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, subscriptionTier: string) => {
    console.log('Starting registration process...');
    
    try {
      // Validate inputs
      if (!name.trim()) {
        throw new Error('Name is required');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      const cleanEmail = email.trim().toLowerCase();
      const cleanName = name.trim();

      console.log('Registration data:', { cleanName, cleanEmail, subscriptionTier });

      // Check if user already exists in auth
      console.log('Checking if user already exists...');
      const { data: existingUser } = await supabase
        .from('users')
        .select('email')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (existingUser) {
        throw new Error('An account with this email already exists. Please sign in instead.');
      }

      // Create auth user
      console.log('Creating auth user...');
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            name: cleanName,
            subscription_tier: subscriptionTier,
          }
        }
      });

      if (authError) {
        console.error('Auth signup error:', authError);
        if (authError.message.includes('User already registered')) {
          throw new Error('An account with this email already exists. Please sign in instead.');
        } else if (authError.message.includes('Password should be at least 6 characters')) {
          throw new Error('Password must be at least 6 characters long');
        } else {
          throw new Error(authError.message || 'Registration failed. Please try again.');
        }
      }

      if (!authData.user) {
        throw new Error('Failed to create user account. Please try again.');
      }

      console.log('Auth user created successfully:', authData.user.id);

      // Create user profile in our users table
      console.log('Creating user profile...');
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
        console.error('Profile creation error:', profileError);
        // Don't throw here - the auth user was created successfully
        // We'll handle profile creation issues gracefully
      } else {
        console.log('User profile created successfully');
      }

      console.log('Registration completed successfully');
      return { emailConfirmationRequired: !authData.session };
      
    } catch (error: any) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      throw new Error('Please enter a valid email address');
    }

    const { error } = await supabase.auth.updateUser({ 
      email: newEmail.trim().toLowerCase() 
    });
    if (error) throw error;
    
    await updateProfile({ email: newEmail.trim().toLowerCase() });
  };

  const updatePassword = async (newPassword: string) => {
    if (newPassword.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
  };

  const resetPassword = async (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Please enter a valid email address');
    }

    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      {
        redirectTo: `${window.location.origin}/reset-password`,
      }
    );
    if (error) throw error;
  };

  const resendVerificationEmail = async () => {
    if (!currentUser?.email) {
      throw new Error('No email address found');
    }

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: currentUser.email,
    });

    if (error) throw error;
  };

  const deactivateAccount = async () => {
    await logout();
  };

  const deleteAccount = async () => {
    if (!currentUser) throw new Error('No user logged in');

    // Delete user data
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', currentUser.id);

    if (error) throw error;

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