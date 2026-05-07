import { smruMapConfig } from '@/data/map/smruMapConfig';
import { calculateDistance } from '@/lib/mapUtils';

export type CampusGeofenceDecision = 'inside-campus' | 'outside-campus';

export interface CampusGeofenceAssessment {
  decision: CampusGeofenceDecision;
  isInsideCampus: boolean;
  isInsideBecauseOfAccuracyBuffer: boolean;
  distanceToCampusMeters: number;
  accuracyBufferMeters: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function isInsideCampusBounds(latitude: number, longitude: number): boolean {
  const { minLat, maxLat, minLon, maxLon } = smruMapConfig.bounds;
  return latitude >= minLat && latitude <= maxLat && longitude >= minLon && longitude <= maxLon;
}

function distanceToCampusBoundsMeters(latitude: number, longitude: number): number {
  const { minLat, maxLat, minLon, maxLon } = smruMapConfig.bounds;
  const clampedLatitude = clamp(latitude, minLat, maxLat);
  const clampedLongitude = clamp(longitude, minLon, maxLon);
  return calculateDistance({ lat: latitude, lng: longitude }, { lat: clampedLatitude, lng: clampedLongitude }) * 1000;
}

export function assessCampusGeofence(latitude: number, longitude: number, accuracyMeters = 0): CampusGeofenceAssessment {
  const accuracyBufferMeters = Math.max(0, accuracyMeters || 0);
  const insideCampusBounds = isInsideCampusBounds(latitude, longitude);
  const distanceToCampusMeters = distanceToCampusBoundsMeters(latitude, longitude);
  const isInsideBecauseOfAccuracyBuffer = !insideCampusBounds && distanceToCampusMeters <= accuracyBufferMeters;
  const isInsideCampus = insideCampusBounds || isInsideBecauseOfAccuracyBuffer;

  return {
    decision: isInsideCampus ? 'inside-campus' : 'outside-campus',
    isInsideCampus,
    isInsideBecauseOfAccuracyBuffer,
    distanceToCampusMeters,
    accuracyBufferMeters,
  };
}