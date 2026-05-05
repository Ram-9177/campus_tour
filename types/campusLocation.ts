import type { AppUserType } from './appRules';

export interface CampusLocationI18nText {
  en: string;
  te: string;
  hi: string;
}

export interface CampusLocationI18nMedia {
  en: string;
  te: string;
  hi: string;
}

export type CampusLocationCategory =
  | 'gate'
  | 'admin'
  | 'academic'
  | 'library'
  | 'hostel'
  | 'food'
  | 'sports'
  | 'rehab'
  | 'parking'
  | 'facility'
  | 'viewpoint'
  | 'transport'
  | 'garden'
  | 'other';

export interface CampusLocation {
  id: string;
  slug: string;
  name: CampusLocationI18nText;
  category: CampusLocationCategory | string;
  latitude: number;
  longitude: number;
  mapPointId?: string;
  x?: number;
  y?: number;
  radiusMeters: number;
  description: CampusLocationI18nText;
  script: CampusLocationI18nText;
  audio: CampusLocationI18nMedia;
  images: string[];
  videos: string[];
  virtual360Url?: string;
  routeOrder: number;
  recommendedFor: AppUserType[];
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}
