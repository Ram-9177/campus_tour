'use client';

import { useEffect, useRef } from 'react';
import mediaSync from '@/lib/mediaSyncEngine';
import audioEngine from '@/lib/audioGuideEngine';
import type { CampusLocation } from '@/types/campusLocation';
import { useTourSession } from '@/hooks/useTourSession';

export function useDelayedLocationAudio() {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastLocationIdRef = useRef<string | null>(null);
  const { session } = useTourSession();

  useEffect(() => {
    const unsub = mediaSync.subscribe((loc?: CampusLocation | null) => {
      // Clear any existing timer when location changes
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      if (!loc) {
        lastLocationIdRef.current = null;
        audioEngine.stop();
        return;
      }

      if (lastLocationIdRef.current === loc.id) {
        return;
      }
      lastLocationIdRef.current = loc.id;

      if (!audioEngine.getState().isAvailable) {
        return;
      }

      // Set a 2-second delay before playing
      timerRef.current = setTimeout(() => {
        const active = mediaSync.getCurrent();
        if (!active || active.id !== loc.id) {
          timerRef.current = null;
          return;
        }
        if (session?.audioStarted) {
          void audioEngine.play();
        }
        timerRef.current = null;
      }, 2000);
    });

    return () => {
      unsub();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [session?.audioStarted]);
}
