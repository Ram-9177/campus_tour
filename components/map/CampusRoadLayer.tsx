'use client';

import React from 'react';
import { smruMapConfig } from '@/data/map/smruMapConfig';

interface Props {
  stroke?: string;
  strokeWidth?: number;
  debug?: boolean;
}

export default function CampusRoadLayer({ stroke = '#f97316', strokeWidth = 5, debug = false }: Props) {
  return (
    <g data-layer="campus-roads">
      {smruMapConfig.data.roads.map((road) => (
        <g key={road.id} className="group">
          <polyline
            points={road.coordinates.map(c => `${c.x},${c.y}`).join(' ')}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-300 opacity-80"
          />
          {/* Transparent hit area for debugging or interaction */}
          <polyline
            points={road.coordinates.map(c => `${c.x},${c.y}`).join(' ')}
            fill="none"
            stroke="transparent"
            strokeWidth={strokeWidth * 3}
            className="cursor-help"
          />
          {debug && (
            <text
              x={road.coordinates[0].x}
              y={road.coordinates[0].y}
              className="text-[8px] fill-orange-800 font-bold opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {road.name}
            </text>
          )}
        </g>
      ))}
    </g>
  );
}
