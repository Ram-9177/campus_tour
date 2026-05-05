'use client';

import React, { useState, useEffect } from 'react';
import { LocationStore } from '@/lib/locationStore';
import type { CampusLocation } from '@/types/campusLocation';

interface Props {
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  debug?: boolean;
  allowedLocationIds?: string[];
}

export default function CampusPointLayer({ selectedId, onSelect, debug = false, allowedLocationIds }: Props) {
  const [locations, setLocations] = useState<CampusLocation[]>([]);

  const fetchLocations = () => {
    const allowed = allowedLocationIds && allowedLocationIds.length > 0 ? new Set(allowedLocationIds) : null;
    const data = LocationStore.getAllLocations().filter((loc) => loc.active && (!allowed || allowed.has(loc.id)));
    setLocations(data);
  };

  useEffect(() => {
    fetchLocations();
    window.addEventListener('smru_locations_updated', fetchLocations);
    return () => window.removeEventListener('smru_locations_updated', fetchLocations);
  }, [allowedLocationIds?.join('|')]);

  return (
    <g data-layer="campus-points">
      {locations.map((marker) => {
        const targetId = marker.mapPointId || marker.id;
        const isSelected = selectedId === targetId;
        
        return (
          <g
            key={marker.id}
            transform={`translate(${marker.x || 0}, ${marker.y || 0})`}
            onClick={() => onSelect?.(targetId)}
            className="cursor-pointer group"
          >
            {/* Shadow/Backdrop */}
            <circle r={isSelected ? 18 : 14} fill="white" className="opacity-90 shadow-lg" />
            
            {/* Main Pin (Blue) */}
            <circle
              r={isSelected ? 16 : 12}
              fill={isSelected ? '#2563eb' : '#3b82f6'}
              className="transition-all duration-300"
            />
            
            {/* Pulse Effect */}
            {isSelected && (
              <circle r={24} fill="none" stroke="#2563eb" strokeWidth="2" className="animate-ping opacity-30" />
            )}

            {/* Icon/Label */}
            <text
              textAnchor="middle"
              className="pointer-events-none fill-white text-[10px] font-bold select-none"
              dy=".35em"
            >
              📍
            </text>

            {/* Name Label */}
            <text
              y="32"
              textAnchor="middle"
              className={`pointer-events-none text-[11px] font-bold transition-all ${isSelected ? 'fill-blue-700' : 'fill-slate-700'}`}
            >
              {marker.name.en}
            </text>

            {/* Debug Info */}
            {debug && (
              <text
                y="-20"
                textAnchor="middle"
                className="text-[8px] font-mono fill-red-500 opacity-0 group-hover:opacity-100"
              >
                ID: {marker.id}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}
