import React, { createContext, useContext, useState, useEffect } from 'react';
import { Job } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppContextType {
  savedJobs: Job[];
  toggleSaveJob: (job: Job) => void;
  isSaved: (job: Job) => boolean; 
  appliedJobs: string[];
  applyForJob: (job: Job) => void; 
  hasApplied: (job: Job) => boolean; 
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  colors: any;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    AsyncStorage.getItem('savedJobs').then(data => {
      if (data) setSavedJobs(JSON.parse(data));
    });
    AsyncStorage.getItem('appliedJobs').then(data => {
      if (data) setAppliedJobs(JSON.parse(data));
    });
  }, []);

  // Creates a stable key to prevent duplicates if mock API changes IDs
  const getStableKey = (job: Job) => `${job.title}-${job.company}`;

  const toggleSaveJob = (job: Job) => {
    setSavedJobs(prev => {
      const exists = prev.find(j => getStableKey(j) === getStableKey(job));
      let newList;
      if (exists) {
        newList = prev.filter(j => getStableKey(j) !== getStableKey(job)); 
      } else {
        newList = [...prev, job]; 
      }
      AsyncStorage.setItem('savedJobs', JSON.stringify(newList));
      return newList;
    });
  };

  const isSaved = (job: Job) => !!savedJobs.find(j => getStableKey(j) === getStableKey(job));

  const applyForJob = (job: Job) => {
    setAppliedJobs(prev => {
      const key = getStableKey(job);
      if (prev.includes(key)) return prev;
      const newList = [...prev, key];
      AsyncStorage.setItem('appliedJobs', JSON.stringify(newList));
      return newList;
    });
  };

  const hasApplied = (job: Job) => appliedJobs.includes(getStableKey(job));

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  const colors = theme === 'light' 
    ? { 
        background: '#F4F5F7', card: '#FFFFFF', text: '#172B4D', 
        secondaryText: '#5E6C84', primary: '#0052CC', error: '#DE350B', border: '#DFE1E6' 
      }
    : { 
        background: '#091E42', card: '#1B2E4B', text: '#FFFFFF', 
        secondaryText: '#97A0AF', primary: '#4C9AFF', error: '#FF5630', border: '#2C3E5D' 
      };

  return (
    <AppContext.Provider value={{ savedJobs, toggleSaveJob, isSaved, appliedJobs, applyForJob, hasApplied, theme, toggleTheme, colors }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};