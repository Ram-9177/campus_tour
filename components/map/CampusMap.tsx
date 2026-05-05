'use client';

import { useState } from 'react';
import { smruMapConfig } from '@/data/map/smruMapConfig';

type MapModel = 'standard' | 'terrain' | 'satellite';

const MODELS: Array<{ key: MapModel; label: string }> = [
  { key: 'standard', label: 'Standard' },
  { key: 'terrain', label: 'Terrain' },
  { key: 'satellite', label: 'Satellite' },
];

function pointsToPath(points: Array<{ x: number; y: number }>) {
  return points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
}

function getMapSurface(model: MapModel) {
  if (model === 'terrain') return 'bg-[#eef6ea]';
  if (model === 'satellite') return 'bg-[#eef2f6]';
  return 'bg-[#f7faff]';
}

export default function CampusMap() {
  const [model, setModel] = useState<MapModel>('standard');
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);

  return (
    <section className="rounded-2xl border border-[#dbe5f5] bg-white p-3 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{smruMapConfig.name}</h3>
          <p className="text-xs text-slate-500">Drag to move, + / - to zoom</p>
        </div>
        <div className="flex gap-1">
          <button type="button" onClick={() => setZoom((v) => Math.max(1, +(v - 0.2).toFixed(2)))} className="rounded border px-2">-</button>
          <button type="button" onClick={() => { setZoom(1); setOffset({ x: 0, y: 0 }); }} className="rounded border px-2 text-xs">Reset</button>
          <button type="button" onClick={() => setZoom((v) => Math.min(3, +(v + 0.2).toFixed(2)))} className="rounded border px-2">+</button>
        </div>
      </div>

      <div className="mb-3 grid grid-cols-3 gap-2">
        {MODELS.map((item) => (
          <button key={item.key} type="button" aria-pressed={model === item.key} onClick={() => setModel(item.key)} className={`min-h-10 rounded-xl border px-2 text-xs font-semibold ${model === item.key ? 'border-[#0b57d0] bg-[#eef4ff] text-[#0b57d0]' : 'border-[#dbe5f5] bg-white text-slate-700'}`}>
            {item.label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl">
        <svg
          viewBox={`0 0 ${smruMapConfig.coordinateSystem.width} ${smruMapConfig.coordinateSystem.height}`}
          className={`h-auto w-full ${getMapSurface(model)} cursor-grab active:cursor-grabbing`}
          role="img"
          aria-label={`Campus map ${model} model`}
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
            {smruMapConfig.data.roads.map((road) => <path key={road.id} d={pointsToPath(road.coordinates as any)} fill="none" stroke="#64748b" strokeWidth="12" strokeLinecap="round" />)}
            {smruMapConfig.data.campusLocations.map((marker) => <circle key={marker.id} cx={marker.x} cy={marker.y} r="5" fill="#0f766e" />)}
          </g>
        </svg>
      </div>
    </section>
  );
}
