/**
 * Central type definitions export
 * Re-exports all types from specialized type modules
 */

// Tour types
export type {
  NavigationMode,
  VisitorType,
  TourInterest,
  TourRoute,
  TourStop,
  TourProgress,
} from './tour';

// Campus map types
export type {
  CampusCoordinate,
  CampusBlock,
  CampusRoad,
  WalkingPath,
  CartStop,
  CartRoute,
  ParkingPoint,
  DropPoint,
  CampusMap,
} from './campus';

// Media types
export type {
  MediaAsset,
  ImageAsset,
  AudioAsset,
  VideoAsset,
  DocumentAsset,
  Brochure,
} from './media';
export { MediaType } from './media';

// CTA types
export type {
  CTAContact,
  WhatsAppCTA,
  CallCTA,
  EmailCTA,
  CTACollection,
} from './cta';

// AI Guide types
export type {
  AIQuestion,
  AIAnswer,
  AIResponse,
  AIGuideState,
  AIFeedback,
} from './aiGuide';
export { AICategory } from './aiGuide';

// Settings types
export type {
  LanguageContent,
  AppConfig,
  CampusInfo,
  TourFeatures,
  NotificationSettings,
  PrivacySettings,
  AccessibilitySettings,
  IntegrationSettings,
  AppSettings,
} from './settings';
export { LanguageCode } from './settings';

// VMS types (future integration)
export type {
  VMSContext,
  VMSIntegration,
  VMSEventLog,
} from './vms';

export interface AppMetadata {
  name: string;
  description: string;
  version: string;
  url: string;
}

// Legacy type definitions maintained for backward compatibility
export interface TourStep {
  id: number;
  title: string;
  description: string;
  icon: string;
  duration: string;
}

export interface Building {
  id: string;
  name: string;
  description: string;
  icon: string;
  floors: number;
  facilities: string[];
}

export interface Facility {
  id: string;
  name: string;
  description: string;
  icon: string;
  hours: string;
  contact?: string;
}

export interface Location {
  lat: number;
  lng: number;
}

export interface Direction {
  from: string;
  to: string;
  distance: string;
  duration: string;
  steps: string[];
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'auto';
  language?: string;
  notifications?: boolean;
  lastVisited?: string;
}

export type {
  AppLanguage,
  AppUserType,
  AppTourMode,
  AppRules,
} from './appRules';

export type { TourSession } from './tourSession';

export type {
  CampusLocation,
  CampusLocationI18nText,
  CampusLocationI18nMedia,
} from './campusLocation';
