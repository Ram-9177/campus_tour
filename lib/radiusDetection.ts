import { getDistance } from './haversine';
import type { CampusLocation } from '@/types/campusLocation';

export const POINT_ARRIVAL_RADIUS_METERS = 30; // Meters to trigger arrival
export const MAIN_GATE_RADIUS_METERS = 50; // Special radius for starting tour

export function isUserAtPoint(
  userLat: number,
  userLon: number,
  location: CampusLocation,
  customRadius?: number
): boolean {
  const dist = getDistance(
    userLat,
    userLon,
    location.latitude,
    location.longitude
  );
  return dist <= (customRadius || POINT_ARRIVAL_RADIUS_METERS);
}

export function findNearestPoint(
  userLat: number,
  userLon: number,
  locations: CampusLocation[]
): { location: CampusLocation; distance: number } | null {
  if (locations.length === 0) return null;

  let nearest = null;
  let minDist = Infinity;

  for (const loc of locations) {
    const dist = getDistance(
      userLat,
      userLon,
      loc.latitude,
      loc.longitude
    );
    if (dist < minDist) {
      minDist = dist;
      nearest = loc;
    }
  }

  return nearest ? { location: nearest, distance: minDist } : null;
}
