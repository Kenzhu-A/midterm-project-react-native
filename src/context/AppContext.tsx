import React, { createContext, useContext, useState, useEffect } from 'react';
import { Job } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppContextType {
  savedJobs: Job[];
  toggleSaveJob: (job: Job) => void;
  isSaved: (jobId: string) => boolean;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  colors: any;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    AsyncStorage.getItem('savedJobs').then(data => {
      if (data) setSavedJobs(JSON.parse(data));
    });
  }, []);

  const toggleSaveJob = (job: Job) => {
    setSavedJobs(prev => {
      const exists = prev.find(j => j.id === job.id);
      let newList;
      if (exists) {
        newList = prev.filter(j => j.id !== job.id); 
      } else {
        newList = [...prev, job]; 
      }
      AsyncStorage.setItem('savedJobs', JSON.stringify(newList));
      return newList;
    });
  };

  const isSaved = (id: string) => !!savedJobs.find(j => j.id === id);
  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  // Corporate UI Palette
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
    <AppContext.Provider value={{ savedJobs, toggleSaveJob, isSaved, theme, toggleTheme, colors }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};