import type { AppTourMode } from './appRules';

export interface ModeExperienceConfig {
  mode: AppTourMode;
  label: string;
  enabled: boolean;
  durationMinutes: number;
  locationIds: string[];
}

export interface ModeExperienceState {
  modes: Record<AppTourMode, ModeExperienceConfig>;
  updatedAt: string;
}
