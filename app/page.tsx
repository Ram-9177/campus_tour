import PageShell from '@/components/layout/PageShell';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';

export default function HomePage() {
  return (
    <PageShell title="Home" subtitle="SMRU Smart Campus Guide">
      <OnboardingFlow />
    </PageShell>
  );
}
