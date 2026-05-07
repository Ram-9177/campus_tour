'use client';

import React, { useEffect, useState } from 'react';
import locationEngine from '@/lib/locationEngine';
import { latlngToPixel } from '@/lib/campusMapCoordinates';
import { smruMapConfig } from '@/data/map/smruMapConfig';

export default function CampusUserIndicator() {
  const [location, setLocation] = useState(locationEngine.getState());
  const { width, height } = smruMapConfig.coordinateSystem;

  useEffect(() => {
    return locationEngine.subscribe(setLocation);
  }, []);

  if (!location.latitude || !location.longitude) return null;

  const pixels = latlngToPixel(
    { lat: location.latitude, lng: location.longitude },
    width,
    height
  );

  return (
    <g transform={`translate(${pixels.x}, ${pixels.y})`}>
      {/* Pulse effect */}
      <circle r="12" fill="#3b82f6" className="animate-ping opacity-25" />
      <circle r="18" fill="#3b82f6" className="animate-pulse opacity-10" />
      
      {/* Accuracy circle */}
      {location.accuracy && location.accuracy < 50 && (
        <circle 
          r={Math.max(15, location.accuracy * 0.8)} 
          fill="#3b82f6" 
          fillOpacity="0.05" 
          stroke="#3b82f6" 
          strokeOpacity="0.1" 
          strokeWidth="1"
        />
      )}

      {/* Main indicator */}
      <circle r="6" fill="white" stroke="#3b82f6" strokeWidth="2" />
      <circle r="4" fill="#3b82f6" />
    </g>
  );
}
