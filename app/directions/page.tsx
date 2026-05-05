'use client';

import { useState } from 'react';
import PageShell from '@/components/layout/PageShell';
import SectionHeader from '@/components/common/SectionHeader';

interface DirectionInfo {
  from: string;
  to: string;
  distance: string;
  duration: string;
  steps: string[];
}

const DIRECTIONS: DirectionInfo[] = [
  {
    from: 'Main Gate',
    to: 'Academic Block',
    distance: '200m',
    duration: '3 min walk',
    steps: ['Enter through the main gate', 'Turn right from the entrance', 'Follow the main path for 200m', 'The Academic Block will be on your left'],
  },
  {
    from: 'Academic Block',
    to: 'Library',
    distance: '150m',
    duration: '2 min walk',
    steps: ['Exit the Academic Block from the main entrance', 'Turn left and follow the pathway', 'The Central Library is directly ahead'],
  },
  {
    from: 'Library',
    to: 'Cafeteria',
    distance: '300m',
    duration: '4 min walk',
    steps: ['Exit from the library main entrance', 'Head towards the campus center', 'Continue straight for about 300m', 'Cafeteria is near the sports complex'],
  },
  {
    from: 'Cafeteria',
    to: 'Sports Complex',
    distance: '100m',
    duration: '2 min walk',
    steps: ['Exit the cafeteria', 'Turn right', 'The Sports Complex entrance is just ahead'],
  },
];

export default function DirectionsPage() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState('');

  const requestLocation = () => {
    if (!('geolocation' in navigator)) {
      setError('Location is not supported on this device');
      return;
    }

    setError('');
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        setIsLocating(false);
      },
      () => {
        setError('Location permission not granted');
        setIsLocating(false);
      }
    );
  };

  return (
    <PageShell title="Directions" subtitle="Simple walking guidance" backHref="/">
      <SectionHeader title="Directions" description="Built for quick orientation without a crowded interface." />

      <section className="mb-8">
        {location ? (
          <div className="card border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
              <span className="font-semibold">Location detected</span>
            </div>
          </div>
        ) : error ? (
          <div className="card border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
              <span className="font-semibold">{error}</span>
            </div>
            <button
              type="button"
              onClick={requestLocation}
              className="btn-secondary mt-3 inline-flex min-h-10 items-center justify-center text-sm"
            >
              Try Location Again
            </button>
          </div>
        ) : (
          <div className="card border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <span className="font-semibold">Location is optional. Use manual directions or enable location.</span>
            </div>
            <button
              type="button"
              onClick={requestLocation}
              disabled={isLocating}
              className="btn-secondary mt-3 inline-flex min-h-10 items-center justify-center text-sm"
            >
              {isLocating ? 'Checking Location...' : 'Enable Location (Optional)'}
            </button>
          </div>
        )}
      </section>

      <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/90">
        <h3 className="mb-2 text-base font-semibold text-slate-900 dark:text-white">Navigate Campus</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Get turn-by-turn directions between campus locations and buildings.
        </p>
      </section>

      <section className="mb-12 space-y-4">
        <h2 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">Popular Routes</h2>
        {DIRECTIONS.map((direction, index) => (
          <div key={index} className="card-hover">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {direction.from} to {direction.to}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {direction.distance} - {direction.duration}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {direction.steps.map((step, stepIndex) => (
                <div key={stepIndex} className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    {stepIndex + 1}
                  </div>
                  <p className="pt-0.5 text-sm text-slate-600 dark:text-slate-400">{step}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="mb-12 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/90">
        <h3 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">Navigation Tips</h3>
        <ul className="space-y-3 text-sm">
          <li className="flex gap-3">
            <span className="text-slate-600 dark:text-slate-400">Campus maps are available at the information desk</span>
          </li>
          <li className="flex gap-3">
            <span className="text-slate-600 dark:text-slate-400">Directional signs are posted throughout campus</span>
          </li>
          <li className="flex gap-3">
            <span className="text-slate-600 dark:text-slate-400">Ask campus security staff for help with directions</span>
          </li>
          <li className="flex gap-3">
            <span className="text-slate-600 dark:text-slate-400">Most locations are within 10-minute walking distance</span>
          </li>
        </ul>
      </section>
    </PageShell>
  );
}
