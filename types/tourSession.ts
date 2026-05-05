import type { AppLanguage, AppTourMode, AppUserType } from './appRules';

export interface TourSession {
  visitorType: AppUserType;
  language: AppLanguage;
  navigationMode: AppTourMode;
  currentLocationId: string | null;
  visitedLocationIds: string[];
  audioStarted: boolean;
  lastUpdatedAt: string;
}
