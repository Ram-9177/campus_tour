import React, { useEffect, useState } from 'react';
import LocationCard from '../location/LocationCard';
import mediaSync from '@/lib/mediaSyncEngine';
import audioEngine from '@/lib/audioGuideEngine';

export default function MapBottomSheet() {
  const [loc, setLoc] = useState<any | null>(null);
  const [audioState, setAudioState] = useState(audioEngine.getState());

  useEffect(() => mediaSync.subscribe((l) => setLoc(l)), []);
  useEffect(() => audioEngine.subscribe(setAudioState), []);

  if (!loc) return null;

  const language = (audioState.language || 'en') as 'en' | 'te' | 'hi';

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex justify-center bg-black/20 backdrop-blur-sm transition-all duration-300">
      <div className="w-full max-w-2xl rounded-t-3xl bg-white border-t border-slate-200 shadow-2xl overflow-y-auto" style={{ maxHeight: '70vh' }}>
        {/* Premium drag handle */}
        <div className="sticky top-0 bg-white rounded-t-3xl px-4 py-4 flex justify-center border-b border-slate-100">
          <div className="h-1.5 w-12 rounded-full bg-slate-300 opacity-60" />
        </div>

        {/* Content */}
        <div className="px-4 pb-6 pt-2">
          <LocationCard location={loc} language={language} />

          {/* Navigation buttons with better spacing */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:flex sm:gap-2">
            <button 
              onClick={() => mediaSync.prev()} 
              className="rounded-xl border border-slate-300 hover:border-slate-400 hover:bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 transition-all active:scale-95"
            >
              ← Previous
            </button>
            <button 
              onClick={() => mediaSync.next()} 
              className="rounded-xl border border-slate-300 hover:border-slate-400 hover:bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 transition-all active:scale-95"
            >
              Next →
            </button>
            <button 
              onClick={() => mediaSync.setCurrentByLocationId(null)} 
              className="rounded-xl border border-slate-300 hover:border-slate-400 hover:bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 transition-all active:scale-95"
            >
              Skip
            </button>
            <button 
              onClick={() => mediaSync.setCurrentByLocationId(null)} 
              className="rounded-xl bg-linear-to-r from-[#0b57d0] to-[#0a4cc0] hover:shadow-lg px-4 py-3 text-sm font-semibold text-white transition-all active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
