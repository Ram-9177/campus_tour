/**
 * Application settings types
 */

/**
 * Language codes supported by the app
 */
export enum LanguageCode {
  ENGLISH = 'en',
  HINDI = 'hi',
  SPANISH = 'es',
  FRENCH = 'fr',
  CHINESE = 'zh',
  GERMAN = 'de',
  JAPANESE = 'ja',
  ARABIC = 'ar',
}

/**
 * Localized content for a specific language
 */
export interface LanguageContent {
  language: LanguageCode;
  name: string; // Language name e.g., "English"
  nativeScript?: string; // Native name e.g., "हिंदी"
  direction?: 'ltr' | 'rtl'; // Text direction
  content: {
    appName?: string;
    appDescription?: string;
    strings?: Record<string, string>;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Application configuration
 */
export interface AppConfig {
  name: string;
  version: string;
  description: string;
  domain: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

/**
 * Campus information
 */
export interface CampusInfo {
  name: string;
  shortName?: string;
  address: string;
  city: string;
  state?: string;
  zipCode?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
}

/**
 * Tour feature settings
 */
export interface TourFeatures {
  aiGuide: boolean;
  audioTours: boolean;
  interactiveMaps: boolean;
  brochures: boolean;
  cartLocations: boolean;
  parkingInfo: boolean;
  transportInfo: boolean;
  eventCalendar?: boolean;
  virtualTour?: boolean;
}

/**
 * Notification settings
 */
export interface NotificationSettings {
  enabled: boolean;
  pushNotifications?: boolean;
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  notificationFrequency?: 'immediate' | 'daily' | 'weekly' | 'never';
}

/**
 * Privacy and data settings
 */
export interface PrivacySettings {
  analyticsEnabled: boolean;
  crashReportingEnabled: boolean;
  personalDataCollection: boolean; // Should be false
  locationTracking: boolean; // Should be false
  cookiesEnabled: boolean;
  dataPolicyUrl?: string;
  privacyPolicyUrl?: string;
}

/**
 * Display and accessibility settings
 */
export interface AccessibilitySettings {
  darkModeEnabled?: boolean;
  largeTextEnabled?: boolean;
  highContrastEnabled?: boolean;
  screenReaderSupport?: boolean;
  captionsEnabled?: boolean;
}

/**
 * API and integration settings
 */
export interface IntegrationSettings {
  vmsEnabled: boolean;
  cmsEnabled: boolean;
  analyticsProvider?: string;
  mapProvider?: string;
  externalLinks?: Record<string, string>;
}

/**
 * Complete application settings
 */
export interface AppSettings {
  id?: string;
  app: AppConfig;
  campus: CampusInfo;
  tour: {
    defaultDuration: number; // in minutes
    languages: LanguageCode[];
    features: TourFeatures;
  };
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  accessibility: AccessibilitySettings;
  integrations: IntegrationSettings;
  branding: {
    primaryColor: string;
    secondaryColor: string;
    accentColor?: string;
    logoUrl?: string;
    faviconUrl?: string;
  };
  supportedLanguages: LanguageContent[];
  createdAt?: Date;
  updatedAt?: Date;
}
