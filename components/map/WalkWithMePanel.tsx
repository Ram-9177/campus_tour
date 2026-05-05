'use client';

import { useEffect, useMemo, useState } from 'react';
import { LocationStore } from '@/lib/locationStore';
import locationEngine from '@/lib/locationEngine';
import radiusDetectionEngine from '@/lib/radiusDetection';
import NearbyLocationPrompt from '@/components/location/NearbyLocationPrompt';
import type { CampusLocation } from '@/types/campusLocation';

interface WalkWithMePanelProps {
  allowedLocationIds?: string[];
  language?: 'en' | 'te' | 'hi';
}

export default function WalkWithMePanel({ allowedLocationIds, language = 'en' }: WalkWithMePanelProps) {
  const [locationState, setLocationState] = useState(locationEngine.getState());
  const [radiusState, setRadiusState] = useState(radiusDetectionEngine.getState());
  const [hasRequested, setHasRequested] = useState(false);
  const [isDenied, setIsDenied] = useState(false);
  const [locations, setLocations] = useState<CampusLocation[]>([]);

  const scopedLocations = useMemo(() => {
    const allowed = allowedLocationIds && allowedLocationIds.length > 0 ? new Set(allowedLocationIds) : null;
    return locations.filter((loc) => loc.active && (!allowed || allowed.has(loc.id)));
  }, [locations, allowedLocationIds?.join('|')]);

  useEffect(() => {
    locationEngine.resetPermissionState();
    setHasRequested(false);
    setIsDenied(false);
  }, []);

  useEffect(() => {
    const load = () => {
      setLocations(LocationStore.getAllLocations());
    };
    load();
    window.addEventListener('smru_locations_updated', load);
    return () => window.removeEventListener('smru_locations_updated', load);
  }, []);

  // Subscribe to location engine
  useEffect(() => {
    const unsubscribe = locationEngine.subscribe((state) => {
      setLocationState(state);
      if (hasRequested) {
        setIsDenied(state.isDenied);
      }
    });
    return unsubscribe;
  }, [hasRequested]);

  // Initialize and subscribe to radius detection
  useEffect(() => {
    radiusDetectionEngine.initialize(scopedLocations);
    const unsubscribe = radiusDetectionEngine.subscribe((state) => {
      setRadiusState(state);
    });
    return () => {
      unsubscribe();
      radiusDetectionEngine.destroy();
    };
  }, [scopedLocations]);

  const handleRequestLocation = async () => {
    setHasRequested(true);
    const success = await locationEngine.requestLocation();
    if (!success) {
      setIsDenied(true);
    }
  };

  const handleStopTracking = () => {
    locationEngine.stopWatching();
    radiusDetectionEngine.destroy();
    setHasRequested(false);
    setLocationState(locationEngine.getState());
  };

  const handleSimulateWalk = (lat: number, lon: number) => {
    locationEngine.setManualLocation(lat, lon);
  };

  // Only show denial after the user has actually requested GPS access.
  if (hasRequested && isDenied && !locationState.latitude) {
    return (
      <div className="space-y-4 animate-in">
        <div className="glass rounded-2xl p-6 border-amber-200 bg-amber-50/50">
          <p className="text-sm font-bold text-amber-900 mb-3 flex items-center gap-2">
            <span>⚠️</span> Location Access Denied
          </p>
          <p className="text-xs text-amber-800 mb-5 leading-relaxed">
            To use live tracking, please enable GPS in your browser settings. Alternatively, use manual mode.
          </p>
          <button
            onClick={() => window.location.href = '/map?mode=manual'}
            className="w-full h-11 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm"
          >
            Switch to Manual Explore
          </button>
        </div>
      </div>
    );
  }

  if (scopedLocations.length === 0) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
        No active points are configured for Walk With Me. Update mode points in Admin Settings.
      </div>
    );
  }

  // If location not requested, show button to request
  if (!hasRequested && !locationState.latitude) {
    return (
      <div className="space-y-4 animate-in">
        <div className="glass rounded-3xl p-8 border-slate-200/50">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl">📍</div>
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2 text-center tracking-tight">Real-time Companion</h3>
          <p className="text-sm text-slate-500 mb-8 text-center leading-relaxed">
            The guide will automatically detect your location and read the script as you walk past buildings.
          </p>
          <div className="space-y-3">
            <button
              onClick={handleRequestLocation}
              disabled={locationState.isRequesting}
              className="btn-premium w-full"
            >
              {locationState.isRequesting ? 'Requesting GPS...' : 'Start Live Tracking'}
            </button>
            <button
              onClick={() => {
                setHasRequested(true);
                // Start with a default location (Main Gate)
                const first = scopedLocations.find(l => l.slug === 'main-gate') || scopedLocations[0];
                if (first) handleSimulateWalk(first.latitude, first.longitude);
              }}
              className="w-full h-12 text-[10px] font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition uppercase tracking-widest"
            >
              Or Try Demo Mode (Simulate)
            </button>
          </div>
          <p className="text-[10px] text-slate-400 mt-6 text-center italic">
            Privacy First: Your location never leaves this device.
          </p>
        </div>
      </div>
    );
  }

  // If location enabled, show map with markers and controls
  return (
    <div className="space-y-4 animate-in">
      {/* Toolbar */}
      <div className="glass rounded-2xl p-4 border-slate-200/50">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600"></span>
              </span>
              Live Walk Active
            </div>
            {locationState.accuracy && (
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                Accuracy: ±{Math.round(locationState.accuracy)}m
              </div>
            )}
          </div>
          <div className="flex gap-2 shrink-0">
            <div className="h-10 px-3 inline-flex items-center justify-center bg-slate-50 border border-slate-100 text-slate-700 rounded-xl text-[10px] font-black tracking-widest">
              {language.toUpperCase()}
            </div>
            <button
              onClick={handleStopTracking}
              className="h-10 w-10 inline-flex items-center justify-center bg-red-50 border border-red-100 hover:bg-red-100 text-red-600 rounded-xl transition-colors active:scale-95"
            >
              ⏹
            </button>
          </div>
        </div>
      </div>

      {/* Simulation Controls (Horizontal Scroll) */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar">
        <span className="shrink-0 flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest pr-2 border-r border-slate-100">Simulate:</span>
        {scopedLocations.map(loc => (
          <button
            key={loc.id}
            onClick={() => handleSimulateWalk(loc.latitude, loc.longitude)}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all active:scale-95 ${
              radiusState.nearbyLocationId === loc.id 
                ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
            }`}
          >
            {loc.name.en}
          </button>
        ))}
      </div>

      {/* Nearby location prompt */}
      {radiusState.nearbyLocationId && radiusState.distance !== null && (
        <div className="animate-in">
          <NearbyLocationPrompt
            location={scopedLocations.find((loc) => loc.id === radiusState.nearbyLocationId)!}
            distance={radiusState.distance}
            language={language}
          />
        </div>
      )}

      {/* Status info */}
      {locationState.latitude && locationState.longitude && (
        <div className="glass rounded-2xl p-4 border-slate-100/50 text-center space-y-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tracking Status</div>
          <div className="text-sm font-medium text-slate-700">
            {radiusState.nearbyLocationId 
              ? `Reached ${scopedLocations.find(l => l.id === radiusState.nearbyLocationId)?.name.en}`
              : "Detecting nearest building..."}
          </div>
        </div>
      )}
    </div>
  );
}
