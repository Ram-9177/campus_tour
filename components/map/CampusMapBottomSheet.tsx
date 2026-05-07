'use client';

import React, { useState } from 'react';
import { useLocationExperience } from '@/hooks/useLocationExperience';
import LocationExperienceCard from '../location/LocationExperienceCard';
import AdmissionsCTASection from '../location/AdmissionsCTASection';
import audioEngine from '@/lib/audioGuideEngine';
import { LocationStore } from '@/lib/locationStore';
import { trackTourComplete } from '@/lib/publicTourEvents';

export default function CampusMapBottomSheet() {
  const { currentLocation, progress, resetTour } = useLocationExperience();
  const [mounted, setMounted] = useState(false);

  const mainGate = React.useMemo(() => LocationStore.getAllLocations().find(l => l.category === 'gate'), []);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const audioState = audioEngine.getState();
  const language = (audioState.language || 'en') as 'en' | 'te' | 'hi';

  const showCompletion = !currentLocation && progress.isComplete;
  const showContent = !!currentLocation;

  React.useEffect(() => {
    if (showCompletion) {
      trackTourComplete(progress.visitedIds.size);
    }
  }, [showCompletion, progress.visitedIds.size]);

  if (!mounted) return null;
  if (!showContent && !showCompletion) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center p-3 sm:p-4">
      <div className="pointer-events-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-200 bg-white/98 shadow-[0_-18px_40px_-24px_rgba(15,23,42,0.45)] backdrop-blur animate-in slide-in-from-bottom duration-500 ease-out">
        <div className="flex justify-center py-3">
          <div className="h-1.5 w-12 rounded-full bg-slate-200" />
        </div>

        <div className="max-h-[80vh] overflow-y-auto px-5 pb-7 pt-0 sm:max-h-[72vh] sm:px-6">
          {showContent && currentLocation && (
            <>
              {audioState.error ? (
                <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-base font-medium text-red-700">
                  {audioState.error}
                </div>
              ) : null}
              <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Current Stop</div>
                    <div className="text-[1.1rem] font-black tracking-tight text-slate-900">{currentLocation.name[language] || currentLocation.name.en}</div>
                  </div>
                  <div className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-700">
                    Visited: {progress.visitedIds.size}
                  </div>
                </div>
              </div>
              <LocationExperienceCard location={currentLocation} language={language} />
            </>
          )}

          {showCompletion && (
            <div className="py-12 text-center animate-in fade-in zoom-in duration-700">
              <div className="mx-auto mb-5 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold uppercase tracking-wide text-emerald-700">Tour Complete</div>
              <h3 className="mb-2 text-3xl font-black tracking-tight text-slate-900">Campus Tour Complete!</h3>
              <p className="mx-auto mb-8 max-w-sm text-base text-slate-500">
                You've explored all major campus highlights for this admission visit. We hope this helped parents and aspirants understand the campus better.
              </p>
              
              <div className="mb-8">
                <AdmissionsCTASection cta={mainGate?.admissionsCta} />
              </div>

              <div className="mx-auto flex max-w-xs flex-col gap-3">
                <button
                  onClick={resetTour}
                  className="h-14 rounded-2xl bg-linear-to-r from-[#0b57d0] to-[#0a4cc0] text-base font-bold text-white shadow-lg transition hover:shadow-xl active:scale-95"
                >
                  Restart Institutional Tour
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="h-12 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Close & Explore Manually
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
