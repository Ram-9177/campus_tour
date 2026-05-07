import { useState } from 'react';
import audioEngine from '@/lib/audioGuideEngine';
import BrandLogo from '@/components/layout/BrandLogo';
import { smruMapConfig } from '@/data/map/smruMapConfig';
import { calculateDistance } from '@/lib/mapUtils';
import { getBestLocationFix } from '@/lib/locationFix';

interface WelcomeStepProps {
  onStart: () => void;
  onNext: (locationAccess: 'inside' | 'outside') => void;
}

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

export default function WelcomeStep({ onStart, onNext }: WelcomeStepProps) {
  const [isCheckingLocation, setIsCheckingLocation] = useState(false);
  const [locationNote, setLocationNote] = useState<string | null>(null);
  const [showPermissionGate, setShowPermissionGate] = useState(false);

  const requestLocationPermission = async (): Promise<'inside' | 'outside' | null> => {
    const fix = await getBestLocationFix({ desiredAccuracyMeters: 35, timeoutMs: 18000 });
    if (!fix.position) {
      if (fix.error === 'unsupported') {
        setLocationNote('GPS is not available in this browser. Enable location support or continue in Virtual mode.');
      } else if (fix.error === 'permission_denied') {
        setLocationNote('Location permission is blocked. Allow location for this site, or continue without location.');
      } else {
        setLocationNote('Could not capture accurate GPS. Move outdoors, turn on precise location, or continue without location.');
      }
      return null;
    }

    const { latitude, longitude, accuracy } = fix.position.coords;
    const outsideDistance = distanceFromCampusBoundsMeters(latitude, longitude);
    const safetyBufferMeters = Math.max(accuracy || 0, 0);
    const isInsideOrNear = outsideDistance <= OUTSIDE_CAMPUS_LIMIT_METERS + safetyBufferMeters;

    if (isInsideOrNear) {
      setLocationNote(`Location captured (±${Math.round(accuracy)}m). Full tour modes unlocked.`);
      return 'inside';
    }

    setLocationNote(`You are ~${(outsideDistance / 1000).toFixed(1)} km outside campus (±${Math.round(accuracy)}m). Virtual mode only.`);
    return 'outside';
  };

  const handleRequestLocation = async () => {
    setIsCheckingLocation(true);
    const locationAccess = await requestLocationPermission();
    setIsCheckingLocation(false);
    if (locationAccess) {
      onNext(locationAccess);
    }
    return locationAccess;
  };

  const handleStart = () => {
    audioEngine.registerUserGesture();
    onStart();
    setShowPermissionGate(true);
  };

  const handleContinueWithoutLocation = () => {
    onNext('outside');
  };

  return (
    <section className="mx-auto flex w-full max-w-xl flex-col items-center rounded-4xl border border-slate-200 bg-white p-6 text-center shadow-[0_24px_60px_-36px_rgba(15,23,42,0.2)] sm:p-8 lg:p-10">
      <div className="relative mb-6 flex justify-center sm:mb-8">
        <div className="absolute inset-0 rounded-full bg-blue-100/50 blur-3xl scale-150" />
        <div className="relative inline-flex h-28 w-28 items-center justify-center rounded-3xl border border-[#bfd2f8] bg-white shadow-sm sm:h-32 sm:w-32">
          <BrandLogo className="h-18 w-auto object-contain sm:h-20" />
        </div>
      </div>

      <div className="mb-8 space-y-3 sm:mb-10">
        <p className="text-[11px] font-black uppercase tracking-[0.28em] text-blue-600">SMRU Campus Guide</p>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">Welcome to St. Mary&apos;s University</h1>
        <p className="mx-auto max-w-[24rem] text-base leading-relaxed text-slate-600 sm:text-[1.03rem]">
          Start your campus tour. We&apos;ll ask for location only after you choose to continue.
        </p>
      </div>

      {!showPermissionGate ? (
        <div className="w-full space-y-4">
          <button
            type="button"
            onClick={handleStart}
            className="flex h-14 w-full items-center justify-center rounded-2xl bg-[#0b57d0] px-5 text-lg font-bold text-white shadow-[0_18px_36px_-18px_rgba(11,87,208,0.75)] transition-transform active:scale-[0.99]"
          >
            Start Tour
          </button>
          <p className="text-sm text-slate-500">No login. No personal data. No GPS until you tap Start Tour.</p>
        </div>
      ) : (
        <div className="w-full space-y-4">
          <div className="rounded-2xl bg-slate-50 px-4 py-4 text-left">
            <p className="text-base font-semibold text-slate-900">Choose how you want to continue</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Allow location for guided campus features, or continue without location for Virtual Tour.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              void handleRequestLocation();
            }}
            disabled={isCheckingLocation}
            className="flex h-14 w-full items-center justify-center rounded-2xl bg-[#0b57d0] px-5 text-lg font-bold text-white shadow-[0_18px_36px_-18px_rgba(11,87,208,0.75)] transition-transform active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isCheckingLocation ? 'Checking Location...' : 'Allow Location'}
          </button>

          <button
            type="button"
            onClick={handleContinueWithoutLocation}
            className="flex h-14 w-full items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 text-lg font-semibold text-slate-800 transition-colors hover:bg-slate-50"
          >
            Continue Without Location / Virtual Tour
          </button>

          {locationNote ? <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">{locationNote}</p> : null}
          <div className="flex items-center justify-center gap-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            <span>No Login</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span>No Location History</span>
          </div>
        </div>
      )}
    </section>
  );
}
