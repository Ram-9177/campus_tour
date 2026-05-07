'use client';

type SMRUEventType = 
  | 'tour_started' 
  | 'language_selected' 
  | 'mode_selected' 
  | 'location_opened' 
  | 'audio_played' 
  | 'audio_paused' 
  | 'video_opened' 
  | 'brochure_clicked' 
  | 'apply_clicked' 
  | 'whatsapp_clicked' 
  | 'tour_completed';

interface SMRUEvent {
  type: SMRUEventType;
  timestamp: string;
  data?: any;
  sessionId: string;
}

const STORAGE_KEY = 'smru_anonymous_events';

class AnalyticsEventStore {
  private sessionId: string;

  constructor() {
    this.sessionId = typeof window !== 'undefined' 
      ? (localStorage.getItem('smru_analytics_sid') || this.createSession())
      : 'server';
  }

  private createSession(): string {
    const sid = `sid_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('smru_analytics_sid', sid);
    return sid;
  }

  track(type: SMRUEventType, data?: any) {
    if (typeof window === 'undefined') return;

    const event: SMRUEvent = {
      type,
      timestamp: new Date().toISOString(),
      data,
      sessionId: this.sessionId
    };

    // Console debug for local dev
    console.log(`[Analytics] ${type}`, event);

    // Save locally for now
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const events = stored ? JSON.parse(stored) : [];
      events.push(event);
      
      // Limit to last 100 events to prevent storage bloat
      const limited = events.slice(-100);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(limited));
    } catch (e) {
      // Fail silently, do not break the app
    }

    // Backend dispatch can be added here later
  }

  getEvents(): SMRUEvent[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  clear() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  }
}

export const analytics = new AnalyticsEventStore();
