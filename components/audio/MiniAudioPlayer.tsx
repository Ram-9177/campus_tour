'use client';

import React, { useEffect, useState } from 'react';
import engine from '@/lib/audioGuideEngine';
import mediaSync from '@/lib/mediaSyncEngine';

export default function MiniAudioPlayer() {
  const [state, setState] = useState(engine.getState());
  const [expanded, setExpanded] = useState(false);

  useEffect(() => engine.subscribe(setState), []);

  if (!state.currentLocation) return null;

  const title = state.currentLocation.name[state.language] || state.currentLocation.name.en;
  const isPlaying = state.isPlaying;

  return (
    <div 
      className={`fixed z-50 right-4 transition-all duration-300 ${
        expanded ? 'bottom-32 w-80' : 'bottom-20 w-auto'
      }`}
    >
      <div className={`rounded-3xl border border-slate-200/80 bg-white/95 backdrop-blur-xl shadow-[0_20px_48px_rgba(15,23,42,0.2)] transition-all duration-300 overflow-hidden ${
        expanded ? 'p-5' : 'px-4 py-3 pr-3'
      }`}>
        {expanded ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Admissions Guide</div>
              <button
                onClick={() => setExpanded(false)}
                className="h-6 w-6 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:text-slate-600 transition"
              >
                ✕
              </button>
            </div>
            
            <div>
              <div className="font-bold text-slate-900 leading-tight mb-1">{title}</div>
              <div className="text-[10px] text-slate-500 font-medium">{state.currentLocation.category.toUpperCase()}</div>
            </div>

            {!state.isAvailable && (
              <div className="text-[10px] font-bold text-amber-600 uppercase py-2 px-3 bg-amber-50 rounded-lg border border-amber-100 text-center">
                Audio Coming Soon
              </div>
            )}

            {state.error && (
              <div className="text-[10px] font-bold text-red-600 uppercase py-2 px-3 bg-red-50 rounded-lg border border-red-100 text-center">
                {state.error}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                {state.isAvailable && (
                  <button 
                    onClick={() => {
                      if (isPlaying) {
                        engine.pause();
                        return;
                      }
                      engine.registerUserGesture();
                      engine.play();
                    }} 
                    className={`flex-1 h-12 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all active:scale-95 shadow-sm ${
                      isPlaying ? 'bg-slate-100 text-slate-900 hover:bg-slate-200' : 'bg-[#0b57d0] text-white hover:bg-[#0a4cc0]'
                    }`}
                  >
                    <span>{isPlaying ? '⏸ PAUSE' : state.isPaused ? '▶ RESUME' : '▶ PLAY'}</span>
                  </button>
                )}
                {state.isAvailable && (
                  <button 
                    onClick={() => engine.replay()} 
                    className="h-12 w-12 flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition active:scale-95"
                  >
                    ↺
                  </button>
                )}
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => mediaSync.prev()} 
                  className="flex-1 h-10 rounded-xl border border-slate-200 text-[10px] font-bold text-slate-500 hover:bg-slate-50 transition uppercase tracking-wider"
                >
                  Prev
                </button>
                <button 
                  onClick={() => mediaSync.next()} 
                  className="flex-1 h-10 rounded-xl border border-slate-200 text-[10px] font-bold text-slate-500 hover:bg-slate-50 transition uppercase tracking-wider"
                >
                  Next
                </button>
              </div>

              <button 
                onClick={() => mediaSync.setCurrentByLocationId(null)} 
                className="h-10 w-full text-[10px] font-bold text-slate-400 hover:text-slate-600 transition uppercase tracking-[0.2em]"
              >
                Skip Stop
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setExpanded(true)}
            className="flex items-center gap-3 py-1"
          >
            <div className={`relative h-10 w-10 flex items-center justify-center rounded-xl transition-all ${
              isPlaying 
                ? 'bg-linear-to-br from-[#0b57d0] to-[#0a4cc0] text-white shadow-lg' 
                : 'bg-slate-50 text-slate-400 border border-slate-100'
            }`}>
              <span className="text-lg">{isPlaying ? '♪' : '🎙'}</span>
              {isPlaying && (
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white animate-pulse" />
              )}
            </div>
            <div className="flex flex-col items-start pr-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Admissions Guide</div>
              <div className="text-xs font-bold text-slate-900 truncate max-w-32">{title}</div>
            </div>
            <span className="text-slate-300 ml-1">›</span>
          </button>
        )}
      </div>
    </div>
  );
}
