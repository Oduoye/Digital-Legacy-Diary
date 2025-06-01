import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DiaryEntry, TrustedContact, User } from '../types';
import { useAuth } from './AuthContext';
import { generateLifeStory } from '../utils/lifeStoryWeaver';

interface DiaryContextType {
  entries: DiaryEntry[];
  trustedContacts: TrustedContact[];
  addEntry: (entry: Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => void;
  updateEntry: (id: string, entry: Partial<DiaryEntry>) => void;
  deleteEntry: (id: string) => void;
  getEntry: (id: string) => DiaryEntry | undefined;
  addTrustedContact: (contact: Omit<TrustedContact, 'id'>) => void;
  removeTrustedContact: (id: string) => void;
  updateTrustedContact: (id: string, contact: Partial<TrustedContact>) => void;
  generateLifeStoryInsights: () => void;
}

const DiaryContext = createContext<DiaryContextType>({
  entries: [],
  trustedContacts: [],
  addEntry: () => {},
  updateEntry: () => {},
  deleteEntry: () => {},
  getEntry: () => undefined,
  addTrustedContact: () => {},
  removeTrustedContact: () => {},
  updateTrustedContact: () => {},
  generateLifeStoryInsights: () => {},
});

export const useDiary = () => useContext(DiaryContext);

export const DiaryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, updateProfile } = useAuth();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [trustedContacts, setTrustedContacts] = useState<TrustedContact[]>([]);

  // Load entries from localStorage on initial render
  useEffect(() => {
    if (currentUser) {
      const storedEntries = localStorage.getItem(`diary_entries_${currentUser.id}`);
      const storedContacts = localStorage.getItem(`trusted_contacts_${currentUser.id}`);
      
      if (storedEntries) {
        try {
          const parsedEntries = JSON.parse(storedEntries);
          // Convert string dates back to Date objects
          setEntries(parsedEntries.map((entry: any) => ({
            ...entry,
            createdAt: new Date(entry.createdAt),
            updatedAt: new Date(entry.updatedAt),
          })));
        } catch (error) {
          console.error('Failed to parse stored entries', error);
          setEntries([]);
        }
      }
      
      if (storedContacts) {
        try {
          setTrustedContacts(JSON.parse(storedContacts));
        } catch (error) {
          console.error('Failed to parse stored contacts', error);
          setTrustedContacts([]);
        }
      }
    } else {
      setEntries([]);
      setTrustedContacts([]);
    }
  }, [currentUser]);

  // Save entries to localStorage whenever they change
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`diary_entries_${currentUser.id}`, JSON.stringify(entries));
    }
  }, [entries, currentUser]);

  // Save trusted contacts to localStorage whenever they change, excluding picture data
  useEffect(() => {
    if (currentUser) {
      try {
        // Create a new array of contacts without the picture data
        const contactsForStorage = trustedContacts.map(({ picture, ...contact }) => ({
          ...contact,
          // Set picture to null to indicate it was removed for storage
          picture: null
        }));
        
        localStorage.setItem(
          `trusted_contacts_${currentUser.id}`, 
          JSON.stringify(contactsForStorage)
        );
      } catch (error) {
        console.error('Failed to save trusted contacts to localStorage:', error);
      }
    }
  }, [trustedContacts, currentUser]);

  const addEntry = (entry: Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    if (!currentUser) return;
    
    const newEntry: DiaryEntry = {
      ...entry,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: currentUser.id,
    };
    
    setEntries([newEntry, ...entries]);
  };

  const updateEntry = (id: string, updates: Partial<DiaryEntry>) => {
    setEntries(
      entries.map((entry) =>
        entry.id === id
          ? { ...entry, ...updates, updatedAt: new Date() }
          : entry
      )
    );
  };

  const deleteEntry = (id: string) => {
    setEntries(entries.filter((entry) => entry.id !== id));
  };

  const getEntry = (id: string) => {
    return entries.find((entry) => entry.id === id);
  };

  const addTrustedContact = (contact: Omit<TrustedContact, 'id'>) => {
    const newContact = {
      ...contact,
      id: uuidv4(),
    };
    setTrustedContacts([...trustedContacts, newContact]);
  };

  const removeTrustedContact = (id: string) => {
    setTrustedContacts(trustedContacts.filter((contact) => contact.id !== id));
  };

  const updateTrustedContact = (id: string, updates: Partial<TrustedContact>) => {
    setTrustedContacts(
      trustedContacts.map((contact) =>
        contact.id === id ? { ...contact, ...updates } : contact
      )
    );
  };

  const generateLifeStoryInsights = () => {
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