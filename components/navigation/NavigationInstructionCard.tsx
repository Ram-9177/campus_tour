'use client';

import React from 'react';

interface Props {
  distance: number;
  mode: string;
  onClose: () => void;
  destinationName?: string;
}

export default function NavigationInstructionCard({ distance, mode, onClose, destinationName }: Props) {
  // Rough estimate: distance in graph units to meters
  // Assuming 1 unit is approx 0.5 meters based on campus size
  const meters = Math.round(distance * 0.5);
  const minutes = Math.ceil(meters / 80); // Avg walking speed 80m/min

  return (
    <div className="fixed bottom-32 left-4 right-4 sm:left-auto sm:right-6 sm:w-80 z-50 animate-in slide-in-from-bottom duration-300">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-5 overflow-hidden relative">
        {/* Animated background accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-500 via-emerald-500 to-blue-500 bg-size-[200%_100%] animate-[shimmer_2s_linear_infinite]" />

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">🚩</span>
            <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Active Navigation</div>
          </div>
          <button 
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-slate-600 transition"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <div className="text-sm font-bold text-slate-900 leading-tight">
            {destinationName || 'Selected Destination'}
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-500 uppercase tracking-wider">
              {mode} MODE
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Distance</span>
            <span className="text-lg font-bold text-slate-900">{meters}m</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Est. Time</span>
            <span className="text-lg font-bold text-slate-900">{minutes} min</span>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
            ↑
          </div>
          <div className="text-xs font-bold text-blue-800 leading-tight">
            Follow the highlighted blue line on the map to reach your destination.
          </div>
        </div>
      </div>
    </div>
  );
}
