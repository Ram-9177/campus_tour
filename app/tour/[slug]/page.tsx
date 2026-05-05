import Link from 'next/link';
import PageShell from '@/components/layout/PageShell';
import SectionHeader from '@/components/common/SectionHeader';
import EmptyState from '@/components/common/EmptyState';
import NavigationModeSelector from '@/components/routes/NavigationModeSelector';
import { getRouteBySlug } from '@/data/mockRoutes';
import { getStopsByIds } from '@/data/mockStops';

interface TourSlugPageProps {
  params: Promise<{ slug: string }>;
}

export default async function TourSlugPage({ params }: TourSlugPageProps) {
  const { slug } = await params;
  const route = getRouteBySlug(slug);
  const stops = route ? getStopsByIds(route.orderedStopIds) : [];

  return (
    <PageShell title="Tour details" subtitle={route?.title ?? 'Official route'} backHref="/locations">
      {route ? (
        <>
          <SectionHeader
            title={route.title}
            description={route.shortDescription}
            eyebrow={route.category}
          />

          <div className="space-y-3">
            <article className="card-hover">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Duration</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{route.estimatedDuration} minutes</p>
            </article>
            <article className="card-hover">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Navigation modes</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Campus Cart · Walk / Manual · Own Vehicle · Complete Manual
              </p>
            </article>
            <article className="card-hover">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Stops</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {stops.length} seeded stops in route order
              </p>
            </article>
          </div>

          <div className="mt-4">
            <NavigationModeSelector availableModes={route.availableNavigationModes} />
          </div>

          <div className="mt-4 space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Route stops
            </p>
            {stops.map((stop, index) => (
              <Link key={stop.id} href={`/stop/${stop.slug}`} className="card-hover block">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Stop {index + 1}
                    </p>
                    <h3 className="mt-1 font-semibold text-slate-900 dark:text-white">
                      {stop.name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                      {stop.short_description ?? stop.description}
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    {stop.category}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href={stops[0] ? `/stop/${stops[0].slug}` : '/routes'}
              className="btn-primary inline-flex min-h-11 items-center justify-center"
            >
              Start Route
            </Link>
            <Link href="/map" className="btn-secondary inline-flex min-h-11 items-center justify-center">
              Open Map
            </Link>
            <Link href="/locations" className="btn-secondary inline-flex min-h-11 items-center justify-center">
              Back to Locations
            </Link>
          </div>
        </>
      ) : (
        <EmptyState
          icon="?"
          title="Route not found"
          description="The route you requested is unavailable. Please select one of the official routes."
          actionLabel="Back to Locations"
          actionHref="/locations"
        />
      )}
    </PageShell>
  );
}
