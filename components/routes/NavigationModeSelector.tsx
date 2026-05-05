'use client';

import { useMemo, useState } from 'react';
import type { RouteNavigationMode } from '@/data/mockRoutes';

interface NavigationModeSelectorProps {
  availableModes: RouteNavigationMode[];
}

const MODE_ITEMS: Array<{ key: RouteNavigationMode; label: string }> = [
  { key: 'guided', label: 'Campus Cart' },
  { key: 'walk_manual', label: 'Walk / Manual' },
  { key: 'self_paced', label: 'Own Vehicle' },
  { key: 'audio_only', label: 'Complete Manual' },
];

export default function NavigationModeSelector({ availableModes }: NavigationModeSelectorProps) {
  const initialMode = useMemo(
    () => MODE_ITEMS.find((mode) => availableModes.includes(mode.key))?.key ?? 'walk_manual',
    [availableModes]
  );
  const [selected, setSelected] = useState<RouteNavigationMode>(initialMode);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
      <p className="text-sm font-semibold text-slate-900 dark:text-white">Navigation Mode</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {MODE_ITEMS.map((mode) => {
          const available = availableModes.includes(mode.key);
          const active = selected === mode.key;
          return (
            <button
              key={mode.key}
              type="button"
              aria-pressed={active}
              onClick={() => setSelected(mode.key)}
              className={`min-h-11 rounded-xl border px-3 py-2 text-left text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                active
                  ? 'border-blue-600 bg-blue-50 text-blue-800 dark:bg-blue-950/50 dark:text-blue-200'
                  : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
              }`}
            >
              <span>{mode.label}</span>
              {!available ? (
                <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">(Not listed)</span>
              ) : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}
