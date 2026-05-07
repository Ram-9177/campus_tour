'use client';

import React from 'react';
import { Polyline } from 'react-leaflet';
import { smruMapConfig } from '@/data/map/smruMapConfig';

export default function CampusRoadLayer() {
  const roads = smruMapConfig.data.roads;

  return (
    <>
      {roads.map((road) => {
        const positions = road.coordinates.map(c => [c.latitude, c.longitude] as [number, number]);
        
        return (
          <React.Fragment key={road.id}>
            {/* Road Outer Glow/Casing */}
            <Polyline
              positions={positions}
              pathOptions={{
                color: '#fff',
                weight: 8,
                opacity: 0.3,
                lineCap: 'round',
                lineJoin: 'round',
              }}
            />
            {/* Primary Road Line (Orange) */}
            <Polyline
              positions={positions}
              pathOptions={{
                color: '#f97316', // orange-500
                weight: 4,
                opacity: 0.8,
                lineCap: 'round',
                lineJoin: 'round',
              }}
            />
          </React.Fragment>
        );
      })}
    </>
  );
}
