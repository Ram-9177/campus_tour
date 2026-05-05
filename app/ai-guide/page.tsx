import PageShell from '@/components/layout/PageShell';
import SectionHeader from '@/components/common/SectionHeader';
import AIGuidePlaceholder from '@/components/ai-guide/AIGuidePlaceholder';

export default function AIGuidePage() {
  return (
    <PageShell title="AI Guide" subtitle="Local static helper" backHref="/">
      <SectionHeader
        title="Local AI Guide"
        description="Static question helper with controlled fallback guidance."
      />
      <AIGuidePlaceholder />
    </PageShell>
  );
}
