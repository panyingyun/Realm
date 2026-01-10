import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Settings } from '../types';

interface AppContextType {
  isAuthenticated: boolean;
  settings: Settings;
  setAuthenticated: (value: boolean) => void;
  updateSettings: (settings: Settings) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Use sessionStorage to remember login state during app session
  // sessionStorage is automatically cleared when the app is closed
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('isAuthenticated') === 'true';
  });

  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return { language: 'en', theme: 'light' };
      }
    }
    return { language: 'en', theme: 'light' };
  });

  // Save authentication state to sessionStorage (cleared on app close)
  useEffect(() => {
    if (isAuthenticated) {
      sessionStorage.setItem('isAuthenticated', 'true');
    } else {
      sessionStorage.removeItem('isAuthenticated');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  // Apply theme on mount and when settings change
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  const updateSettings = (newSettings: Settings) => {
    setSettings(newSettings);
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        settings,
        setAuthenticated: setIsAuthenticated,
        updateSettings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
