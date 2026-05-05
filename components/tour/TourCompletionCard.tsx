'use client';

import React from 'react';
import { locationSequence as sequence } from '@/lib/locationSequence';

export default function TourCompletionCard() {
  const progress = sequence.getProgress();
  
  return (
    <div className="glass rounded-4xl p-10 text-center animate-in shadow-2xl border-blue-100">
      <div className="relative mb-8 flex justify-center">
        <div className="absolute inset-0 bg-emerald-100/50 rounded-full blur-3xl scale-150 animate-pulse-soft" />
        <div className="relative text-7xl">🎉</div>
      </div>

      <div className="space-y-3 mb-10">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">
          Tour Accomplished
        </p>
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">
          Campus Discovered!
        </h2>
        <p className="text-sm leading-relaxed text-slate-500 max-w-[280px] mx-auto">
          You've successfully explored all key institutional points. We hope you enjoyed the journey.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div className="text-2xl font-black text-slate-900">{progress.visitedIds.size}</div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Points Visited</div>
        </div>
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div className="text-2xl font-black text-slate-900">100%</div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Completion</div>
        </div>
      </div>

      <div className="space-y-3">
        <button 
          onClick={() => window.location.href = '/'}
          className="btn-premium w-full"
        >
          Finish & Return Home
        </button>
        <button 
          onClick={() => sequence.reset()}
          className="h-12 w-full text-[10px] font-bold text-slate-400 hover:text-slate-600 transition uppercase tracking-[0.2em]"
        >
          Restart Tour
        </button>
      </div>
    </div>
  );
}
