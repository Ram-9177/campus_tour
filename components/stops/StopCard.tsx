import type { ReactNode } from 'react';

interface StopCardProps {
  title: string;
  children: ReactNode;
}

export default function StopCard({ title, children }: StopCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all">
      <p className="text-sm font-bold text-slate-900 uppercase tracking-wide">{title}</p>
      <div className="mt-3 text-sm text-slate-700 leading-relaxed">{children}</div>
    </article>
  );
}
