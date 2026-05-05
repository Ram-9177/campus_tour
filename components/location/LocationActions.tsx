'use client';

import React, { useEffect, useState } from 'react';
import mediaSync from '@/lib/mediaSyncEngine';
import audioEngine from '@/lib/audioGuideEngine';

interface Props {
  locationId: string;
}

export default function LocationActions({ locationId }: Props) {
  const [audioState, setAudioState] = useState(audioEngine.getState());

  useEffect(() => {
    return audioEngine.subscribe(setAudioState);
  }, []);

  const isCurrentLocation = audioState.currentLocation?.id === locationId;
  const isPlaying = audioState.isPlaying && isCurrentLocation;
  const isPaused = audioState.isPaused && isCurrentLocation;

  const handlePlayToggle = () => {
    audioEngine.registerUserGesture();
    
    if (!isCurrentLocation) {
      // If this isn't the currently active location in the sync engine, select it first
      mediaSync.setCurrentByLocationId(locationId);
      // Brief timeout to ensure the engine state updates before playing
      setTimeout(() => audioEngine.play(), 50);
    } else {
      if (isPlaying) {
        audioEngine.pause();
      } else {
        audioEngine.play();
      }
    }
  };

  return (
    <div className="space-y-4 mt-6">
      {/* Primary Action: Play Audio */}
      <button
        onClick={handlePlayToggle}
        className={`h-14 w-full flex items-center justify-center gap-3 rounded-2xl text-sm font-bold transition-all transform active:scale-95 shadow-lg ${
          isPlaying 
            ? 'bg-slate-100 text-slate-900 shadow-none border border-slate-200' 
            : 'bg-linear-to-r from-[#0b57d0] to-[#0a4cc0] text-white hover:shadow-xl'
        }`}
      >
        <span className="text-xl">{isPlaying ? '⏸' : '🎙'}</span>
        <span>
          {isPlaying ? 'Pause Narration' : isPaused ? 'Resume Narration' : 'Play Audio Guide'}
        </span>
      </button>

      {!audioState.isAvailable && !audioState.isLoading && (
        <p className="text-[10px] text-center text-amber-600 font-bold uppercase tracking-widest">
          No script in selected language for this location
        </p>
      )}


      {/* Secondary Actions: Navigation */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          onClick={() => mediaSync.prev()}
          className="h-12 flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 transition active:scale-95"
        >
          <span>←</span>
          <span>PREVIOUS</span>
        </button>
        <button
          onClick={() => mediaSync.next()}
          className="h-12 flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 transition active:scale-95"
        >
          <span>NEXT</span>
          <span>→</span>
        </button>
      </div>

      <button
        onClick={() => mediaSync.setCurrentByLocationId(null)}
        className="h-10 w-full text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] hover:text-slate-600 transition"
      >
        Dismiss Exploration
      </button>
    </div>
  );
}
