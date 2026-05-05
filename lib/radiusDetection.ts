// Radius detection - detects when user enters a location's radius
// Remembers which locations have been triggered to avoid repeats

import type { CampusLocation } from '@/types/campusLocation';
import locationEngine from './locationEngine';

type RadiusDetectionState = {
  nearbyLocationId: string | null;
  distance: number | null;
  triggeredLocationIds: Set<string>;
};

type RadiusDetectionListener = (state: RadiusDetectionState) => void;

// Calculate distance between two lat/lon points in meters (Haversine formula)
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

class RadiusDetectionEngine {
  private state: RadiusDetectionState = {
    nearbyLocationId: null,
    distance: null,
    triggeredLocationIds: new Set(),
  };

  private listeners: RadiusDetectionListener[] = [];
  private locations: CampusLocation[] = [];
  private locationEngineUnsubscribe: (() => void) | null = null;

  subscribe(fn: RadiusDetectionListener) {
    this.listeners.push(fn);
    fn(this.state);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  private emit() {
    this.listeners.forEach((l) =>
      l({
        ...this.state,
        triggeredLocationIds: new Set(this.state.triggeredLocationIds),
      })
    );
  }

  // Initialize with list of campus locations
  initialize(locations: CampusLocation[]) {
    this.locations = locations.filter((loc) => loc.active && loc.latitude && loc.longitude);

    // Subscribe to location engine
    this.locationEngineUnsubscribe = locationEngine.subscribe((locState) => {
      this.detectNearby(locState.latitude, locState.longitude);
    });
  }

  private detectNearby(userLat: number | null, userLon: number | null) {
    if (userLat === null || userLon === null) {
      this.state.nearbyLocationId = null;
      this.state.distance = null;
      this.emit();
      return;
    }

    let nearestLocation: CampusLocation | null = null;
    let minDistance = Infinity;

    // Find the nearest active location
    for (const loc of this.locations) {
      if (loc.latitude === undefined || loc.longitude === undefined) continue;

      const distance = calculateDistance(userLat, userLon, loc.latitude, loc.longitude);

      // Check if user is within location's radius
      if (distance <= loc.radiusMeters && distance < minDistance) {
        nearestLocation = loc;
        minDistance = distance;
      }
    }

    // Update state - only set if location hasn't been triggered yet
    if (
      nearestLocation &&
      !this.state.triggeredLocationIds.has(nearestLocation.id)
    ) {
      this.state.nearbyLocationId = nearestLocation.id;
      this.state.distance = minDistance;
      // Mark as triggered so we don't show it again
      this.state.triggeredLocationIds.add(nearestLocation.id);
    } else if (!nearestLocation) {
      this.state.nearbyLocationId = null;
      this.state.distance = null;
    }

    this.emit();
  }

  // Manual replay - show a location again
  replayLocation(locationId: string) {
    this.state.triggeredLocationIds.delete(locationId);
    // Trigger detection again immediately
    const locState = locationEngine.getState();
    if (locState.latitude !== null && locState.longitude !== null) {
      this.detectNearby(locState.latitude, locState.longitude);
    }
  }

  // Get current state
  getState() {
    return {
      ...this.state,
      triggeredLocationIds: new Set(this.state.triggeredLocationIds),
    };
  }

  // Cleanup
  destroy() {
    if (this.locationEngineUnsubscribe) {
      this.locationEngineUnsubscribe();
    }
    this.listeners = [];
  }
}

const radiusDetectionEngine = new RadiusDetectionEngine();
export default radiusDetectionEngine;
