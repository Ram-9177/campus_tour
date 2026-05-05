'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { smruMapConfig } from '@/data/map/smruMapConfig';
import CampusRoadLayer from './CampusRoadLayer';
import CampusPointLayer from './CampusPointLayer';
import CampusMapControls from './CampusMapControls';
import CampusMapTopBar from './CampusMapTopBar';
import mediaSync from '@/lib/mediaSyncEngine';
import audioEngine from '@/lib/audioGuideEngine';
import RouteHighlightLayer from './RouteHighlightLayer';
import { campusRouteEngine, type RouteResult } from '@/lib/campusRouteEngine';

const SatelliteCampusMap = dynamic(() => import('./SatelliteCampusMap'), { ssr: false });

type BaseMode = 'standard' | 'satellite';

interface Props {
  isWalkMode?: boolean;
  hideControls?: boolean;
  hideTopBar?: boolean;
  allowedLocationIds?: string[];
  language?: 'en' | 'te' | 'hi';
}

export default function SMRUCampusWorldMap({
  isWalkMode = false,
  hideControls = false,
  hideTopBar = false,
  allowedLocationIds,
  language = 'en',
}: Props) {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeRoute, setActiveRoute] = useState<RouteResult | null>(null);
  const [debug, setDebug] = useState(false);
  const [baseMode, setBaseMode] = useState<BaseMode>('satellite');
  const svgRef = useRef<SVGSVGElement>(null);

  const { coordinateSystem } = smruMapConfig;

  useEffect(() => {
    const unsub = mediaSync.subscribe((loc) => {
      const targetId = loc?.mapPointId || loc?.id || null;
      setSelectedId(targetId);
      if (loc && (loc.x !== undefined || loc.y !== undefined)) {
        const targetX = loc.x || 0;
        const targetY = loc.y || 0;
        const centerX = coordinateSystem.width / 2;
        const centerY = coordinateSystem.height / 2;
        setOffset({ x: centerX - (targetX * zoom), y: centerY - (targetY * zoom) });
        const route = campusRouteEngine.calculatePath(882, 128, targetX, targetY);
        setActiveRoute(route);
      } else {
        setActiveRoute(null);
      }
    });
    return unsub;
  }, [zoom, coordinateSystem.width, coordinateSystem.height]);

  const handlePointerDown = (e: React.PointerEvent) => setDrag({ x: e.clientX, y: e.clientY });
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!drag) return;
    setOffset((prev) => ({ x: prev.x + (e.clientX - drag.x), y: prev.y + (e.clientY - drag.y) }));
    setDrag({ x: e.clientX, y: e.clientY });
  };
  const handlePointerUp = () => setDrag(null);

  useEffect(() => {
    audioEngine.setLanguage(language);
  }, [language]);

  const handleFitCampus = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  const handleSelect = (id: string) => mediaSync.setCurrentByMapPointId(id);

  return (
    <div className="relative flex h-full min-h-125 w-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
      <div className="p-4 pb-0 sm:p-6">
        {!hideTopBar && <CampusMapTopBar debug={debug} onToggleDebug={() => setDebug(!debug)} />}

        {/* Removed toggle buttons - Satellite only */}
      </div>

      {/* Always show Satellite map only */}
      <div className="flex-1 p-4 pt-0 sm:px-6 sm:pb-6">
        <SatelliteCampusMap allowedLocationIds={allowedLocationIds} />
      </div>
    </div>
  );
}
