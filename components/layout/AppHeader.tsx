import Link from 'next/link';
import BrandLogo from './BrandLogo';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
}

export default function AppHeader({
  title,
  subtitle,
  backHref,
  backLabel = 'Back',
}: AppHeaderProps) {
  return (
    <header className="cinematic-header sticky top-0 z-40 backdrop-blur supports-backdrop-filter:bg-[#edf3ff]/90">
      <div className="container-safe flex min-h-20 items-center gap-3 py-3.5 sm:gap-4 lg:min-h-24 lg:py-4">
        {backHref ? (
          <Link
            href={backHref}
            aria-label={backLabel}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#c6d8fb] bg-white/90 text-slate-700 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 sm:h-11 sm:w-11"
          >
            <span aria-hidden="true">←</span>
          </Link>
        ) : null}

        <Link href="/" className="flex min-w-0 flex-1 items-center gap-3">
          <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#bfd2f8] bg-white shadow-sm sm:h-16 sm:w-16">
            <BrandLogo className="h-10 w-auto object-contain sm:h-12" />
          </span>
          <span className="min-w-0">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500 sm:text-[12px]">
              SMRU Campus Tour
            </span>
            <span className="block truncate text-[1.2rem] leading-tight font-bold tracking-[-0.01em] text-slate-900 sm:text-[1.35rem] lg:text-[1.45rem]">
              {title ?? 'Campus Tour'}
            </span>
            {subtitle ? (
              <span className="block truncate text-sm font-medium text-slate-600 sm:text-[0.95rem]">
                {subtitle}
              </span>
            ) : null}
          </span>
        </Link>
      </div>
    </header>
  );
}
