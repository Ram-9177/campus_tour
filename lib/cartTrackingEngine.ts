import { cartRoute } from '@/data/cartRoute';
import { campusLocations } from '@/data/campusLocations';
import { calculateDistance } from '@/lib/mapUtils';
import type { CartTrackingState } from '@/types/cartTracking';

const UPDATE_INTERVAL_MS = 2000;
const MIN_ACCEPTABLE_ACCURACY_METERS = 60;
const HIGH_CONFIDENCE_DISTANCE_METERS = 45;
const ASSUMED_CART_SPEED_MPS = 3.3;

type Listener = (state: CartTrackingState) => void;

type RouteStop = {
  id: string;
  lat: number;
  lng: number;
  order: number;
};

class CartTrackingEngine {
  private state: CartTrackingState = {
    source: 'user_gps',
    status: 'idle',
    confidence: 'low',
    latitude: null,
    longitude: null,
    accuracy: null,
    timestamp: null,
    currentStopId: null,
    nextStopId: null,
    progress: 0,
    etaSeconds: null,
    lastUpdatedAt: null,
    error: null,
  };

  private listeners: Listener[] = [];
  private watchId: number | null = null;
  private routeStops: RouteStop[] = cartRoute
    .map((stop, idx) => {
      const loc = campusLocations.find((l) => l.id === stop.locationId);
      if (!loc) return null;
      return { id: stop.id, lat: loc.latitude, lng: loc.longitude, order: idx };
    })
    .filter((s): s is RouteStop => s !== null);

  subscribe(fn: Listener) {
    this.listeners.push(fn);
    fn(this.state);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  getState() {
    return { ...this.state };
  }

  private emit() {
    this.listeners.forEach((l) => l(this.getState()));
  }

  async start() {
    if (!navigator.geolocation) {
      this.state.status = 'gps_unavailable';
      this.state.error = 'Geolocation not supported';
      this.emit();
      return false;
    }
    if (this.watchId !== null) return true;

    this.state.status = 'tracking';
    this.state.error = null;
    this.emit();

    this.watchId = navigator.geolocation.watchPosition(
      (position) => this.onPosition(position),
      (error) => this.onError(error),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: UPDATE_INTERVAL_MS,
      }
    );
    return true;
  }

  pause() {
    if (this.state.status === 'tracking') {
      this.state.status = 'paused';
      this.emit();
    }
  }

  resume() {
    if (this.state.status === 'paused') {
      this.state.status = 'tracking';
      this.emit();
    }
  }

  stop() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    this.state.status = 'idle';
    this.state.error = null;
    this.emit();
  }

  private onPosition(position: GeolocationPosition) {
    const { latitude, longitude, accuracy } = position.coords;
    const timestamp = position.timestamp;

    this.state.latitude = latitude;
    this.state.longitude = longitude;
    this.state.accuracy = accuracy;
    this.state.timestamp = timestamp;
    this.state.lastUpdatedAt = Date.now();

    const nearest = this.findNearestStop(latitude, longitude);
    if (!nearest) {
      this.state.confidence = 'low';
      this.state.error = 'No route stops available';
      this.emit();
      return;
    }

    const highConfidence =
      nearest.distanceMeters <= HIGH_CONFIDENCE_DISTANCE_METERS &&
      accuracy <= MIN_ACCEPTABLE_ACCURACY_METERS;

    this.state.confidence = highConfidence ? 'high' : 'low';
    this.state.currentStopId = nearest.stop.id;

    const nextIndex = (nearest.stop.order + 1) % this.routeStops.length;
    const nextStop = this.routeStops[nextIndex];
    this.state.nextStopId = nextStop?.id ?? null;
    this.state.progress = ((nearest.stop.order + 1) / this.routeStops.length) * 100;

    if (nextStop) {
      const toNextKm = calculateDistance(
        { lat: latitude, lng: longitude },
        { lat: nextStop.lat, lng: nextStop.lng }
      );
      this.state.etaSeconds = Math.round((toNextKm * 1000) / ASSUMED_CART_SPEED_MPS);
    } else {
      this.state.etaSeconds = null;
    }

    this.state.error = null;
    if (this.state.status !== 'paused') this.state.status = 'tracking';
    this.emit();
  }

  private onError(error: GeolocationPositionError) {
    if (error.code === error.PERMISSION_DENIED) {
      this.state.status = 'gps_denied';
      this.state.error = 'Location permission denied';
    } else if (error.code === error.TIMEOUT) {
      this.state.error = 'Location request timed out';
    } else {
      this.state.error = error.message || 'Unknown geolocation error';
    }
    this.emit();
  }

  private findNearestStop(lat: number, lng: number) {
    if (this.routeStops.length === 0) return null;
    let best: { stop: RouteStop; distanceMeters: number } | null = null;

    for (const stop of this.routeStops) {
      const km = calculateDistance({ lat, lng }, { lat: stop.lat, lng: stop.lng });
      const meters = km * 1000;
      if (!best || meters < best.distanceMeters) {
        best = { stop, distanceMeters: meters };
      }
    }
    return best;
  }
}

const cartTrackingEngine = new CartTrackingEngine();
export default cartTrackingEngine;
