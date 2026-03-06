'use client';

import type { ReactNode } from 'react';
import type { Locale, Translations } from './translations';

import { useMemo, useState, useContext, useCallback, createContext } from 'react';

import { translations } from './translations';

// ======================================================================
// CONTEXT
// ======================================================================

interface LanguageContextType {
  locale: Locale;
  t: Translations;
  toggleLocale: () => void;
  setLocale: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: 'fr',
  t: translations.fr,
  toggleLocale: () => {},
  setLocale: () => {},
});

// ======================================================================
// PROVIDER
// ======================================================================

interface LanguageProviderProps {
  children: ReactNode;
  defaultLocale?: Locale;
}

export function LanguageProvider({ children, defaultLocale = 'fr' }: LanguageProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  const toggleLocale = useCallback(() => {
    setLocaleState((prev) => (prev === 'fr' ? 'en' : 'fr'));
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
  }, []);

  const t = useMemo(() => translations[locale], [locale]);

  const value = useMemo(
    () => ({ locale, t, toggleLocale, setLocale }),
    [locale, t, toggleLocale, setLocale]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

// ======================================================================
// HOOK
// ======================================================================

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
