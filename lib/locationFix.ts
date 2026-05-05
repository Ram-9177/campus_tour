export type LocationFixError = 'unsupported' | 'permission_denied' | 'timeout' | 'unavailable';

export interface LocationFixResult {
  position: GeolocationPosition | null;
  error: LocationFixError | null;
}

interface LocationFixOptions {
  desiredAccuracyMeters?: number;
  timeoutMs?: number;
}

const DEFAULT_DESIRED_ACCURACY_METERS = 35;
const DEFAULT_TIMEOUT_MS = 18000;

export function getBestLocationFix(options: LocationFixOptions = {}): Promise<LocationFixResult> {
  const desiredAccuracyMeters = options.desiredAccuracyMeters ?? DEFAULT_DESIRED_ACCURACY_METERS;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    return Promise.resolve({ position: null, error: 'unsupported' });
  }

  return new Promise<LocationFixResult>((resolve) => {
    let done = false;
    let best: GeolocationPosition | null = null;
    let watchId: number | null = null;

    const finish = (result: LocationFixResult) => {
      if (done) return;
      done = true;
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
      resolve(result);
    };

    const timer = window.setTimeout(() => {
      if (best) {
        finish({ position: best, error: null });
        return;
      }
      finish({ position: null, error: 'timeout' });
    }, timeoutMs);

    watchId = navigator.geolocation.watchPosition(
      (position) => {
        if (!best || position.coords.accuracy < best.coords.accuracy) {
          best = position;
        }
        if ((best?.coords.accuracy ?? Number.POSITIVE_INFINITY) <= desiredAccuracyMeters) {
          window.clearTimeout(timer);
          finish({ position: best, error: null });
        }
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          window.clearTimeout(timer);
          finish({ position: null, error: 'permission_denied' });
          return;
        }

        if (best) return;
        window.clearTimeout(timer);
        finish({ position: null, error: 'unavailable' });
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 12000,
      }
    );
  });
}
