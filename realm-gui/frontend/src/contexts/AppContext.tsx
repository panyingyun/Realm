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
  // Always start with unauthenticated state - force login on every app start
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

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

  // Note: isAuthenticated is NOT saved to localStorage - user must login every time

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
