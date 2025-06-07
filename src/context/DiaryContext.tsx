import React, { createContext, useContext, useState, useEffect } from 'react';
import { DiaryEntry, TrustedContact } from '../types';
import { useAuth } from './AuthContext';
import { generateLifeStory } from '../utils/lifeStoryWeaver';
import { supabase } from '../lib/supabase';

interface DiaryContextType {
  entries: DiaryEntry[];
  trustedContacts: TrustedContact[];
  addEntry: (entry: Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => Promise<void>;
  updateEntry: (id: string, entry: Partial<DiaryEntry>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  getEntry: (id: string) => DiaryEntry | undefined;
  addTrustedContact: (contact: Omit<TrustedContact, 'id'>) => Promise<void>;
  removeTrustedContact: (id: string) => Promise<void>;
  updateTrustedContact: (id: string, contact: Partial<TrustedContact>) => Promise<void>;
  generateLifeStoryInsights: () => Promise<void>;
}

const DiaryContext = createContext<DiaryContextType>({
  entries: [],
  trustedContacts: [],
  addEntry: async () => {},
  updateEntry: async () => {},
  deleteEntry: async () => {},
  getEntry: () => undefined,
  addTrustedContact: async () => {},
  removeTrustedContact: async () => {},
  updateTrustedContact: async () => {},
  generateLifeStoryInsights: async () => {},
});

export const useDiary = () => useContext(DiaryContext);

export const DiaryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, updateProfile } = useAuth();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [trustedContacts, setTrustedContacts] = useState<TrustedContact[]>([]);

  // Load data when user changes
  useEffect(() => {
    if (currentUser) {
      loadEntries();
      loadTrustedContacts();
    } else {
      setEntries([]);
      setTrustedContacts([]);
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

      if (error) throw error;

      const formattedEntries = data.map(entry => ({
        ...entry,
        createdAt: new Date(entry.created_at),
        updatedAt: new Date(entry.updated_at),
        userId: entry.user_id,
      }));

      setEntries(formattedEntries);
    } catch (error) {
      console.error('Error loading entries:', error);
    }
  };

  const loadTrustedContacts = async () => {
    if (!currentUser) return;

    try {
      const { data, error } = await supabase
        .from('trusted_contacts')
        .select('*')
        .eq('user_id', currentUser.id);

      if (error) throw error;

      setTrustedContacts(data || []);
    } catch (error) {
      console.error('Error loading trusted contacts:', error);
    }
  };

  const addEntry = async (entry: Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    if (!currentUser) throw new Error('No user logged in');
    
    const { data, error } = await supabase
      .from('diary_entries')
      .insert({
        user_id: currentUser.id,
        title: entry.title,
        content: entry.content,
        tags: entry.tags,
        images: entry.images,
      })
      .select()
      .single();

    if (error) throw error;

    const newEntry: DiaryEntry = {
      id: data.id,
      title: data.title,
      content: data.content,
      tags: data.tags,
      images: data.images,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      userId: data.user_id,
    };

    setEntries(prev => [newEntry, ...prev]);
  };

  const updateEntry = async (id: string, updates: Partial<DiaryEntry>) => {
    const { error } = await supabase
      .from('diary_entries')
      .update({
        title: updates.title,
        content: updates.content,
        tags: updates.tags,
        images: updates.images,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) throw error;

    setEntries(prev => prev.map(entry => 
      entry.id === id 
        ? { ...entry, ...updates, updatedAt: new Date() }
        : entry
    ));
  };

  const deleteEntry = async (id: string) => {
    const { error } = await supabase
      .from('diary_entries')
      .delete()
      .eq('id', id);

    if (error) throw error;

    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const getEntry = (id: string) => {
    return entries.find(entry => entry.id === id);
  };

  const addTrustedContact = async (contact: Omit<TrustedContact, 'id'>) => {
    if (!currentUser) throw new Error('No user logged in');

    const { data, error } = await supabase
      .from('trusted_contacts')
      .insert({
        user_id: currentUser.id,
        name: contact.name,
        email: contact.email,
        relationship: contact.relationship,
        picture: contact.picture,
      })
      .select()
      .single();

    if (error) throw error;

    setTrustedContacts(prev => [...prev, data]);
  };

  const removeTrustedContact = async (id: string) => {
    const { error } = await supabase
      .from('trusted_contacts')
      .delete()
      .eq('id', id);

    if (error) throw error;

    setTrustedContacts(prev => prev.filter(contact => contact.id !== id));
  };

  const updateTrustedContact = async (id: string, updates: Partial<TrustedContact>) => {
    const { error } = await supabase
      .from('trusted_contacts')
      .update({
        name: updates.name,
        email: updates.email,
        relationship: updates.relationship,
        picture: updates.picture,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) throw error;

    setTrustedContacts(prev => prev.map(contact => 
      contact.id === id ? { ...contact, ...updates } : contact
    ));
  };

  const generateLifeStoryInsights = async () => {
    if (!currentUser || entries.length === 0) return;

    const lifeStory = generateLifeStory(entries);
    
    // Update the database
    const { error } = await supabase
      .from('users')
      .update({
        life_story_last_generated: lifeStory.lastGenerated.toISOString(),
        life_story_narrative: lifeStory.narrative,
        life_story_themes: lifeStory.themes,
        life_story_timeline: lifeStory.timeline,
        life_story_relationships: lifeStory.relationships,
        life_story_values: lifeStory.values,
      })
      .eq('id', currentUser.id);

    if (error) {
      console.error('Error updating life story:', error);
      throw error;
    }

    // Update local state
    updateProfile({ lifeStory });
  };

  return (
    <DiaryContext.Provider
      value={{
        entries,
        trustedContacts,
        addEntry,
        updateEntry,
        deleteEntry,
        getEntry,
        addTrustedContact,
        removeTrustedContact,
        updateTrustedContact,
        generateLifeStoryInsights,
      }}
    >
      {children}
    </DiaryContext.Provider>
  );
};