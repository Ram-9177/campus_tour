import PageShell from '@/components/layout/PageShell';
import EmptyState from '@/components/common/EmptyState';

export default function OfflinePage() {
  return (
    <PageShell title="Offline" subtitle="Fallback access" backHref="/">
      <EmptyState
        icon="OFF"
        title="Offline support"
        description="This page stays lightweight so visitors can still find basic app guidance when connectivity drops."
        actionLabel="Return home"
        actionHref="/"
      />
    </PageShell>
  );
}
