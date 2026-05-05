import PageShell from '@/components/layout/PageShell';
import SectionHeader from '@/components/common/SectionHeader';
import { mockBrochures } from '@/data/mockBrochures';

export default function BrochuresPage() {
  return (
    <PageShell title="Brochures" subtitle="Reference sheets and guides" backHref="/">
      <SectionHeader
        title="Brochure library"
        description="Local brochure placeholders with active/inactive status."
      />

      <div className="space-y-3">
        {mockBrochures.map((brochure, index) => {
          const isActive = brochure.featured || index % 2 === 0;
          return (
            <article key={brochure.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
              <h3 className="font-semibold text-slate-900 dark:text-white">{brochure.title}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">{brochure.description}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  Linked route/stop: placeholder
                </span>
                <span
                  className={`rounded-full px-2.5 py-1 ${
                    isActive
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <button
                type="button"
                className="btn-secondary mt-3 inline-flex min-h-11 items-center justify-center text-sm"
                aria-label={`Download brochure placeholder for ${brochure.title}`}
              >
                Download (Placeholder)
              </button>
            </article>
          );
        })}
      </div>
    </PageShell>
  );
}
