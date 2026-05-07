import type { AppTourMode } from '@/types/appRules';

export type ContentVariantType = 'physical' | 'virtual' | 'buggy';

export const TOUR_MODE_TO_VARIANT: Record<AppTourMode, ContentVariantType> = {
  walk_with_me: 'physical',
  manual_explore: 'physical',
  campus_cart: 'buggy',
  virtual_tour: 'virtual',
};
