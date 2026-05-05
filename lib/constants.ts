import type { AppRules, AppTourMode, AppUserType } from '@/types/appRules';

export const APP = {
  name: 'SMRU Smart Campus Guide',
  version: '1.0.0',
  description: 'Public smart campus guide for SMRU with custom internal map.',
  domain: 'tour.smru.edu.in',
  url: 'https://tour.smru.edu.in',
  author: 'SMRU',
  shortName: 'SMRU Guide',
} as const;

export const LANGUAGES = {
  DEFAULT: 'en',
  SUPPORTED: [
    { code: 'te', name: 'Telugu', nativeScript: 'తెలుగు' },
    { code: 'en', name: 'English', nativeScript: 'English' },
    { code: 'hi', name: 'Hindi', nativeScript: 'हिन्दी' },
  ],
} as const;

export const USER_TYPES: ReadonlyArray<{ key: AppUserType; label: string }> = [
  { key: 'parent', label: 'Parent' },
  { key: 'student', label: 'Student' },
  { key: 'consultant', label: 'Consultant' },
  { key: 'other', label: 'Other' },
] as const;

export const TOUR_MODES: ReadonlyArray<{ key: AppTourMode; label: string }> = [
  { key: 'walk_with_me', label: 'Walk With Me' },
  { key: 'campus_cart', label: 'Campus Cart' },
  { key: 'manual_explore', label: 'Manual Explore' },
  { key: 'virtual_tour', label: 'Virtual Tour' },
] as const;

export const APP_RULES: AppRules = {
  publicPWAOnly: true,
  singleEntryPoint: true,
  loginRequired: false,
  leadFormEnabled: false,
  collectVisitorName: false,
  collectVisitorMobile: false,
  collectVisitorEmail: false,
  vmsIntegrationEnabled: false,
  stopWiseQREnabled: false,
  routeWiseQREnabled: false,
  gpsRequired: false,
  worksWithoutGPS: true,
  virtualTourRemoteEnabled: true,
  internalMapProvider: 'smru_custom',
  externalMapProvidersAllowed: false,
  satelliteBaseAssetMode: 'local_custom_only',
};

export const ROUTES_NAV = {
  HOME: '/',
  ROUTES: '/routes',
  TOUR: '/tour',
  STOP: '/stop',
  MAP: '/map',
  CART: '/cart',
  AI_GUIDE: '/ai-guide',
  BROCHURES: '/brochures',
  OFFLINE: '/offline',
  ADMIN: '/admin',
} as const;

export const ADMIN_ROUTES = {
  DASHBOARD: '/admin',
  ROUTES: '/admin/routes',
  STOPS: '/admin/stops',
  MAP: '/admin/map',
  MEDIA: '/admin/media',
  BROCHURES: '/admin/brochures',
  AI_GUIDE: '/admin/ai-guide',
  SETTINGS: '/admin/settings',
} as const;

export const DEFAULTS = {
  TOUR_DURATION: 60,
  TOUR_DISTANCE: 2.5,
  PAGE_SIZE: 10,
  CACHE_TTL: 3600,
  DEFAULT_LANGUAGE: LANGUAGES.DEFAULT,
  DEFAULT_USER_TYPE: 'other' as AppUserType,
  DEFAULT_TOUR_MODE: 'manual_explore' as AppTourMode,
} as const;

export const STORAGE_KEYS = {
  TOUR_PROGRESS: 'completedTourSteps',
  THEME: 'app-theme',
  LAST_VISITED: 'lastVisited',
  USER_PREFERENCES: 'userPreferences',
  TOUR_SESSION: 'tourSession',
  SCRIPT_OVERRIDES: 'locationScriptOverrides',
} as const;

export const ROUTES = {
  HOME: '/',
  TOUR: '/tour',
  BUILDINGS: '/buildings',
  FACILITIES: '/facilities',
  DIRECTIONS: '/directions',
  ABOUT: '/about',
  LOCATIONS: '/locations',
  MAP: '/map',
  CART: '/cart',
  AI_GUIDE: '/ai-guide',
  BROCHURES: '/brochures',
  OFFLINE: '/offline',
} as const;

export const BREAKPOINTS = {
  MOBILE: 640,
  TABLET: 1024,
  DESKTOP: 1280,
} as const;
