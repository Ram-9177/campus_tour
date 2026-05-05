'use client';

import React from 'react';
import { useLocationExperience } from '@/hooks/useLocationExperience';
import LocationExperienceCard from '../location/LocationExperienceCard';
import audioEngine from '@/lib/audioGuideEngine';

export default function CampusMapBottomSheet() {
  const { currentLocation, progress, resetTour, goToNext, goToPrev } = useLocationExperience();
  const audioState = audioEngine.getState();
  const language = (audioState.language || 'en') as 'en' | 'te' | 'hi';

  const showCompletion = !currentLocation && progress.isComplete;
  const showContent = !!currentLocation;

  if (!showContent && !showCompletion) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center p-4 sm:p-0 pointer-events-none">
      <div className="w-full max-w-2xl bg-white rounded-4xl shadow-[0_-12px_40px_rgba(0,0,0,0.12)] border-t border-slate-100 overflow-hidden pointer-events-auto animate-in slide-in-from-bottom duration-500 ease-out">
        {/* Visual Grabber */}
        <div className="flex justify-center py-4">
          <div className="h-1.5 w-12 rounded-full bg-slate-200" />
        </div>

        {/* Scrollable Container */}
        <div className="px-6 pb-8 pt-0 overflow-y-auto max-h-[80vh] sm:max-h-[70vh]">
          {showContent && currentLocation && (
            <>
              <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => goToPrev()}
                    className="h-11 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                  >
                    ⏮ Prev
                  </button>
                  <button
                    onClick={() => {
                      audioEngine.registerUserGesture();
                      if (audioState.currentLocation?.id !== currentLocation.id) {
                        audioEngine.loadLocation(currentLocation);
                      }
                      if (!audioEngine.getState().isAvailable) return;
                      if (audioState.isPlaying) {
                        audioEngine.pause();
                      } else {
                        audioEngine.play();
                      }
                    }}
                    disabled={!audioState.isAvailable}
                    className="h-11 rounded-xl bg-[#0b57d0] text-xs font-bold text-white hover:bg-[#0a4cc0] transition disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed"
                  >
                    {audioState.isAvailable
                      ? audioState.isPlaying
                        ? '⏸ Pause'
                        : audioState.isPaused
                          ? '▶ Resume'
                          : '▶ Play'
                      : `No ${language.toUpperCase()} script`}
                  </button>
                  <button
                    onClick={() => goToNext()}
                    className="h-11 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                  >
                    Next ⏭
                  </button>
                </div>
              </div>
              <LocationExperienceCard location={currentLocation} language={language} />
            </>
          )}

          {showCompletion && (
            <div className="py-12 text-center animate-in fade-in zoom-in duration-700">
              <div className="text-6xl mb-6">🎓</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Campus Tour Complete!</h3>
              <p className="text-sm text-slate-500 mb-8 max-w-sm mx-auto">
                You've explored all major campus highlights for this admission visit. We hope this helped parents and aspirants understand the campus better.
              </p>
              <div className="flex flex-col gap-3 max-w-xs mx-auto">
                <button
                  onClick={resetTour}
                  className="h-14 rounded-2xl bg-linear-to-r from-[#0b57d0] to-[#0a4cc0] text-white text-sm font-bold shadow-lg hover:shadow-xl transition active:scale-95"
                >
                  Restart Institutional Tour
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="h-12 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition"
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
