import React, { createContext, useState, useEffect, useContext } from 'react';
import { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, subscriptionTier: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  updateProfile: (updates: Partial<User>) => void;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  updateEmail: (newEmail: string, password: string) => Promise<void>;
  deactivateAccount: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  updateSubscription: (tierId: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isAuthenticated: false,
  updateProfile: () => {},
  updatePassword: async () => {},
  updateEmail: async () => {},
  deactivateAccount: async () => {},
  deleteAccount: async () => {},
  updateSubscription: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const updateProfile = (updates: Partial<User>) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      setCurrentUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const updateSubscription = (tierId: string) => {
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        subscription: {
          tier: tierId,
          startDate: new Date(),
        },
      };
      setCurrentUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    if (currentPassword && newPassword) {
      console.log('Password updated');
    } else {
      throw new Error('Invalid password data');
    }
  };

  const updateEmail = async (newEmail: string, password: string) => {
    if (newEmail && password && currentUser) {
      const updatedUser = { ...currentUser, email: newEmail };
      setCurrentUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } else {
      throw new Error('Invalid email update data');
    }
  };

  const deactivateAccount = async () => {
    if (currentUser) {
      logout();
      return Promise.resolve();
    }
    throw new Error('No user logged in');
  };

  const deleteAccount = async () => {
    if (currentUser) {
      logout();
      localStorage.removeItem(`diary_entries_${currentUser.id}`);
      localStorage.removeItem(`trusted_contacts_${currentUser.id}`);
      return Promise.resolve();
    }
    throw new Error('No user logged in');
  };

  const login = async (email: string, password: string) => {
    if (email && password) {
      const user: User = {
        id: '1',
        name: email.split('@')[0],
        email,
        subscription: {
          tier: 'free',
          startDate: new Date(),
        },
      };
      setCurrentUser(user);
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const register = async (name: string, email: string, password: string, subscriptionTier: string) => {
    if (name && email && password) {
      const user: User = {
        id: Date.now().toString(),
        name,
        email,
        subscription: {
          tier: subscriptionTier,
          startDate: new Date(),
        },
      };
      setCurrentUser(user);
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      throw new Error('Invalid registration data');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
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