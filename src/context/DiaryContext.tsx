import React, { createContext, useContext, useState, useEffect } from 'react';
import { DiaryEntry, TrustedContact, User } from '../types';
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

  // Load entries and contacts when user changes
  useEffect(() => {
    if (currentUser) {
      fetchEntries();
      fetchContacts();
    } else {
      setEntries([]);
      setTrustedContacts([]);
    }
  }, [currentUser]);

  const fetchEntries = async () => {
    if (!currentUser) return;

    try {
      const { data, error } = await supabase
        .from('diary_entries')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setEntries(data.map(entry => ({
        ...entry,
        createdAt: new Date(entry.created_at),
        updatedAt: new Date(entry.updated_at),
      })));
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  const fetchContacts = async () => {
    if (!currentUser) return;

    try {
      const { data, error } = await supabase
        .from('trusted_contacts')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setTrustedContacts(data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const addEntry = async (entry: Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    if (!currentUser) return;

    try {
      const { data, error } = await supabase
        .from('diary_entries')
        .insert([{
          ...entry,
          user_id: currentUser.id,
        }])
        .select()
        .single();

      if (error) throw error;

      setEntries(prev => [{
        ...data,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      }, ...prev]);
    } catch (error) {
      console.error('Error adding entry:', error);
      throw error;
    }
  };

  const updateEntry = async (id: string, updates: Partial<DiaryEntry>) => {
    if (!currentUser) return;

    try {
      const { data, error } = await supabase
        .from('diary_entries')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', currentUser.id)
        .select()
        .single();

      if (error) throw error;

      setEntries(prev => prev.map(entry => 
        entry.id === id 
          ? {
              ...data,
              createdAt: new Date(data.created_at),
              updatedAt: new Date(data.updated_at),
            }
          : entry
      ));
    } catch (error) {
      console.error('Error updating entry:', error);
      throw error;
    }
  };

  const deleteEntry = async (id: string) => {
    if (!currentUser) return;

    try {
      const { error } = await supabase
        .from('diary_entries')
        .delete()
        .eq('id', id)
        .eq('user_id', currentUser.id);

      if (error) throw error;

      setEntries(prev => prev.filter(entry => entry.id !== id));
    } catch (error) {
      console.error('Error deleting entry:', error);
      throw error;
    }
  };

  const getEntry = (id: string) => {
    return entries.find(entry => entry.id === id);
  };

  const addTrustedContact = async (contact: Omit<TrustedContact, 'id'>) => {
    if (!currentUser) return;

    try {
      const { data, error } = await supabase
        .from('trusted_contacts')
        .insert([{
          ...contact,
          user_id: currentUser.id,
        }])
        .select()
        .single();

      if (error) throw error;

      setTrustedContacts(prev => [...prev, data]);
    } catch (error) {
      console.error('Error adding contact:', error);
      throw error;
    }
  };

  const removeTrustedContact = async (id: string) => {
    if (!currentUser) return;

    try {
      const { error } = await supabase
        .from('trusted_contacts')
        .delete()
        .eq('id', id)
        .eq('user_id', currentUser.id);

      if (error) throw error;

      setTrustedContacts(prev => prev.filter(contact => contact.id !== id));
    } catch (error) {
      console.error('Error removing contact:', error);
      throw error;
    }
  };

  const updateTrustedContact = async (id: string, updates: Partial<TrustedContact>) => {
    if (!currentUser) return;

    try {
      const { data, error } = await supabase
        .from('trusted_contacts')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', currentUser.id)
        .select()
        .single();

      if (error) throw error;

      setTrustedContacts(prev => prev.map(contact => 
        contact.id === id ? data : contact
      ));
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  };

  const generateLifeStoryInsights = async () => {
    if (!currentUser || entries.length === 0) return;

    try {
      const lifeStory = generateLifeStory(entries);
      
      const { error } = await supabase
        .from('users')
        .update({
          life_story_last_generated: lifeStory.lastGenerated.toISOString(),
          life_story_narrative: lifeStory.narrative,
          life_story_themes: lifeStory.themes,
          life_story_timeline: lifeStory.timeline,
          life_story_relationships: lifeStory.relationships,
          life_story_values: lifeStory.values,
          updated_at: new Date().toISOString(),
        })
        .eq('id', currentUser.id);

      if (error) throw error;

      updateProfile({ 
        lifeStory: {
          ...lifeStory,
          lastGenerated: new Date(lifeStory.lastGenerated),
        }
      });
    } catch (error) {
      console.error('Error generating life story:', error);
      throw error;
    }
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