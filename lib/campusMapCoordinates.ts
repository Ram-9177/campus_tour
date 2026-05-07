import { smruMapConfig } from '@/data/map/smruMapConfig';

export interface LatLng {
  lat: number;
  lng: number;
}

export interface PixelCoord {
  x: number;
  y: number;
}

/**
 * Convert geographical coordinates to pixel coordinates on canvas.
 * Assumes canvas covers the full campus bounds.
 */
export function latlngToPixel(latlng: LatLng, canvasWidth: number, canvasHeight: number): PixelCoord {
  const { minLat, maxLat, minLon, maxLon } = smruMapConfig.bounds;

  // Normalize to 0-1
  const normalizedX = (latlng.lng - minLon) / (maxLon - minLon);
  const normalizedY = (maxLat - latlng.lat) / (maxLat - minLat); // Flip Y for canvas

  // Clamp to bounds
  const x = Math.max(0, Math.min(canvasWidth, normalizedX * canvasWidth));
  const y = Math.max(0, Math.min(canvasHeight, normalizedY * canvasHeight));

  return { x, y };
}

/**
 * Convert pixel coordinates to geographical coordinates.
 */
export function pixelToLatlng(pixel: PixelCoord, canvasWidth: number, canvasHeight: number): LatLng {
  const { minLat, maxLat, minLon, maxLon } = smruMapConfig.bounds;

  // Normalize to 0-1
  const normalizedX = pixel.x / canvasWidth;
  const normalizedY = pixel.y / canvasHeight;

  // Convert back to latlng
  const lng = minLon + normalizedX * (maxLon - minLon);
  const lat = maxLat - normalizedY * (maxLat - minLat);

  return { lat, lng };
}

/**
 * Check if a point is within campus bounds.
 */
export function isWithinCampusBounds(latlng: LatLng): boolean {
  const { minLat, maxLat, minLon, maxLon } = smruMapConfig.bounds;
  return latlng.lat >= minLat && latlng.lat <= maxLat && latlng.lng >= minLon && latlng.lng <= maxLon;
}

/**
 * Get the bounds in pixel coordinates.
 */
export function getCampusBoundsPixels(canvasWidth: number, canvasHeight: number) {
  const { minLat, maxLat, minLon, maxLon } = smruMapConfig.bounds;
  const topLeft = latlngToPixel({ lat: maxLat, lng: minLon }, canvasWidth, canvasHeight);
  const bottomRight = latlngToPixel({ lat: minLat, lng: maxLon }, canvasWidth, canvasHeight);
  return { topLeft, bottomRight, width: bottomRight.x - topLeft.x, height: bottomRight.y - topLeft.y };
}
