'use client';

import { useEffect, useState } from 'react';
import locationEngine from '@/lib/locationEngine';

interface UserLocationMarkerProps {
  svgWidth: number;
  svgHeight: number;
  mapBounds: {
    minLat: number;
    maxLat: number;
    minLon: number;
    maxLon: number;
  };
}

export default function UserLocationMarker({
  svgWidth,
  svgHeight,
  mapBounds,
}: UserLocationMarkerProps) {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const unsubscribe = locationEngine.subscribe((state) => {
      if (state.latitude !== null && state.longitude !== null) {
        // Convert lat/lon to SVG coordinates
        const x =
          ((state.longitude - mapBounds.minLon) /
            (mapBounds.maxLon - mapBounds.minLon)) *
          svgWidth;
        const y =
          ((mapBounds.maxLat - state.latitude) /
            (mapBounds.maxLat - mapBounds.minLat)) *
          svgHeight;

        setPosition({ x, y });
      } else {
        setPosition(null);
      }
    });

    return unsubscribe;
  }, [svgWidth, svgHeight, mapBounds]);

  if (!position) return null;

  return (
    <g>
      <defs>
        <filter id="glowFilter">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Outer glowing pulse rings */}
      <circle cx={position.x} cy={position.y} r={8} fill="none" stroke="#3b82f6" strokeWidth={1.5} opacity={0.4} filter="url(#glowFilter)">
        <animate attributeName="r" from={8} to={18} dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" from={0.6} to={0} dur="2s" repeatCount="indefinite" />
      </circle>
      
      {/* Secondary pulse */}
      <circle cx={position.x} cy={position.y} r={6} fill="none" stroke="#60a5fa" strokeWidth={1} opacity={0.3} filter="url(#glowFilter)">
        <animate attributeName="r" from={6} to={14} dur="1.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" from={0.4} to={0} dur="1.5s" repeatCount="indefinite" />
      </circle>
      
      {/* Core marker with shadow */}
      <circle cx={position.x} cy={position.y} r={7} fill="#2563eb" stroke="white" strokeWidth={2.5} filter="url(#glowFilter)" />
      
      {/* Inner dot */}
      <circle cx={position.x} cy={position.y} r={2.5} fill="white" opacity={0.9} />
    </g>
  );
}
