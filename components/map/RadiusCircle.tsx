'use client';

import type { CampusLocation } from '@/types/campusLocation';

interface RadiusCircleProps {
  location: CampusLocation;
  svgWidth: number;
  svgHeight: number;
  mapBounds: {
    minLat: number;
    maxLat: number;
    minLon: number;
    maxLon: number;
  };
  userLat?: number | null;
  userLon?: number | null;
  isTriggered?: boolean;
}

export default function RadiusCircle({
  location,
  svgWidth,
  svgHeight,
  mapBounds,
  userLat,
  userLon,
  isTriggered,
}: RadiusCircleProps) {
  // Skip if location doesn't have coordinates
  if (
    location.latitude === undefined ||
    location.longitude === undefined ||
    location.latitude === null ||
    location.longitude === null
  ) {
    return null;
  }

  // Convert lat/lon to SVG coordinates
  const cx =
    ((location.longitude - mapBounds.minLon) /
      (mapBounds.maxLon - mapBounds.minLon)) *
    svgWidth;
  const cy =
    ((mapBounds.maxLat - location.latitude) /
      (mapBounds.maxLat - mapBounds.minLat)) *
    svgHeight;

  // Convert radius from meters to SVG units
  // Assuming ~111 km per degree of latitude
  const latPerPixel = (mapBounds.maxLat - mapBounds.minLat) / svgHeight;
  const metersPerPixel = latPerPixel * 111000;
  const radiusPixels = location.radiusMeters / metersPerPixel;

  // Check if user is inside this radius
  let isUserInside = false;
  if (userLat !== null && userLat !== undefined && userLon !== null && userLon !== undefined) {
    const dx = ((userLon - mapBounds.minLon) / (mapBounds.maxLon - mapBounds.minLon)) * svgWidth - cx;
    const dy = ((mapBounds.maxLat - userLat) / (mapBounds.maxLat - mapBounds.minLat)) * svgHeight - cy;
    const distance = Math.sqrt(dx * dx + dy * dy);
    isUserInside = distance <= radiusPixels;
  }

  const strokeColor = isTriggered ? '#06b6d4' : '#0f766e';
  const opacity = isUserInside ? 0.4 : 0.2;

  return (
    <circle
      cx={cx}
      cy={cy}
      r={radiusPixels}
      fill="none"
      stroke={strokeColor}
      strokeWidth={isUserInside ? 2 : 1}
      opacity={opacity}
      strokeDasharray={isTriggered ? '5,5' : undefined}
    />
  );
}
