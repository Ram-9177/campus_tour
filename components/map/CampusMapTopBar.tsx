'use client';

import React from 'react';
import { smruMapConfig } from '@/data/map/smruMapConfig';

interface Props {
  debug: boolean;
  onToggleDebug: () => void;
  title?: string;
}

export default function CampusMapTopBar({ debug, onToggleDebug, title }: Props) {
  const showDebugToggle = process.env.NODE_ENV !== 'production';
  return (
    <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
      <div>
        <h2 className="text-2xl font-black leading-tight tracking-tight text-slate-900">
          {title || smruMapConfig.name}
        </h2>
        <div className="mt-1.5 flex items-center gap-3">
          <p className="text-sm font-medium text-slate-600">Campus-only local navigation map</p>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Map Ready</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="rounded-xl border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-blue-700">
          SMRU Campus World
        </span>
        {showDebugToggle ? (
          <button
            onClick={onToggleDebug}
            className={`rounded-xl border px-3 py-2 text-sm font-semibold transition-all ${
              debug
                ? 'border-red-200 bg-red-50 text-red-700'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {debug ? 'Debug On' : 'Debug'}
          </button>
        ) : null}
      </div>
    </div>
  );
}
