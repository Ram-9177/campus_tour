import { findNearestPoint } from './radiusDetection';
import { LocationStore } from './locationStore';
import type { CampusLocation } from '@/types/campusLocation';

export function getNearestCampusPoint(
  lat: number,
  lon: number,
  allowedIds?: string[]
): CampusLocation | null {
  let locations = LocationStore.getAllLocations().filter(l => l.active);
  if (allowedIds && allowedIds.length > 0) {
    locations = locations.filter(l => allowedIds.includes(l.id));
  }

  const result = findNearestPoint(lat, lon, locations);
  return result?.location || null;
}
