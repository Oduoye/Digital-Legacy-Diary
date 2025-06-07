import React, { createContext, useContext, useState, useEffect } from 'react';
import { DiaryEntry, TrustedContact } from '../types';
import { useAuth } from './AuthContext';
import { generateLifeStory } from '../utils/lifeStoryWeaver';

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

  // Load data from localStorage when user changes
  useEffect(() => {
    if (currentUser) {
      const savedEntries = localStorage.getItem(`diaryEntries_${currentUser.id}`);
      const savedContacts = localStorage.getItem(`trustedContacts_${currentUser.id}`);
      
      if (savedEntries) {
        try {
          const parsedEntries = JSON.parse(savedEntries).map((entry: any) => ({
            ...entry,
            createdAt: new Date(entry.createdAt),
            updatedAt: new Date(entry.updatedAt),
          }));
          setEntries(parsedEntries);
        } catch (error) {
          console.error('Error loading diary entries:', error);
        }
      }
      
      if (savedContacts) {
        try {
          setTrustedContacts(JSON.parse(savedContacts));
        } catch (error) {
          console.error('Error loading trusted contacts:', error);
        }
      }
    } else {
      setEntries([]);
      setTrustedContacts([]);
    }
  }, [currentUser]);

  // Save entries to localStorage whenever they change
  useEffect(() => {
    if (currentUser && entries.length >= 0) {
      localStorage.setItem(`diaryEntries_${currentUser.id}`, JSON.stringify(entries));
    }
  }, [entries, currentUser]);

  // Save contacts to localStorage whenever they change
  useEffect(() => {
    if (currentUser && trustedContacts.length >= 0) {
      localStorage.setItem(`trustedContacts_${currentUser.id}`, JSON.stringify(trustedContacts));
    }
  }, [trustedContacts, currentUser]);

  const addEntry = async (entry: Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    if (!currentUser) throw new Error('No user logged in');
    
    const newEntry: DiaryEntry = {
      id: crypto.randomUUID(),
      ...entry,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: currentUser.id,
    };
    setEntries(prev => [newEntry, ...prev]);
  };

  const updateEntry = async (id: string, updates: Partial<DiaryEntry>) => {
    setEntries(prev => prev.map(entry => 
      entry.id === id 
        ? { ...entry, ...updates, updatedAt: new Date() }
        : entry
    ));
  };

  const deleteEntry = async (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const getEntry = (id: string) => {
    return entries.find(entry => entry.id === id);
  };

  const addTrustedContact = async (contact: Omit<TrustedContact, 'id'>) => {
    const newContact: TrustedContact = {
      id: crypto.randomUUID(),
      ...contact
    };
    setTrustedContacts(prev => [...prev, newContact]);
  };

  const removeTrustedContact = async (id: string) => {
    setTrustedContacts(prev => prev.filter(contact => contact.id !== id));
  };

  const updateTrustedContact = async (id: string, updates: Partial<TrustedContact>) => {
    setTrustedContacts(prev => prev.map(contact => 
      contact.id === id ? { ...contact, ...updates } : contact
    ));
  };

  const generateLifeStoryInsights = async () => {
    if (!currentUser || entries.length === 0) return;

    const lifeStory = generateLifeStory(entries);
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