import Link from 'next/link';
import PageShell from '@/components/layout/PageShell';
import SectionHeader from '@/components/common/SectionHeader';

export default function AboutPage() {
  return (
    <PageShell title="About" subtitle="SMRU Campus Tour overview" backHref="/">
      <section className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
          SMRU Campus Tour is a mobile-first PWA for browsing seeded campus routes, locations, and simple guidance without requiring login or lead capture.
        </p>
      </section>

      <SectionHeader
        title="What it emphasizes"
        description="A compact experience built for phones, offline resilience, and clear navigation."
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {[
          ['Mobile-first', 'Designed to fit small Android and iPhone screens comfortably.'],
          ['Offline-ready', 'Shows a notice when connectivity drops.'],
          ['Accessible controls', 'Buttons and links are sized for touch use.'],
          ['No clutter', 'The shell keeps the interface focused and readable.'],
        ].map(([featureTitle, description]) => (
          <article key={featureTitle} className="card-hover">
            <h3 className="font-semibold text-slate-900 dark:text-white">{featureTitle}</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
          </article>
        ))}
      </div>

      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
          Explore the seeded public surfaces from the home page, or jump directly to routes and the map.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/locations" className="btn-primary inline-flex min-h-11 items-center justify-center">
            Routes
          </Link>
          <Link href="/map" className="btn-secondary inline-flex min-h-11 items-center justify-center">
            Map
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
