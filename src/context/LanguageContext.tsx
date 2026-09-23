import { useEffect, useState, type ReactNode } from 'react';
import { LanguageContext, dictionaries, type Language } from './languageContextValue';

const STORAGE_KEY = 'vs_admin_language';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'hi' ? 'hi' : 'en';
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // Private browsing can block storage; language just won't persist across visits.
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: dictionaries[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}
