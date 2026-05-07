'use client';

import React, { useEffect, useState } from 'react';
import { CircleMarker, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { LocationStore } from '@/lib/locationStore';
import mediaSync from '@/lib/mediaSyncEngine';
import type { CampusLocation } from '@/types/campusLocation';

interface Props {
  allowedLocationIds?: string[];
  language: 'en' | 'te' | 'hi';
}

export default function CampusPointLayer({ allowedLocationIds, language }: Props) {
  const map = useMap();
  const [locations, setLocations] = useState<CampusLocation[]>([]);
  const [currentLocation, setCurrentLocation] = useState<CampusLocation | null>(mediaSync.getCurrent());

  useEffect(() => {
    const load = () => {
      let all = LocationStore.getAllLocations().filter(l => l.active);
      if (allowedLocationIds && allowedLocationIds.length > 0) {
        all = all.filter(l => allowedLocationIds.includes(l.id));
      }
      setLocations(all);
    };
    load();
    window.addEventListener('smru_locations_updated', load);
    const unsub = mediaSync.subscribe((loc) => setCurrentLocation(loc || null));
    return () => {
      window.removeEventListener('smru_locations_updated', load);
      unsub();
    };
  }, [allowedLocationIds]);

  const handlePointClick = (loc: CampusLocation) => {
    mediaSync.setCurrentByLocationId(loc.id);
    map.flyTo([loc.latitude, loc.longitude], 18, {
      duration: 1.5
    });
  };

  return (
    <>
      {locations.map((loc) => {
        const isSelected = currentLocation?.id === loc.id;
        const pos: [number, number] = [loc.latitude, loc.longitude];

        return (
          <React.Fragment key={loc.id}>
            {/* Animated Glow for Selected Pin */}
            {isSelected && (
              <CircleMarker
                center={pos}
                radius={15}
                pathOptions={{
                  color: '#3b82f6', // blue-500
                  fillColor: '#3b82f6',
                  fillOpacity: 0.2,
                  weight: 0,
                  className: 'animate-pulse'
                }}
              />
            )}

            <CircleMarker
              center={pos}
              radius={isSelected ? 10 : 7}
              eventHandlers={{
                click: () => handlePointClick(loc)
              }}
              pathOptions={{
                color: '#fff',
                weight: 2,
                fillColor: isSelected ? '#1d4ed8' : '#3b82f6', // blue-700 : blue-500
                fillOpacity: 1,
                className: 'cursor-pointer transition-all duration-300'
              }}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={isSelected}>
                <div className="px-2 py-1 font-black text-[10px] uppercase tracking-wider text-slate-800">
                  {loc.name[language] || loc.name.en}
                </div>
              </Tooltip>
            </CircleMarker>
          </React.Fragment>
        );
      })}
    </>
  );
}
