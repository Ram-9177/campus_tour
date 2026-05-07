import React from 'react';
import { smruMapConfig } from '@/data/map/smruMapConfig';
import type { MapRoad } from '@/types/mapData';

type Props = {
  stroke?: string;
  strokeWidth?: number;
};

function pointsToPath(points: Array<{ x: number; y: number }>) {
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
}

export default function RoadLayer({ stroke = '#f97316', strokeWidth = 8 }: Props) {
  const roads = smruMapConfig.data.roads as MapRoad[];
  const boundary = smruMapConfig.data.boundary as MapRoad | null;

  return (
    <g data-layer="roads">
      {roads.map((road) => (
        <path
          key={road.id}
          d={pointsToPath(road.coordinates as any)}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      ))}
      {boundary && (
        <path
          key={boundary.id}
          d={pointsToPath(boundary.coordinates as any)}
          fill="none"
          stroke="#94a3b8"
          strokeWidth="3"
          strokeDasharray="5 5"
          strokeLinecap="round"
        />
      )}
    </g>
  );
}
