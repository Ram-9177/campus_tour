'use client';

import { useEffect, useMemo, useState } from 'react';
import mediaSync from '@/lib/mediaSyncEngine';
import locationEngine from '@/lib/locationEngine';
import { LocationStore } from '@/lib/locationStore';
import { findNearestPoint } from '@/lib/radiusDetection';
import type { CampusLocation } from '@/types/campusLocation';
import { useTourSession } from '@/hooks/useTourSession';
import { resolveLocationExperience } from '@/lib/locationExperienceResolver';

export default function WalkWithMePanel({ allowedLocationIds, language = 'en' }: { allowedLocationIds?: string[], language?: 'en' | 'te' | 'hi' }) {
  const { session } = useTourSession();
  const [gps, setGps] = useState(locationEngine.getState());
  const [activeLocation, setActiveLocation] = useState(mediaSync.getCurrent());
  const [locations, setLocations] = useState<CampusLocation[]>([]);

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
    return locations.filter((loc) => !allowed || allowed.has(loc.id));
  }, [locations, allowedLocationIds]);

  const nearest = useMemo(() => {
    if (!gps.latitude || !gps.longitude) return null;
    return findNearestPoint(gps.latitude, gps.longitude, scopedLocations);
  }, [gps.latitude, gps.longitude, scopedLocations]);

  const currentExp = useMemo(() => {
    if (!activeLocation) return null;
    return resolveLocationExperience({
      location: activeLocation,
      mode: 'walk_with_me',
      language: language
    });
  }, [activeLocation, language]);

  if (!gps.latitude) {
    return (
      <div className="panel-soft p-6 text-center animate-in duration-500">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-4xl shadow-inner">🚶</div>
        <h2 className="text-2xl font-black text-slate-900">Walk with Me</h2>
        <p className="mt-2 text-slate-600 leading-relaxed">
          Explore the campus on foot. We will automatically trigger stories as you walk near landmarks.
        </p>
        <button
          onClick={() => locationEngine.requestLocation()}
          className="mt-6 h-14 w-full rounded-2xl bg-blue-600 text-lg font-black text-white shadow-xl shadow-blue-900/20 transition hover:bg-blue-700 active:scale-95"
        >
          Unlock Live Walking
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in slide-in-from-bottom duration-500">
      {/* GPS Status Card */}
      <div className="panel-soft p-4 flex items-center justify-between bg-white shadow-sm ring-1 ring-slate-100">
        <div className="flex items-center gap-3">
           <div className="relative h-3 w-3">
              <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-75" />
              <div className="relative h-3 w-3 bg-blue-600 rounded-full" />
           </div>
           <span className="text-xs font-black uppercase tracking-widest text-slate-900">Live GPS Walking Active</span>
        </div>
        <div className="text-[10px] font-black text-slate-400 uppercase">
           Accuracy: ±{Math.round(gps.accuracy || 0)}m
        </div>
      </div>

      {/* Nearest Point Card */}
      {nearest && (
        <div className="panel-soft p-5 border-l-4 border-l-blue-400">
           <div className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-1">Nearest Landmark</div>
           <h3 className="text-xl font-black text-slate-900 leading-tight">{nearest.location.name[language] || nearest.location.name.en}</h3>
           <div className="mt-2 text-sm font-bold text-slate-500">
              {Math.round(nearest.distance)} meters away
           </div>
        </div>
      )}

      {/* Recommended Path Info */}
      <div className="panel-soft p-4 bg-slate-50 border-dashed border-2 border-slate-200">
         <p className="text-xs font-bold text-slate-500 italic">
            "Keep your screen on. We'll alert you when you're within 30 meters of a story point."
         </p>
      </div>
      
      {activeLocation && (
        <div className="panel-soft p-5 bg-blue-600 text-white shadow-xl">
           <div className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-1">Currently Viewing</div>
           <h3 className="text-xl font-black">{currentExp?.title}</h3>
           <button 
             onClick={() => mediaSync.setCurrentByLocationId(null)}
             className="mt-4 h-10 w-full rounded-xl bg-white/10 text-xs font-black uppercase tracking-widest hover:bg-white/20 transition"
           >
             Close to see nearest
           </button>
        </div>
      )}
    </div>
  );
}
