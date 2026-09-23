import { useLanguage } from '../hooks/useLanguage';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  return (
    <button
      type="button"
      onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
      aria-label="Toggle language"
      className="rounded-md px-2 py-1 text-sm font-medium text-brand-blue hover:bg-brand-bg"
    >
      {language === 'en' ? 'हिं' : 'EN'}
    </button>
  );
}
