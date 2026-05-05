import type { ReactNode } from 'react';
import PageShell from '@/components/layout/PageShell';

interface AdminShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  backHref?: string;
}

export default function AdminShell({
  title,
  subtitle,
  children,
  backHref = '/admin',
}: AdminShellProps) {
  return (
    <PageShell
      title={title}
      subtitle={subtitle}
      backHref={backHref}
      showBottomNav={false}
      showAIGuideButton={false}
    >
      {children}
    </PageShell>
  );
}
