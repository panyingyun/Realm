import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Login } from '../../wailsjs/go/main/App';
import { useI18n } from '../i18n';

export const LoginPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, setAuthenticated, settings, updateSettings } = useApp();
  const { t, lang } = useI18n();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/main');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async () => {
    if (!password.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      // Call backend login (empty implementation)
      const success = await Login('user', password);
      if (success) {
        setAuthenticated(true);
        navigate('/main');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = () => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light';
    updateSettings({ ...settings, theme: newTheme });
  };

  const toggleLanguage = () => {
    const newLang = settings.language === 'en' ? 'zh' : 'en';
    updateSettings({ ...settings, language: newLang });
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white min-h-screen relative overflow-hidden">
      <div className="blob top-[-10%] left-[-10%]"></div>
      <div className="blob bottom-[-10%] right-[-10%]"></div>
      <div className="blob top-[30%] right-[10%] bg-indigo-500/10"></div>
      <div className="relative flex h-screen w-full flex-col">
        <div className="layout-container flex h-full grow flex-col">
          <header className="flex items-center justify-between whitespace-nowrap px-10 py-5 w-full max-w-[1200px] mx-auto">
            <div className="flex items-center gap-4">
              <div className="size-8 text-primary">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z" fill="currentColor"></path>
                </svg>
              </div>
              <h2 className="text-lg font-bold leading-tight tracking-tight">{t.login.title}</h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-white/50 dark:bg-white/10 rounded-xl p-1 border border-white/20">
                <button
                  onClick={toggleLanguage}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    lang === 'en' ? 'bg-white dark:bg-white/20 shadow-sm text-primary' : 'text-slate-400 hover:text-primary'
                  }`}
                >
                  EN
                </button>
                <div className="w-[1px] h-3 bg-slate-300 dark:bg-slate-700 mx-1"></div>
                <button
                  onClick={toggleLanguage}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    lang === 'zh' ? 'bg-white dark:bg-white/20 shadow-sm text-primary' : 'text-slate-400 hover:text-primary'
                  }`}
                >
                  中文
                </button>
              </div>
              <button
                onClick={toggleTheme}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/50 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 transition-all border border-white/20"
              >
                <span className="material-symbols-outlined text-xl">dark_mode</span>
              </button>
            </div>
          </header>
          <main className="flex-1 flex items-center justify-center px-4">
            <div className="glass-card w-full max-w-[480px] rounded-xl p-10 shadow-2xl flex flex-col gap-8">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <span className="material-symbols-outlined text-white text-4xl">lock</span>
                </div>
                <div className="text-center">
                  <h1 className="text-slate-900 dark:text-white text-[32px] font-bold leading-tight">{t.login.title}</h1>
                  <p className="text-slate-500 dark:text-slate-400 text-base font-normal mt-2">{t.login.subtitle}</p>
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="flex flex-col w-full">
                    <p className="text-slate-900 dark:text-white text-sm font-semibold leading-normal pb-2 px-1">{t.login.masterPassword}</p>
                    <div className="flex w-full items-stretch rounded-xl group">
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 focus:border-primary h-14 placeholder:text-slate-400 p-[15px] text-base font-normal leading-normal transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                  </label>
                  <div className="flex justify-between px-1">
                    <button className="text-xs text-slate-500 hover:text-primary transition-colors font-medium">{t.login.forgotPassword}</button>
                    <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                      <span className="material-symbols-outlined text-xs">verified_user</span>
                      {t.login.encrypted}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogin}
                  disabled={isLoading || !password.trim()}
                  className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-5 bg-primary text-white gap-3 text-base font-bold leading-normal tracking-[0.015em] shadow-lg shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined">lock_open</span>
                  <span>{isLoading ? t.login.unlocking : t.login.unlockVault}</span>
                </button>
              </div>
              <div className="border-t border-slate-200 dark:border-white/10 pt-6 text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {t.login.notYourVault}
                  <a className="text-primary font-bold hover:underline ml-1" href="#">{t.login.switchAccount}</a>
                </p>
              </div>
            </div>
          </main>
          <footer className="p-6 text-center">
            <p className="text-xs text-slate-400 font-medium">
              @2026 panyingyun. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};
