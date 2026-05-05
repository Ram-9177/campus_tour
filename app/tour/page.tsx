'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import PageShell from '@/components/layout/PageShell';
import SectionHeader from '@/components/common/SectionHeader';

interface TourStep {
  id: number;
  title: string;
  description: string;
  duration: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 1,
    title: 'Main Gate',
    description: 'Start your tour at the main entrance of SMRU Campus',
    duration: '5 min',
  },
  {
    id: 2,
    title: 'Academic Block',
    description: 'Visit the main academic building with classrooms and labs',
    duration: '15 min',
  },
  {
    id: 3,
    title: 'Library',
    description: 'Explore our state-of-the-art library facilities',
    duration: '10 min',
  },
  {
    id: 4,
    title: 'Cafeteria',
    description: 'Discover dining and recreational facilities',
    duration: '10 min',
  },
  {
    id: 5,
    title: 'Sports Complex',
    description: 'Check out our sports and fitness facilities',
    duration: '15 min',
  },
  {
    id: 6,
    title: 'Residential Area',
    description: 'View student dormitories and housing facilities',
    duration: '10 min',
  },
];

export default function TourPage() {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('completedTourSteps');
    if (saved) {
      setCompletedSteps(JSON.parse(saved));
    }
  }, []);

  const toggleStep = (stepId: number) => {
    setCompletedSteps((prev) => {
      const updated = prev.includes(stepId)
        ? prev.filter((id) => id !== stepId)
        : [...prev, stepId];
      localStorage.setItem('completedTourSteps', JSON.stringify(updated));
      return updated;
    });
  };

  const progress = Math.round(
    (completedSteps.length / TOUR_STEPS.length) * 100
  );

  return (
    <PageShell title="Tour" subtitle="Tour progress" backHref="/">
      <SectionHeader
        title="Tour progress"
        description="Mark stops as completed as you move through campus."
      />

      <section className="mb-6">
        <div className="card">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Progress
            </h2>
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-sm font-semibold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
              {progress}%
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {completedSteps.length} of {TOUR_STEPS.length} stops completed
          </p>
        </div>
      </section>

      <section className="mb-8 space-y-3">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">
          Tour Stops
        </h2>
        {TOUR_STEPS.map((step) => {
          const completed = completedSteps.includes(step.id);
          return (
            <button
              key={step.id}
              onClick={() => toggleStep(step.id)}
              className={`w-full rounded-xl border p-4 text-left transition-colors ${
                completed
                  ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/20'
                  : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    Stop {step.id}
                  </p>
                  <h3 className={`text-sm font-semibold ${completed ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-900 dark:text-white'}`}>
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    {step.description}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <span className="block rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {step.duration}
                  </span>
                  <span className={`mt-2 block text-xs font-semibold ${completed ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-500 dark:text-slate-400'}`}>
                    {completed ? 'Completed' : 'Pending'}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </section>

      <section className="grid grid-cols-2 gap-3">
        {[
          { href: '/buildings', title: 'Buildings' },
          { href: '/facilities', title: 'Facilities' },
          { href: '/directions', title: 'Directions' },
          { href: '/about', title: 'About' },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="card-hover flex min-h-20 items-center justify-center text-center text-sm font-semibold text-slate-900 dark:text-white"
          >
            {item.title}
          </Link>
        ))}
      </section>
    </PageShell>
  );
}
