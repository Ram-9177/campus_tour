'use client';

import { useCallback, useEffect, useState } from 'react';
import type { TourSession } from '@/types/tourSession';
import { getTourSession, patchTourSession, resetTourSession, setTourSession } from '@/lib/tourSession';

export function useTourSession() {
  const [session, setSession] = useState<TourSession | null>(null);

  useEffect(() => {
    setSession(getTourSession());
  }, []);

  const set = useCallback((next: TourSession) => {
    const updated = setTourSession(next);
    setSession(updated);
    return updated;
  }, []);

  const patch = useCallback((nextPatch: Partial<TourSession>) => {
    const updated = patchTourSession(nextPatch);
    setSession(updated);
    return updated;
  }, []);

  const reset = useCallback(() => {
    const updated = resetTourSession();
    setSession(updated);
    return updated;
  }, []);

  const get = useCallback(() => {
    const current = getTourSession();
    setSession(current);
    return current;
  }, []);

  return { session, get, set, patch, reset };
}
