import Link from 'next/link';
import type { MockRouteSeed, RouteNavigationMode } from '@/data/mockRoutes';

interface RouteCardProps {
  route: MockRouteSeed;
}

const NAV_MODE_LABELS: Record<RouteNavigationMode, string> = {
  guided: 'Campus Cart',
  walk_manual: 'Walk / Manual',
  self_paced: 'Own Vehicle',
  audio_only: 'Complete Manual',
};

const DISPLAY_MODES: Array<{ key: RouteNavigationMode; label: string }> = [
  { key: 'guided', label: 'Campus Cart' },
  { key: 'walk_manual', label: 'Walk / Manual' },
  { key: 'self_paced', label: 'Own Vehicle' },
  { key: 'audio_only', label: 'Complete Manual' },
];

export default function RouteCard({ route }: RouteCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all">
      <h3 className="text-lg font-bold text-slate-900">{route.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{route.shortDescription}</p>

      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-100 text-blue-900 font-semibold">
          ⏱ {route.estimatedDuration} min
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-100 text-cyan-900 font-semibold">
          📍 {route.orderedStopIds.length} stops
        </span>
      </div>

      <div className="mt-4">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
          Navigation Modes
        </p>
        <div className="flex flex-wrap gap-2">
          {DISPLAY_MODES.map((mode) => {
            const available = route.availableNavigationModes.includes(mode.key);
            return (
              <span
                key={mode.key}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                  available
                    ? mode.key === 'guided'
                      ? 'bg-amber-100 text-amber-900'
                      : mode.key === 'walk_manual'
                        ? 'bg-emerald-100 text-emerald-900'
                        : mode.key === 'self_paced'
                          ? 'bg-blue-100 text-blue-900'
                          : 'bg-violet-100 text-violet-900'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {NAV_MODE_LABELS[mode.key]}
              </span>
            );
          })}
        </div>
      </div>

      <div className="mt-5">
        <Link
          href={`/tour/${route.slug}`}
          className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-linear-to-r from-[#0b57d0] to-[#0a4cc0] hover:shadow-lg text-sm font-semibold text-white transition-all active:scale-95"
          aria-label={`View route ${route.title}`}
        >
          Explore Route →
        </Link>
      </div>
    </article>
  );
}
