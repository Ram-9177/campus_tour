import type { CampusAccessDecision } from '@/lib/tourAccessDecision';
import type { AppLanguage, AppTourMode, AppUserType } from './appRules';

export interface TourSession {
  visitorType: AppUserType;
  language: AppLanguage;
  navigationMode: AppTourMode;
  campusAccessDecision: CampusAccessDecision | null;
  currentLocationId: string | null;
  visitedLocationIds: string[];
  audioStarted: boolean;
  lastUpdatedAt: string;
}
