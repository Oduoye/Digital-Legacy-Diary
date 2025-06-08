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

// Local storage keys
const ENTRIES_KEY = 'digital_legacy_entries';
const CONTACTS_KEY = 'digital_legacy_contacts';

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

  const getUserKey = (key: string) => `${key}_${currentUser?.id}`;

  const loadEntries = () => {
    if (!currentUser) return;
    
    const stored = localStorage.getItem(getUserKey(ENTRIES_KEY));
    if (stored) {
      const parsedEntries = JSON.parse(stored).map((entry: any) => ({
        ...entry,
        createdAt: new Date(entry.createdAt),
        updatedAt: new Date(entry.updatedAt),
      }));
      setEntries(parsedEntries);
    }
  };

  const saveEntries = (newEntries: DiaryEntry[]) => {
    if (!currentUser) return;
    localStorage.setItem(getUserKey(ENTRIES_KEY), JSON.stringify(newEntries));
  };

  const loadTrustedContacts = () => {
    if (!currentUser) return;
    
    const stored = localStorage.getItem(getUserKey(CONTACTS_KEY));
    if (stored) {
      setTrustedContacts(JSON.parse(stored));
    }
  };

  const saveTrustedContacts = (newContacts: TrustedContact[]) => {
    if (!currentUser) return;
    localStorage.setItem(getUserKey(CONTACTS_KEY), JSON.stringify(newContacts));
  };

  const addEntry = async (entry: Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    if (!currentUser) throw new Error('No user logged in');
    
    const newEntry: DiaryEntry = {
      id: crypto.randomUUID(),
      ...entry,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: currentUser.id,
    };

    const newEntries = [newEntry, ...entries];
    setEntries(newEntries);
    saveEntries(newEntries);
  };

  const updateEntry = async (id: string, updates: Partial<DiaryEntry>) => {
    const newEntries = entries.map(entry => 
      entry.id === id 
        ? { ...entry, ...updates, updatedAt: new Date() }
        : entry
    );
    setEntries(newEntries);
    saveEntries(newEntries);
  };

  const deleteEntry = async (id: string) => {
    const newEntries = entries.filter(entry => entry.id !== id);
    setEntries(newEntries);
    saveEntries(newEntries);
  };

  const getEntry = (id: string) => {
    return entries.find(entry => entry.id === id);
  };

  const addTrustedContact = async (contact: Omit<TrustedContact, 'id'>) => {
    if (!currentUser) throw new Error('No user logged in');

    const newContact: TrustedContact = {
      id: crypto.randomUUID(),
      ...contact,
    };

    const newContacts = [...trustedContacts, newContact];
    setTrustedContacts(newContacts);
    saveTrustedContacts(newContacts);
  };

  const removeTrustedContact = async (id: string) => {
    const newContacts = trustedContacts.filter(contact => contact.id !== id);
    setTrustedContacts(newContacts);
    saveTrustedContacts(newContacts);
  };

  const updateTrustedContact = async (id: string, updates: Partial<TrustedContact>) => {
    const newContacts = trustedContacts.map(contact => 
      contact.id === id ? { ...contact, ...updates } : contact
    );
    setTrustedContacts(newContacts);
    saveTrustedContacts(newContacts);
  };

  const generateLifeStoryInsights = async () => {
    if (!currentUser || entries.length === 0) return;

    const lifeStory = generateLifeStory(entries);
    
    // Update local user profile
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