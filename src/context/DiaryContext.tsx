import React, { createContext, useContext, useState, useEffect } from 'react';
import { DiaryEntry, TrustedContact, Will } from '../types';
import { useAuth } from './AuthContext';
import { generateLifeStory } from '../utils/lifeStoryWeaver';
import { supabase } from '../lib/supabase';

interface DiaryContextType {
  entries: DiaryEntry[];
  trustedContacts: TrustedContact[];
  wills: Will[];
  addEntry: (entry: Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => Promise<void>;
  updateEntry: (id: string, entry: Partial<DiaryEntry>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  getEntry: (id: string) => DiaryEntry | undefined;
  addTrustedContact: (contact: Omit<TrustedContact, 'id'>) => Promise<void>;
  removeTrustedContact: (id: string) => Promise<void>;
  updateTrustedContact: (id: string, contact: Partial<TrustedContact>) => Promise<void>;
  addWill: (will: Omit<Will, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => Promise<void>;
  updateWill: (id: string, will: Partial<Will>) => Promise<void>;
  deleteWill: (id: string) => Promise<void>;
  getWill: (id: string) => Will | undefined;
  generateLifeStoryInsights: () => Promise<void>;
}

const DiaryContext = createContext<DiaryContextType>({
  entries: [],
  trustedContacts: [],
  wills: [],
  addEntry: async () => {},
  updateEntry: async () => {},
  deleteEntry: async () => {},
  getEntry: () => undefined,
  addTrustedContact: async () => {},
  removeTrustedContact: async () => {},
  updateTrustedContact: async () => {},
  addWill: async () => {},
  updateWill: async () => {},
  deleteWill: async () => {},
  getWill: () => undefined,
  generateLifeStoryInsights: async () => {},
});

export const useDiary = () => useContext(DiaryContext);

// Helper function to convert database entry to app entry
const convertDbEntryToAppEntry = (dbEntry: any): DiaryEntry => {
  return {
    id: dbEntry.id,
    title: dbEntry.title,
    content: dbEntry.content,
    tags: dbEntry.tags || [],
    images: dbEntry.images || [],
    createdAt: new Date(dbEntry.created_at),
    updatedAt: new Date(dbEntry.updated_at),
    userId: dbEntry.user_id,
  };
};

// Helper function to convert database contact to app contact
const convertDbContactToAppContact = (dbContact: any): TrustedContact => {
  return {
    id: dbContact.id,
    name: dbContact.name,
    email: dbContact.email,
    relationship: dbContact.relationship || '',
    picture: dbContact.picture,
  };
};

// Helper function to convert database will to app will
const convertDbWillToAppWill = (dbWill: any): Will => {
  return {
    id: dbWill.id,
    userId: dbWill.user_id,
    title: dbWill.title,
    content: dbWill.content,
    attachments: dbWill.attachments || [],
    createdAt: new Date(dbWill.created_at),
    updatedAt: new Date(dbWill.updated_at),
    isActive: dbWill.is_active,
  };
};

export const DiaryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, updateProfile } = useAuth();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [trustedContacts, setTrustedContacts] = useState<TrustedContact[]>([]);
  const [wills, setWills] = useState<Will[]>([]);

  // Load data when user changes
  useEffect(() => {
    if (currentUser) {
      loadEntries();
      loadTrustedContacts();
      loadWills();
    } else {
      setEntries([]);
      setTrustedContacts([]);
      setWills([]);
    }
  }, [currentUser]);

  const loadEntries = async () => {
    if (!currentUser) return;
    
    try {
      const { data, error } = await supabase
        .from('diary_entries')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading entries:', error);
        return;
      }

      if (data) {
        setEntries(data.map(convertDbEntryToAppEntry));
      }
    } catch (error) {
      console.error('Error in loadEntries:', error);
    }
  };

  const loadTrustedContacts = async () => {
    if (!currentUser) return;
    
    try {
      const { data, error } = await supabase
        .from('trusted_contacts')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading trusted contacts:', error);
        return;
      }

      if (data) {
        setTrustedContacts(data.map(convertDbContactToAppContact));
      }
    } catch (error) {
      console.error('Error in loadTrustedContacts:', error);
    }
  };

  const loadWills = async () => {
    if (!currentUser) return;
    
    try {
      const { data, error } = await supabase
        .from('wills')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading wills:', error);
        return;
      }

      if (data) {
        setWills(data.map(convertDbWillToAppWill));
      }
    } catch (error) {
      console.error('Error in loadWills:', error);
    }
  };

  const addEntry = async (entry: Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    if (!currentUser) throw new Error('No user logged in');
    
    const now = new Date().toISOString();
    const dbEntry = {
      title: entry.title,
      content: entry.content,
      tags: entry.tags,
      images: entry.images,
      user_id: currentUser.id,
      created_at: now,
      updated_at: now,
    };

    const { data, error } = await supabase
      .from('diary_entries')
      .insert(dbEntry)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    if (data) {
      const newEntry = convertDbEntryToAppEntry(data);
      setEntries(prev => [newEntry, ...prev]);
    }
  };

  const updateEntry = async (id: string, updates: Partial<DiaryEntry>) => {
    if (!currentUser) throw new Error('No user logged in');

    const dbUpdates: any = {
      updated_at: new Date().toISOString(),
    };

    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.content !== undefined) dbUpdates.content = updates.content;
    if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
    if (updates.images !== undefined) dbUpdates.images = updates.images;

    const { error } = await supabase
      .from('diary_entries')
      .update(dbUpdates)
      .eq('id', id)
      .eq('user_id', currentUser.id);

    if (error) {
      throw new Error(error.message);
    }

    setEntries(prev => prev.map(entry => 
      entry.id === id 
        ? { ...entry, ...updates, updatedAt: new Date() }
        : entry
    ));
  };

  const deleteEntry = async (id: string) => {
    if (!currentUser) throw new Error('No user logged in');

    const { error } = await supabase
      .from('diary_entries')
      .delete()
      .eq('id', id)
      .eq('user_id', currentUser.id);

    if (error) {
      throw new Error(error.message);
    }

    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const getEntry = (id: string) => {
    return entries.find(entry => entry.id === id);
  };

  const addTrustedContact = async (contact: Omit<TrustedContact, 'id'>) => {
    if (!currentUser) throw new Error('No user logged in');

    const now = new Date().toISOString();
    const dbContact = {
      name: contact.name,
      email: contact.email,
      relationship: contact.relationship,
      picture: contact.picture,
      user_id: currentUser.id,
      created_at: now,
      updated_at: now,
    };

    const { data, error } = await supabase
      .from('trusted_contacts')
      .insert(dbContact)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    if (data) {
      const newContact = convertDbContactToAppContact(data);
      setTrustedContacts(prev => [...prev, newContact]);
    }
  };

  const removeTrustedContact = async (id: string) => {
    if (!currentUser) throw new Error('No user logged in');

    const { error } = await supabase
      .from('trusted_contacts')
      .delete()
      .eq('id', id)
      .eq('user_id', currentUser.id);

    if (error) {
      throw new Error(error.message);
    }

    setTrustedContacts(prev => prev.filter(contact => contact.id !== id));
  };

  const updateTrustedContact = async (id: string, updates: Partial<TrustedContact>) => {
    if (!currentUser) throw new Error('No user logged in');

    const dbUpdates: any = {
      updated_at: new Date().toISOString(),
    };

    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.email !== undefined) dbUpdates.email = updates.email;
    if (updates.relationship !== undefined) dbUpdates.relationship = updates.relationship;
    if (updates.picture !== undefined) dbUpdates.picture = updates.picture;

    const { error } = await supabase
      .from('trusted_contacts')
      .update(dbUpdates)
      .eq('id', id)
      .eq('user_id', currentUser.id);

    if (error) {
      throw new Error(error.message);
    }

    setTrustedContacts(prev => prev.map(contact => 
      contact.id === id ? { ...contact, ...updates } : contact
    ));
  };

  const addWill = async (will: Omit<Will, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    if (!currentUser) throw new Error('No user logged in');

    const now = new Date().toISOString();
    const dbWill = {
      title: will.title,
      content: will.content,
      attachments: will.attachments,
      is_active: will.isActive,
      user_id: currentUser.id,
      created_at: now,
      updated_at: now,
    };

    const { data, error } = await supabase
      .from('wills')
      .insert(dbWill)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    if (data) {
      const newWill = convertDbWillToAppWill(data);
      setWills(prev => [newWill, ...prev]);
    }
  };

  const updateWill = async (id: string, updates: Partial<Will>) => {
    if (!currentUser) throw new Error('No user logged in');

    const dbUpdates: any = {
      updated_at: new Date().toISOString(),
    };

    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.content !== undefined) dbUpdates.content = updates.content;
    if (updates.attachments !== undefined) dbUpdates.attachments = updates.attachments;
    if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive;

    const { error } = await supabase
      .from('wills')
      .update(dbUpdates)
      .eq('id', id)
      .eq('user_id', currentUser.id);

    if (error) {
      throw new Error(error.message);
    }

    setWills(prev => prev.map(will => 
      will.id === id 
        ? { ...will, ...updates, updatedAt: new Date() }
        : will
    ));
  };

  const deleteWill = async (id: string) => {
    if (!currentUser) throw new Error('No user logged in');

    const { error } = await supabase
      .from('wills')
      .delete()
      .eq('id', id)
      .eq('user_id', currentUser.id);

    if (error) {
      throw new Error(error.message);
    }

    setWills(prev => prev.filter(will => will.id !== id));
  };

  const getWill = (id: string) => {
    return wills.find(will => will.id === id);
  };

  const generateLifeStoryInsights = async () => {
    if (!currentUser || entries.length === 0) return;

    const lifeStory = generateLifeStory(entries);
    
    // Update user profile with life story
    await updateProfile({ lifeStory });
  };

  return (
    <DiaryContext.Provider
      value={{
        entries,
        trustedContacts,
        wills,
        addEntry,
        updateEntry,
        deleteEntry,
        getEntry,
        addTrustedContact,
        removeTrustedContact,
        updateTrustedContact,
        addWill,
        updateWill,
        deleteWill,
        getWill,
        generateLifeStoryInsights,
      }}
    >
      {children}
    </DiaryContext.Provider>
  );
};