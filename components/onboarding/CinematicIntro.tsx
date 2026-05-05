'use client';

import { useEffect, useState } from 'react';
import audioEngine from '@/lib/audioGuideEngine';

interface Props {
  onDone: () => void;
}

export default function CinematicIntro({ onDone }: Props) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 350);
    const t2 = setTimeout(() => setPhase(2), 1100);
    const t3 = setTimeout(() => setPhase(3), 2200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const enter = () => {
    audioEngine.registerUserGesture();
    onDone();
  };

  return (
    <section className="relative min-h-[74vh] overflow-hidden rounded-4xl border border-[#203557] bg-[#030913] text-white shadow-[0_30px_70px_-35px_rgba(0,0,0,0.85)] sm:min-h-[76vh] lg:min-h-[78vh]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.28),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(14,165,233,0.22),transparent_35%),linear-gradient(160deg,#030913_0%,#071425_45%,#0a1b31_100%)]" />
      <div className="absolute inset-0">
        <div className={`absolute left-1/2 top-[36%] h-130 w-130 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/20 bg-[radial-gradient(circle_at_40%_35%,#79b8ff_0%,#1f4e96_45%,#0a2448_100%)] shadow-[0_0_140px_rgba(59,130,246,0.35)] transition-all duration-2600 ${phase >= 1 ? 'scale-100 opacity-100' : 'scale-[0.72] opacity-0'}`} />
        <div className={`absolute left-1/2 top-[36%] h-130 w-130 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 transition-all duration-2600 ${phase >= 2 ? 'scale-[2.7] opacity-0' : 'scale-100 opacity-35'}`} />
        <div className={`absolute left-1/2 top-[36%] h-140 w-140 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-100/15 transition-all duration-2600 ${phase >= 2 ? 'scale-[2.4] opacity-0' : 'scale-100 opacity-20'}`} />

        <div className={`absolute inset-x-5 bottom-20 rounded-2xl border border-cyan-100/20 bg-[#081a30]/70 p-4 backdrop-blur transition-all duration-1000 sm:inset-x-8 sm:bottom-24 ${phase >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan-200/85">Zoom Target</div>
          <div className="mt-1 text-lg font-extrabold tracking-[-0.01em] text-white">St. Mary’s / SMRU Campus</div>
          <div className="mt-1 text-xs text-slate-300">Pilani-style cinematic zoom into local campus navigation map</div>
        </div>
      </div>

      <div className="relative z-10 flex min-h-[74vh] flex-col justify-between p-5 sm:p-7 lg:min-h-[78vh] lg:p-8">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={enter}
            className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-white/90 hover:bg-white/20"
          >
            Skip Intro
          </button>
        </div>

        <div className="space-y-5 pb-6">
          <div className={`transition-all duration-700 ${phase >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-cyan-200/85">SMRU CAMPUS TOUR</p>
          </div>

          <div className={`transition-all duration-700 delay-150 ${phase >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
            <h1 className="text-3xl font-black leading-[1.05] tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl">
              From Earth to
              <span className="block bg-linear-to-r from-cyan-200 via-blue-300 to-indigo-200 bg-clip-text text-transparent">
                St. Mary’s Campus
              </span>
            </h1>
          </div>

          <div className={`transition-all duration-700 delay-300 ${phase >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
            <p className="max-w-sm text-sm leading-7 text-slate-200/90">
              A cinematic zoom-in intro that lands directly into your campus exploration experience.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={enter}
          className={`h-12 w-full rounded-xl bg-linear-to-r from-[#0b57d0] via-[#1d6bdf] to-[#0a4cc0] text-sm font-bold text-white shadow-[0_18px_36px_-20px_rgba(29,107,223,0.95)] transition-all active:scale-[0.99] ${
            phase >= 3 ? 'opacity-100' : 'opacity-90'
          }`}
        >
          Enter Tour
        </button>
      </div>
    </section>
  );
}
