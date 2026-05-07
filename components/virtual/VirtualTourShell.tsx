'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LocationStore } from '@/lib/locationStore';
import mediaSync from '@/lib/mediaSyncEngine';
import audioEngine from '@/lib/audioGuideEngine';
import type { CampusLocation } from '@/types/campusLocation';
import VirtualLocationPanel from './VirtualLocationPanel';
import { useSelectedLanguage } from '@/hooks/useSelectedLanguage';
import { useDelayedLocationAudio } from '@/hooks/useDelayedLocationAudio';
import StickyAudioControlBar from '../audio/StickyAudioControlBar';
import SMRUCampusWorldMap from '../map/SMRUCampusWorldMap';

export default function VirtualTourShell() {
  useDelayedLocationAudio();
  const router = useRouter();
  const selectedLanguage = useSelectedLanguage();
  const [locations, setLocations] = useState<CampusLocation[]>([]);
  const [currentLocation, setCurrentLocation] = useState<CampusLocation | null>(mediaSync.getCurrent());
  const [audioState, setAudioState] = useState(audioEngine.getState());
  const [tourComplete, setTourComplete] = useState(false);

  useEffect(() => {
    const load = () => {
      const activeLocations = LocationStore.getAllLocations()
        .filter((loc) => loc.active)
        .sort((a, b) => (a.routeOrder || 0) - (b.routeOrder || 0));
      setLocations(activeLocations);
    };
    load();
    window.addEventListener('smru_locations_updated', load);
    return () => window.removeEventListener('smru_locations_updated', load);
  }, []);

  useEffect(() => {
    const unsub = mediaSync.subscribe((location) => {
      setCurrentLocation(location || null);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = audioEngine.subscribe(setAudioState);
    return () => {
      unsub();
      audioEngine.stop();
    };
  }, []);

  useEffect(() => {
    audioEngine.setLanguage(selectedLanguage.language);
  }, [selectedLanguage.language]);

  const locationIds = useMemo(() => locations.map((loc) => loc.id), [locations]);
  const currentIndex = currentLocation ? locationIds.indexOf(currentLocation.id) : -1;
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const isAtFirst = safeIndex <= 0;
  const isAtLast = locations.length > 0 && safeIndex >= locations.length - 1;

  useEffect(() => {
    if (locations.length === 0) return;
    if (!currentLocation || !locationIds.includes(currentLocation.id)) {
      mediaSync.setCurrentByLocationId(locations[0].id);
      setTourComplete(false);
    }
  }, [currentLocation, locationIds, locations]);

  const handleSelectLocation = (locationId: string) => {
    setTourComplete(false);
    mediaSync.setCurrentByLocationId(locationId);
  };

  const handleNext = () => {
    if (locations.length === 0) return;
    if (isAtLast) {
      setTourComplete(true);
      return;
    }
    setTourComplete(false);
    mediaSync.setCurrentByLocationId(locations[safeIndex + 1].id);
  };

  const handlePrev = () => {
    if (locations.length === 0 || isAtFirst) return;
    setTourComplete(false);
    mediaSync.setCurrentByLocationId(locations[safeIndex - 1].id);
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.push('/');
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
      return;
    }
    void audioEngine.play();
  };

  if (locations.length === 0) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 text-slate-900">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 text-center text-lg font-semibold shadow-sm">
          No active locations available for Virtual Tour.
        </div>
      </div>
    );
  }

  if (!currentLocation) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 text-slate-900">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 text-center text-lg font-semibold shadow-sm">
          Loading Virtual Tour...
        </div>
      </div>
    );
  }

  return (
    <div className="tour-shell min-h-screen w-full text-slate-900">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200/80 bg-white/90 p-4 backdrop-blur-sm sm:p-5">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 active:scale-95"
            title="Go back"
            aria-label="Go back"
          >
            Back
          </button>
          <div>
            <h1 className="title-page">Virtual Campus Tour</h1>
            <p className="mt-1 text-sm text-slate-600">Available from anywhere. No GPS required.</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 px-4 py-5 pb-40 sm:px-6">
        {/* Interactive Map Header */}
        <div className="overflow-hidden rounded-3xl border-4 border-slate-100 bg-slate-50 shadow-inner">
          <SMRUCampusWorldMap 
            language={selectedLanguage.language}
            allowedLocationIds={locationIds}
          />
        </div>

        <div className="panel-soft p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-600">Route Progress</div>
              <div className="text-2xl font-black text-blue-700">{safeIndex + 1} of {locations.length}</div>
            </div>
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-blue-50 text-xl shadow-inner">📍</div>
          </div>
          <div className="mt-3 h-2 w-full rounded-full bg-slate-100">
            <div
              className="h-2 rounded-full bg-linear-to-r from-blue-500 to-cyan-400 transition-all duration-300"
              style={{ width: `${((safeIndex + 1) / locations.length) * 100}%` }}
            />
          </div>
        </div>

        {tourComplete && (
          <div className="panel-soft border-emerald-200 bg-emerald-50 p-5 shadow-sm animate-in zoom-in duration-500">
            <div className="text-lg font-black text-emerald-800">Virtual Journey Complete ✨</div>
            <div className="mt-1 text-sm font-bold text-emerald-700/80 leading-relaxed">
              You've explored all the major landmarks of St. Mary's University remotely. Ready to visit us in person?
            </div>
          </div>
        )}

        <VirtualLocationPanel
          location={currentLocation}
          language={selectedLanguage.language}
          currentIndex={safeIndex}
          totalLocations={locations.length}
        />
      </div>

      <StickyAudioControlBar />
    </div>
  );
}
