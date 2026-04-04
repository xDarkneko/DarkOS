import { useStore } from '../store/useStore';
import { translations, TranslationKey } from '../i18n/translations';

export function useTranslation() {
  const language = useStore((state) => state.language);
  
  const t = (key: TranslationKey): string => {
    const value = translations[language][key];
    if (typeof value === 'string') {
      return value;
    }
    return key;
  };

  const tArray = (key: TranslationKey): string[] => {
    const value = translations[language][key];
    if (Array.isArray(value)) {
      return value;
    }
    return [];
  };

  return { t, tArray, language };
}