import type { AppTourMode } from '@/types/appRules';

export function queryModeToTourMode(mode: string | null): AppTourMode {
  if (mode === 'walk') return 'walk_with_me';
  if (mode === 'cart') return 'campus_cart';
  if (mode === 'virtual') return 'virtual_tour';
  return 'manual_explore';
}

export function tourModeToQueryMode(mode: AppTourMode): string {
  if (mode === 'walk_with_me') return 'walk';
  if (mode === 'campus_cart') return 'cart';
  if (mode === 'virtual_tour') return 'virtual';
  return 'manual';
}

export function getModeLabel(mode: AppTourMode): string {
  if (mode === 'walk_with_me') return 'Walk With Me';
  if (mode === 'campus_cart') return 'Campus Cart';
  if (mode === 'virtual_tour') return 'Virtual Tour';
  return 'Manual Explore';
}
