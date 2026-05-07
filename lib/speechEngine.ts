'use client';

import type { AppLanguage } from '@/types/appRules';

class SpeechEngine {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSupported = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.isSupported = true;
    }
  }

  speak(text: string, language: AppLanguage, onEnd?: () => void, onProgress?: (progress: number) => void) {
    if (!this.synth || !this.isSupported) return;

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Map AppLanguage to BCP 47
    switch (language) {
      case 'te': utterance.lang = 'te-IN'; break;
      case 'hi': utterance.lang = 'hi-IN'; break;
      default: utterance.lang = 'en-IN'; break;
    }

    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onend = () => {
      this.currentUtterance = null;
      onEnd?.();
    };

    utterance.onerror = (event) => {
      console.error('SpeechSynthesis error:', event);
      this.currentUtterance = null;
      onEnd?.();
    };

    if (onProgress) {
      utterance.onboundary = (event) => {
        if (event.name === 'word') {
          const progress = event.charIndex / text.length;
          onProgress(progress);
        }
      };
    }

    this.currentUtterance = utterance;
    
    // Hack for some browsers to ensure audio plays
    this.synth.cancel();
    this.synth.resume();
    
    try {
      this.synth.speak(utterance);
    } catch (e) {
      console.error('Speech synthesis start failed', e);
      onEnd?.();
    }
  }

  pause() {
    this.synth?.pause();
  }

  resume() {
    this.synth?.resume();
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.currentUtterance = null;
  }

  getIsSupported() {
    return this.isSupported;
  }
}

export const speechEngine = new SpeechEngine();
