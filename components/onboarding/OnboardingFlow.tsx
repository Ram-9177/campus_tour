'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AppTourMode } from '@/types/appRules';
import { useTourSession } from '@/hooks/useTourSession';
import WelcomeStep from './WelcomeStep';
import BrandLogo from '@/components/layout/BrandLogo';
import NavigationModeStep from './NavigationModeStep';

type Step = 0 | 1;

export default function OnboardingFlow() {
  const router = useRouter();
  const { patch } = useTourSession();
  const [step, setStep] = useState<Step>(0);
  const [navigationMode, setNavigationMode] = useState<AppTourMode | null>(null);
  const [locationAccess, setLocationAccess] = useState<'inside' | 'outside'>('outside');
  const [showSplash, setShowSplash] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = window.setTimeout(() => setShowSplash(false), 4000);
    return () => window.clearTimeout(timer);
  }, []);

  const progress = useMemo(() => ((step + 1) / 2) * 100, [step]);
  const wrapperClassName = 'mx-auto w-full max-w-2xl lg:max-w-4xl';
  const allowedModes = locationAccess === 'outside' ? (['virtual_tour'] as AppTourMode[]) : (['manual_explore', 'virtual_tour'] as AppTourMode[]);

  const onMode = (mode: AppTourMode) => {
    const resolvedMode: AppTourMode = locationAccess === 'outside' ? 'virtual_tour' : mode;
    setNavigationMode(resolvedMode);
    patch({ visitorType: 'other', language: 'en', navigationMode: resolvedMode });
    const target =
      resolvedMode === 'walk_with_me'
        ? '/map?mode=walk'
        : resolvedMode === 'campus_cart'
          ? '/map?mode=cart'
          : resolvedMode === 'manual_explore'
            ? '/map?mode=manual'
            : '/virtual-tour';

    router.push(target);
    window.setTimeout(() => {
      if (window.location.pathname + window.location.search !== target) {
        window.location.assign(target);
      }
    }, 150);
  };

  if (!mounted) {
    return <div className={wrapperClassName} />;
  }

  if (showSplash) {
    return (
      <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-linear-to-b from-[#ecf4ff] via-white to-[#eaf2ff] px-6">
        <div className="text-center">
          <div className="mx-auto inline-flex h-34 w-34 items-center justify-center rounded-[2rem] border border-[#bfd2f8] bg-white shadow-xl sm:h-40 sm:w-40">
            <BrandLogo className="h-24 w-auto object-contain sm:h-28" />
          </div>
          <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">St. Mary&apos;s University</h1>
        </div>
      </div>
    );
  }

  return (
    <div className={wrapperClassName}>
      <div className="mb-4 rounded-2xl border border-slate-200 bg-white/80 p-3 shadow-[0_8px_20px_-18px_rgba(15,23,42,0.45)] backdrop-blur sm:p-4">
        <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-600">
          <span>Step {step + 1} of 2</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 rounded-full bg-slate-100">
          <div className="h-2 rounded-full bg-[#0b57d0] transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="transition-all duration-200">
        {step === 0 ? <WelcomeStep onNext={(access) => { setLocationAccess(access); setStep(1); }} /> : null}
        {step === 1 ? <NavigationModeStep value={navigationMode} onSelect={onMode} allowedModes={allowedModes} lockReason={locationAccess === 'outside' ? 'You are outside campus range. Only Virtual Tour is available.' : null} /> : null}
      </div>
    </div>
  );
}
