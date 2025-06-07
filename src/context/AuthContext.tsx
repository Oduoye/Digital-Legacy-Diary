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
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        // Convert date strings back to Date objects
        if (user.created_at) user.created_at = new Date(user.created_at);
        if (user.updated_at) user.updated_at = new Date(user.updated_at);
        if (user.lifeStory?.lastGenerated) {
          user.lifeStory.lastGenerated = new Date(user.lifeStory.lastGenerated);
        }
        setCurrentUser(user);
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user exists in localStorage
      const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const user = users.find((u: any) => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Create user object without password
      const { password: _, ...userWithoutPassword } = user;
      setCurrentUser({
        ...userWithoutPassword,
        created_at: new Date(userWithoutPassword.created_at),
        updated_at: new Date(userWithoutPassword.updated_at),
      });
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, subscriptionTier: string) => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      if (users.find((u: any) => u.email === email)) {
        throw new Error('User with this email already exists');
      }

      // Create new user
      const newUser = {
        id: crypto.randomUUID(),
        name: name.trim(),
        email: email.trim(),
        password, // Store password for demo purposes
        profilePicture: null,
        bio: null,
        socialLinks: {},
        subscription_tier: subscriptionTier,
        created_at: new Date(),
        updated_at: new Date(),
      };

      // Save to localStorage
      users.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(users));

      // Set current user (without password)
      const { password: _, ...userWithoutPassword } = newUser;
      setCurrentUser(userWithoutPassword);

      return { emailConfirmationRequired: false };
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setCurrentUser(null);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!currentUser) throw new Error('No user logged in');

    const updatedUser = { 
      ...currentUser, 
      ...updates, 
      updated_at: new Date() 
    };
    
    setCurrentUser(updatedUser);

    // Update in registered users list
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === currentUser.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates, updated_at: new Date() };
      localStorage.setItem('registeredUsers', JSON.stringify(users));
    }
  };

  const updateEmail = async (newEmail: string) => {
    if (!currentUser) throw new Error('No user logged in');
    await updateProfile({ email: newEmail.trim() });
  };

  const updatePassword = async (newPassword: string) => {
    if (!currentUser) throw new Error('No user logged in');
    
    // Update password in registered users list
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === currentUser.id);
    if (userIndex !== -1) {
      users[userIndex].password = newPassword;
      localStorage.setItem('registeredUsers', JSON.stringify(users));
    }
  };

  const resetPassword = async (email: string) => {
    // Simulate password reset
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Password reset email sent to:', email);
  };

  const deactivateAccount = async () => {
    await logout();
  };

  const deleteAccount = async () => {
    if (!currentUser) throw new Error('No user logged in');

    // Remove from registered users
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const filteredUsers = users.filter((u: any) => u.id !== currentUser.id);
    localStorage.setItem('registeredUsers', JSON.stringify(filteredUsers));

    // Remove diary entries
    localStorage.removeItem(`diaryEntries_${currentUser.id}`);
    localStorage.removeItem(`trustedContacts_${currentUser.id}`);

    await logout();
  };

  const updateSubscription = async (tierId: string) => {
    await updateProfile({ subscription_tier: tierId });
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};