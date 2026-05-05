import PageShell from '@/components/layout/PageShell';
import SectionHeader from '@/components/common/SectionHeader';
import { campusLocations } from '@/data/campusLocations';
import Link from 'next/link';

export default function LocationsPage() {
  return (
    <PageShell title="Locations" subtitle="Campus Map Locations" backHref="/">
      <SectionHeader
        title="Campus Locations"
        description="Select a location to view details and guidance."
      />
      <div className="grid gap-3">
        {campusLocations.filter(loc => loc.active).map(location => (
          <Link
            key={location.id}
            href={`/stop/${location.slug}`}
            className="flex flex-col gap-2 rounded-2xl border border-[#dbe5f5] bg-white p-4 shadow-[0_2px_12px_rgba(11,87,208,0.04)] transition-all hover:-translate-y-1 hover:shadow-lg active:scale-[0.98]"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">{location.name.en}</h3>
              <span className="rounded-lg bg-blue-100 px-2 py-1 text-[10px] font-bold tracking-wider text-blue-900 uppercase">
                {location.category}
              </span>
            </div>
            <p className="text-sm text-slate-600 line-clamp-2">
              {location.description.en}
            </p>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
