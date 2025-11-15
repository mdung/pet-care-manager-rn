import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '@/types/i18n';
import { setLanguage, getLanguage } from '@/services/i18n/i18n';
import { settingsStorage } from '@/services/storage/settingsStorage';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: string, params?: any) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const settings = await settingsStorage.get();
      const lang = (settings as any).language || 'en';
      setLanguageState(lang);
      setLanguage(lang);
    } catch (error) {
      console.error('Error loading language:', error);
    }
  };

  const changeLanguage = async (lang: Language) => {
    try {
      setLanguageState(lang);
      setLanguage(lang);
      const settings = await settingsStorage.get();
      await settingsStorage.save({ ...settings, language: lang } as any);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const t = (key: string, params?: any): string => {
    const { translate } = require('@/services/i18n/i18n');
    return translate(key, params);
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

