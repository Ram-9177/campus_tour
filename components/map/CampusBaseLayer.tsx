'use client';

import React from 'react';
import { Rectangle } from 'react-leaflet';
import L from 'leaflet';
import { smruMapConfig } from '@/data/map/smruMapConfig';

export default function CampusBaseLayer() {
  const { bounds } = smruMapConfig;
  
  // Extend bounds slightly for a margin
  const margin = 0.0002;
  const outerBounds: L.LatLngBoundsExpression = [
    [bounds.minLat - margin, bounds.minLon - margin],
    [bounds.maxLat + margin, bounds.maxLon + margin]
  ];

  const innerBounds: L.LatLngBoundsExpression = [
    [bounds.minLat, bounds.minLon],
    [bounds.maxLat, bounds.maxLon]
  ];

  return (
    <>
      {/* Schematic Background */}
      <Rectangle
        bounds={outerBounds}
        pathOptions={{
          fillColor: '#f8fafc', // slate-50
          fillOpacity: 1,
          stroke: false,
        }}
      />
      
      {/* Campus Main Area Highlight */}
      <Rectangle
        bounds={innerBounds}
        pathOptions={{
          fillColor: '#ffffff',
          fillOpacity: 1,
          color: '#e2e8f0', // slate-200
          weight: 2,
          dashArray: '5, 5',
        }}
      />

      {/* Grid Pattern Effect (Schematic) */}
      {[...Array(10)].map((_, i) => {
          const lat = bounds.minLat + (i * (bounds.maxLat - bounds.minLat) / 10);
          return (
            <Rectangle 
                key={`grid-lat-${i}`}
                bounds={[[lat, bounds.minLon], [lat + 0.000001, bounds.maxLon]]}
                pathOptions={{ color: '#f1f5f9', weight: 1, fillOpacity: 0 }}
            />
          );
      })}
    </>
  );
}
