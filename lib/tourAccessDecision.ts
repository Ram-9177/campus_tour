import type { AppTourMode } from '@/types/appRules';
import type { LocationFixError, LocationFixResult } from '@/lib/locationFix';
import { assessCampusGeofence } from '@/lib/campusGeofence';

export type CampusAccessDecision = 
  | 'inside-campus' 
  | 'outside-campus' 
  | 'location-denied'
  | 'location-unavailable'
  | 'location-timeout'
  | 'unsupported'
  | 'unknown-location';

export interface TourAccessOutcome {
  decision: CampusAccessDecision;
  message: string;
  allowedModes: AppTourMode[];
  canTryAgain: boolean;
}

const INSIDE_CAMPUS_MODES: AppTourMode[] = ['campus_cart', 'walk_with_me', 'manual_explore', 'virtual_tour'];
const VIRTUAL_ONLY_MODES: AppTourMode[] = ['virtual_tour'];

function formatDistance(distanceMeters: number): string {
  if (distanceMeters < 1000) {
    return `${Math.max(0, Math.round(distanceMeters))} m`;
  }
  return `${(distanceMeters / 1000).toFixed(1)} km`;
}

function mapErrorToDecision(error: LocationFixError | null): CampusAccessDecision {
  switch (error) {
    case 'permission_denied': return 'location-denied';
    case 'unavailable': return 'location-unavailable';
    case 'timeout': return 'location-timeout';
    case 'unsupported': return 'unsupported';
    default: return 'unknown-location';
  }
}

function getErrorMessage(error: LocationFixError | null): string {
  switch (error) {
    case 'permission_denied':
      return 'Location access is blocked. Please allow location access in your browser settings to use guided features.';
    case 'timeout':
      return 'We could not get your location in time. This can happen if you are indoors or have a weak GPS signal.';
    case 'unsupported':
      return 'Your browser does not support location features. You can still enjoy the Virtual Tour.';
    default:
      return 'We could not confirm your location. Please try again or continue with the Virtual Tour.';
  }
}

export function decideTourAccess(fix: LocationFixResult): TourAccessOutcome {
  if (!fix.position) {
    const decision = mapErrorToDecision(fix.error);
    return {
      decision,
      message: getErrorMessage(fix.error),
      allowedModes: VIRTUAL_ONLY_MODES,
      canTryAgain: decision !== 'unsupported',
    };
  }

  const { latitude, longitude, accuracy } = fix.position.coords;
  const geofence = assessCampusGeofence(latitude, longitude, accuracy);

  if (geofence.isInsideCampus) {
    return {
      decision: 'inside-campus',
      message: 'You are on campus. All guided tour modes are unlocked.',
      allowedModes: INSIDE_CAMPUS_MODES,
      canTryAgain: false,
    };
  }

  return {
    decision: 'outside-campus',
    message: `You are about ${formatDistance(geofence.distanceToCampusMeters)} outside the campus. Only the Virtual Tour is available.`,
    allowedModes: VIRTUAL_ONLY_MODES,
    canTryAgain: true,
  };
}