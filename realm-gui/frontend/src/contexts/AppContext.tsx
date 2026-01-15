import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Settings } from '../types';

interface AppContextType {
  isAuthenticated: boolean;
  settings: Settings;
  setAuthenticated: (value: boolean) => void;
  updateSettings: (settings: Settings) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Get system default language
const getSystemLanguage = (): string => {
  try {
    const lang = navigator.language || (navigator as any).userLanguage || 'en';
    // Check if language starts with "zh" (Chinese)
    if (lang.toLowerCase().startsWith('zh')) {
      return 'zh';
    }
  } catch (error) {
    console.error('Failed to detect system language:', error);
  }
  return 'en';
};

// Get system default theme
const getSystemTheme = (): string => {
  try {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  } catch (error) {
    console.error('Failed to detect system theme:', error);
  }
  return 'light';
};

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
        // If parsing fails, use system defaults
        return { language: getSystemLanguage(), theme: getSystemTheme() };
      }
    }
    // If no saved settings, use system defaults
    return { language: getSystemLanguage(), theme: getSystemTheme() };
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
