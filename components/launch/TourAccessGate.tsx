'use client';

import { useState } from 'react';
import audioEngine from '@/lib/audioGuideEngine';
import { useTourSession } from '@/hooks/useTourSession';
import { useCampusAccess } from '@/hooks/useCampusAccess';
import { useLanguagePreference } from '@/hooks/useLanguagePreference';
import type { AppTourMode, AppLanguage } from '@/types/appRules';
import InsideCampusModeSelector from './InsideCampusModeSelector';
import OutsideCampusVirtualOnly from './OutsideCampusVirtualOnly';
import LocationUnavailableFallback from './LocationUnavailableFallback';
import BrandLogo from '@/components/layout/BrandLogo';
import { useSelectedLanguage } from '@/hooks/useSelectedLanguage';

interface TourAccessGateProps {
  onSelectMode: (mode: AppTourMode) => void;
}

const LANGUAGES: { id: AppLanguage; label: string; sub: string }[] = [
  { id: 'en', label: 'English', sub: 'Campus Guide' },
  { id: 'te', label: 'తెలుగు', sub: 'క్యాంపస్ గైడ్' },
  { id: 'hi', label: 'हिन्दी', sub: 'कैंपस गाइड' },
];

export default function TourAccessGate({ onSelectMode }: TourAccessGateProps) {
  const { session, patch } = useTourSession();
  const { language: selectedLang, setLanguage: setSelectedLang } = useLanguagePreference();
  const { accessOutcome, isCheckingLocation, requestCampusAccess } = useCampusAccess();
  const { t } = useSelectedLanguage();

  const handleStartCampusTour = async () => {
    patch({ language: selectedLang });
    audioEngine.registerUserGesture();
    patch({ audioStarted: true });
    await requestCampusAccess();
  };

  const handleOpenVirtualTour = () => {
    onSelectMode('virtual_tour');
  };

  const handleSelectMode = (mode: AppTourMode) => {
    onSelectMode(mode);
  };

  // 1. Initial Welcome & Language Selection Screen
  if (!accessOutcome && !isCheckingLocation) {
    return (
      <section className="mx-auto w-full max-w-xl text-center px-4">
        <div className="mb-12 flex flex-col items-center">
           <div className="h-24 w-24 sm:h-28 sm:w-28 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-blue-900/5 flex items-center justify-center p-5 mb-8 animate-in">
              <BrandLogo className="h-full w-full object-contain" />
           </div>
           <h1 className="text-4xl font-black text-slate-900 tracking-tight sm:text-5xl animate-in delay-100">
             {t({ en: 'Campus Guide', te: 'క్యాంపస్ గైడ్', hi: 'कैंपस गाइड' })}
           </h1>
           <p className="mt-4 text-slate-600 text-xl font-medium animate-in delay-200">
             {t({ en: 'Experience St. Mary\'s University', te: 'సెయింట్ మేరీస్ యూనివర్సిటీని అనుభవించండి', hi: 'सेंट मैरी विश्वविद्यालय का अनुभव करें' })}
           </p>
        </div>

        <div className="panel-soft p-8 bg-white/50 backdrop-blur shadow-sm mb-10 animate-in delay-300">
          <div className="mb-6 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">
             {t({ en: 'Choose Your Language', te: 'మీ భాషను ఎంచుకోండి', hi: 'अपनी भाषा चुनें' })}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.id}
                type="button"
                onClick={() => setSelectedLang(lang.id)}
                className={`flex flex-col items-center justify-center rounded-4xl border-2 h-28 transition-all active:scale-[0.97] ${
                  selectedLang === lang.id
                    ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-lg shadow-blue-900/10'
                    : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
                }`}
              >
                <span className="text-2xl font-black">{lang.label}</span>
                <span className="mt-1 text-[10px] font-black uppercase tracking-widest opacity-50">{lang.sub}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleStartCampusTour}
          className="flex h-20 w-full items-center justify-center rounded-[2.5rem] bg-blue-600 px-8 text-2xl font-black text-white shadow-[0_24px_48px_-12px_rgba(37,99,235,0.45)] transition-all hover:bg-blue-700 active:scale-95 animate-in delay-400"
        >
          {t({ en: 'Begin Your Visit', te: 'మీ పర్యటనను ప్రారంభించండి', hi: 'अपनी यात्रा शुरू करें' })}
        </button>
        
        <div className="mt-10 space-y-4 animate-in delay-500">
          <p className="text-base font-bold text-slate-500 leading-relaxed max-w-sm mx-auto">
             {t({ 
               en: 'We use GPS to guide you across the campus grounds.', 
               te: 'క్యాంపస్ ద్వారా మీకు మార్గనిర్దేశం చేయడానికి మేము మీ GPSని ఉపయోగిస్తాము.', 
               hi: 'कैंपस में आपका मार्गदर्शन करने के लिए हम आपके GPS का उपयोग करते हैं।' 
             })}
          </p>
          <div className="flex items-center justify-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            <span className="flex items-center gap-2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              {t({ en: 'No Tracking', te: 'ట్రాకింగ్ లేదు', hi: 'कोई ट्रैकिंग नहीं' })}
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
            <span className="flex items-center gap-2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              {t({ en: 'Anonymous', te: 'అజ్ఞాతంగా', hi: 'अनाम' })}
            </span>
          </div>
        </div>
      </section>
    );
  }

  // 2. Loading State (Location Check)
  if (isCheckingLocation) {
    return (
      <section className="mx-auto w-full max-w-md text-center py-20 px-6">
        <div className="relative mx-auto mb-12 h-24 w-24">
          <div className="absolute inset-0 animate-ping rounded-full bg-blue-100 opacity-75" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-slate-100 border-t-blue-600 bg-white shadow-xl">
             <svg className="h-10 w-10 text-blue-600 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          {t({ en: 'Finding You...', te: 'మిమ్మల్ని గుర్తిస్తున్నాము...', hi: 'आपको ढूँढ रहे हैं...' })}
        </h2>
        <p className="mt-4 text-slate-600 text-lg font-medium">
          {t({ en: 'Preparing your campus experience. Please allow location access.', te: 'దయచేసి లొకేషన్ యాక్సెస్‌ను అనుమతించండి.', hi: 'कृपया स्थान पहुंच की अनुमति दें।' })}
        </p>
        
        <div className="mt-16 pt-8 border-t border-slate-100">
          <button
            type="button"
            onClick={handleOpenVirtualTour}
            className="text-sm font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 underline underline-offset-8"
          >
            {t({ en: 'Explore Remotely', te: 'వర్చువల్ టూర్‌కి వెళ్లండి', hi: 'वर्चुअल टूर पर जाएं' })}
          </button>
        </div>
      </section>
    );
  }

  // 3. Outcome Screens
  if (accessOutcome) {
    if (accessOutcome.decision === 'inside-campus') {
      return <InsideCampusModeSelector message={accessOutcome.message} onSelectMode={handleSelectMode} />;
    }

    if (accessOutcome.decision === 'outside-campus') {
      return <OutsideCampusVirtualOnly message={accessOutcome.message} onOpenVirtualTour={handleOpenVirtualTour} />;
    }

    return (
      <LocationUnavailableFallback
        message={accessOutcome.message}
        onOpenVirtualTour={handleOpenVirtualTour}
        onTryLocationAgain={() => {
          void handleStartCampusTour();
        }}
        isCheckingLocation={isCheckingLocation}
      />
    );
  }

  return null;
}
