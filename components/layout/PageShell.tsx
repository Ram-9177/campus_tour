import type { ReactNode } from 'react';
import AppHeader from './AppHeader';
import BottomNav from './BottomNav';
import OfflineNotice from '@/components/common/OfflineNotice';
import AIGuideButton from '@/components/ai-guide/AIGuideButton';
import StickyActions from '@/components/cta/StickyActions';

interface PageShellProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  className?: string;
  contentClassName?: string;
  showBottomNav?: boolean;
  showAIGuideButton?: boolean;
  showStickyActions?: boolean;
}

export default function PageShell({
  children,
  title,
  subtitle,
  backHref,
  backLabel,
  className,
  contentClassName,
  showBottomNav = true,
  showAIGuideButton = true,
  showStickyActions = true,
}: PageShellProps) {
  return (
    <div
      className={`tour-shell min-h-dvh text-slate-900 ${className ?? ''}`}
    >
      <AppHeader title={title} subtitle={subtitle} backHref={backHref} backLabel={backLabel} />
      <OfflineNotice />
      <main className={`mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 pb-28 sm:px-6 lg:px-8 lg:py-6 animate-in ${contentClassName ?? ''}`}>
        {children}
      </main>

      {showStickyActions ? <StickyActions /> : null}
      {showAIGuideButton && showBottomNav ? <AIGuideButton /> : null}
      {showBottomNav ? <BottomNav /> : null}
    </div>
  );
}
