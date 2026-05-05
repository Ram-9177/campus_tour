'use client';

import { use, useEffect, useState } from 'react';
import PageShell from '@/components/layout/PageShell';
import EmptyState from '@/components/common/EmptyState';
import LocationExperienceCard from '@/components/location/LocationExperienceCard';
import { LocationStore } from '@/lib/locationStore';
import { useTourSession } from '@/hooks/useTourSession';
import type { CampusLocation } from '@/types/campusLocation';

interface StopSlugPageProps {
  params: Promise<{ slug: string }>;
}

export default function StopSlugPage({ params }: StopSlugPageProps) {
  const { slug } = use(params);
  const { session } = useTourSession();
  const [location, setLocation] = useState<CampusLocation | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loc = LocationStore.getLocationBySlug(slug);
    setLocation(loc);
    setLoading(false);
  }, [slug]);

  const language = session?.language || 'en';

  if (loading) {
    return <PageShell title="Loading..." subtitle="Fetching location data..."><div className="p-8 text-center text-slate-400">Loading...</div></PageShell>;
  }

  return (
    <PageShell title="Location details" subtitle={location?.name[language] ?? slug} backHref="/locations">
      {location ? (
        <div className="pb-12">
          <LocationExperienceCard location={location} language={language} />
        </div>
      ) : (
        <EmptyState
          icon="?"
          title="Location not found"
          description="The requested location is unavailable. Please return to the campus overview."
          actionLabel="Back to Locations"
          actionHref="/locations"
        />
      )}
    </PageShell>
  );
}
