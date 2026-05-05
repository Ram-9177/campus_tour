'use client';

import React, { useState, useEffect } from 'react';
import { smruMapConfig } from '@/data/map/smruMapConfig';
import RoadLayer from './RoadLayer';
import CampusPointLayer from './CampusPointLayer';
import JunctionPointLayer from './JunctionPointLayer';
import MapControls from './MapControls';
import MapModeBar from './MapModeBar';
import mediaSync from '@/lib/mediaSyncEngine';
import audioEngine from '@/lib/audioGuideEngine';

type MapModel = 'standard' | 'terrain' | 'satellite';

interface SmartCampusMapProps {
  isWalkMode?: boolean;
}

function surfaceClass(model: MapModel) {
  if (model === 'terrain') return 'bg-[#eef6ea]';
  if (model === 'satellite') return 'bg-[#eef2f6]';
  return 'bg-[#f7faff]';
}

export default function SmartCampusMap({ isWalkMode = false }: SmartCampusMapProps) {
  const [model, setModel] = useState<MapModel>('standard');
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = mediaSync.subscribe((loc) => {
      setSelectedId(loc?.mapPointId || null);
    });
    return unsub;
  }, []);

  function openFor(id: string) {
    mediaSync.setCurrentByMapPointId(id);
  }

  const [language, setLanguage] = useState<'en' | 'te' | 'hi'>('en');

  const debugJunctions = process.env.NEXT_PUBLIC_MAP_DEBUG === 'true';

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      {!isWalkMode && (
        <>
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900">{smruMapConfig.name}</h3>
              <p className="text-xs text-slate-500 mt-1">Drag to pan • Use controls for zoom</p>
            </div>
            <div className="flex items-center gap-2">
              <MapModeBar mode={model} onChange={setModel} />
            </div>
          </div>

          <div className="mb-4">
            <MapControls
              zoom={zoom}
              onZoomIn={() => setZoom((v) => Math.min(3, +(v + 0.2).toFixed(2)))}
              onZoomOut={() => setZoom((v) => Math.max(1, +(v - 0.2).toFixed(2)))}
              onReset={() => { setZoom(1); setOffset({ x: 0, y: 0 }); setSelectedId(null); }}
              language={language.toUpperCase()}
              onToggleLanguage={() => {
                const next = language === 'en' ? 'te' : (language === 'te' ? 'hi' : 'en');
                setLanguage(next);
                audioEngine.setLanguage(next);
              }}
            />
          </div>
        </>
      )}

      <div className="overflow-hidden rounded-xl">
        <svg
          viewBox={`0 0 ${smruMapConfig.coordinateSystem.width} ${smruMapConfig.coordinateSystem.height}`}
          className={`h-auto w-full ${surfaceClass(model)} cursor-grab active:cursor-grabbing`}
          role="img"
          aria-label="SMRU smart campus map"
          onPointerDown={(e) => setDrag({ x: e.clientX, y: e.clientY })}
          onPointerMove={(e) => {
            if (!drag) return;
            setOffset((prev) => ({ x: prev.x + (e.clientX - drag.x), y: prev.y + (e.clientY - drag.y) }));
            setDrag({ x: e.clientX, y: e.clientY });
          }}
          onPointerUp={() => setDrag(null)}
          onPointerLeave={() => setDrag(null)}
        >
          <g transform={`translate(${offset.x} ${offset.y}) scale(${zoom})`}>
            <RoadLayer />
            <CampusPointLayer selectedId={selectedId} onSelect={(id) => openFor(id)} />
            <JunctionPointLayer debug={debugJunctions} />
          </g>
        </svg>
      </div>
    </section>
  );
}
