'use client';

import React from 'react';
import type { RoadNode } from '@/lib/roadGraphBuilder';

interface Props {
  path: RoadNode[];
  mode?: 'walk' | 'cart' | 'vehicle' | 'manual';
}

export default function RouteHighlightLayer({ path, mode = 'manual' }: Props) {
  if (!path || path.length < 2) return null;

  const points = path.map(n => `${n.x},${n.y}`).join(' ');

  // Dynamic colors based on mode
  const strokeColor = 
    mode === 'walk' ? '#3b82f6' : 
    mode === 'cart' ? '#10b981' : 
    mode === 'vehicle' ? '#f59e0b' : '#6366f1';

  return (
    <g data-layer="route-highlight">
      {/* Outer glow/shadow */}
      <polyline
        points={points}
        fill="none"
        stroke={strokeColor}
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-20 blur-[2px]"
      />
      
      {/* Secondary glow */}
      <polyline
        points={points}
        fill="none"
        stroke={strokeColor}
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-40 animate-pulse"
      />

      {/* Main route line */}
      <polyline
        points={points}
        fill="none"
        stroke={strokeColor}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-all duration-500 shadow-xl"
        strokeDasharray="10 6"
        strokeDashoffset="0"
      >
        <animate 
          attributeName="stroke-dashoffset" 
          from="32" 
          to="0" 
          dur="1s" 
          repeatCount="indefinite" 
        />
      </polyline>

      {/* Start/End indicators */}
      <circle cx={path[0].x} cy={path[0].y} r="6" fill="white" stroke={strokeColor} strokeWidth="3" />
      <circle cx={path[path.length - 1].x} cy={path[path.length - 1].y} r="8" fill={strokeColor} className="animate-bounce" />
    </g>
  );
}
