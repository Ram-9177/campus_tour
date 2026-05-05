'use client';

import { useEffect, useState } from 'react';
import type { AppLanguage } from '@/types/appRules';
import { getTourSession } from '@/lib/tourSession';

function readLanguage(): AppLanguage {
  return getTourSession().language;
}

export function useSelectedLanguage(): AppLanguage {
  const [language, setLanguage] = useState<AppLanguage>('en');

  useEffect(() => {
    const sync = () => setLanguage(readLanguage());
    sync();
    window.addEventListener('smru_tour_session_updated', sync);
    return () => window.removeEventListener('smru_tour_session_updated', sync);
  }, []);

  return language;
}
