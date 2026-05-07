'use client';

import React, { useEffect, useMemo, useState } from 'react';
import engine from '@/lib/audioGuideEngine';
import mediaSync from '@/lib/mediaSyncEngine';
import { resolveLocationExperience } from '@/lib/locationExperienceResolver';
import { useTourSession } from '@/hooks/useTourSession';

export default function MiniAudioPlayer() {
  const { session } = useTourSession();
  const [state, setState] = useState(engine.getState());
  const [activeLocation, setActiveLocation] = useState(mediaSync.getCurrent());

  useEffect(() => {
    const unsubEngine = engine.subscribe(setState);
    const unsubMedia = mediaSync.subscribe((loc) => setActiveLocation(loc || null));
    return () => {
      unsubEngine();
      unsubMedia();
    };
  }, []);

  const exp = useMemo(() => {
    if (!activeLocation || !session) return null;
    return resolveLocationExperience({
      location: activeLocation,
      mode: session.navigationMode,
      language: session.language
    });
  }, [activeLocation, session]);

  // Only show mini player if StickyAudioControlBar is NOT likely to be shown 
  // OR if we want it as a fallback. 
  // Actually, the user wants both updated. I'll make this one a floating status pill.
  if (!activeLocation || !exp) return null;

  const isPlaying = state.isPlaying;

  return (
    <div className="fixed right-4 top-24 z-40 animate-in fade-in slide-in-from-right duration-500">
      <button
        onClick={() => mediaSync.setCurrentByLocationId(activeLocation.id)}
        className={`flex items-center gap-3 rounded-full border border-white/20 bg-slate-900/80 p-1.5 pr-4 text-white shadow-xl backdrop-blur-xl transition-all active:scale-95 ${
          isPlaying ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-transparent' : ''
        }`}
      >
        <div className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
          isPlaying ? 'bg-blue-600' : 'bg-white/10'
        }`}>
          {isPlaying ? (
            <div className="flex items-end gap-0.5 h-3">
              <div className="w-0.5 bg-white animate-[bounce_0.6s_ease-in-out_infinite]" style={{ height: '60%' }} />
              <div className="w-0.5 bg-white animate-[bounce_0.8s_ease-in-out_infinite]" style={{ height: '100%' }} />
              <div className="w-0.5 bg-white animate-[bounce_0.5s_ease-in-out_infinite]" style={{ height: '40%' }} />
            </div>
          ) : (
            <span className="text-[10px] font-black opacity-40">OFF</span>
          )}
        </div>
        <div className="text-left">
          <div className="text-[9px] font-black uppercase tracking-widest text-blue-400">Audio Active</div>
          <div className="max-w-25 truncate text-xs font-bold leading-tight">{exp.title}</div>
        </div>
      </button>
    </div>
  );
}
