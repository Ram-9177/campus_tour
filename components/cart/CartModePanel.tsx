'use client';

import { useEffect, useMemo, useState } from 'react';
import mediaSync from '@/lib/mediaSyncEngine';
import audioEngine from '@/lib/audioGuideEngine';
import locationEngine from '@/lib/locationEngine';
import { LocationStore } from '@/lib/locationStore';
import { isUserAtPoint, MAIN_GATE_RADIUS_METERS } from '@/lib/radiusDetection';
import type { CampusLocation } from '@/types/campusLocation';
import { useTourSession } from '@/hooks/useTourSession';
import { resolveLocationExperience } from '@/lib/locationExperienceResolver';

const MAIN_GATE_COORDS = { lat: 17.3320276, lng: 78.7278257 };

export default function CartModePanel({ allowedLocationIds, language = 'en' }: { allowedLocationIds?: string[], language?: 'en' | 'te' | 'hi' }) {
  const { session } = useTourSession();
  const [gps, setGps] = useState(locationEngine.getState());
  const [activeLocation, setActiveLocation] = useState(mediaSync.getCurrent());
  const [locations, setLocations] = useState<CampusLocation[]>([]);
  const [isNearMainGate, setIsNearMainGate] = useState(false);

  useEffect(() => {
    const unsubGps = locationEngine.subscribe(setGps);
    const unsubMedia = mediaSync.subscribe((loc) => setActiveLocation(loc || null));
    return () => {
      unsubGps();
      unsubMedia();
    };
  }, []);

  useEffect(() => {
    const load = () => setLocations(LocationStore.getAllLocations().filter(l => l.active));
    load();
    window.addEventListener('smru_locations_updated', load);
    return () => window.removeEventListener('smru_locations_updated', load);
  }, []);

  const scopedLocations = useMemo(() => {
    const allowed = allowedLocationIds && allowedLocationIds.length > 0 ? new Set(allowedLocationIds) : null;
    return locations
      .filter((loc) => !allowed || allowed.has(loc.id))
      .sort((a, b) => (a.routeOrder || 0) - (b.routeOrder || 0));
  }, [locations, allowedLocationIds]);

  useEffect(() => {
    if (gps.latitude && gps.longitude) {
      const near = isUserAtPoint(gps.latitude, gps.longitude, { latitude: MAIN_GATE_COORDS.lat, longitude: MAIN_GATE_COORDS.lng } as any, MAIN_GATE_RADIUS_METERS);
      setIsNearMainGate(near);
    }
  }, [gps.latitude, gps.longitude]);

  const handleStartTour = () => {
    audioEngine.registerUserGesture();
    if (scopedLocations.length > 0) {
      mediaSync.setCurrentByLocationId(scopedLocations[0].id);
    }
  };

  const currentExp = useMemo(() => {
    if (!activeLocation) return null;
    return resolveLocationExperience({
      location: activeLocation,
      mode: 'campus_cart',
      language: language
    });
  }, [activeLocation, language]);

  const currentIndex = activeLocation ? scopedLocations.findIndex(l => l.id === activeLocation.id) : -1;
  const nextLocation = (currentIndex >= 0 && currentIndex < scopedLocations.length - 1) ? scopedLocations[currentIndex + 1] : null;

  if (!activeLocation) {
    return (
      <div className="panel-soft p-6 text-center animate-in fade-in zoom-in duration-500">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-4xl shadow-inner">🚐</div>
        <h2 className="text-2xl font-black text-slate-900">Buggy Tour</h2>
        <p className="mt-2 text-slate-600 leading-relaxed">
          {isNearMainGate 
            ? "You are near the Main Gate. Ready to start the guided vehicle tour?"
            : "The driver will take you point-to-point. GPS will trigger audio automatically."}
        </p>
        <button
          onClick={handleStartTour}
          className="mt-6 h-14 w-full rounded-2xl bg-blue-600 text-lg font-black text-white shadow-xl shadow-blue-900/20 transition hover:bg-blue-700 active:scale-95"
        >
          {isNearMainGate ? "Start Buggy Tour" : "Begin Sequence"}
        </button>
        {!gps.latitude && (
          <button 
            onClick={() => locationEngine.requestLocation()}
            className="mt-4 text-sm font-bold text-blue-600 underline"
          >
            Enable GPS for Automatic Triggers
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in slide-in-from-bottom duration-500">
      {/* Progress Header */}
      <div className="panel-soft p-4 border-l-4 border-l-blue-600">
        <div className="flex items-center justify-between">
           <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Buggy Route Progress</span>
           <span className="text-sm font-black text-slate-900">Stop {currentIndex + 1} / {scopedLocations.length}</span>
        </div>
        <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
           <div 
             className="h-full rounded-full bg-blue-600 transition-all duration-1000" 
             style={{ width: `${((currentIndex + 1) / scopedLocations.length) * 100}%` }}
           />
        </div>
      </div>

      {/* Current Stop Card */}
      <div className="panel-soft p-5 bg-white shadow-lg ring-1 ring-slate-200">
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Currently Visiting</div>
        <h3 className="text-2xl font-black text-slate-900 leading-tight">{currentExp?.title}</h3>
        <p className="mt-2 text-sm text-slate-600 line-clamp-2">{currentExp?.description}</p>
        
        <div className="mt-4 flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Automatic GPS Trigger Active</span>
        </div>
      </div>

      {/* Next Stop Preview */}
      {nextLocation && (
        <div className="panel-soft p-4 bg-slate-50 border-dashed border-2 border-slate-200 opacity-60">
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Next Stop</div>
          <h4 className="text-base font-black text-slate-700">{nextLocation.name[language] || nextLocation.name.en}</h4>
        </div>
      )}
      
      {!nextLocation && (
        <div className="panel-soft p-4 bg-emerald-50 border-emerald-100">
           <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Route Complete</div>
           <p className="text-sm font-bold text-emerald-800">You have reached the final destination.</p>
        </div>
      )}
    </div>
  );
}
