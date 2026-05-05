import Link from 'next/link';

interface AdminModuleCardProps {
  title: string;
  description: string;
  href?: string;
}

export default function AdminModuleCard({ title, description, href }: AdminModuleCardProps) {
  const content = (
    <>
      <h3 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
        Placeholder Module
      </p>
    </>
  );

  if (!href) {
    return (
      <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
        {content}
      </article>
    );
  }

  return (
    <Link
      href={href}
      className="block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-slate-800 dark:bg-slate-900/90 dark:hover:bg-slate-800/80"
    >
      {content}
    </Link>
  );
}
