import PageShell from '@/components/layout/PageShell';
import SectionHeader from '@/components/common/SectionHeader';
import { getAllStops } from '@/data/mockStops';

export default function CartPage() {
  const stops = getAllStops().slice(0, 6);

  return (
    <PageShell title="Navigation Modes" subtitle="Mode placeholders" backHref="/">
      <SectionHeader
        title="Mode Hub"
        description="Campus navigation placeholders with no forced GPS and no live tracking."
      />

      <div className="space-y-4">
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Campus Cart Mode</h3>
          <div className="mt-3 grid gap-2 text-sm text-slate-600 dark:text-slate-400">
            <p className="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/70">Nearest cart stop: placeholder</p>
            <p className="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/70">Destination cart stop: placeholder</p>
            <p className="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/70">Stop-to-stop route: placeholder</p>
            <p className="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/70">Static ETA: 08 min (placeholder)</p>
            <p className="text-xs">No live vehicle tracking in current version.</p>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Walk / Manual Mode</h3>
          <div className="mt-3 grid gap-2 text-sm text-slate-600 dark:text-slate-400">
            <p className="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/70">Location permission: optional only</p>
            <p className="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/70">Manual navigation fallback: enabled</p>
            <button type="button" className="rounded-xl border border-slate-200 px-3 py-2 text-left dark:border-slate-700">
              Skip next stop (placeholder)
            </button>
            <button type="button" className="rounded-xl border border-slate-200 px-3 py-2 text-left dark:border-slate-700">
              Select stop manually (placeholder)
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Own Vehicle Mode</h3>
          <div className="mt-3 grid gap-2 text-sm text-slate-600 dark:text-slate-400">
            <p className="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/70">Internal road guidance: placeholder</p>
            <p className="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/70">Parking/drop points: placeholder</p>
            <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100">
              Campus safety note: follow internal signage and designated driving limits.
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Complete Manual Browse</h3>
          <div className="mt-3 grid gap-2 text-sm text-slate-600 dark:text-slate-400">
            <p className="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/70">Search stops: placeholder</p>
            <p className="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/70">Filter by category: placeholder</p>
            <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Browse All Stops</p>
              <ul className="space-y-1">
                {stops.map((stop) => (
                  <li key={stop.id} className="text-sm">
                    {stop.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
