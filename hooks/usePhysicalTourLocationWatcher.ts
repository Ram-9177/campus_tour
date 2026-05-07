'use client';

import { useEffect, useState } from 'react';
import { useTourSession } from './useTourSession';
import locationEngine from '@/lib/locationEngine';
import { locationTriggerEngine } from '@/lib/locationTriggerEngine';

export function usePhysicalTourLocationWatcher() {
  const { session } = useTourSession();
  const [gps, setGps] = useState(locationEngine.getState());

  useEffect(() => {
    const unsub = locationEngine.subscribe(setGps);
    return unsub;
  }, []);

  useEffect(() => {
    const isPhysical = session?.navigationMode === 'campus_cart' || 
                       session?.navigationMode === 'walk_with_me' || 
                       session?.navigationMode === 'manual_explore';

    if (session?.campusAccessDecision !== 'inside-campus' || !isPhysical) return;
    if (gps.latitude === null || gps.longitude === null) return;

    locationTriggerEngine.processUpdate(gps.latitude, gps.longitude);
  }, [gps.latitude, gps.longitude, session?.campusAccessDecision, session?.navigationMode]);

  return gps;
}
