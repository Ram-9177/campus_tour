'use client';

import React from 'react';

interface Props {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onFit: () => void;
  language: string;
  onToggleLanguage?: () => void;
}

export default function CampusMapControls({ 
  zoom, 
  onZoomIn, 
  onZoomOut, 
  onReset, 
  onFit,
  language, 
  onToggleLanguage 
}: Props) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex bg-white rounded-xl border border-slate-200 p-1 shadow-sm overflow-hidden">
        <button
          onClick={onZoomIn}
          className="h-10 w-10 flex items-center justify-center text-lg hover:bg-slate-50 transition active:scale-95"
          title="Zoom In"
        >
          ➕
        </button>
        <div className="w-px bg-slate-100 my-2" />
        <button
          onClick={onZoomOut}
          className="h-10 w-10 flex items-center justify-center text-lg hover:bg-slate-50 transition active:scale-95"
          title="Zoom Out"
        >
          ➖
        </button>
      </div>

      <button
        onClick={onFit}
        className="h-12 px-4 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition shadow-sm active:scale-95 flex items-center gap-2"
        title="Fit Campus"
      >
        <span>🎯</span>
        <span className="hidden sm:inline">FIT CAMPUS</span>
      </button>

      <button
        onClick={onReset}
        className="h-12 px-4 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition shadow-sm active:scale-95 flex items-center gap-2"
        title="Reset Map"
      >
        <span>🔄</span>
        <span className="hidden sm:inline">RESET</span>
      </button>

      <button
        onClick={onToggleLanguage}
        disabled={!onToggleLanguage}
        className="h-12 px-4 rounded-xl bg-blue-600 text-white text-xs font-bold transition shadow-sm active:scale-95 flex items-center gap-2 disabled:opacity-80 disabled:cursor-default"
      >
        <span>🌐</span>
        <span>{language}</span>
      </button>

      <div className="hidden lg:flex items-center px-4 h-12 bg-slate-50 rounded-xl border border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        Zoom: {Math.round(zoom * 100)}%
      </div>
    </div>
  );
}
