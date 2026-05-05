'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { campusLocations } from '@/data/campusLocations';
import { getCategories, filterByCategory } from '@/lib/locationSearch';
import mediaSync from '@/lib/mediaSyncEngine';
import audioEngine from '@/lib/audioGuideEngine';
import VirtualLocationPanel from './VirtualLocationPanel';
import { useSelectedLanguage } from '@/hooks/useSelectedLanguage';
import { useTourSession } from '@/hooks/useTourSession';
import type { AppLanguage } from '@/types/appRules';

export default function VirtualTourShell() {
  const router = useRouter();
  const selectedLanguage = useSelectedLanguage();
  const { patch } = useTourSession();
  const [currentLocation, setCurrentLocation] = useState<any | null>(mediaSync.getCurrent());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [audioState, setAudioState] = useState(audioEngine.getState());
  const categories = getCategories(campusLocations);
  
  // Get filtered locations based on selected category
  const filteredLocations = selectedCategory 
    ? filterByCategory(selectedCategory, campusLocations)
    : campusLocations;

  // Get current location index in filtered list
  const currentLocationId = currentLocation?.id;
  const currentIndex = filteredLocations.findIndex(loc => loc.id === currentLocationId);
  const displayIndex = currentIndex >= 0 ? currentIndex : 0;
  const totalLocations = filteredLocations.length;

  // Subscribe to mediaSync changes
  useEffect(() => {
    const unsubscribe = mediaSync.subscribe((location) => {
      setCurrentLocation(location);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = audioEngine.subscribe(setAudioState);
    return unsubscribe;
  }, []);

  // Initialize with first location if none selected
  useEffect(() => {
    if (!currentLocation && filteredLocations.length > 0) {
      mediaSync.setCurrentByLocationId(filteredLocations[0].id);
    }
  }, [currentLocation, filteredLocations]);

  // When category changes, reset to first location in that category
  useEffect(() => {
    if (filteredLocations.length > 0) {
      mediaSync.setCurrentByLocationId(filteredLocations[0].id);
    }
  }, [selectedCategory]);

  const handleNext = () => {
    const nextIndex = (displayIndex + 1) % totalLocations;
    mediaSync.setCurrentByLocationId(filteredLocations[nextIndex].id);
  };

  const handlePrev = () => {
    const prevIndex = (displayIndex - 1 + totalLocations) % totalLocations;
    mediaSync.setCurrentByLocationId(filteredLocations[prevIndex].id);
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.push('/');
  };

  const handleLanguageChange = (language: AppLanguage) => {
    patch({ language });
    audioEngine.setLanguage(language);
  };

  const handleToggleAudio = () => {
    if (!currentLocation) return;
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
  };

  if (!currentLocation) {
    return <div className="w-full h-screen flex items-center justify-center bg-slate-950 text-white">No locations available</div>;
  }

  return (
    <div className="w-full min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header with selected language */}
      <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="h-10 px-3 inline-flex items-center justify-center bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition-all active:scale-95"
            title="Go back"
            aria-label="Go back"
          >
            ← Back
          </button>
          <div>
          <h1 className="text-2xl font-bold text-white">🌐 Virtual Campus Tour</h1>
          <p className="text-sm text-slate-400 mt-1">Explore remotely • No GPS required</p>
          </div>
        </div>
        <div className="inline-flex rounded-lg border border-slate-700 bg-slate-800 p-1">
          {(['en', 'te', 'hi'] as AppLanguage[]).map((lang) => {
            const active = selectedLanguage === lang;
            return (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={`h-8 rounded-md px-3 text-xs font-semibold transition ${
                  active ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                {lang.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main content area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 max-w-7xl mx-auto">
        {/* Location panel - large on desktop, stacked on mobile */}
        <div className="lg:col-span-2">
          <VirtualLocationPanel
            location={currentLocation}
            language={selectedLanguage}
            currentIndex={displayIndex}
            totalLocations={totalLocations}
          />
        </div>

        {/* Sidebar - filters and navigation */}
        <div className="space-y-6">
          {/* Location counter and sequence progress */}
          <div className="bg-slate-800/50 backdrop-blur rounded-xl p-4 border border-slate-700">
            <div className="text-sm text-slate-400 mb-3">Location Sequence</div>
            <div className="text-3xl font-bold text-blue-400 mb-2">{displayIndex + 1}</div>
            <div className="text-sm text-slate-400 mb-4">of {totalLocations}</div>
            {/* Progress bar */}
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-linear-to-r from-blue-500 to-cyan-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((displayIndex + 1) / totalLocations) * 100}%` }}
              />
            </div>
          </div>

          {/* Category filters */}
          <div className="bg-slate-800/50 backdrop-blur rounded-xl p-4 border border-slate-700">
            <div className="text-sm text-slate-400 mb-3">Filter by Category</div>
            <div className="space-y-2">
              {/* All locations option */}
              <button
                onClick={() => setSelectedCategory(null)}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition ${
                  selectedCategory === null
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                All Locations
              </button>
              {/* Category chips */}
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      <div className="fixed inset-x-0 bottom-4 z-30 px-4">
        <div className="mx-auto max-w-2xl rounded-2xl border border-slate-700 bg-slate-900/95 p-3 shadow-2xl backdrop-blur">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={handlePrev}
              className="h-11 rounded-xl bg-slate-700 text-sm font-semibold text-slate-100 hover:bg-slate-600 transition"
            >
              ← Prev
            </button>
            <button
              onClick={handleToggleAudio}
              disabled={audioState.isLoading || !audioState.isAvailable}
              className="h-11 rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 transition disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
            >
              {audioState.isLoading ? 'Loading...' : audioState.isPlaying ? '⏸ Pause' : '▶ Play'}
            </button>
            <button
              onClick={handleNext}
              className="h-11 rounded-xl bg-blue-700 text-sm font-semibold text-white hover:bg-blue-800 transition"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
