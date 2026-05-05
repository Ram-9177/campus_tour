'use client';

import React, { useMemo } from 'react';
import { smruMapConfig } from '@/data/map/smruMapConfig';
import RoadLayer from '@/components/map/RoadLayer';
import type { CampusLocation } from '@/types/campusLocation';

interface Props {
  data: Partial<CampusLocation>;
}

export default function LocationMapPreview({ data }: Props) {
  const { coordinateSystem, bounds } = smruMapConfig;
  const { latitude, longitude, x: manualX, y: manualY, radiusMeters, name, category } = data;

  const latRange = bounds.maxLat - bounds.minLat;
  const lonRange = bounds.maxLon - bounds.minLon;

  const point = useMemo(() => {
    if (latitude !== undefined && longitude !== undefined) {
      // Automatic conversion based on bounds
      const x = ((longitude - bounds.minLon) / lonRange) * coordinateSystem.width;
      const y = coordinateSystem.height - ((latitude - bounds.minLat) / latRange) * coordinateSystem.height;
      
      const isOutside = latitude < bounds.minLat || latitude > bounds.maxLat || 
                        longitude < bounds.minLon || longitude > bounds.maxLon;

      return { x: Math.round(x), y: Math.round(y), isOutside };
    }
    
    if (manualX !== undefined && manualY !== undefined) {
      return { x: manualX, y: manualY, isOutside: false };
    }

    return null;
  }, [latitude, longitude, manualX, manualY, bounds, lonRange, latRange, coordinateSystem]);

  if (!point) {
    return (
      <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-8 text-center">
        <p className="text-slate-500 text-sm">Enter coordinates to see map preview</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-slate-800 uppercase">Map Preview</h4>
        {point.isOutside && (
          <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full animate-pulse">
            ⚠️ OUTSIDE CAMPUS BOUNDARY
          </span>
        )}
      </div>

      <div className="relative rounded-2xl border border-slate-200 overflow-hidden bg-slate-100">
        <svg
          viewBox={`0 0 ${coordinateSystem.width} ${coordinateSystem.height}`}
          className="w-full h-auto bg-[#f7faff]"
        >
          {/* Base Layers */}
          <RoadLayer stroke="#e2e8f0" strokeWidth={6} />
          
          {/* Radius Circle */}
          {radiusMeters && (
            <circle
              cx={point.x}
              cy={point.y}
              r={radiusMeters * 2} // Scaling factor for visual clarity
              fill="rgba(59, 130, 246, 0.1)"
              stroke="rgba(59, 130, 246, 0.3)"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          )}

          {/* Current Location Marker */}
          <g transform={`translate(${point.x}, ${point.y})`}>
            <circle r="12" fill="white" className="shadow-lg" />
            <circle r="8" fill={point.isOutside ? '#ef4444' : '#3b82f6'} />
            {/* Ripples */}
            <circle r="15" fill="none" stroke={point.isOutside ? '#ef4444' : '#3b82f6'} strokeWidth="1" className="animate-ping opacity-20" />
          </g>

          {/* Label */}
          <g transform={`translate(${point.x}, ${point.y + 25})`}>
            <text
              textAnchor="middle"
              className="text-[14px] font-bold fill-slate-900 drop-shadow-sm"
            >
              {name?.en || 'New Point'}
            </text>
            <text
              y="16"
              textAnchor="middle"
              className="text-[10px] font-medium fill-slate-500 uppercase tracking-wider"
            >
              {category || 'Unknown'}
            </text>
          </g>
        </svg>

        {/* Floating Stats */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm p-2 rounded-lg border border-slate-200 shadow-sm text-[10px] font-mono">
          <div>X: {point.x} | Y: {point.y}</div>
          <div className="text-slate-400 mt-0.5">Scale: 1m ≈ 2px</div>
        </div>
      </div>

      <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-[11px] text-blue-700 leading-relaxed">
        <strong>Tip:</strong> The blue dashed circle represents the <strong>{radiusMeters}m</strong> proximity trigger zone. Ensure it covers the intended arrival area for visitors.
      </div>
    </div>
  );
}
