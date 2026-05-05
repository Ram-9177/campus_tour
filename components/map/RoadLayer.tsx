import React from 'react';
import { smruMapConfig } from '@/data/map/smruMapConfig';

type Props = {
  stroke?: string;
  strokeWidth?: number;
};

function pointsToPath(points: Array<{ x: number; y: number }>) {
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
}

export default function RoadLayer({ stroke = '#f97316', strokeWidth = 8 }: Props) {
  return (
    <g data-layer="roads">
      {smruMapConfig.data.roads.map((road) => (
        <path
          key={road.id}
          d={pointsToPath(road.coordinates as any)}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      ))}
      {smruMapConfig.data.boundary && (
        <path
          key={smruMapConfig.data.boundary.id}
          d={pointsToPath(smruMapConfig.data.boundary.coordinates as any)}
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
