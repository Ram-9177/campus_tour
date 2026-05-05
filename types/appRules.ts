export type AppLanguage = 'te' | 'en' | 'hi';
export type AppUserType = 'parent' | 'student' | 'consultant' | 'other';
export type AppTourMode = 'walk_with_me' | 'campus_cart' | 'manual_explore' | 'virtual_tour';

export interface AppRules {
  publicPWAOnly: true;
  singleEntryPoint: true;
  loginRequired: false;
  leadFormEnabled: false;
  collectVisitorName: false;
  collectVisitorMobile: false;
  collectVisitorEmail: false;
  vmsIntegrationEnabled: false;
  stopWiseQREnabled: false;
  routeWiseQREnabled: false;
  gpsRequired: false;
  worksWithoutGPS: true;
  virtualTourRemoteEnabled: true;
  internalMapProvider: 'smru_custom';
  externalMapProvidersAllowed: false;
  satelliteBaseAssetMode: 'local_custom_only';
}
