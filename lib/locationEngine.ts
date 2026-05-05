// Real-time user location tracking engine
// GPS is optional and only requested when user taps button

type LocationState = {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  timestamp: number | null;
  isRequesting: boolean;
  isDenied: boolean;
  error: string | null;
};

type LocationListener = (state: LocationState) => void;

class LocationEngine {
  private state: LocationState = {
    latitude: null,
    longitude: null,
    accuracy: null,
    timestamp: null,
    isRequesting: false,
    isDenied: false,
    error: null,
  };

  private listeners: LocationListener[] = [];
  private watchId: number | null = null;

  subscribe(fn: LocationListener) {
    this.listeners.push(fn);
    fn(this.state);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
      // Stop watching if no more listeners
      if (this.listeners.length === 0 && this.watchId !== null) {
        navigator.geolocation.clearWatch(this.watchId);
        this.watchId = null;
      }
    };
  }

  private emit() {
    this.listeners.forEach((l) => l(this.state));
  }

  // Request user location - only called when user explicitly taps button
  async requestLocation() {
    if (!navigator.geolocation) {
      this.state.error = 'Geolocation not supported';
      this.state.isDenied = true;
      this.emit();
      return;
    }

    this.state.isRequesting = true;
    this.emit();

    return new Promise<boolean>((resolve) => {
      const DESIRED_ACCURACY_METERS = 35;
      const MAX_WAIT_MS = 18000;
      let resolved = false;
      let bestPosition: GeolocationPosition | null = null;

      const finalize = (ok: boolean) => {
        if (resolved) return;
        resolved = true;
        resolve(ok);
      };

      const timeoutId = window.setTimeout(() => {
        this.state.isRequesting = false;
        if (bestPosition) {
          this.state.latitude = bestPosition.coords.latitude;
          this.state.longitude = bestPosition.coords.longitude;
          this.state.accuracy = bestPosition.coords.accuracy;
          this.state.timestamp = bestPosition.timestamp;
          this.state.error = null;
          this.state.isDenied = false;
          this.emit();
          finalize(true);
          return;
        }
        this.state.error = 'Could not fetch accurate location. Move to open sky and retry.';
        this.emit();
        finalize(false);
      }, MAX_WAIT_MS);

      // Use watchPosition for continuous updates
      this.watchId = navigator.geolocation.watchPosition(
        (position) => {
          if (!bestPosition || position.coords.accuracy < bestPosition.coords.accuracy) {
            bestPosition = position;
          }
          this.state.latitude = position.coords.latitude;
          this.state.longitude = position.coords.longitude;
          this.state.accuracy = position.coords.accuracy;
          this.state.timestamp = position.timestamp;
          this.state.isRequesting = false;
          this.state.error = null;
          this.state.isDenied = false;
          this.emit();
          if (!resolved && position.coords.accuracy <= DESIRED_ACCURACY_METERS) {
            window.clearTimeout(timeoutId);
            finalize(true);
          }
        },
        (error) => {
          this.state.isRequesting = false;
          if (error.code === error.PERMISSION_DENIED) {
            this.state.isDenied = true;
            this.state.error = 'Location permission denied';
            window.clearTimeout(timeoutId);
            this.emit();
            finalize(false);
            return;
          } else if (error.code === error.TIMEOUT) {
            this.state.error = 'Location request timed out';
          } else {
            this.state.error = error.message || 'Unknown error';
          }
          this.emit();
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  }

  // Stop watching location
  stopWatching() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    this.state = {
      latitude: null,
      longitude: null,
      accuracy: null,
      timestamp: null,
      isRequesting: false,
      isDenied: false,
      error: null,
    };
    this.emit();
  }

  resetPermissionState() {
    this.state = {
      ...this.state,
      isRequesting: false,
      isDenied: false,
      error: null,
    };
    this.emit();
  }

  // Manually set location (useful for simulation or debugging)
  setManualLocation(lat: number, lon: number, accuracy: number = 5) {
    // If we were watching real GPS, stop it
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }

    this.state = {
      ...this.state,
      latitude: lat,
      longitude: lon,
      accuracy,
      timestamp: Date.now(),
      isRequesting: false,
      error: null,
      isDenied: false,
    };
    this.emit();
  }

  getState() {
    return { ...this.state };
  }


  hasLocation() {
    return this.state.latitude !== null && this.state.longitude !== null;
  }
}

const locationEngine = new LocationEngine();
export default locationEngine;
