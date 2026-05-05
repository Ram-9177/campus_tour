import React from 'react';
import { smruMapConfig } from '@/data/map/smruMapConfig';

type Props = {
  debug?: boolean;
};

export default function JunctionPointLayer({ debug = false }: Props) {
  if (!debug) return null;

  return (
    <g data-layer="junction-points">
      {smruMapConfig.data.junctionPoints?.map((b) => (
        <g key={b.id}>
          <circle cx={b.x} cy={b.y} r={6} fill="#f97316" />
        </g>
      ))}
    </g>
  );
}
