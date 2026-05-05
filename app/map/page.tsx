import { Suspense } from 'react';
import PageShell from '@/components/layout/PageShell';
import SectionHeader from '@/components/common/SectionHeader';
import MapPageClient from '@/components/map/MapPageClient';

function MapContent() {
  return <MapPageClient />;
}

export default function MapPage() {
  return (
    <PageShell title="Map" subtitle="Campus overview" backHref="/">
      <SectionHeader
        title="Campus map"
        description="Unified campus map for all modes. Mode-specific points and durations are controlled by admin settings."
      />
      <Suspense fallback={<div>Loading map...</div>}>
        <MapContent />
      </Suspense>
    </PageShell>
  );
}
