import React from 'react';

type Props = {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  language?: string;
  onToggleLanguage?: () => void;
};

export default function MapControls({ zoom, onZoomIn, onZoomOut, onReset, language = 'EN', onToggleLanguage }: Props) {
  return (
    <div className="flex items-center justify-between gap-2 flex-wrap">
      <div className="flex items-center gap-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm p-1.5">
        <button 
          type="button" 
          onClick={onZoomOut} 
          aria-label="Zoom out" 
          title="Zoom out"
          className="h-10 w-10 inline-flex items-center justify-center rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold transition-colors active:bg-slate-100"
        >
          −
        </button>
        <div className="inline-flex items-center justify-center rounded-lg bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
          {zoom.toFixed(1)}x
        </div>
        <button 
          type="button" 
          onClick={onZoomIn} 
          aria-label="Zoom in"
          title="Zoom in"
          className="h-10 w-10 inline-flex items-center justify-center rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold transition-colors active:bg-slate-100"
        >
          +
        </button>
        <div className="w-px h-6 bg-slate-200 mx-0.5" />
        <button 
          type="button" 
          onClick={onReset} 
          aria-label="Reset view"
          title="Reset view"
          className="h-10 px-3 inline-flex items-center justify-center rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors active:bg-slate-100"
        >
          Reset
        </button>
      </div>

      <button 
        type="button" 
        onClick={onToggleLanguage} 
        className="h-10 px-3 inline-flex items-center justify-center rounded-xl bg-linear-to-r from-slate-100 to-slate-50 border border-slate-300 hover:border-slate-400 hover:shadow-sm text-slate-700 text-xs font-semibold transition-all active:scale-95"
        title="Toggle language"
      >
        🌐 {language}
      </button>
    </div>
  );
}
