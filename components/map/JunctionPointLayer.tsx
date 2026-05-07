import React from 'react';
import { smruMapConfig } from '@/data/map/smruMapConfig';
import type { MapPoint } from '@/types/mapData';

type Props = {
  debug?: boolean;
};

export default function JunctionPointLayer({ debug = false }: Props) {
  if (!debug) return null;

  const points = (smruMapConfig.data.junctionPoints || []) as MapPoint[];

  return (
    <g data-layer="junction-points">
      {points.map((b) => (
        <g key={b.id}>
          <circle cx={b.x} cy={b.y} r={6} fill="#f97316" />
        </g>
      ))}
    </g>
  );
}
