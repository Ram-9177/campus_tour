'use client';

import React from 'react';
import { smruMapConfig } from '@/data/map/smruMapConfig';

interface Props {
  debug: boolean;
  onToggleDebug: () => void;
  title?: string;
}

export default function CampusMapTopBar({ debug, onToggleDebug, title }: Props) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 leading-tight">
          {title || smruMapConfig.name}
        </h2>
        <div className="flex items-center gap-3 mt-1.5">
          <p className="text-xs text-slate-500 font-medium">Real satellite campus navigation</p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ACTIVE</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onToggleDebug}
          className={`h-9 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${
            debug 
              ? 'bg-red-50 border-red-200 text-red-600 shadow-inner' 
              : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
          }`}
        >
          {debug ? 'Debug: ON' : 'Debug'}
        </button>
        <div className="hidden sm:block h-6 w-px bg-slate-200 mx-1" />
        <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2.5 py-1.5 rounded-lg border border-blue-100 shadow-sm uppercase tracking-wider">
          Campus Satellite
        </span>
      </div>
    </div>
  );
}
