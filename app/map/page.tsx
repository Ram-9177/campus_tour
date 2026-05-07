'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import PageShell from '@/components/layout/PageShell';

const MapPageClient = dynamic(() => import('@/components/map/MapPageClient'), { ssr: false });

function MapContent() {
  return <MapPageClient />;
}

export default function MapPage() {
  return (
    <PageShell
      title="Campus Map"
      subtitle="SMRU Campus World"
      backHref="/"
      showAIGuideButton={false}
      showStickyActions={false}
    >
      <Suspense fallback={<div>Loading map...</div>}>
        <MapContent />
      </Suspense>
    </PageShell>
  );
}
