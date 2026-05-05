'use client';

import { useEffect, useState } from 'react';
import type { CampusLocation } from '@/types/campusLocation';
import audioEngine from '@/lib/audioGuideEngine';
import { getScriptForLocation } from '@/lib/scriptStore';

type Language = 'en' | 'te' | 'hi';

interface VirtualLocationPanelProps {
  location: CampusLocation;
  language: Language;
  currentIndex: number;
  totalLocations: number;
}

export default function VirtualLocationPanel({
  location,
  language,
  currentIndex,
  totalLocations,
}: VirtualLocationPanelProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioAvailable, setAudioAvailable] = useState(true);
  const [imageIndex, setImageIndex] = useState(0);

  const images = Array.isArray(location.images) && location.images.length > 0 ? location.images : ['/images/location-fallback.svg'];
  const videoUrl = Array.isArray(location.videos) && location.videos.length > 0 ? location.videos[0] : null;
  const activeImage = images[Math.min(imageIndex, images.length - 1)] || '/images/location-fallback.svg';

  // Subscribe to audio engine changes
  useEffect(() => {
    const unsubscribe = audioEngine.subscribe((state) => {
      setIsPlaying(state.isPlaying);
      setIsLoading(state.isLoading);
      setAudioAvailable(state.isAvailable);
    });
    return unsubscribe;
  }, []);

  // Load location audio when location changes
  useEffect(() => {
    audioEngine.loadLocation(location);
  }, [location, language]);

  useEffect(() => {
    setImageIndex(0);
  }, [location.id]);

  const handlePlayAudio = () => {
    audioEngine.registerUserGesture();
    if (isPlaying) {
      audioEngine.pause();
    } else {
      audioEngine.play();
    }
  };

  const handleReplay = () => {
    audioEngine.replay();
  };

  const getDescription = (loc: CampusLocation) => {
    const descriptions: Record<Language, string | undefined> = {
      en: loc.description.en,
      te: loc.description.te,
      hi: loc.description.hi,
    };
    return descriptions[language] || 'Content coming soon in selected language';
  };

  const getScript = (loc: CampusLocation) => {
    return getScriptForLocation(loc, language);
  };

  const handlePrevImage = () => {
    setImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNextImage = () => {
    setImageIndex((prev) => (prev + 1) % images.length);
  };

  const isPlayableVideo = (url: string | null) => {
    if (!url) return false;
    return url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg');
  };

  return (
    <div className="space-y-6">
      {/* Large media display - cinematic hero */}
      <div className="relative bg-linear-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl aspect-video flex items-center justify-center group">
        <img
          src={activeImage}
          alt={`${location.name[language]} gallery ${imageIndex + 1}`}
          className="absolute inset-0 h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.src = '/images/location-fallback.svg';
          }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />

        {images.length > 1 ? (
          <>
            <button
              type="button"
              onClick={handlePrevImage}
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/40 bg-slate-900/60 px-3 py-2 text-white hover:bg-slate-900/80"
            >
              ←
            </button>
            <button
              type="button"
              onClick={handleNextImage}
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/40 bg-slate-900/60 px-3 py-2 text-white hover:bg-slate-900/80"
            >
              →
            </button>
          </>
        ) : null}

        {/* Overlay - location name and category badge */}
        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent flex flex-col justify-end p-6">
          <div className="mb-3">
            <span className="inline-block px-3 py-1 bg-blue-600/80 text-white text-xs font-medium rounded-full mb-2">
              {location.category}
            </span>
            <span className="ml-2 inline-block px-2.5 py-1 bg-slate-900/70 text-white text-[11px] font-medium rounded-full border border-slate-600">
              {imageIndex + 1}/{images.length}
            </span>
          </div>
          <h2 className="text-3xl font-bold text-white drop-shadow-lg">{location.name[language]}</h2>
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 ? (
        <div className="grid grid-cols-4 gap-2">
          {images.map((img, idx) => (
            <button
              type="button"
              key={`${img}-${idx}`}
              onClick={() => setImageIndex(idx)}
              className={`overflow-hidden rounded-lg border transition ${
                idx === imageIndex ? 'border-blue-400 ring-2 ring-blue-500/40' : 'border-slate-700'
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="h-20 w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/images/location-fallback.svg';
                }}
              />
            </button>
          ))}
        </div>
      ) : null}

      {/* Video */}
      {videoUrl ? (
        <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
          <div className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-300">Campus Video</div>
          {isPlayableVideo(videoUrl) ? (
            <video className="w-full rounded-lg border border-slate-700 bg-black" controls preload="metadata">
              <source src={videoUrl} />
              Your browser does not support the video tag.
            </video>
          ) : (
            <a
              href={videoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Open Video
            </a>
          )}
        </div>
      ) : null}

      {/* Description in selected language */}
      <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
        <div className="text-sm text-slate-400 uppercase tracking-wide font-semibold mb-3">
          Location Details
        </div>
        <p className="text-slate-200 leading-relaxed mb-4">
          {getDescription(location)}
        </p>

        {/* Audio script if available */}
        {getScript(location) && (
          <div className="mt-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
            <div className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-2">
              Audio Guide Script
            </div>
            <p className="text-sm text-slate-300 leading-relaxed italic">
              {getScript(location) || 'Content coming soon in selected language'}
            </p>
          </div>
        )}
      </div>

      {/* Audio guide controls */}
      <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
        <div className="text-sm text-slate-400 uppercase tracking-wide font-semibold mb-4 flex items-center gap-2">
          🔊 Audio Guide
        </div>

        {!audioAvailable ? (
          <div className="p-4 bg-amber-900/30 border border-amber-700 rounded-lg text-sm text-amber-200">
            Audio coming soon for this location
          </div>
        ) : (
          <div className="space-y-3">
            <button
              onClick={handlePlayAudio}
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition ${
                isPlaying
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-slate-700 disabled:text-slate-400'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  Loading...
                </>
              ) : isPlaying ? (
                <>
                  ⏸ Pause Audio
                </>
              ) : (
                <>
                  ▶ Play Audio
                </>
              )}
            </button>

            <button
              onClick={handleReplay}
              disabled={isLoading || !isPlaying}
              className="w-full py-2 px-4 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 text-slate-200 rounded-lg font-medium flex items-center justify-center gap-2 transition"
            >
              ↻ Replay
            </button>

            {/* Language indicator */}
            <div className="text-xs text-slate-400 text-center mt-2">
              {language === 'en' && 'English Audio'}
              {language === 'te' && 'తెలుగు (Telugu) Audio'}
              {language === 'hi' && 'हिन्दी (Hindi) Audio'}
            </div>
          </div>
        )}
      </div>

      {/* Cinematic footer with location sequence info */}
      <div className="text-center text-slate-500 text-xs mt-8 pb-4">
        <div>Step {currentIndex + 1} of {totalLocations} in your virtual journey</div>
        <div className="mt-2">← Use navigation to continue exploring →</div>
      </div>
    </div>
  );
}
