'use client';

import React, { useEffect, useState } from 'react';
import mediaSync from '@/lib/mediaSyncEngine';
import audioEngine from '@/lib/audioGuideEngine';
import ModernAudioController from './ModernAudioController';

const ChevronLeftIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const XCircleIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

interface Props {
  locationId: string;
}

export default function LocationActions({ locationId }: Props) {
  const [audioState, setAudioState] = useState(audioEngine.getState());

  useEffect(() => {
    return audioEngine.subscribe(setAudioState);
  }, []);

  const isCurrentLocation = audioState.currentLocation?.id === locationId;

  return (
    <div className="space-y-6 mt-2">
      {isCurrentLocation && <ModernAudioController />}

      {!isCurrentLocation && (
        <button
          onClick={() => {
            audioEngine.registerUserGesture();
            mediaSync.setCurrentByLocationId(locationId);
            setTimeout(() => {
              void audioEngine.play();
            }, 100);
          }}
          className="flex h-16 w-full items-center justify-center gap-3 rounded-2xl bg-linear-to-r from-blue-600 to-blue-700 text-white text-lg font-bold shadow-xl hover:shadow-blue-200 transition-all active:scale-95"
        >
          <span className="text-2xl">▶</span>
          <span>Start Audio Guide</span>
        </button>
      )}

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => mediaSync.prev()}
          className="flex items-center justify-center gap-2 h-14 rounded-2xl border border-slate-200 bg-white px-4 text-[0.95rem] font-bold text-slate-700 transition hover:bg-slate-50 hover:border-slate-300 active:scale-95 shadow-sm"
        >
          <ChevronLeftIcon className="w-5 h-5" />
          Previous
        </button>
        <button
          onClick={() => mediaSync.next()}
          className="flex items-center justify-center gap-2 h-14 rounded-2xl border border-slate-200 bg-white px-4 text-[0.95rem] font-bold text-slate-700 transition hover:bg-slate-50 hover:border-slate-300 active:scale-95 shadow-sm"
        >
          Next
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>

      <button
        onClick={() => mediaSync.setCurrentByLocationId(null)}
        className="flex items-center justify-center gap-2 h-12 w-full rounded-2xl text-sm font-bold text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
      >
        <XCircleIcon className="w-4 h-4" />
        Close Stop Details
      </button>
    </div>
  );
}

