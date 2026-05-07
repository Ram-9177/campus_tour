import React, { useEffect, useState } from 'react';
import { LocationStore } from '@/lib/locationStore';
import type { CampusLocation } from '@/types/campusLocation';

export default function CampusBuildingLayer() {
  const [locations, setLocations] = useState<CampusLocation[]>([]);

  useEffect(() => {
    const fetch = () => {
      setLocations(LocationStore.getAllLocations().filter(l => l.active));
    };
    fetch();
    window.addEventListener('smru_locations_updated', fetch);
    return () => window.removeEventListener('smru_locations_updated', fetch);
  }, []);

  return (
    <g data-layer="campus-buildings">
      <defs>
        <linearGradient id="buildingFront" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="buildingTop" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f8fafc" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.5" />
        </linearGradient>
      </defs>

      {locations.map((loc, idx) => {
        const name = (loc.name.en || '').toLowerCase();
        const category = (loc.category || '').toLowerCase();
        
        // Comprehensive exclusion list for open areas
        if (
          name.includes('ground') || 
          name.includes('parking') || 
          name.includes('gate') || 
          name.includes('pool') ||
          name.includes('area') ||
          name.includes('garden') ||
          name.includes('road') ||
          category.includes('utility')
        ) return null;

        const x = loc.x || 0;
        const y = loc.y || 0;
        
        // Identify building type
        const isHostel = name.includes('hostel') || name.includes('block');
        const isAcademic = name.includes('school') || name.includes('university') || name.includes('library');
        const isLarge = isHostel || isAcademic;

        // Base dimensions
        const w = isLarge ? 50 : 35;
        const h = isLarge ? 40 : 25;
        const depth = isLarge ? 10 : 6;

        return (
          <g key={loc.id} transform={`translate(${x - w/2}, ${y - h - 20})`} className="opacity-60">
            {/* L-Shape Logic for Hostels */}
            {isHostel ? (
              <g>
                {/* Main Body */}
                <rect width={w} height={h} fill="url(#buildingFront)" stroke="#94a3b8" strokeWidth="0.5" rx={2} />
                <path d={`M 0 0 L ${depth} ${-depth} L ${w + depth} ${-depth} L ${w} 0 Z`} fill="url(#buildingTop)" stroke="#64748b" strokeWidth="0.5" />
                <path d={`M ${w} 0 L ${w + depth} ${-depth} L ${w + depth} ${h - depth} L ${w} ${h} Z`} fill="#475569" opacity="0.3" />
                
                {/* Side Wing (L-Shape) */}
                <rect x={-w/2} y={h*0.3} width={w/2} height={h*0.7} fill="url(#buildingFront)" stroke="#94a3b8" strokeWidth="0.5" rx={2} />
                <path d={`M ${-w/2} ${h*0.3} L ${-w/2 + depth} ${h*0.3 - depth} L ${depth} ${h*0.3 - depth} L 0 ${h*0.3} Z`} fill="url(#buildingTop)" stroke="#64748b" strokeWidth="0.5" />
              </g>
            ) : (
              <g>
                {/* Rectangular Block for others */}
                <rect width={w} height={h} fill="url(#buildingFront)" stroke="#94a3b8" strokeWidth="0.5" rx={2} />
                <path d={`M 0 0 L ${depth} ${-depth} L ${w + depth} ${-depth} L ${w} 0 Z`} fill="url(#buildingTop)" stroke="#64748b" strokeWidth="0.5" />
                <path d={`M ${w} 0 L ${w + depth} ${-depth} L ${w + depth} ${h - depth} L ${w} ${h} Z`} fill="#475569" opacity="0.3" />
                
                {/* Roof Skylight for Academic */}
                {isAcademic && (
                  <rect x={w*0.3} y={-depth*0.8} width={w*0.4} height={depth*0.6} fill="#38bdf8" opacity="0.3" rx={1} transform={`skewX(-45)`} />
                )}
              </g>
            )}

            {/* Architectural Windows (Subtle) */}
            <g opacity="0.2">
              {[...Array(isLarge ? 4 : 2)].map((_, r) => (
                <g key={r} transform={`translate(0, ${h * (0.2 + r * 0.2)})`}>
                  {[...Array(3)].map((_, c) => (
                    <rect key={c} x={w * (0.2 + c * 0.25)} width={w * 0.15} height={h * 0.1} fill="#1e293b" rx={0.5} />
                  ))}
                </g>
              ))}
            </g>
          </g>
        );
      })}
    </g>
  );
}
