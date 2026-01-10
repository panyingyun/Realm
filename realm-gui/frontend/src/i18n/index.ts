import { zh } from './zh';
import { en } from './en';
import { useApp } from '../contexts/AppContext';

export type TranslationKey = keyof typeof zh;

export const translations = {
  zh,
  en,
};

export type Language = 'zh' | 'en';

export const useI18n = () => {
  const { settings } = useApp();
  const lang: Language = (settings.language === 'zh' ? 'zh' : 'en') as Language;
  const t = translations[lang];

  return { t, lang };
};
