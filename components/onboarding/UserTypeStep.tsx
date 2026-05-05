import type { AppUserType } from '@/types/appRules';
import { USER_TYPES } from '@/lib/constants';

interface UserTypeStepProps { value: AppUserType | null; onSelect: (value: AppUserType) => void; }

export default function UserTypeStep({ value, onSelect }: UserTypeStepProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
      <h2 className="text-xl font-semibold text-slate-900 sm:text-[1.35rem]">Select User Type</h2>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {USER_TYPES.map((item) => (
          <button key={item.key} type="button" onClick={() => onSelect(item.key)} className={`min-h-16 rounded-2xl border px-4 text-left text-sm font-semibold leading-tight transition-colors sm:min-h-18 ${value === item.key ? 'border-[#0b57d0] bg-[#eef4ff] text-[#0b57d0]' : 'border-slate-200 bg-white text-slate-800 hover:border-[#bfd2f6]'}`}>{item.label}</button>
        ))}
      </div>
    </section>
  );
}
