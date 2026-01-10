import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Settings as SettingsType } from '../types';
import { GetSettings, UpdateSettings } from '../../wailsjs/go/main/App';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings: setSettings, setAuthenticated } = useApp();
  const [localSettings, setLocalSettings] = useState<SettingsType>(settings);
  const navigate = useNavigate();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await GetSettings();
      const s = JSON.parse(data) as SettingsType;
      setLocalSettings(s);
      setSettings(s);
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const handleLanguageChange = (lang: string) => {
    const newSettings = { ...localSettings, language: lang };
    setLocalSettings(newSettings);
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleThemeChange = (theme: string) => {
    const newSettings = { ...localSettings, theme: theme };
    setLocalSettings(newSettings);
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const saveSettings = async (newSettings: SettingsType) => {
    try {
      await UpdateSettings(JSON.stringify(newSettings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const handleSignOut = () => {
    setAuthenticated(false);
    navigate('/login');
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="flex h-screen overflow-hidden">
        <aside className="w-64 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between p-6 bg-white dark:bg-slate-900">
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white">
                <span className="material-symbols-outlined fill-icon">shield_lock</span>
              </div>
              <div className="flex flex-col">
                <h1 className="text-slate-900 dark:text-white text-base font-bold leading-none">Realm</h1>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-normal">Passwd Manager</p>
              </div>
            </div>
            <nav className="flex flex-col gap-2">
              <a
                onClick={() => navigate('/main')}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined">grid_view</span>
                <span className="text-sm font-medium">Dashboard</span>
              </a>
              <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary dark:bg-primary/20 transition-colors cursor-pointer">
                <span className="material-symbols-outlined fill-icon">settings</span>
                <span className="text-sm font-semibold">Settings</span>
              </a>
            </nav>
          </div>
          <div className="flex flex-col gap-2">
            <a
              onClick={handleSignOut}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined">logout</span>
              <span className="text-sm font-medium">Sign Out</span>
            </a>
          </div>
        </aside>
        <main className="flex-1 overflow-y-auto relative bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background-light to-background-light dark:from-primary/5 dark:via-background-dark dark:to-background-dark p-10">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-slate-900 dark:text-white text-[32px] font-bold tracking-tight">Settings</h1>
              <p className="text-slate-500 dark:text-slate-400 text-base">Manage your account preferences and application appearance.</p>
            </div>
            <div className="glass-panel rounded-2xl shadow-xl p-8 space-y-12">
              <section>
                <h2 className="text-slate-900 dark:text-white text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">language</span>
                  Language Preference
                </h2>
                <div className="max-w-md">
                  <div className="flex h-12 items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
                    <label className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-4 has-[:checked]:bg-white dark:has-[:checked]:bg-slate-700 has-[:checked]:shadow-sm has-[:checked]:text-primary text-slate-500 dark:text-slate-400 text-sm font-semibold transition-all">
                      <span>Chinese (简体中文)</span>
                      <input
                        type="radio"
                        name="lang"
                        value="zh"
                        checked={localSettings.language === 'zh'}
                        onChange={(e) => handleLanguageChange(e.target.value)}
                        className="hidden"
                      />
                    </label>
                    <label className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-4 has-[:checked]:bg-white dark:has-[:checked]:bg-slate-700 has-[:checked]:shadow-sm has-[:checked]:text-primary text-slate-500 dark:text-slate-400 text-sm font-semibold transition-all">
                      <span>English</span>
                      <input
                        type="radio"
                        name="lang"
                        value="en"
                        checked={localSettings.language === 'en'}
                        onChange={(e) => handleLanguageChange(e.target.value)}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </section>
              <section>
                <h2 className="text-slate-900 dark:text-white text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">palette</span>
                  Theme Mode
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group relative cursor-pointer">
                    <input
                      type="radio"
                      id="theme-light"
                      name="theme"
                      value="light"
                      checked={localSettings.theme === 'light'}
                      onChange={(e) => handleThemeChange(e.target.value)}
                      className="peer hidden"
                    />
                    <label
                      htmlFor="theme-light"
                      className="block p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 peer-checked:border-primary peer-checked:bg-primary/5 transition-all"
                    >
                      <div className="aspect-video rounded-lg mb-4 overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 p-2 flex flex-col gap-2">
                        <div className="flex gap-2">
                          <div className="w-8 h-2 rounded-full bg-slate-200"></div>
                          <div className="w-12 h-2 rounded-full bg-primary/30"></div>
                        </div>
                        <div className="flex-1 rounded-md bg-white shadow-sm p-2 space-y-2">
                          <div className="h-2 w-full bg-slate-100 rounded"></div>
                          <div className="h-2 w-3/4 bg-slate-100 rounded"></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Light Mode</span>
                        <span className="material-symbols-outlined text-primary opacity-0 peer-checked:opacity-100 transition-opacity">check_circle</span>
                      </div>
                    </label>
                  </div>
                  <div className="group relative cursor-pointer">
                    <input
                      type="radio"
                      id="theme-dark"
                      name="theme"
                      value="dark"
                      checked={localSettings.theme === 'dark'}
                      onChange={(e) => handleThemeChange(e.target.value)}
                      className="peer hidden"
                    />
                    <label
                      htmlFor="theme-dark"
                      className="block p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 peer-checked:border-primary peer-checked:bg-primary/5 transition-all"
                    >
                      <div className="aspect-video rounded-lg mb-4 overflow-hidden border border-slate-700 bg-slate-900 p-2 flex flex-col gap-2">
                        <div className="flex gap-2">
                          <div className="w-8 h-2 rounded-full bg-slate-700"></div>
                          <div className="w-12 h-2 rounded-full bg-primary/50"></div>
                        </div>
                        <div className="flex-1 rounded-md bg-slate-800 shadow-sm p-2 space-y-2">
                          <div className="h-2 w-full bg-slate-700 rounded"></div>
                          <div className="h-2 w-3/4 bg-slate-700 rounded"></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Dark Mode</span>
                        <span className="material-symbols-outlined text-primary opacity-0 peer-checked:opacity-100 transition-opacity">check_circle</span>
                      </div>
                    </label>
                  </div>
                </div>
              </section>
            </div>
            <footer className="flex justify-center pt-12 pb-10">
              <p className="text-slate-400 dark:text-slate-600 text-xs font-medium">
                © 2026 panyingyun. All rights reserved.
              </p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
};
