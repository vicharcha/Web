'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { TranslationService } from '@/lib/translation-service';

interface TranslationContextType {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  translate: (text: string, targetLang?: string) => Promise<string>;
}

const TranslationContext = createContext<TranslationContextType | null>(null);

export const TranslationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang) {
      setCurrentLanguage(savedLang);
    }
  }, []);

  const setLanguage = (lang: string) => {
    setCurrentLanguage(lang);
    localStorage.setItem('preferredLanguage', lang);
  };

  const translate = async (text: string, targetLang?: string) => {
    const lang = targetLang || currentLanguage;
    if (lang === 'en') return text;

    try {
      return await TranslationService.getInstance().translateText(text, { to: lang });
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  };

  return (
    <TranslationContext.Provider value={{ currentLanguage, setLanguage, translate }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

export const TranslatedText: React.FC<{
  text: string;
  lang?: string;
}> = ({ text, lang }) => {
  const { translate } = useTranslation();
  const [translatedText, setTranslatedText] = useState(text);

  useEffect(() => {
    translate(text, lang).then(setTranslatedText);
  }, [text, lang, translate]);

  return <>{translatedText}</>;
};

export const withTranslation = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  return function WrappedComponent(props: P) {
    const translation = useTranslation();
    return <Component {...props} translation={translation} />;
  };
};
