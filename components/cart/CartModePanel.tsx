'use client';

import { useEffect, useMemo, useState } from 'react';
import { campusLocations } from '@/data/campusLocations';
import { cartRoute, type CartStop } from '@/data/cartRoute';
import { smruMapConfig } from '@/data/map/smruMapConfig';
import BrandLogo from '@/components/layout/BrandLogo';
import audioEngine from '@/lib/audioGuideEngine';
import mediaSync from '@/lib/mediaSyncEngine';
import cartTrackingEngine from '@/lib/cartTrackingEngine';
import { calculateDistance } from '@/lib/mapUtils';
import { getBestLocationFix } from '@/lib/locationFix';
import { LocationStore } from '@/lib/locationStore';
import type { CartTrackingState } from '@/types/cartTracking';
import type { CampusLocation } from '@/types/campusLocation';

type Language = 'en' | 'te' | 'hi';
type CartGeoGate = 'idle' | 'checking' | 'unlocked' | 'virtual_only' | 'gps_denied' | 'gps_unavailable';

const OUTSIDE_CAMPUS_LIMIT_METERS = 1000;

interface CartModePanelProps {
  allowedLocationIds?: string[];
  language?: Language;
}

function formatEta(seconds: number | null) {
  if (seconds === null || Number.isNaN(seconds)) return '--';
  if (seconds < 60) return '<1 min';
  return `${Math.ceil(seconds / 60)} min`;
}

function formatLastUpdated(timestamp: number | null) {
  if (!timestamp) return 'Not updated yet';
  return new Date(timestamp).toLocaleTimeString();
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function distanceFromCampusBoundsMeters(lat: number, lng: number): number {
  const { minLat, maxLat, minLon, maxLon } = smruMapConfig.bounds;
  const clampedLat = clamp(lat, minLat, maxLat);
  const clampedLon = clamp(lng, minLon, maxLon);
  return calculateDistance({ lat, lng }, { lat: clampedLat, lng: clampedLon }) * 1000;
}

export default function CartModePanel({ allowedLocationIds, language = 'en' }: CartModePanelProps) {
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [audioState, setAudioState] = useState(audioEngine.getState());
  const [trackingState, setTrackingState] = useState<CartTrackingState>(cartTrackingEngine.getState());
  const [locations, setLocations] = useState<CampusLocation[]>([]);
  const [geoGate, setGeoGate] = useState<CartGeoGate>('idle');
  const [geoDistanceMeters, setGeoDistanceMeters] = useState<number | null>(null);
  const [hasEnteredCartExperience, setHasEnteredCartExperience] = useState(false);
  const [isEntering, setIsEntering] = useState(false);

  useEffect(() => {
    const unsubscribeAudio = audioEngine.subscribe(setAudioState);
    const unsubscribeTracking = cartTrackingEngine.subscribe(setTrackingState);
    return () => {
      unsubscribeAudio();
      unsubscribeTracking();
      cartTrackingEngine.stop();
    };
  }, []);

  useEffect(() => {
    const load = () => setLocations(LocationStore.getAllLocations());
    load();
    window.addEventListener('smru_locations_updated', load);
    return () => window.removeEventListener('smru_locations_updated', load);
  }, []);

  const runGeoGateCheck = async () => {
    const fix = await getBestLocationFix({ desiredAccuracyMeters: 35, timeoutMs: 18000 });
    if (!fix.position) {
      if (fix.error === 'permission_denied') {
        setGeoGate('gps_denied');
        return;
      }
      setGeoGate('gps_unavailable');
      return;
    }

    const { latitude, longitude, accuracy } = fix.position.coords;
    const outsideDistance = distanceFromCampusBoundsMeters(latitude, longitude);
    setGeoDistanceMeters(outsideDistance);
    const safetyBufferMeters = Math.max(accuracy || 0, 0);
    if (outsideDistance <= OUTSIDE_CAMPUS_LIMIT_METERS + safetyBufferMeters) {
      setGeoGate('unlocked');
      return;
    }
    setGeoGate('virtual_only');
    cartTrackingEngine.stop();
  };

  const handleEnterCartMode = async () => {
    if (isEntering || hasEnteredCartExperience) return;
    setIsEntering(true);
    setGeoGate('checking');
    await runGeoGateCheck();
    setHasEnteredCartExperience(true);
    setIsEntering(false);
  };

  useEffect(() => {
    if (geoGate !== 'unlocked' && trackingState.status === 'tracking') {
      cartTrackingEngine.stop();
    }
  }, [geoGate, trackingState.status]);

  const scopedStops = useMemo(() => {
    const allowed = allowedLocationIds && allowedLocationIds.length > 0 ? new Set(allowedLocationIds) : null;
    const activeLocations = locations
      .filter((loc) => loc.active && (!allowed || allowed.has(loc.id)))
      .sort((a, b) => (a.routeOrder || 0) - (b.routeOrder || 0));

    const routeStops: CartStop[] = activeLocations.map((loc, idx) => {
      const routeStop = cartRoute.find((stop) => stop.locationId === loc.id);
      if (routeStop) return routeStop;
      return {
        id: `cart-stop-generated-${loc.id}`,
        locationId: loc.id,
        name: { ...loc.name },
        description: { ...loc.description },
        waitTimeMinutes: 3,
        order: idx + 1,
      };
    });

    return routeStops.length > 0 ? routeStops : cartRoute;
  }, [allowedLocationIds?.join('|'), locations]);

  useEffect(() => {
    setCurrentStopIndex((prev) => Math.min(prev, Math.max(0, scopedStops.length - 1)));
  }, [scopedStops.length]);

  useEffect(() => {
    if (trackingState.confidence !== 'high' || !trackingState.currentStopId) return;
    const idx = scopedStops.findIndex((stop) => stop.id === trackingState.currentStopId);
    if (idx >= 0 && idx !== currentStopIndex) {
      setCurrentStopIndex(idx);
    }
  }, [trackingState.currentStopId, trackingState.confidence, currentStopIndex, scopedStops]);

  const currentStop = scopedStops[currentStopIndex];
  const nextStopIndex = (currentStopIndex + 1) % scopedStops.length;
  const nextStop = scopedStops[nextStopIndex];
  const currentLocation = locations.find((loc) => loc.id === currentStop.locationId) || campusLocations.find((loc) => loc.id === currentStop.locationId);
  const nextLocation = locations.find((loc) => loc.id === nextStop.locationId) || campusLocations.find((loc) => loc.id === nextStop.locationId);

  const isLive = trackingState.status === 'tracking';
  const canResume = trackingState.status === 'paused';
  const isGeoChecking = geoGate === 'checking';
  const isLiveUnlocked = geoGate === 'unlocked';

  const trackingBadge = useMemo(() => {
    if (trackingState.status === 'tracking') return 'LIVE';
    if (trackingState.status === 'paused') return 'PAUSED';
    if (trackingState.status === 'gps_denied') return 'GPS DENIED';
    if (trackingState.status === 'gps_unavailable') return 'GPS OFF';
    return 'IDLE';
  }, [trackingState.status]);

  const handleNext = () => {
    setCurrentStopIndex((prev) => (prev + 1) % scopedStops.length);
  };

  const handlePrev = () => {
    setCurrentStopIndex((prev) => (prev === 0 ? scopedStops.length - 1 : prev - 1));
  };

  const handlePlayAudio = () => {
    if (currentLocation) {
      mediaSync.setCurrentByLocationId(currentLocation.id);
      audioEngine.registerUserGesture();
      audioEngine.loadLocation(currentLocation);
      audioEngine.setLanguage(language);
      audioEngine.play();
    }
  };

  const handleStartLive = async () => {
    if (!isLiveUnlocked) return;
    await cartTrackingEngine.start();
  };

  if (!hasEnteredCartExperience) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mx-auto flex max-w-md flex-col items-center text-center">
          <BrandLogo className="h-20 w-auto object-contain" />
          <h2 className="mt-4 text-2xl font-black text-slate-900">Welcome to St. Mary&apos;s University</h2>
          <p className="mt-2 text-sm text-slate-600">
            Press Start to verify your location. If you are inside/near campus, all features unlock. If you are far, virtual mode stays available.
          </p>
          <button
            onClick={() => {
              void handleEnterCartMode();
            }}
            disabled={isEntering}
            className="mt-6 h-12 w-full rounded-xl bg-linear-to-r from-[#0b57d0] to-[#0a4cc0] px-4 text-sm font-bold text-white shadow hover:shadow-lg disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isEntering ? 'Checking Location...' : 'Start'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-linear-to-r from-blue-50 to-cyan-50 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">🚐 Campus Cart Tour</h2>
            <p className="mt-1 text-sm text-slate-600">User-GPS live tracking • 2s updates</p>
          </div>
          <div className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900">
            🌐 {language.toUpperCase()}
          </div>
        </div>

        {isGeoChecking && (
          <div className="mb-3 rounded-lg border border-slate-200 bg-white p-2 text-xs font-medium text-slate-700">
            Checking your location to unlock on-campus live tracking...
          </div>
        )}
        {geoGate === 'unlocked' && (
          <div className="mb-3 rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-xs font-medium text-emerald-800">
            You are on/near campus. Live cart tracking is unlocked.
          </div>
        )}
        {geoGate === 'virtual_only' && (
          <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 p-2 text-xs font-medium text-amber-800">
            You are more than 1 km outside campus bounds{geoDistanceMeters ? ` (~${(geoDistanceMeters / 1000).toFixed(1)} km)` : ''}. Showing virtual route only.
          </div>
        )}
        {geoGate === 'gps_denied' && (
          <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 p-2 text-xs font-medium text-amber-800">
            Location permission denied. Showing virtual route only.
          </div>
        )}
        {geoGate === 'gps_unavailable' && (
          <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 p-2 text-xs font-medium text-amber-800">
            Location unavailable. Showing virtual route only.
          </div>
        )}

        <div className="mb-3 grid grid-cols-2 gap-2 rounded-lg bg-white p-3 text-xs">
          <div className="rounded-md bg-slate-100 px-2 py-1 font-semibold text-slate-700">Status: {trackingBadge}</div>
          <div className="rounded-md bg-slate-100 px-2 py-1 font-semibold text-slate-700">
            Confidence: {trackingState.confidence.toUpperCase()}
          </div>
          <div className="rounded-md bg-slate-100 px-2 py-1 text-slate-700">
            GPS Accuracy: {trackingState.accuracy ? `±${Math.round(trackingState.accuracy)}m` : '--'}
          </div>
          <div className="rounded-md bg-slate-100 px-2 py-1 text-slate-700">ETA to next: {formatEta(trackingState.etaSeconds)}</div>
          <div className="col-span-2 rounded-md bg-slate-100 px-2 py-1 text-slate-700">
            Last update: {formatLastUpdated(trackingState.lastUpdatedAt)}
          </div>
        </div>

        {trackingState.error && (
          <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 p-2 text-xs text-amber-800">{trackingState.error}</div>
        )}

        <div className="mb-3 flex gap-2">
          {!isLive && !canResume && (
            <button
              onClick={handleStartLive}
              disabled={!isLiveUnlocked || isGeoChecking}
              className="h-10 rounded-lg bg-[#0b57d0] px-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {isGeoChecking ? 'Checking GPS...' : isLiveUnlocked ? 'Start Live Tracking' : 'Virtual Route Only'}
            </button>
          )}
          {isLive && (
            <button
              onClick={() => cartTrackingEngine.pause()}
              className="h-10 rounded-lg bg-slate-200 px-3 text-sm font-semibold text-slate-900"
            >
              Pause Live
            </button>
          )}
          {canResume && (
            <button
              onClick={() => cartTrackingEngine.resume()}
              disabled={!isLiveUnlocked}
              className="h-10 rounded-lg bg-[#0b57d0] px-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Resume Live
            </button>
          )}
          <button
            onClick={() => cartTrackingEngine.stop()}
            className="h-10 rounded-lg bg-slate-100 px-3 text-sm font-semibold text-slate-700"
          >
            Stop
          </button>
        </div>

        <div className="rounded-lg bg-white p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Route Progress</span>
            <span className="text-xs font-semibold text-blue-600">Stop {currentStopIndex + 1} / {scopedStops.length}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-200">
            <div
              className="h-2 rounded-full bg-linear-to-r from-blue-500 to-cyan-400 transition-all duration-300"
              style={{ width: `${((currentStopIndex + 1) / scopedStops.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {currentLocation && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-700">📍 Current Stop</div>
          <h3 className="mb-1 text-lg font-bold text-slate-900">{currentStop.name[language]}</h3>
          <p className="mb-3 text-sm text-slate-700">{currentStop.description[language]}</p>
          {currentStop.waitTimeMinutes > 0 && (
            <div className="mb-3 rounded-lg bg-blue-100 p-2 text-sm font-medium text-blue-900">
              ⏱ Wait time at this stop: {currentStop.waitTimeMinutes} minutes
            </div>
          )}
          <button
            onClick={handlePlayAudio}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#0b57d0] to-[#0a4cc0] px-4 font-semibold text-white transition-all active:scale-95 hover:shadow-lg disabled:from-slate-400 disabled:to-slate-400"
            disabled={audioState.isLoading}
          >
            {audioState.isLoading ? 'Loading...' : audioState.isPlaying ? '⏸ Stop Audio' : '🎙 Play Stop Audio'}
          </button>
        </div>
      )}

      {nextLocation && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">👉 Next Stop</div>
          <h4 className="mb-1 text-base font-bold text-slate-900">{nextStop.name[language]}</h4>
          <p className="text-sm text-slate-600">{nextStop.description[language]}</p>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-600">📋 Full Route Sequence</div>
        <div className="space-y-2">
          {scopedStops.map((stop, idx) => (
            <button
              key={stop.id}
              onClick={() => setCurrentStopIndex(idx)}
              className={`w-full rounded-lg p-2.5 text-left transition ${
                idx === currentStopIndex
                  ? 'border-l-4 border-blue-600 bg-blue-100 font-semibold text-blue-900'
                  : idx < currentStopIndex
                    ? 'bg-green-50 text-sm text-slate-700'
                    : 'bg-slate-100 text-sm text-slate-600'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-xs font-bold">{idx + 1}</span>
                <span>{stop.name[language]}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-2 gap-3">
          <button onClick={handlePrev} className="h-12 rounded-lg bg-slate-100 px-4 font-semibold text-slate-900">← Prev</button>
          <button onClick={handleNext} className="h-12 rounded-lg bg-linear-to-r from-[#0b57d0] to-[#0a4cc0] px-4 font-semibold text-white">Next →</button>
        </div>
      </div>

      <div className="py-2 text-center text-xs text-slate-500">
        <p>Campus Cart Tour • Live user GPS + manual fallback</p>
        <p className="mt-1">Location is used in-session only and not sent to server.</p>
      </div>
    </div>
  );
}
