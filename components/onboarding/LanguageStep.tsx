import type { AppLanguage } from '@/types/appRules';
import { LANGUAGES } from '@/lib/constants';

interface LanguageStepProps { value: AppLanguage | null; onSelect: (value: AppLanguage) => void; }

export default function LanguageStep({ value, onSelect }: LanguageStepProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
      <h2 className="text-xl font-semibold text-slate-900 sm:text-[1.35rem]">Select Language</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {LANGUAGES.SUPPORTED.map((item) => (
          <button key={item.code} type="button" onClick={() => onSelect(item.code)} className={`min-h-14 rounded-2xl border px-4 text-left text-sm font-semibold transition-colors ${value === item.code ? 'border-[#0b57d0] bg-[#eef4ff] text-[#0b57d0]' : 'border-slate-200 bg-white text-slate-800 hover:border-[#bfd2f6]'}`}>
            <span>{item.name}</span>
            <span className="ml-2 text-xs text-slate-500">{item.nativeScript}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
