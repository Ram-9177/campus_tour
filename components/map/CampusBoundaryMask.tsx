'use client';

import React from 'react';
import { smruMapConfig } from '@/data/map/smruMapConfig';

interface CampusBoundaryMaskProps {
  clipPathId: string;
  debug?: boolean;
}

/**
 * SVG clip-path for campus boundary in local map coordinate space.
 */
export default function CampusBoundaryMask({ clipPathId, debug = false }: CampusBoundaryMaskProps) {
  const { width: mapWidth, height: mapHeight } = smruMapConfig.coordinateSystem;
  const gridPatternId = `${clipPathId}-grid`;

  return (
    <>
      <defs>
        <clipPath id={clipPathId}>
          <rect x="0" y="0" width={mapWidth} height={mapHeight} />
        </clipPath>
        {debug && (
          <pattern
            id={gridPatternId}
            x="0"
            y="0"
            width="50"
            height="50"
            patternUnits="userSpaceOnUse"
          >
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#cbd5e1" strokeWidth="1" />
          </pattern>
        )}
      </defs>

      {debug && (
        <>
          <rect x="0" y="0" width={mapWidth} height={mapHeight} fill={`url(#${gridPatternId})`} opacity="0.36" />
          <rect x="0" y="0" width={mapWidth} height={mapHeight} fill="none" stroke="#0b57d0" strokeWidth="2" opacity="0.5" />
        </>
      )}
    </>
  );
}
