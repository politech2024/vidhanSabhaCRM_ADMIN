import { createContext } from 'react';
import { en } from '../locales/en';
import { hi } from '../locales/hi';

export type Language = 'en' | 'hi';
export type Dictionary = typeof en;

export const dictionaries: Record<Language, Dictionary> = { en, hi };

export interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Dictionary;
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);
