export type CartTrackingSource = 'user_gps';

export type CartTrackingStatus =
  | 'idle'
  | 'tracking'
  | 'paused'
  | 'gps_denied'
  | 'gps_unavailable';

export type CartTrackingConfidence = 'high' | 'low';

export interface CartTrackingState {
  source: CartTrackingSource;
  status: CartTrackingStatus;
  confidence: CartTrackingConfidence;
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  timestamp: number | null;
  currentStopId: string | null;
  nextStopId: string | null;
  progress: number;
  etaSeconds: number | null;
  lastUpdatedAt: number | null;
  error: string | null;
}
