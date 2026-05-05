import { useEffect, useState } from 'react';
import audioEngine from '@/lib/audioGuideEngine';
import BrandLogo from '@/components/layout/BrandLogo';
import { smruMapConfig } from '@/data/map/smruMapConfig';
import { calculateDistance } from '@/lib/mapUtils';
import { getBestLocationFix } from '@/lib/locationFix';

interface WelcomeStepProps { onNext: (locationAccess: 'inside' | 'outside') => void; }

const OUTSIDE_CAMPUS_LIMIT_METERS = 1000;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function distanceFromCampusBoundsMeters(lat: number, lng: number): number {
  const { minLat, maxLat, minLon, maxLon } = smruMapConfig.bounds;
  const clampedLat = clamp(lat, minLat, maxLat);
  const clampedLon = clamp(lng, minLon, maxLon);
  return calculateDistance({ lat, lng }, { lat: clampedLat, lng: clampedLon }) * 1000;
}

export default function WelcomeStep({ onNext }: WelcomeStepProps) {
  const [isCheckingLocation, setIsCheckingLocation] = useState(false);
  const [locationNote, setLocationNote] = useState<string | null>(null);
  const [allowManualVirtual, setAllowManualVirtual] = useState(false);
  const [resolvedAccess, setResolvedAccess] = useState<'inside' | 'outside' | null>(null);
  const [hasAutoRequested, setHasAutoRequested] = useState(false);

  const requestLocationPermission = async (): Promise<'inside' | 'outside' | null> => {
    const fix = await getBestLocationFix({ desiredAccuracyMeters: 35, timeoutMs: 18000 });
    if (!fix.position) {
      if (fix.error === 'unsupported') {
        setLocationNote('GPS is not available in this browser. Enable location support or continue in Virtual mode.');
      } else if (fix.error === 'permission_denied') {
        setLocationNote('Location permission is blocked. Allow location for this site and tap Start again.');
      } else {
        setLocationNote('Could not capture accurate GPS. Move outdoors, turn on precise location, and tap Start again.');
      }
      setAllowManualVirtual(true);
      return null;
    }

    const { latitude, longitude, accuracy } = fix.position.coords;
    const outsideDistance = distanceFromCampusBoundsMeters(latitude, longitude);
    const safetyBufferMeters = Math.max(accuracy || 0, 0);
    const isInsideOrNear = outsideDistance <= OUTSIDE_CAMPUS_LIMIT_METERS + safetyBufferMeters;

    if (isInsideOrNear) {
      setLocationNote(`Location captured (±${Math.round(accuracy)}m). Full tour modes unlocked.`);
      setAllowManualVirtual(false);
      setResolvedAccess('inside');
      return 'inside';
    }

    setLocationNote(`You are ~${(outsideDistance / 1000).toFixed(1)} km outside campus (±${Math.round(accuracy)}m). Virtual mode only.`);
    setAllowManualVirtual(false);
    setResolvedAccess('outside');
    return 'outside';
  };

  const handleRequestLocation = async () => {
    setIsCheckingLocation(true);
    const locationAccess = await requestLocationPermission();
    setIsCheckingLocation(false);
    return locationAccess;
  };

  useEffect(() => {
    if (hasAutoRequested) return;
    setHasAutoRequested(true);
    void handleRequestLocation();
  }, [hasAutoRequested]);

  const handleNext = async () => {
    audioEngine.registerUserGesture();
    if (resolvedAccess) {
      onNext(resolvedAccess);
      return;
    }
    const locationAccess = await handleRequestLocation();
    if (!locationAccess) return;
    onNext(locationAccess);
  };

  return (
    <section className="glass rounded-[2rem] p-6 text-center shadow-[0_24px_60px_-36px_rgba(15,23,42,0.38)] animate-in sm:p-8 lg:p-10">
      <div className="relative mb-8 flex justify-center sm:mb-10">
        <div className="absolute inset-0 rounded-full bg-blue-100/50 blur-3xl scale-150 animate-pulse-soft" />
        <div className="relative inline-flex h-28 w-28 items-center justify-center rounded-3xl border border-[#bfd2f8] bg-white shadow-sm sm:h-32 sm:w-32">
          <BrandLogo className="h-18 w-auto object-contain sm:h-20" />
        </div>
      </div>

      <div className="mb-10 space-y-3 sm:mb-12">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 animate-in delay-100">
          PWA Campus Guide
        </p>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 animate-in delay-200 sm:text-4xl lg:text-5xl">
          Welcome to <br /> St. Mary&apos;s University
        </h1>
        <p className="mx-auto max-w-[20rem] text-sm leading-relaxed text-slate-500 animate-in delay-300 sm:max-w-[24rem] sm:text-[0.98rem]">
          Start your smart campus tour with location-aware guidance, directions, media, and virtual exploration.
        </p>
      </div>

      <div className="space-y-5 animate-in delay-300 sm:space-y-6">
        {!resolvedAccess ? (
          <button
            type="button"
            onClick={() => {
              void handleRequestLocation();
            }}
            disabled={isCheckingLocation}
            className="w-full rounded-xl border border-blue-300 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-800 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isCheckingLocation ? 'Requesting Location Permission...' : 'Allow Location Access'}
          </button>
        ) : null}
        <button
          type="button"
          onClick={handleNext}
          disabled={isCheckingLocation}
          className="btn-premium w-full group"
        >
          <span>{isCheckingLocation ? 'Checking Location...' : 'Start'}</span>
          <span className="transition-transform group-hover:translate-x-1">{isCheckingLocation ? '…' : '→'}</span>
        </button>
        {locationNote ? <p className="text-xs text-slate-500">{locationNote}</p> : null}
        {allowManualVirtual ? (
          <button
            type="button"
            onClick={() => onNext('outside')}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Continue With Virtual Mode
          </button>
        ) : null}

        <div className="flex items-center justify-center gap-4 grayscale opacity-40">
          <span className="text-[10px] font-bold uppercase tracking-widest">No Login</span>
          <div className="h-1 w-1 rounded-full bg-slate-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Works Offline</span>
        </div>
      </div>
    </section>
  );
}
