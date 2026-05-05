import Link from 'next/link';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: string;
  actionLabel?: string;
  actionHref?: string;
  children?: ReactNode;
}

export default function EmptyState({
  title,
  description,
  icon = '•',
  actionLabel,
  actionHref,
  children,
}: EmptyStateProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900/80 sm:p-8">
      <div
        aria-hidden="true"
        className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl text-slate-700 dark:bg-slate-800 dark:text-slate-200"
      >
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
        {title}
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-400">
        {description}
      </p>
      {children ? <div className="mt-4">{children}</div> : null}
      {actionLabel && actionHref ? (
        <div className="mt-5">
          <Link href={actionHref} className="btn-primary inline-flex min-h-11 items-center justify-center">
            {actionLabel}
          </Link>
        </div>
      ) : null}
    </section>
  );
}
