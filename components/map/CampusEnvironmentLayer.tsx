'use client';

import React from 'react';

export default function CampusEnvironmentLayer({ width, height }: { width: number; height: number }) {
  // Generate pseudo-random trees and greenery based on the map dimensions
  // This makes the campus feel "alive" and "real-time"
  const trees = Array.from({ length: 45 }).map((_, i) => ({
    x: (i * 137) % width,
    y: (i * 223) % height,
    size: 5 + (i % 5),
  }));

  return (
    <g data-layer="campus-environment">
      {/* Grass patches */}
      <circle cx={width * 0.2} cy={height * 0.4} r={120} fill="#f0fdf4" opacity="0.4" />
      <circle cx={width * 0.7} cy={height * 0.2} r={180} fill="#f0fdf4" opacity="0.4" />
      <circle cx={width * 0.5} cy={height * 0.8} r={150} fill="#f0fdf4" opacity="0.4" />

      {/* Trees */}
      {trees.map((tree, i) => (
        <g key={i} transform={`translate(${tree.x}, ${tree.y})`} className="opacity-30">
          <circle r={tree.size} fill="#16a34a" />
          <circle r={tree.size * 0.6} cx={tree.size * 0.3} cy={-tree.size * 0.3} fill="#22c55e" />
        </g>
      ))}
    </g>
  );
}
