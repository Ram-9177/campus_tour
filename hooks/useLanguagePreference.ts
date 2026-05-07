'use client';

import { useCallback } from 'react';
import { useTourSession } from '@/hooks/useTourSession';
import type { AppLanguage } from '@/types/appRules';
import audioEngine from '@/lib/audioGuideEngine';

export function useLanguagePreference() {
  const { session, patch } = useTourSession();

  const setLanguage = useCallback((lang: AppLanguage) => {
    // 1. Update Session
    patch({ language: lang });
    
    // 2. Sync Audio Engine
    // The AudioGuideEngine already listens for 'smru_tour_session_updated' 
    // and syncs language from session in its constructor/handler.
    // However, if audio is playing, it might need specific handling to restart in new lang.
    audioEngine.setLanguage(lang);
  }, [patch]);

  return {
    language: session?.language || 'en',
    setLanguage,
  };
}
