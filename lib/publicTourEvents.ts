import { analytics } from './analyticsEventStore';

export const trackTourStart = (mode: string, language: string) => {
  analytics.track('tour_started', { mode, language });
};

export const trackLanguageChange = (language: string) => {
  analytics.track('language_selected', { language });
};

export const trackModeChange = (mode: string) => {
  analytics.track('mode_selected', { mode });
};

export const trackLocationOpen = (locationId: string, slug: string) => {
  analytics.track('location_opened', { locationId, slug });
};

export const trackAudioPlay = (locationId: string) => {
  analytics.track('audio_played', { locationId });
};

export const trackAudioPause = (locationId: string) => {
  analytics.track('audio_paused', { locationId });
};

export const trackVideoOpen = (locationId: string, videoUrl: string) => {
  analytics.track('video_opened', { locationId, videoUrl });
};

export const trackBrochureClick = (locationId?: string) => {
  analytics.track('brochure_clicked', { locationId });
};

export const trackApplyClick = (locationId?: string) => {
  analytics.track('apply_clicked', { locationId });
};

export const trackWhatsAppClick = (locationId?: string) => {
  analytics.track('whatsapp_clicked', { locationId });
};

export const trackTourComplete = (visitedCount: number) => {
  analytics.track('tour_completed', { visitedCount });
};
