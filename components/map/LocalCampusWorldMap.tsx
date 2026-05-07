'use client';

import React from 'react';
import { MapContainer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { smruMapConfig } from '@/data/map/smruMapConfig';
import CampusBaseLayer from './CampusBaseLayer';
import CampusRoadLayer from './CampusRoadLayer';
import CampusPointLayer from './CampusPointLayer';
import CampusMapControls from './CampusMapControls';
import RouteHighlightLayer from './RouteHighlightLayer';

interface Props {
  allowedLocationIds?: string[];
  language: 'en' | 'te' | 'hi';
}

export default function LocalCampusWorldMap({ allowedLocationIds, language }: Props) {
  const { bounds } = smruMapConfig;
  
  const mapCenter: [number, number] = [
    (bounds.minLat + bounds.maxLat) / 2,
    (bounds.minLon + bounds.maxLon) / 2
  ];

  const mapBounds: [[number, number], [number, number]] = [
    [bounds.minLat, bounds.minLon],
    [bounds.maxLat, bounds.maxLon]
  ];

  // Slightly larger bounds for panning restriction
  const maxBounds: [[number, number], [number, number]] = [
    [bounds.minLat - 0.005, bounds.minLon - 0.005],
    [bounds.maxLat + 0.005, bounds.maxLon + 0.005]
  ];

  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl border-4 border-slate-100 bg-slate-50 shadow-inner">
      <MapContainer
        center={mapCenter}
        zoom={17}
        minZoom={16}
        maxZoom={20}
        scrollWheelZoom={true}
        className="h-full w-full"
        zoomControl={false}
        attributionControl={false}
        maxBounds={maxBounds}
        bounds={mapBounds}
      >
        <CampusBaseLayer />
        <CampusRoadLayer />
        <RouteHighlightLayer />
        <CampusPointLayer allowedLocationIds={allowedLocationIds} language={language} />
        <CampusMapControls />
      </MapContainer>
      
      {/* Decorative Branding Watermark */}
      <div className="pointer-events-none absolute bottom-4 right-6 z-10 opacity-20">
         <div className="text-right">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">SMRU Institutional World</div>
            <div className="text-sm font-black text-slate-300">CAMPUS MAP v1.0</div>
         </div>
      </div>
    </div>
  );
}
