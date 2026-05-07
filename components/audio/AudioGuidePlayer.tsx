'use client';

import React, { useEffect, useState } from 'react';
import engine from '@/lib/audioGuideEngine';
import mediaSync from '@/lib/mediaSyncEngine';
import type { CampusLocation } from '@/types/campusLocation';

export default function AudioGuidePlayer() {
  const [audioState, setAudioState] = useState(engine.getState());
  const [location, setLocation] = useState<CampusLocation | null>(mediaSync.getCurrent());

  useEffect(() => engine.subscribe(setAudioState), []);
  useEffect(() => mediaSync.subscribe((l) => setLocation(l || null)), []);

  if (!location) return null;

  const language = (audioState.language || 'en') as 'en' | 'te' | 'hi';
  const available = audioState.isAvailable;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-0.5">Now Visiting</div>
          <div className="text-sm font-bold text-slate-900 truncate">{location.name[language] || location.name.en}</div>
          <div className="text-[10px] text-slate-500 uppercase tracking-tighter mt-0.5">Campus {location.category} Stop</div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            type="button" 
            onClick={() => mediaSync.prev()} 
            className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition active:scale-95"
            title="Previous"
          >
            ⏮
          </button>

          <button 
            type="button" 
            onClick={() => mediaSync.next()} 
            className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition active:scale-95"
            title="Next"
          >
            ⏭
          </button>

          <div className="h-6 w-px bg-slate-100 mx-1" />

          {available ? (
            <>
              {audioState.isPlaying ? (
                <button 
                  onClick={() => engine.pause()} 
                  className="h-10 px-4 flex items-center gap-2 rounded-xl bg-slate-100 text-slate-900 text-xs font-bold hover:bg-slate-200 transition active:scale-95"
                >
                  <span>⏸</span> PAUSE
                </button>
              ) : (
                <button 
                  onClick={() => { engine.registerUserGesture(); engine.play(); }} 
                  className="h-10 px-4 flex items-center gap-2 rounded-xl bg-[#0b57d0] text-white text-xs font-bold hover:bg-[#0a4cc0] transition shadow-md active:scale-95"
                >
                  <span>▶</span> {audioState.isLoading ? 'LOADING' : audioState.isPaused ? 'RESUME' : 'PLAY'}
                </button>
              )}

              <button 
                onClick={() => engine.replay()} 
                className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition active:scale-95"
                title="Replay"
              >
                ↺
              </button>
            </>
          ) : (
            <div className="text-[10px] font-bold text-slate-400 uppercase bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
              Audio coming soon
            </div>
          )}

          {audioState.error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
              {audioState.error}
            </div>
          ) : null}

          <button 
            onClick={() => mediaSync.setCurrentByLocationId(null)} 
            className="h-10 px-3 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-600 text-xs font-bold transition"
          >
            SKIP
          </button>
        </div>
      </div>
    </div>
  );
}
