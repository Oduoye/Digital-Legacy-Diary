import React, { createContext, useState, useContext } from 'react';
import { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, subscriptionTier: string) => Promise<{ emailConfirmationRequired: boolean }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  updateEmail: (newEmail: string, password: string) => Promise<void>;
  deactivateAccount: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  updateSubscription: (tierId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: false,
  login: async () => {},
  register: async () => ({ emailConfirmationRequired: false }),
  logout: async () => {},
  isAuthenticated: false,
  updateProfile: async () => {},
  updatePassword: async () => {},
  updateEmail: async () => {},
  deactivateAccount: async () => {},
  deleteAccount: async () => {},
  updateSubscription: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    // Implement actual authentication later
    setCurrentUser({
      id: '1',
      name: 'Demo User',
      email: email,
      subscription_tier: 'free',
      created_at: new Date(),
      updated_at: new Date()
    });
  };

  const register = async (name: string, email: string, password: string, subscriptionTier: string) => {
    // Implement actual registration later
    setCurrentUser({
      id: '1',
      name: name,
      email: email,
      subscription_tier: subscriptionTier,
      created_at: new Date(),
      updated_at: new Date()
    });
    return { emailConfirmationRequired: false };
  };

  const logout = async () => {
    setCurrentUser(null);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, ...updates });
    }
  };

  const updatePassword = async () => {
    // Implement later
  };

  const updateEmail = async (newEmail: string) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, email: newEmail });
    }
  };

  const deactivateAccount = async () => {
    setCurrentUser(null);
  };

  const deleteAccount = async () => {
    setCurrentUser(null);
  };

  const updateSubscription = async (tierId: string) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, subscription_tier: tierId });
    }
  };

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!currentUser,
    updateProfile,
    updatePassword,
    updateEmail,
    deactivateAccount,
    deleteAccount,
    updateSubscription,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};