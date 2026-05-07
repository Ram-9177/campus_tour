import type { CampusLocation } from '@/types/campusLocation';
import { getTourSession } from '@/lib/tourSession';
import type { AppLanguage, AppTourMode } from '@/types/appRules';
import { resolveLocationExperience } from './locationExperienceResolver';
import { trackAudioPlay, trackAudioPause } from './publicTourEvents';

type State = {
  currentLocation?: CampusLocation | null;
  language: AppLanguage;
  isPlaying: boolean;
  isPaused: boolean;
  isLoading: boolean;
  isAvailable: boolean;
  error: string | null;
  currentTime: number;
  duration: number;
  progress: number; // 0 to 1
  playbackRate: number;
  autoAdvance: boolean;
  navigationMode: AppTourMode;
};

type Listener = (state: State) => void;

const AUDIO_BLOCKED_MESSAGE = 'Audio playback is blocked. Tap Play again.';
const AUDIO_LOAD_ERROR_MESSAGE = 'Audio could not load. Tap Play again.';
const AUDIO_COMING_SOON_MESSAGE = 'Audio coming soon.';

class AudioGuideEngine {
  private state: State = {
    language: 'en',
    isPlaying: false,
    isPaused: false,
    isLoading: false,
    isAvailable: true,
    error: null,
    currentTime: 0,
    duration: 0,
    progress: 0,
    playbackRate: 1.0,
    autoAdvance: false,
    navigationMode: 'manual_explore',
  };

  private listeners: Listener[] = [];
  private hasUserGesture = false;
  private audio: HTMLAudioElement | null = null;
  private currentAudioUrl: string | null = null;
  private progressInterval: number | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audio = new Audio();
      this.audio.preload = 'auto';
      this.audio.addEventListener('play', this.handlePlay);
      this.audio.addEventListener('playing', this.handlePlay);
      this.audio.addEventListener('ended', this.handleEnded);
      this.audio.addEventListener('error', this.handleError);
      this.audio.addEventListener('loadedmetadata', this.handleMetadata);
      this.audio.addEventListener('timeupdate', this.handleTimeUpdate);
      window.addEventListener('smru_tour_session_updated', () => this.syncLanguageFromSession());
    }

    this.syncLanguageFromSession();
  }

  subscribe(fn: Listener) {
    this.listeners.push(fn);
    fn(this.state);
    return () => {
      this.listeners = this.listeners.filter((listener) => listener !== fn);
    };
  }

  private emit() {
    // Ensure state emission is always asynchronous to avoid React "update during render" errors
    Promise.resolve().then(() => {
      this.listeners.forEach((l) => l({ ...this.state }));
    });
  }

  private handleMetadata = () => {
    if (this.audio) {
      this.state.duration = this.audio.duration;
      this.emit();
    }
  };

  private handleTimeUpdate = () => {
    if (this.audio) {
      this.state.currentTime = this.audio.currentTime;
      this.state.duration = this.audio.duration || 0;
      this.state.progress = this.state.duration > 0 ? this.state.currentTime / this.state.duration : 0;
      this.emit();
    }
  };

  private handlePlay = () => {
    this.state.isLoading = false;
    this.state.isPlaying = true;
    this.state.isPaused = false;
    this.state.error = null;
    this.startProgressTracking();
    if (this.state.currentLocation) {
      trackAudioPlay(this.state.currentLocation.id);
    }
    this.emit();
  };

  private handleEnded = () => {
    this.state.isLoading = false;
    this.state.isPlaying = false;
    this.state.isPaused = false;
    this.state.error = null;
    this.state.progress = 1;
    this.stopProgressTracking();
    this.emit();

    if (this.state.autoAdvance) {
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('smru_audio_ended_autoadvance'));
      }, 1000);
    }
  };

  private handleError = () => {
    this.state.isLoading = false;
    this.state.isPlaying = false;
    this.state.isPaused = false;
    this.stopProgressTracking();
    
    // Check if error was just a network interruption or real failure
    if (this.audio?.src) {
        this.state.error = AUDIO_LOAD_ERROR_MESSAGE;
    }
    this.emit();
  };

  private startProgressTracking() {
    this.stopProgressTracking();
    this.progressInterval = window.setInterval(() => this.handleTimeUpdate(), 250);
  }

  private stopProgressTracking() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  private isAutoplayBlocked(error: unknown): boolean {
    if (error && typeof error === 'object') {
      const name = (error as { name?: string }).name;
      const message = (error as { message?: string }).message;
      return name === 'NotAllowedError' || message?.toLowerCase().includes('not allowed') === true;
    }
    return false;
  }

  private clearAudioSource() {
    if (!this.audio) return;
    this.audio.pause();
    this.audio.removeAttribute('src');
    this.audio.load();
    this.state.currentTime = 0;
    this.state.progress = 0;
  }

  private applyLocation(location?: CampusLocation | null) {
    this.state.currentLocation = location || null;
    this.state.error = null;
    this.state.currentTime = 0;
    this.state.progress = 0;

    if (!location) {
      this.currentAudioUrl = null;
      this.state.isAvailable = false;
      this.clearAudioSource();
      this.emit();
      return;
    }

    const exp = resolveLocationExperience({
      location,
      mode: this.state.navigationMode,
      language: this.state.language
    });
    
    const url = exp.audioUrl;
    this.currentAudioUrl = url || null;

    if (!url) {
      this.state.isAvailable = false;
      this.state.error = AUDIO_COMING_SOON_MESSAGE;
      this.clearAudioSource();
      this.emit();
      return;
    }

    this.state.isAvailable = true;
    if (this.audio) {
      this.audio.pause();
      this.audio.src = url;
      this.audio.playbackRate = this.state.playbackRate;
      this.audio.load();
    }
    this.emit();
  }

  private syncLanguageFromSession() {
    const session = getTourSession();
    const prevLang = this.state.language;
    const prevMode = this.state.navigationMode;
    
    this.state.language = session.language;
    this.state.navigationMode = session.navigationMode;
    
    // If language or mode changed, we must reload audio for the new context
    if (prevLang !== session.language || prevMode !== session.navigationMode) {
      if (this.state.currentLocation) {
        const wasPlaying = this.state.isPlaying;
        this.applyLocation(this.state.currentLocation);
        if (wasPlaying && this.state.isAvailable) {
          void this.play();
        }
      }
    }
  }

  getState() {
    return { ...this.state };
  }

  registerUserGesture() {
    this.hasUserGesture = true;
  }

  loadLocation(location?: CampusLocation | null) {
    this.stop();
    this.applyLocation(location || null);
  }

  setLanguage(lang: AppLanguage) {
    if (lang === this.state.language) return;
    
    const currentLocation = this.state.currentLocation || null;
    const wasPlaying = this.state.isPlaying;

    this.stop();
    this.state.language = lang;

    if (currentLocation) {
      this.applyLocation(currentLocation);
      if (wasPlaying && this.state.isAvailable) {
        void this.play();
      }
    }
  }

  async play(): Promise<boolean> {
    const location = this.state.currentLocation || null;
    const url = this.currentAudioUrl;

    if (!location || !url) {
      if (location && !url) {
        this.state.isAvailable = false;
        this.state.error = AUDIO_COMING_SOON_MESSAGE;
        this.emit();
      }
      return false;
    }

    if (!this.audio) {
      return false;
    }

    if (!this.hasUserGesture) {
      this.state.error = AUDIO_BLOCKED_MESSAGE;
      this.emit();
      return false;
    }

    this.state.isLoading = true;
    this.state.error = null;
    this.emit();

    try {
      this.audio.playbackRate = this.state.playbackRate;
      const playPromise = this.audio.play();
      if (playPromise) {
        await playPromise;
      }

      this.state.isLoading = false;
      this.state.isPlaying = true;
      this.state.isPaused = false;
      this.state.error = null;
      this.emit();
      return true;
    } catch (error) {
      this.state.isLoading = false;
      this.state.isPlaying = false;
      this.state.isPaused = false;
      this.state.error = this.isAutoplayBlocked(error) ? AUDIO_BLOCKED_MESSAGE : AUDIO_LOAD_ERROR_MESSAGE;
      this.emit();
      return false;
    }
  }

  pause() {
    if (this.audio && !this.audio.paused) {
      this.audio.pause();
    }
    if (this.state.currentLocation) {
      trackAudioPause(this.state.currentLocation.id);
    }
    this.state.isLoading = false;
    this.state.isPlaying = false;
    this.state.isPaused = true;
    this.stopProgressTracking();
    this.emit();
  }

  resume() {
    void this.play();
  }

  seek(time: number) {
    if (this.audio) {
      this.audio.currentTime = Math.max(0, Math.min(this.audio.duration || 0, time));
      this.handleTimeUpdate();
    }
  }

  setPlaybackRate(rate: number) {
    this.state.playbackRate = rate;
    if (this.audio) {
      this.audio.playbackRate = rate;
    }
    this.emit();
  }

  setAutoAdvance(enabled: boolean) {
    this.state.autoAdvance = enabled;
    this.emit();
  }

  replay() {
    if (!this.state.currentLocation) return false;
    const location = this.state.currentLocation;
    this.stop();
    this.applyLocation(location);
    void this.play();
    return true;
  }

  stop() {
    if (this.audio) {
      this.audio.pause();
      try {
        this.audio.currentTime = 0;
      } catch {
        // Ignored
      }
    }
    this.state.isLoading = false;
    this.state.isPlaying = false;
    this.state.isPaused = false;
    this.state.error = null;
    this.state.currentTime = 0;
    this.state.progress = 0;
    this.stopProgressTracking();
    this.emit();
  }
}

const audioEngine = new AudioGuideEngine();
export default audioEngine;
