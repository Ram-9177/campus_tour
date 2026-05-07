'use client';

import React, { useEffect, useMemo, useState } from 'react';
import engine from '@/lib/audioGuideEngine';
import mediaSync from '@/lib/mediaSyncEngine';
import { resolveLocationExperience } from '@/lib/locationExperienceResolver';
import { useTourSession } from '@/hooks/useTourSession';
import { locationTriggerEngine } from '@/lib/locationTriggerEngine';

const PrevIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/>
  </svg>
);

const NextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 18l8.5-6L6 6zm9-12v12h2V6z"/>
  </svg>
);

const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z"/>
  </svg>
);

const PauseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19h4V5H6zm8-14v14h4V5z"/>
  </svg>
);

const ReplayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
    <path d="M3 3v5h5"/>
  </svg>
);

export default function StickyAudioControlBar() {
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

  if (!activeLocation || !exp) return null;

  const isPlaying = state.isPlaying;
  const isLoading = state.isLoading;
  
  const locations = mediaSync.getLocations();
  const currentIndex = locations.findIndex(l => l.id === activeLocation.id);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === locations.length - 1;

  return (
    <div className="fixed inset-x-0 bottom-0 z-60 px-4 pb-6 sm:px-6 safe-area-bottom">
      <div className="mx-auto max-w-2xl overflow-hidden rounded-4xl border border-white/40 bg-slate-900/90 text-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] backdrop-blur-3xl ring-1 ring-white/10">
        
        {/* Progress bar at the top of the bar */}
        <div className="h-1.5 w-full bg-white/10">
          <div 
            className="h-full bg-blue-500 transition-all duration-300 ease-linear"
            style={{ width: `${state.progress * 100}%` }}
          />
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between gap-4">
            
            {/* Title and Language Info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">
                  {session?.language.toUpperCase()} • {session?.navigationMode.replace(/_/g, ' ').toUpperCase()}
                </span>
                {exp.missingAudio && (
                  <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[9px] font-black text-amber-400 uppercase tracking-tighter">
                    Audio Coming Soon
                  </span>
                )}
              </div>
              <h4 className="truncate text-lg font-black tracking-tight leading-tight mt-0.5">
                {exp.title}
              </h4>
            </div>

            {/* Replay Button */}
            <button 
              onClick={() => {
                if (activeLocation) {
                  locationTriggerEngine.resetTrigger(activeLocation.id);
                }
                engine.replay();
              }}
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-all active:scale-90"
              title="Replay from start"
            >
              <ReplayIcon />
            </button>
          </div>

          <div className="mt-5 grid grid-cols-5 gap-3">
            {/* Previous */}
            <button
              onClick={() => mediaSync.prev()}
              disabled={isFirst}
              className="flex flex-col items-center justify-center gap-1.5 rounded-2xl bg-white/5 py-4 transition hover:bg-white/10 disabled:opacity-10 disabled:cursor-not-allowed"
            >
              <PrevIcon />
              <span className="text-[9px] font-black uppercase tracking-widest opacity-80">Back</span>
            </button>

            {/* Play/Pause */}
            <button
              onClick={() => {
                if (isPlaying) engine.pause();
                else {
                  engine.registerUserGesture();
                  engine.play();
                }
              }}
              disabled={exp.missingAudio || isLoading}
              className={`col-span-1 flex h-16 items-center justify-center rounded-3xl transition-all active:scale-95 ${
                isPlaying ? 'bg-white text-slate-900 shadow-xl' : 'bg-blue-600 text-white shadow-xl shadow-blue-900/50'
              } disabled:bg-white/10 disabled:text-white/20`}
            >
              {isLoading ? (
                <div className="h-7 w-7 animate-spin rounded-full border-3 border-current border-t-transparent" />
              ) : isPlaying ? (
                <PauseIcon />
              ) : (
                <PlayIcon />
              )}
            </button>

            {/* Next or Finish */}
            {isLast ? (
              <button
                onClick={() => mediaSync.setCurrentByLocationId(null)}
                className="col-span-1 flex flex-col items-center justify-center gap-1.5 rounded-2xl bg-emerald-600 py-4 transition hover:bg-emerald-700 shadow-xl shadow-emerald-900/40"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                <span className="text-[9px] font-black uppercase tracking-widest">Done</span>
              </button>
            ) : (
              <button
                onClick={() => mediaSync.next()}
                className="flex flex-col items-center justify-center gap-1.5 rounded-2xl bg-white/5 py-4 transition hover:bg-white/10"
              >
                <NextIcon />
                <span className="text-[9px] font-black uppercase tracking-widest opacity-80">Next</span>
              </button>
            )}

            {/* Skip (Hidden if last) */}
            {!isLast ? (
              <button
                onClick={() => mediaSync.skip()}
                className="col-span-2 flex items-center justify-center gap-3 rounded-2xl border-2 border-white/10 bg-white/10 px-4 font-black text-xs uppercase tracking-[0.15em] transition hover:bg-white/20 hover:border-white/30 active:scale-95"
              >
                <span>Skip Stop</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            ) : (
              <div className="col-span-2 flex items-center justify-center px-4 text-center">
                 <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Arrived at Final Stop</span>
              </div>
            )}
          </div>
        </div>

        {/* Status bar */}
        {state.error && (
          <div className="bg-red-500 px-4 py-2 text-center text-[10px] font-black uppercase tracking-widest text-white animate-in slide-in-from-bottom-full">
            {state.error}
          </div>
        )}
      </div>
    </div>
  );
}
