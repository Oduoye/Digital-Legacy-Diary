import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const fetchUserProfile = async (userId: string): Promise<User | null> => {
    try {
      console.log('Fetching user profile for ID:', userId);
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      console.log('User profile data from database:', data);

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

  // Function to create user profile in database
  const createUserProfile = async (authUser: any): Promise<User | null> => {
    try {
      console.log('Creating user profile for:', authUser.id);
      
      const userProfileData = {
        id: authUser.id,
        name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
        email: authUser.email,
        profile_picture: null,
        bio: null,
        social_links: {},
        subscription_tier: authUser.user_metadata?.subscription_tier || 'free',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('users')
        .insert(userProfileData)
        .select()
        .single();

      if (error) {
        console.error('Profile creation error:', error);
        throw new Error(`Failed to create user profile: ${error.message}`);
      }
      
      console.log('Database profile created successfully:', data);
      
      // Return the created user profile
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
      };
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  };

  // Helper function to handle user session - DATABASE ONLY
  const handleUserSession = async (authUser: any) => {
    try {
      console.log('Handling user session for:', authUser.id);

      // Try to fetch existing user profile from database
      let userProfile = await fetchUserProfile(authUser.id);
      
      if (!userProfile) {
        console.log('No profile found in database, creating new profile...');
        userProfile = await createUserProfile(authUser);
      }

      if (userProfile) {
        console.log('Setting user profile from database:', userProfile);
        setCurrentUser(userProfile);
      } else {
        console.error('Failed to get or create user profile in database');
        // Don't sign out - just log the error
      }
    } catch (error) {
      console.error('Error handling user session:', error);
      // Don't sign out - just log the error
    }
  };

  useEffect(() => {
    // Check active session on mount
    const getSession = async () => {
      try {
        console.log('Getting initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }

        if (session?.user) {
          console.log('Found active session for user:', session.user.id);
          await handleUserSession(session.user);
        } else {
          console.log('No active session found');
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
        console.log('User signed in, handling session...');
        await handleUserSession(session.user);
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out, clearing profile');
        setCurrentUser(null);
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        // Handle token refresh - ensure user profile is still loaded
        if (!currentUser) {
          await handleUserSession(session.user);
        }
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
      console.log('Attempting login for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        console.error('Login error:', error);
        throw new Error(error.message);
      }

      if (data.user) {
        console.log('Auth login successful for user:', data.user.id);
        
        // Check if user exists in database
        const userProfile = await fetchUserProfile(data.user.id);
        
        if (!userProfile) {
          console.log('User not found in database, signing out');
          await supabase.auth.signOut();
          throw new Error('Account not found. Please contact support or register a new account.');
        }

        console.log('User found in database, login successful');
        // The auth state change listener will handle setting the user profile
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
      console.log('Attempting registration for:', email);
      
      // First, sign up the user with Supabase Auth - NO EMAIL CONFIRMATION
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            name: name.trim(),
            subscription_tier: subscriptionTier,
          },
          // Explicitly disable email confirmation
          emailRedirectTo: undefined,
        },
      });

      if (authError) {
        console.error('Registration error:', authError);
        throw new Error(authError.message);
      }

      if (authData.user) {
        console.log('Auth user created:', authData.user.id);
        
        // Always create profile immediately - no email confirmation required
        console.log('Creating profile in database...');
        const userProfile = await createUserProfile(authData.user);
        
        if (userProfile) {
          setCurrentUser(userProfile);
        }
        
        return { emailConfirmationRequired: false };
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
      console.log('Logging out user...');
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        throw error;
      }
      
      console.log('User logged out successfully');
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

      console.log('Updating profile with:', updates);

      // Prepare database updates
      const dbUpdates: any = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.bio !== undefined) dbUpdates.bio = updates.bio;
      if (updates.profilePicture !== undefined) dbUpdates.profile_picture = updates.profilePicture;
      if (updates.socialLinks !== undefined) dbUpdates.social_links = updates.socialLinks;
      if (updates.subscription_tier !== undefined) dbUpdates.subscription_tier = updates.subscription_tier;

      // Always update the updated_at timestamp
      dbUpdates.updated_at = new Date().toISOString();

      console.log('Database updates to apply:', dbUpdates);

      // Update user profile in database
      const { error: dbError } = await supabase
        .from('users')
        .update(dbUpdates)
        .eq('id', currentUser.id);

      if (dbError) {
        console.error('Database update error:', dbError);
        throw dbError;
      }

      console.log('Database profile updated successfully');

      // Update auth user metadata if name changed
      if (updates.name) {
        const { error: authError } = await supabase.auth.updateUser({
          data: { name: updates.name },
        });
        if (authError) {
          console.error('Auth metadata update error:', authError);
          // Don't throw here as the database was updated successfully
        }
      }

      // Update local state
      const updatedUser = { 
        ...currentUser, 
        ...updates, 
        updated_at: new Date() 
      };
      
      console.log('Updated user state:', updatedUser);
      setCurrentUser(updatedUser);
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