import type { AppTourMode } from '@/types/appRules';
import { TOUR_MODES } from '@/lib/constants';

const MODE_DETAILS: Record<AppTourMode, { desc: string; icon: string }> = {
  walk_with_me: { desc: 'GPS-enabled walking tour with real-time location detection', icon: '🚶' },
  campus_cart: { desc: 'Guided cart tour with pre-set stops and commentary', icon: '🛒' },
  manual_explore: { desc: 'Campus map tour with directions, media, and guided exploration', icon: '🗺️' },
  virtual_tour: { desc: 'Remote exploration from anywhere without GPS', icon: '🌐' },
};

interface NavigationModeStepProps {
  value: AppTourMode | null;
  onSelect: (value: AppTourMode) => void;
  allowedModes?: AppTourMode[];
  lockReason?: string | null;
}

export default function NavigationModeStep({ value, onSelect, allowedModes, lockReason }: NavigationModeStepProps) {
  const renderedModes = allowedModes && allowedModes.length > 0 ? TOUR_MODES.filter((item) => allowedModes.includes(item.key)) : TOUR_MODES;

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-linear-to-b from-white to-slate-50 p-5 shadow-sm sm:p-6 lg:p-8">
      <h2 className="mb-1 text-xl font-extrabold tracking-[-0.01em] text-slate-900 sm:text-2xl lg:text-[2.1rem]">Choose How to Explore</h2>
      <p className="mb-4 text-sm font-medium text-slate-600 sm:mb-5">Pick your preferred campus exploration mode</p>
      {lockReason ? (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
          {lockReason}
        </div>
      ) : null}
      <div className="grid gap-3 lg:grid-cols-2">
        {renderedModes.map((item) => {
          const details = MODE_DETAILS[item.key];
          const isSelected = value === item.key;
          const displayLabel = item.key === 'manual_explore' ? 'Campus Tour' : item.label;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onSelect(item.key)}
              aria-pressed={isSelected}
              className={`group relative min-h-[132px] overflow-hidden rounded-3xl border p-4 text-left transition-all duration-200 active:scale-[0.99] sm:min-h-[148px] sm:p-5 lg:min-h-[156px] ${
                isSelected
                  ? 'border-[#0b57d0] bg-linear-to-r from-[#eaf2ff] via-[#f3f8ff] to-[#eef7ff] shadow-[0_12px_28px_-20px_rgba(11,87,208,0.9)]'
                  : 'border-slate-200 bg-white hover:border-[#bfd2f6] hover:shadow-sm'
              }`}
            >
              <div
                className={`pointer-events-none absolute inset-y-0 left-0 w-1.5 rounded-r-full transition-opacity ${
                  isSelected ? 'bg-[#0b57d0] opacity-100' : 'bg-transparent opacity-0 group-hover:opacity-60 group-hover:bg-[#bfd2f6]'
                }`}
              />
              <div className="flex h-full items-start gap-3.5 sm:gap-4">
                <span className="mt-1 shrink-0 text-3xl leading-none sm:text-4xl">{details.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className={`text-[1.9rem] leading-[1.05] font-extrabold tracking-[-0.02em] sm:text-[2.2rem] lg:text-[2.3rem] ${isSelected ? 'text-[#0b57d0]' : 'text-slate-900'}`}>
                    {displayLabel}
                  </div>
                  <div className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-[1.02rem]">
                    {details.desc}
                  </div>
                </div>
                <div className="mt-1 shrink-0 self-start">
                  <span
                    className={`inline-flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold transition sm:h-8 sm:w-8 ${
                      isSelected
                        ? 'border-[#0b57d0] bg-[#0b57d0] text-white'
                        : 'border-slate-300 bg-white text-slate-400'
                    }`}
                  >
                    {isSelected ? '✓' : ''}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
