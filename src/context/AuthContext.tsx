import React, { createContext, useState, useContext, useEffect } from 'react';
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

// Mock users storage
const USERS_KEY = 'digital_legacy_users';
const CURRENT_USER_KEY = 'digital_legacy_current_user';

const getStoredUsers = (): User[] => {
  const stored = localStorage.getItem(USERS_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const getCurrentUser = (): User | null => {
  const stored = localStorage.getItem(CURRENT_USER_KEY);
  if (!stored) return null;
  
  const userData = JSON.parse(stored);
  return {
    ...userData,
    created_at: new Date(userData.created_at),
    updated_at: new Date(userData.updated_at),
  };
};

const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load current user from localStorage on app start
    const user = getCurrentUser();
    setCurrentUserState(user);
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const users = getStoredUsers();
    const user = users.find(u => u.email === email.toLowerCase());
    
    if (!user) {
      throw new Error('Invalid email or password. Please check your credentials and try again.');
    }
    
    // In a real app, you'd verify the password hash
    // For demo purposes, we'll just check if password is not empty
    if (!password) {
      throw new Error('Invalid email or password. Please check your credentials and try again.');
    }
    
    setCurrentUser(user);
    setCurrentUserState(user);
  };

  const register = async (name: string, email: string, password: string, subscriptionTier: string) => {
    const users = getStoredUsers();
    const existingUser = users.find(u => u.email === email.toLowerCase());
    
    if (existingUser) {
      throw new Error('An account with this email already exists. Please sign in instead.');
    }
    
    const newUser: User = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email.toLowerCase(),
      subscription_tier: subscriptionTier,
      created_at: new Date(),
      updated_at: new Date(),
    };
    
    users.push(newUser);
    saveUsers(users);
    setCurrentUser(newUser);
    setCurrentUserState(newUser);
    
    return { emailConfirmationRequired: false };
  };

  const logout = async () => {
    setCurrentUser(null);
    setCurrentUserState(null);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!currentUser) throw new Error('No user logged in');

    const updatedUser = {
      ...currentUser,
      ...updates,
      updated_at: new Date(),
    };

    // Update in storage
    const users = getStoredUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      saveUsers(users);
    }

    setCurrentUser(updatedUser);
    setCurrentUserState(updatedUser);
  };

  const updateEmail = async (newEmail: string) => {
    await updateProfile({ email: newEmail.toLowerCase() });
  };

  const updatePassword = async (newPassword: string) => {
    // In a real app, you'd hash and store the password
    // For demo purposes, we'll just simulate success
    console.log('Password updated successfully');
  };

  const resetPassword = async (email: string) => {
    // In a real app, you'd send a reset email
    // For demo purposes, we'll just simulate success
    console.log('Password reset email sent to:', email);
  };

  const resendVerificationEmail = async (email?: string) => {
    // In a real app, you'd resend verification email
    // For demo purposes, we'll just simulate success
    console.log('Verification email sent to:', email);
  };

  const deactivateAccount = async () => {
    await logout();
  };

  const deleteAccount = async () => {
    if (!currentUser) throw new Error('No user logged in');

    // Remove user from storage
    const users = getStoredUsers();
    const filteredUsers = users.filter(u => u.id !== currentUser.id);
    saveUsers(filteredUsers);

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