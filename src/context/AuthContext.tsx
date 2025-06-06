import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from '../types';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  sendOtp: (email: string) => Promise<void>;
  verifyOtp: (email: string, token: string) => Promise<void>;
  register: (name: string, email: string, subscriptionTier: string) => Promise<{ emailConfirmationRequired: boolean }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  updateEmail: (newEmail: string) => Promise<void>;
  deactivateAccount: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  updateSubscription: (tierId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: false,
  sendOtp: async () => {},
  verifyOtp: async () => {},
  register: async () => ({ emailConfirmationRequired: false }),
  logout: async () => {},
  isAuthenticated: false,
  updateProfile: async () => {},
  updateEmail: async () => {},
  deactivateAccount: async () => {},
  deleteAccount: async () => {},
  updateSubscription: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setCurrentUser({
          id: session.user.id,
          name: session.user.user_metadata.name || '',
          email: session.user.email || '',
          subscription_tier: 'free',
          created_at: new Date(session.user.created_at),
          updated_at: new Date(),
        });
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setCurrentUser({
          id: session.user.id,
          name: session.user.user_metadata.name || '',
          email: session.user.email || '',
          subscription_tier: 'free',
          created_at: new Date(session.user.created_at),
          updated_at: new Date(),
        });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const sendOtp = async (email: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw error;
    }
  };

  const verifyOtp = async (email: string, token: string) => {
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw error;
    }
  };

  const register = async (name: string, email: string, subscriptionTier: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          data: {
            name,
            subscription_tier: subscriptionTier,
          },
        },
      });
      if (error) throw error;
      return { emailConfirmationRequired: true };
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setCurrentUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: updates,
      });
      if (error) throw error;
      if (currentUser) {
        setCurrentUser({ ...currentUser, ...updates });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const updateEmail = async (newEmail: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail,
      });
      if (error) throw error;
      if (currentUser) {
        setCurrentUser({ ...currentUser, email: newEmail });
      }
    } catch (error) {
      console.error('Error updating email:', error);
      throw error;
    }
  };

  const deactivateAccount = async () => {
    try {
      // Implement account deactivation logic
      await logout();
    } catch (error) {
      console.error('Error deactivating account:', error);
      throw error;
    }
  };

  const deleteAccount = async () => {
    try {
      const { error } = await supabase.auth.admin.deleteUser(
        currentUser?.id || ''
      );
      if (error) throw error;
      await logout();
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  };

  const updateSubscription = async (tierId: string) => {
    try {
      await updateProfile({ subscription_tier: tierId });
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    loading,
    sendOtp,
    verifyOtp,
    register,
    logout,
    isAuthenticated: !!currentUser,
    updateProfile,
    updateEmail,
    deactivateAccount,
    deleteAccount,
    updateSubscription,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};