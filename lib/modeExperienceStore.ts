import { campusLocations as seedLocations } from '@/data/campusLocations';
import { cartRoute } from '@/data/cartRoute';
import type { AppTourMode } from '@/types/appRules';
import type { ModeExperienceConfig, ModeExperienceState } from '@/types/modeExperience';
import { LocationStore } from './locationStore';

const STORAGE_KEY = 'smru_mode_experience_config';

const MODE_LABELS: Record<AppTourMode, string> = {
  manual_explore: 'Manual Explore',
  walk_with_me: 'Walk With Me',
  campus_cart: 'Campus Cart',
  virtual_tour: 'Virtual Tour',
};

const MODE_DURATIONS: Record<AppTourMode, number> = {
  manual_explore: 45,
  walk_with_me: 60,
  campus_cart: 35,
  virtual_tour: 30,
};

function nowIso() {
  return new Date().toISOString();
}

function isClient() {
  return typeof window !== 'undefined';
}

function uniq(ids: string[]) {
  return Array.from(new Set(ids.filter(Boolean)));
}

function getAllLocationIds(): string[] {
  const locations = isClient()
    ? LocationStore.getAllLocations().filter((loc) => loc.active)
    : seedLocations.filter((loc) => loc.active);
  return locations.map((loc) => loc.id);
}

function getDefaultModeLocationIds(mode: AppTourMode, allLocationIds: string[]): string[] {
  if (mode !== 'campus_cart') return allLocationIds;
  const cartIds = uniq(cartRoute.map((stop) => stop.locationId));
  const set = new Set(allLocationIds);
  const filtered = cartIds.filter((id) => set.has(id));
  return filtered.length > 0 ? filtered : allLocationIds;
}

function getDefaultState(allLocationIds?: string[]): ModeExperienceState {
  const resolvedIds = allLocationIds || getAllLocationIds();
  const modes = (['manual_explore', 'walk_with_me', 'campus_cart', 'virtual_tour'] as AppTourMode[]).reduce(
    (acc, mode) => {
      acc[mode] = {
        mode,
        label: MODE_LABELS[mode],
        enabled: true,
        durationMinutes: MODE_DURATIONS[mode],
        locationIds: getDefaultModeLocationIds(mode, resolvedIds),
      };
      return acc;
    },
    {} as Record<AppTourMode, ModeExperienceConfig>
  );

  return { modes, updatedAt: nowIso() };
}

function normalizeState(input: Partial<ModeExperienceState> | null | undefined): ModeExperienceState {
  const allLocationIds = getAllLocationIds();
  const defaults = getDefaultState(allLocationIds);
  const validSet = new Set(allLocationIds);
  const modes = defaults.modes;

  (['manual_explore', 'walk_with_me', 'campus_cart', 'virtual_tour'] as AppTourMode[]).forEach((mode) => {
    const fromInput = input?.modes?.[mode];
    if (!fromInput) return;

    const filteredIds = uniq(Array.isArray(fromInput.locationIds) ? fromInput.locationIds : []).filter((id) =>
      validSet.has(id)
    );

    modes[mode] = {
      mode,
      label: typeof fromInput.label === 'string' && fromInput.label ? fromInput.label : MODE_LABELS[mode],
      enabled: typeof fromInput.enabled === 'boolean' ? fromInput.enabled : true,
      durationMinutes:
        typeof fromInput.durationMinutes === 'number' && Number.isFinite(fromInput.durationMinutes)
          ? Math.max(1, Math.round(fromInput.durationMinutes))
          : MODE_DURATIONS[mode],
      locationIds: filteredIds.length > 0 ? filteredIds : defaults.modes[mode].locationIds,
    };
  });

  return {
    modes,
    updatedAt: typeof input?.updatedAt === 'string' && input.updatedAt ? input.updatedAt : nowIso(),
  };
}

function readRaw(): Partial<ModeExperienceState> | null {
  if (!isClient()) return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Partial<ModeExperienceState>;
  } catch {
    return null;
  }
}

function persist(state: ModeExperienceState) {
  if (!isClient()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new Event('smru_mode_config_updated'));
}

export class ModeExperienceStore {
  static getState(): ModeExperienceState {
    const normalized = normalizeState(readRaw());
    if (isClient() && !localStorage.getItem(STORAGE_KEY)) {
      persist(normalized);
    }
    return normalized;
  }

  static getModeConfig(mode: AppTourMode): ModeExperienceConfig {
    return this.getState().modes[mode];
  }

  static updateModeConfig(mode: AppTourMode, patch: Partial<ModeExperienceConfig>): ModeExperienceState {
    const current = this.getState();
    const next: ModeExperienceState = {
      ...current,
      updatedAt: nowIso(),
      modes: {
        ...current.modes,
        [mode]: {
          ...current.modes[mode],
          ...patch,
          mode,
          locationIds: uniq((patch.locationIds || current.modes[mode].locationIds) as string[]),
        },
      },
    };
    const normalized = normalizeState(next);
    persist(normalized);
    return normalized;
  }

  static reset(): ModeExperienceState {
    const next = getDefaultState();
    persist(next);
    return next;
  }
}
