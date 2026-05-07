'use client';

import { useEffect, useMemo, useState } from 'react';
import mediaSync from '@/lib/mediaSyncEngine';
import { locationSequence, type TourProgress } from '@/lib/locationSequence';
import type { CampusLocation } from '@/types/campusLocation';
import { useTourSession } from './useTourSession';
import { resolveLocationExperience, type LocationExperience } from '@/lib/locationExperienceResolver';

export function useLocationExperience() {
  const { session } = useTourSession();
  const [currentLocation, setCurrentLocation] = useState<CampusLocation | null>(null);
  const [progress, setProgress] = useState<TourProgress>(locationSequence.getProgress());

  useEffect(() => {
    const unsubMedia = mediaSync.subscribe((loc) => {
      setCurrentLocation(loc || null);
      setProgress(locationSequence.getProgress());
    });

    return () => {
      unsubMedia();
    };
  }, []);

  const experience = useMemo((): LocationExperience | null => {
    if (!currentLocation || !session) return null;
    return resolveLocationExperience({
      location: currentLocation,
      mode: session.navigationMode,
      language: session.language
    });
  }, [currentLocation, session]);

  const goToNext = () => mediaSync.next();
  const goToPrev = () => mediaSync.prev();
  const skipCurrent = () => mediaSync.setCurrentByLocationId(null);
  const resetTour = () => {
    locationSequence.reset();
    mediaSync.setCurrentByLocationId(null);
    setProgress(locationSequence.getProgress());
  };

  return {
    currentLocation,
    experience,
    progress,
    goToNext,
    goToPrev,
    skipCurrent,
    resetTour
  };
}
