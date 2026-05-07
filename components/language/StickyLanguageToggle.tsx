'use client';

import { useState } from 'react';
import { useLanguagePreference } from '@/hooks/useLanguagePreference';
import type { AppLanguage } from '@/types/appRules';

const LANGUAGES: { id: AppLanguage; label: string; native: string }[] = [
  { id: 'en', label: 'English', native: 'English' },
  { id: 'te', label: 'Telugu', native: 'తెలుగు' },
  { id: 'hi', label: 'Hindi', native: 'हिंदी' },
];

export default function StickyLanguageToggle() {
  const { language, setLanguage } = useLanguagePreference();
  const [isOpen, setIsOpen] = useState(false);

  const activeLang = LANGUAGES.find((l) => l.id === language) || LANGUAGES[0];

  return (
    <div className="fixed bottom-36 right-6 z-60 flex flex-col items-end gap-4 pointer-events-none sm:bottom-40">
      {/* Language Options */}
      {isOpen && (
        <>
          {/* Backdrop to close when clicking outside */}
          <div 
            className="fixed inset-0 z-[-1] bg-slate-900/10 backdrop-blur-[2px] pointer-events-auto"
            onClick={() => setIsOpen(false)}
          />
          <div className="flex flex-col gap-3 pointer-events-auto animate-in slide-in-from-bottom-4 fade-in duration-300">
            {LANGUAGES.filter(l => l.id !== language).map((lang) => (
              <button
                key={lang.id}
                onClick={() => {
                  setLanguage(lang.id);
                  setIsOpen(false);
                }}
                className="group flex h-16 w-40 items-center justify-between rounded-2xl bg-white/95 border border-slate-200 pl-5 pr-4 shadow-[0_12px_24px_-8px_rgba(0,0,0,0.15)] backdrop-blur-md active:scale-95 transition-all hover:border-blue-300 hover:bg-blue-50/50"
              >
                <div className="flex flex-col items-start">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-blue-500 transition-colors">{lang.label}</span>
                  <span className="text-lg font-black text-slate-900 leading-tight">{lang.native}</span>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 group-hover:bg-blue-100 transition-colors text-slate-400 group-hover:text-blue-600">
                   <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                   </svg>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Main Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`pointer-events-auto flex h-24 w-24 flex-col items-center justify-center rounded-[2.5rem] shadow-[0_24px_48px_-12px_rgba(30,58,138,0.4)] ring-8 ring-white active:scale-90 transition-all duration-300 ${
          isOpen ? 'bg-slate-900 text-white' : 'bg-linear-to-br from-blue-600 to-blue-800 text-white'
        }`}
        aria-label="Change Language"
      >
        {isOpen ? (
          <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">Language</span>
            <span className="text-3xl font-black">{activeLang.id.toUpperCase()}</span>
          </div>
        )}
      </button>
    </div>
  );
}
