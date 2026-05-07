'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AppTourMode } from '@/types/appRules';
import { useTourSession } from '@/hooks/useTourSession';
import TourAccessGate from '@/components/launch/TourAccessGate';
import BrandLogo from '@/components/layout/BrandLogo';

export default function OnboardingFlow() {
  const router = useRouter();
  const { patch } = useTourSession();
  const [showSplash, setShowSplash] = useState(true);
  const [splashFading, setSplashFading] = useState(false);

  useEffect(() => {
    // Splash duration: 3.2s show, 0.8s fade = 4s total
    const fadeTimer = window.setTimeout(() => setSplashFading(true), 3200);
    const hideTimer = window.setTimeout(() => setShowSplash(false), 4000);
    
    // Preload hint (browsers can handle images if we render them invisibly or just trust the cache)
    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  const onMode = (mode: AppTourMode) => {
    patch({ visitorType: 'other', navigationMode: mode });
    const target =
      mode === 'walk_with_me'
        ? '/map?mode=walk'
        : mode === 'campus_cart'
          ? '/map?mode=cart'
          : mode === 'manual_explore'
            ? '/map?mode=manual'
            : '/virtual-tour';

    router.push(target);
    // Safety redirect for slow routers
    window.setTimeout(() => {
      if (window.location.pathname + window.location.search !== target) {
        window.location.assign(target);
      }
    }, 150);
  };

  return (
    <div className="tour-shell relative flex min-h-dvh flex-col overflow-hidden bg-white text-slate-900">
      {/* Background accents */}
      <div className="pointer-events-none absolute -left-16 top-24 h-56 w-56 rounded-full bg-blue-100/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-20 h-64 w-64 rounded-full bg-slate-100/30 blur-3xl" />
      
      {/* Premium Full-Screen White Splash */}
      {showSplash ? (
        <div
          className={`fixed inset-0 z-100 flex items-center justify-center bg-white px-6 transition-opacity duration-700 ${
            splashFading ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div className="text-center">
            <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-white sm:h-40 sm:w-40">
              <BrandLogo className="h-24 w-auto object-contain sm:h-28" />
            </div>
            <div className="mt-8 space-y-2">
              <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">St. Mary&apos;s University</h1>
              <div className="mx-auto h-0.5 w-12 bg-blue-600/30 rounded-full" />
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-slate-400 sm:text-base">SMRU Campus Tour</p>
            </div>
          </div>
        </div>
      ) : null}

      {/* Main Flow Container */}
      <div className={`flex min-h-dvh flex-1 flex-col items-center justify-center px-4 py-8 transition-opacity duration-700 sm:px-6 lg:px-8 ${showSplash ? 'opacity-0' : 'opacity-100'}`}>
        <TourAccessGate onSelectMode={onMode} />
      </div>
    </div>
  );
}
