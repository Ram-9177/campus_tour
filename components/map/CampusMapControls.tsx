'use client';

import React from 'react';
import { useMap } from 'react-leaflet';
import { smruMapConfig } from '@/data/map/smruMapConfig';

export default function CampusMapControls() {
  const map = useMap();
  const { bounds } = smruMapConfig;

  const handleReset = () => {
    map.fitBounds([
      [bounds.minLat, bounds.minLon],
      [bounds.maxLat, bounds.maxLon]
    ], { padding: [40, 40] });
  };

  const handleZoomIn = () => map.zoomIn();
  const handleZoomOut = () => map.zoomOut();

  return (
    <div className="absolute right-4 top-4 z-1000 flex flex-col gap-2">
      <button
        onClick={handleReset}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-md transition hover:bg-slate-50 active:scale-95"
        title="Reset to Campus View"
      >
        <span className="text-xl">🏠</span>
      </button>
      <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md">
        <button
          onClick={handleZoomIn}
          className="flex h-10 w-10 items-center justify-center transition hover:bg-slate-50 border-b border-slate-100"
        >
          <span className="text-xl font-bold">+</span>
        </button>
        <button
          onClick={handleZoomOut}
          className="flex h-10 w-10 items-center justify-center transition hover:bg-slate-50"
        >
          <span className="text-xl font-bold">-</span>
        </button>
      </div>
    </div>
  );
}
