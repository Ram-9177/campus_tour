'use client';

import { useEffect, useMemo, useState } from 'react';
import { LocationStore } from '@/lib/locationStore';
import { ModeExperienceStore } from '@/lib/modeExperienceStore';
import { getModeLabel } from '@/lib/modeUtils';
import type { CampusLocation } from '@/types/campusLocation';
import type { AppTourMode } from '@/types/appRules';
import type { ModeExperienceState } from '@/types/modeExperience';

const MODES: AppTourMode[] = ['manual_explore', 'walk_with_me', 'campus_cart', 'virtual_tour'];

export default function ModeExperienceSettings() {
  const [modeState, setModeState] = useState<ModeExperienceState | null>(null);
  const [locations, setLocations] = useState<CampusLocation[]>([]);

  const activeLocations = useMemo(
    () => locations.filter((loc) => loc.active).sort((a, b) => (a.routeOrder || 0) - (b.routeOrder || 0)),
    [locations]
  );

  useEffect(() => {
    const load = () => {
      setModeState(ModeExperienceStore.getState());
      setLocations(LocationStore.getAllLocations());
    };

    load();
    window.addEventListener('smru_mode_config_updated', load);
    window.addEventListener('smru_locations_updated', load);
    return () => {
      window.removeEventListener('smru_mode_config_updated', load);
      window.removeEventListener('smru_locations_updated', load);
    };
  }, []);

  if (!modeState) return null;

  const toggleModeEnabled = (mode: AppTourMode, enabled: boolean) => {
    ModeExperienceStore.updateModeConfig(mode, { enabled });
    setModeState(ModeExperienceStore.getState());
  };

  const updateDuration = (mode: AppTourMode, duration: number) => {
    ModeExperienceStore.updateModeConfig(mode, { durationMinutes: Math.max(1, duration) });
    setModeState(ModeExperienceStore.getState());
  };

  const toggleLocation = (mode: AppTourMode, locationId: string) => {
    const config = modeState.modes[mode];
    const hasId = config.locationIds.includes(locationId);
    const nextIds = hasId
      ? config.locationIds.filter((id) => id !== locationId)
      : [...config.locationIds, locationId];

    // Keep at least one point so the mode remains usable.
    if (nextIds.length === 0) return;

    ModeExperienceStore.updateModeConfig(mode, { locationIds: nextIds });
    setModeState(ModeExperienceStore.getState());
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900">🧭 Mode Scope Control</h2>
        <button
          type="button"
          onClick={() => {
            ModeExperienceStore.reset();
            setModeState(ModeExperienceStore.getState());
          }}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          Reset Defaults
        </button>
      </div>
      <p className="mb-5 text-sm text-slate-600">
        One shared map for all modes. Configure mode visibility, expected duration, and which campus points are active.
      </p>

      <div className="space-y-4">
        {MODES.map((mode) => {
          const config = modeState.modes[mode];
          const selectedSet = new Set(config.locationIds);
          return (
            <div key={mode} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div className="font-semibold text-slate-900">{getModeLabel(mode)}</div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <span>Enabled</span>
                    <input
                      type="checkbox"
                      checked={config.enabled}
                      onChange={(e) => toggleModeEnabled(mode, e.target.checked)}
                      className="h-4 w-4 rounded"
                    />
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <span>Duration</span>
                    <input
                      type="number"
                      min={1}
                      value={config.durationMinutes}
                      onChange={(e) => updateDuration(mode, parseInt(e.target.value || '1', 10))}
                      className="h-9 w-20 rounded-lg border border-slate-300 bg-white px-2 text-sm"
                    />
                    <span>min</span>
                  </label>
                </div>
              </div>

              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Active points for this mode ({config.locationIds.length})
              </div>
              <div className="max-h-52 overflow-y-auto rounded-lg border border-slate-200 bg-white p-2">
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  {activeLocations.map((location) => {
                    const selected = selectedSet.has(location.id);
                    return (
                      <button
                        key={location.id}
                        type="button"
                        onClick={() => toggleLocation(mode, location.id)}
                        className={`rounded-lg border px-3 py-2 text-left text-xs font-medium transition ${
                          selected
                            ? 'border-blue-600 bg-blue-50 text-blue-900'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {location.name.en}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
