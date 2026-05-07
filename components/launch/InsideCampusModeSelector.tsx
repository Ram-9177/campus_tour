'use client';

import type { AppTourMode } from '@/types/appRules';

interface InsideCampusModeSelectorProps {
  onSelectMode: (mode: AppTourMode) => void;
  message?: string | null;
}

const MODE_OPTIONS: Array<{
  mode: AppTourMode;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}> = [
  {
    mode: 'campus_cart',
    label: 'Campus Buggy Tour',
    description: 'Perfect if you are sitting in an official campus vehicle.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="10" rx="2" />
        <circle cx="7" cy="21" r="2" />
        <circle cx="17" cy="21" r="2" />
        <path d="M19 11V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v5" />
      </svg>
    ),
    color: 'bg-blue-600',
  },
  {
    mode: 'walk_with_me',
    label: 'Walk or Private Vehicle',
    description: 'Guided experience while walking or driving yourself.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 4v16" />
        <path d="M17 14l-4 4-4-4" />
        <path d="M17 10l-4-4-4 4" />
      </svg>
    ),
    color: 'bg-emerald-600',
  },
  {
    mode: 'manual_explore',
    label: 'Manual Explore',
    description: 'Browse the campus map at your own pace.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
        <line x1="8" y1="2" x2="8" y2="18" />
        <line x1="16" y1="6" x2="16" y2="22" />
      </svg>
    ),
    color: 'bg-orange-600',
  },
];

export default function InsideCampusModeSelector({ onSelectMode, message }: InsideCampusModeSelectorProps) {
  return (
    <section className="mx-auto w-full max-w-2xl px-4 animate-in">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Welcome to Campus</h1>
        <p className="mt-3 text-xl font-medium text-slate-600 italic">How would you like to explore today?</p>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {MODE_OPTIONS.map((option) => (
          <button
            key={option.mode}
            type="button"
            onClick={() => onSelectMode(option.mode)}
            className="group flex w-full items-center gap-6 rounded-[2.5rem] border-2 border-slate-100 bg-white p-7 text-left transition-all hover:border-blue-200 hover:bg-blue-50 active:scale-[0.98] shadow-sm hover:shadow-xl hover:shadow-blue-900/5"
          >
            <div className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl ${option.color} text-white shadow-lg group-hover:scale-110 transition-transform`}>
              {option.icon}
            </div>
            <div className="flex-1">
              <div className="text-2xl font-black text-slate-900 leading-tight">{option.label}</div>
              <p className="mt-2 text-slate-500 font-bold text-base leading-snug">{option.description}</p>
            </div>
            <div className="text-slate-300 group-hover:text-blue-500 transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </div>
          </button>
        ))}
      </div>
      
      <div className="mt-12 flex flex-col items-center gap-4">
        <button
          onClick={() => onSelectMode('virtual_tour')}
          className="text-sm font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
        >
          Or Switch to Virtual Mode
        </button>
        {message && (
          <div className="rounded-2xl bg-blue-50 px-6 py-3 text-xs font-black text-blue-700 uppercase tracking-widest border border-blue-100">
            {message}
          </div>
        )}
      </div>
    </section>
  );
}
