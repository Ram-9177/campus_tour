'use client';

import { useEffect, useState } from 'react';
import mediaSync from '@/lib/mediaSyncEngine';
import { locationSequence, type TourProgress } from '@/lib/locationSequence';
import type { CampusLocation } from '@/types/campusLocation';

export function useLocationExperience() {
  const [currentLocation, setCurrentLocation] = useState<CampusLocation | null>(null);
  const [progress, setProgress] = useState<TourProgress>(locationSequence.getProgress());

  useEffect(() => {
    const unsubMedia = mediaSync.subscribe((loc) => {
      setCurrentLocation(loc || null);
      // Refresh progress whenever location changes (as it marks visited/skipped)
      setProgress(locationSequence.getProgress());
    });

    return () => {
      unsubMedia();
    };
  }, []);

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
    progress,
    goToNext,
    goToPrev,
    skipCurrent,
    resetTour
  };
}
