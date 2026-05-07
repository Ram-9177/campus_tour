'use client';

import { useTourSession } from '@/hooks/useTourSession';
import type { AppLanguage } from '@/types/appRules';

export function useSelectedLanguage() {
  const { session } = useTourSession();
  const language = (session?.language || 'en') as AppLanguage;

  const t = (localizedText: { en: string; te?: string; hi?: string } | undefined | null, fallback?: string) => {
    if (!localizedText) return fallback || '';
    
    const val = localizedText[language];
    if (val && val.trim().length > 0) return val;
    
    // If it's English and missing, return fallback or empty
    if (language === 'en') return localizedText.en || fallback || '';
    
    // If selected language (te, hi) is missing:
    return 'Content coming soon in selected language.';
  };

  return { language, t };
}
