'use client';

import { useEffect, useState } from 'react';
import type { CampusLocation } from '@/types/campusLocation';
import audioEngine from '@/lib/audioGuideEngine';
import mediaSync from '@/lib/mediaSyncEngine';
import radiusDetectionEngine from '@/lib/radiusDetection';

interface NearbyLocationPromptProps {
  location: CampusLocation;
  distance: number;
  language: 'en' | 'te' | 'hi';
}

export default function NearbyLocationPrompt({
  location,
  distance,
  language,
}: NearbyLocationPromptProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioState, setAudioState] = useState(audioEngine.getState());

  useEffect(() => {
    const unsubscribe = audioEngine.subscribe(setAudioState);
    return unsubscribe;
  }, []);

  const getDescription = (loc: CampusLocation) => {
    const descriptions: Record<'en' | 'te' | 'hi', string | undefined> = {
      en: loc.description.en,
      te: loc.description.te,
      hi: loc.description.hi,
    };
    return descriptions[language] || 'Content coming soon in selected language';
  };

  const handlePlayAudio = () => {
    audioEngine.registerUserGesture();
    mediaSync.setCurrentByLocationId(location.id);
    audioEngine.loadLocation(location);
    audioEngine.play();
    setIsPlaying(true);
  };

  const handleDismiss = () => {
    // Dismiss by stopping audio
    audioEngine.stop();
  };

  const handleReplay = () => {
    radiusDetectionEngine.replayLocation(location.id);
  };

  const distanceText =
    distance < 1000
      ? `${Math.round(distance)}m away`
      : `${(distance / 1000).toFixed(1)}km away`;

  return (
    <div className="fixed inset-0 flex items-end z-50 pointer-events-none">
      <div className="w-full max-h-96 bg-white rounded-t-3xl shadow-2xl pointer-events-auto animate-in slide-in-from-bottom duration-300">
        {/* Close handle */}
        <div className="flex justify-center pt-3">
          <div className="h-1.5 w-12 rounded-full bg-slate-300" />
        </div>

        {/* Content */}
        <div className="px-6 pb-6 overflow-y-auto" style={{ maxHeight: 'calc(100% - 40px)' }}>
          {/* Badge + title */}
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-teal-100 text-teal-900 text-xs font-semibold rounded-full mb-2">
              {location.category}
            </span>
            <h3 className="text-2xl font-bold text-slate-900">{location.name[language]}</h3>
            <p className="text-sm text-slate-500 mt-1">📍 {distanceText}</p>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-700 leading-relaxed mb-4">
            {getDescription(location)}
          </p>

          {/* Action buttons */}
          <div className="flex flex-col gap-3 mt-4">
            <button
              onClick={handlePlayAudio}
              className="w-full h-12 px-4 bg-linear-to-r from-[#0b57d0] to-[#0a4cc0] hover:shadow-lg text-white font-semibold rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              🎙 Play Audio Guide
            </button>

            <button
              onClick={handleDismiss}
              className="w-full h-11 px-4 bg-slate-200 hover:bg-slate-300 text-slate-900 font-medium rounded-xl transition-all active:scale-95"
            >
              Close
            </button>
          </div>

          {/* Hint text */}
          <p className="text-xs text-slate-500 text-center mt-4">
            Tap close to dismiss this notification
          </p>
        </div>
      </div>
    </div>
  );
}
