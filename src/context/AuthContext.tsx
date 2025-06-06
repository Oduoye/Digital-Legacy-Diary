import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from '../types';
import { supabase } from '../lib/supabase';

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
  const [loading, setLoading] = useState(true);

  // Function to fetch user profile from database
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return {
        id: data.id,
        name: data.name,
        email: data.email,
        profilePicture: data.profile_picture,
        bio: data.bio,
        socialLinks: data.social_links || {},
        subscription_tier: data.subscription_tier || 'free',
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
      };
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  useEffect(() => {
    // Check active session on mount
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }

        if (session?.user) {
          const userProfile = await fetchUserProfile(session.user.id);
          if (userProfile) {
            setCurrentUser(userProfile);
          }
        }
      } catch (error) {
        console.error('Error in getSession:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (event === 'SIGNED_IN' && session?.user) {
        const userProfile = await fetchUserProfile(session.user.id);
        if (userProfile) {
          setCurrentUser(userProfile);
        }
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        console.error('Login error:', error);
        throw new Error(error.message);
      }

      if (data.user) {
        const userProfile = await fetchUserProfile(data.user.id);
        if (userProfile) {
          setCurrentUser(userProfile);
        }
      }
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, subscriptionTier: string) => {
    try {
      setLoading(true);
      
      // First, sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            name: name.trim(),
            subscription_tier: subscriptionTier,
          },
        },
      });

      if (authError) {
        console.error('Registration error:', authError);
        throw new Error(authError.message);
      }

      if (authData.user) {
        // Create user profile in database
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            name: name.trim(),
            email: email.trim(),
            subscription_tier: subscriptionTier,
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          // Don't throw here as the auth user was created successfully
        }

        // If email confirmation is not required, fetch and set user profile
        if (!authData.user.email_confirmed_at && authData.user.confirmation_sent_at) {
          return { emailConfirmationRequired: true };
        } else {
          const userProfile = await fetchUserProfile(authData.user.id);
          if (userProfile) {
            setCurrentUser(userProfile);
          }
          return { emailConfirmationRequired: false };
        }
      }

      return { emailConfirmationRequired: false };
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        throw error;
      }
      setCurrentUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      if (!currentUser) throw new Error('No user logged in');

      // Update auth user metadata if needed
      const authUpdates: any = {};
      if (updates.name) authUpdates.name = updates.name;
      
      if (Object.keys(authUpdates).length > 0) {
        const { error: authError } = await supabase.auth.updateUser({
          data: authUpdates,
        });
        if (authError) throw authError;
      }

      // Update user profile in database
      const dbUpdates: any = {};
      if (updates.name) dbUpdates.name = updates.name;
      if (updates.bio !== undefined) dbUpdates.bio = updates.bio;
      if (updates.profilePicture !== undefined) dbUpdates.profile_picture = updates.profilePicture;
      if (updates.socialLinks !== undefined) dbUpdates.social_links = updates.socialLinks;
      if (updates.subscription_tier) dbUpdates.subscription_tier = updates.subscription_tier;

      if (Object.keys(dbUpdates).length > 0) {
        dbUpdates.updated_at = new Date().toISOString();
        
        const { error: dbError } = await supabase
          .from('users')
          .update(dbUpdates)
          .eq('id', currentUser.id);

        if (dbError) throw dbError;
      }

      // Update local state
      setCurrentUser(prev => prev ? { ...prev, ...updates, updated_at: new Date() } : null);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const updateEmail = async (newEmail: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail.trim(),
      });
      if (error) throw error;

      // Update in database
      if (currentUser) {
        const { error: dbError } = await supabase
          .from('users')
          .update({ 
            email: newEmail.trim(),
            updated_at: new Date().toISOString()
          })
          .eq('id', currentUser.id);

        if (dbError) throw dbError;

        setCurrentUser(prev => prev ? { 
          ...prev, 
          email: newEmail.trim(),
          updated_at: new Date()
        } : null);
      }
    } catch (error) {
      console.error('Error updating email:', error);
      throw error;
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
      if (error) throw error;
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  };

  const deactivateAccount = async () => {
    try {
      // For now, just log out the user
      await logout();
    } catch (error) {
      console.error('Error deactivating account:', error);
      throw error;
    }
  };

  const deleteAccount = async () => {
    try {
      if (!currentUser) throw new Error('No user logged in');

      // Delete user data from database first
      const { error: dbError } = await supabase
        .from('users')
        .delete()
        .eq('id', currentUser.id);

      if (dbError) throw dbError;

      // Then delete auth user (this requires admin privileges in a real app)
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