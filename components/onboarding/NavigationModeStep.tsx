import type { AppTourMode } from '@/types/appRules';
import { TOUR_MODES } from '@/lib/constants';

const MODE_DETAILS: Record<AppTourMode, { desc: string; icon: string }> = {
  campus_cart: { desc: 'Best for a guided campus ride in a campus buggy or vehicle.', icon: '🏎️' },
  walk_with_me: { desc: 'Use GPS guidance while walking or driving your own vehicle.', icon: '🚶' },
  manual_explore: { desc: 'Browse the campus map with directions and media at your own pace.', icon: '🗺️' },
  virtual_tour: { desc: 'Explore the campus remotely from anywhere without location access.', icon: '🌐' },
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
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
      <h2 className="mb-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Choose Your Tour</h2>
      <p className="mb-6 text-base font-medium text-slate-500">Pick your preferred campus exploration mode</p>
      
      {lockReason ? (
        <div className="mb-6 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
          {lockReason}
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        {renderedModes.map((item) => {
          const details = MODE_DETAILS[item.key];
          const isSelected = value === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onSelect(item.key)}
              aria-pressed={isSelected}
              className={`group relative flex min-h-36 flex-col justify-between overflow-hidden rounded-4xl border-2 p-6 text-left transition-all duration-200 active:scale-[0.99] ${
                isSelected
                  ? 'border-blue-600 bg-blue-50 shadow-[0_20px_40px_-20px_rgba(37,99,235,0.3)]'
                  : 'border-slate-100 bg-white hover:border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="text-4xl leading-none">{details.icon}</span>
                <span
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-full border-2 transition ${
                    isSelected
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-slate-200 bg-white text-transparent'
                  }`}
                >
                  ✓
                </span>
              </div>
              
              <div className="mt-4">
                <div className={`text-xl font-black leading-tight tracking-tight sm:text-2xl ${isSelected ? 'text-blue-900' : 'text-slate-900'}`}>
                  {item.label}
                </div>
                <div className="mt-1 text-sm font-medium leading-relaxed text-slate-500">
                  {details.desc}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
