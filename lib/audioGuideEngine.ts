import type { CampusLocation } from '@/types/campusLocation';
import { getTourSession } from '@/lib/tourSession';
import { getScriptForLocation } from '@/lib/scriptStore';
import type { AppUserType } from '@/types/appRules';

type State = {
  currentLocation?: CampusLocation | null;
  language: 'en' | 'te' | 'hi';
  isPlaying: boolean;
  isPaused: boolean;
  isLoading: boolean;
  isAvailable: boolean;
  error: string | null;
};

type Listener = (s: State) => void;

class AudioGuideEngine {
  private state: State = {
    language: 'en',
    isPlaying: false,
    isPaused: false,
    isLoading: false,
    isAvailable: true, // Always true for TTS
    error: null,
  };
  private listeners: Listener[] = [];
  private hasUserGesture = false;
  private lastCancelAt = 0;
  private activeSpeechKey: string | null = null;
  private pendingSpeechKey: string | null = null;
  private playbackGeneration = 0;

  constructor() {
    this.syncLanguageFromSession();
    if (typeof window !== 'undefined') {
      window.addEventListener('smru_tour_session_updated', () => this.syncLanguageFromSession());
    }
  }

  subscribe(fn: Listener) {
    this.listeners.push(fn);
    fn(this.state);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  private emit() {
    this.listeners.forEach((l) => l(this.state));
  }

  private cancelSpeech() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    this.lastCancelAt = Date.now();
    window.speechSynthesis.cancel();
  }

  private isRecentCancelIntent(): boolean {
    return Date.now() - this.lastCancelAt < 500;
  }

  private getSpeechErrorCode(event: Event): string {
    const maybeError = (event as { error?: unknown }).error;
    return typeof maybeError === 'string' ? maybeError.toLowerCase() : '';
  }

  private mapSpeechErrorToMessage(code: string): string {
    switch (code) {
      case 'audio-busy':
        return 'Audio output is currently busy. Please try again.';
      case 'audio-hardware':
        return 'No audio output device is available.';
      case 'language-unavailable':
      case 'voice-unavailable':
        return 'Selected language voice is unavailable on this device.';
      case 'network':
        return 'Voice playback failed due to a network issue.';
      case 'not-allowed':
        return 'Audio playback is blocked. Tap play again.';
      case 'synthesis-unavailable':
      case 'synthesis-failed':
        return 'Voice synthesis is unavailable right now.';
      default:
        return 'Voice playback failed';
    }
  }

  private getUtteranceLang(): string {
    if (this.state.language === 'te') return 'te-IN';
    if (this.state.language === 'hi') return 'hi-IN';
    return 'en-IN';
  }

  private isLowQualityVoice(voice: SpeechSynthesisVoice): boolean {
    const name = `${voice.name} ${voice.voiceURI}`.toLowerCase();
    const lowQualityHints = ['espeak', 'eloquence', 'festival', 'robot', 'old'];
    return lowQualityHints.some((hint) => name.includes(hint));
  }

  private getPreferredVoice(utteranceLang: string): SpeechSynthesisVoice | null {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) return null;

    const normalizedTarget = utteranceLang.toLowerCase();
    const base = normalizedTarget.split('-')[0];

    const scored = voices
      .map((voice) => {
        const lang = voice.lang.toLowerCase();
        const name = `${voice.name} ${voice.voiceURI}`.toLowerCase();
        let score = 0;
        let langTier = 0;

        if (lang === normalizedTarget) {
          score += 120;
          langTier = 3;
        } else if (lang.startsWith(`${base}-`)) {
          score += 90;
          langTier = 2;
        } else if (lang === base) {
          score += 70;
          langTier = 1;
        } else {
          score -= 40;
        }

        if (voice.default) score += 18;
        if (voice.localService) score += 2;

        const highQualityHints = ['neural', 'natural', 'wavenet', 'google', 'microsoft', 'siri', 'enhanced', 'premium'];

        if (highQualityHints.some((hint) => name.includes(hint))) score += 22;
        const lowQuality = this.isLowQualityVoice(voice);
        if (lowQuality) score -= 65;

        return { voice, score, langTier, lowQuality };
      });

    const pickBest = (items: typeof scored): SpeechSynthesisVoice | null => {
      if (items.length === 0) return null;
      return [...items].sort((a, b) => b.score - a.score)[0].voice;
    };

    return (
      pickBest(scored.filter((v) => v.langTier >= 2 && !v.lowQuality)) ||
      pickBest(scored.filter((v) => v.langTier >= 2)) ||
      pickBest(scored.filter((v) => v.langTier === 1 && !v.lowQuality)) ||
      pickBest(scored.filter((v) => !v.lowQuality)) ||
      pickBest(scored)
    );
  }

  private getVisitorType(): AppUserType {
    return getTourSession().visitorType;
  }

  private getAudienceLine(visitorType: AppUserType): string {
    if (this.state.language === 'te') {
      if (visitorType === 'parent') return 'ప్రవేశ కాలంలో తల్లిదండ్రులకు ఇది భద్రత, మద్దతు సేవలు మరియు రోజువారీ సౌకర్యాల స్పష్టమైన అవగాహన ఇస్తుంది.';
      if (visitorType === 'student') return 'ప్రవేశ కాలంలో అభ్యర్థులకు ఇది అకాడెమిక్స్, క్యాంపస్ లైఫ్ మరియు నేర్చుకునే వాతావరణంపై స్పష్టత ఇస్తుంది.';
      if (visitorType === 'consultant') return 'ప్రవేశ మార్గదర్శకుల కోసం ఇది కోర్సులు, సౌకర్యాలు మరియు క్యాంపస్ ప్రవాహంపై వేగమైన అవగాహన ఇస్తుంది.';
      return 'ప్రవేశ కాల సందర్శకులందరికీ ఇది క్యాంపస్ బలాలు మరియు సౌకర్యాల సమగ్ర అవగాహన ఇస్తుంది.';
    }

    if (this.state.language === 'hi') {
      if (visitorType === 'parent') return 'प्रवेश सत्र में अभिभावकों के लिए यह स्थान सुरक्षा, छात्र सहायता और दैनिक सुविधाओं की स्पष्ट जानकारी देता है।';
      if (visitorType === 'student') return 'प्रवेश सत्र में अभ्यर्थियों के लिए यह स्थान अकादमिक गुणवत्ता, कैंपस जीवन और सीखने के माहौल को स्पष्ट करता है।';
      if (visitorType === 'consultant') return 'प्रवेश सलाहकारों के लिए यह स्थान पाठ्यक्रम, सुविधाएँ और कैंपस फ्लो का संक्षिप्त सार देता है।';
      return 'प्रवेश सत्र के सभी आगंतुकों के लिए यह स्थान कैंपस की प्रमुख खूबियों का स्पष्ट परिचय देता है।';
    }

    if (visitorType === 'parent') {
      return 'For parents in this admission season, this stop highlights student safety, support services, and daily campus facilities.';
    }
    if (visitorType === 'student') {
      return 'For student aspirants this admission season, this stop explains academics, campus life, and learning quality.';
    }
    if (visitorType === 'consultant') {
      return 'For admission consultants, this stop gives a quick and clear view of campus offerings and infrastructure.';
    }
    return 'For admission-season visitors, this stop provides a clear view of campus strengths and facilities.';
  }

  private getUspIntro(location: CampusLocation): string {
    const name = location.name[this.state.language] || location.name.en;
    if (this.state.language === 'te') {
      return `మీరు ఇప్పుడు ${name} వద్ద ఉన్నారు.`;
    }
    if (this.state.language === 'hi') {
      return `आप अब ${name} पर हैं।`;
    }
    return `You are now at ${name}.`;
  }

  private sanitizeText(text: string): string {
    return text
      .replace(/\s+/g, ' ')
      .replace(/([.!?]){2,}/g, '$1')
      .replace(/[•●▪◦]/g, ',')
      .trim();
  }

  private splitNarrationIntoChunks(text: string, maxChars = 220): string[] {
    const normalized = this.sanitizeText(text);
    if (!normalized) return [];

    const sentenceParts = normalized.match(/[^.!?।]+[.!?।]?/g) ?? [normalized];
    const chunks: string[] = [];
    let current = '';

    const pushCurrent = () => {
      const value = current.trim();
      if (value.length > 0) chunks.push(value);
      current = '';
    };

    const appendByWords = (sentence: string) => {
      const words = sentence.split(/\s+/).filter(Boolean);
      for (const word of words) {
        const candidate = current ? `${current} ${word}` : word;
        if (candidate.length <= maxChars) {
          current = candidate;
          continue;
        }
        pushCurrent();
        current = word;
      }
    };

    for (const rawPart of sentenceParts) {
      const sentence = rawPart.trim();
      if (!sentence) continue;

      const candidate = current ? `${current} ${sentence}` : sentence;
      if (candidate.length <= maxChars) {
        current = candidate;
        continue;
      }

      pushCurrent();
      if (sentence.length <= maxChars) {
        current = sentence;
      } else {
        appendByWords(sentence);
      }
    }

    pushCurrent();
    return chunks;
  }

  private buildNarrationText(location: CampusLocation): string {
    const script = this.sanitizeText(getScriptForLocation(location, this.state.language));
    if (!script) return '';

    const intro = this.getUspIntro(location);
    if (script.length >= 180) {
      return `${intro} ${script}`.trim();
    }

    const visitorType = this.getVisitorType();
    const audienceLine = this.getAudienceLine(visitorType);
    return this.sanitizeText(`${intro} ${audienceLine} ${script}`);
  }

  private hasScriptForSelectedLanguage(location?: CampusLocation | null): boolean {
    if (!location) return false;
    return getScriptForLocation(location, this.state.language).trim().length > 0;
  }

  private speakTextChunks(
    chunks: string[],
    utteranceLang: string,
    preferredVoice: SpeechSynthesisVoice | null,
    speechKey: string,
    generation: number,
    index = 0,
    hasStarted = false
  ) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (generation !== this.playbackGeneration || index >= chunks.length) return;

    const utterance = new SpeechSynthesisUtterance(chunks[index]);
    utterance.lang = utteranceLang;
    if (preferredVoice) {
      utterance.voice = preferredVoice;
      utterance.lang = preferredVoice.lang || utteranceLang;
    }

    utterance.rate = this.state.language === 'en' ? 0.96 : 0.92;
    utterance.pitch = 1.0;
    utterance.volume = 1;

    utterance.onstart = () => {
      if (generation !== this.playbackGeneration) return;
      this.pendingSpeechKey = null;
      this.activeSpeechKey = speechKey;
      if (!hasStarted) {
        this.state.isLoading = false;
        this.state.isPlaying = true;
        this.state.isPaused = false;
        this.state.error = null;
        this.emit();
      }
    };

    utterance.onend = () => {
      if (generation !== this.playbackGeneration) return;
      if (index < chunks.length - 1) {
        this.speakTextChunks(chunks, utteranceLang, preferredVoice, speechKey, generation, index + 1, true);
        return;
      }
      this.pendingSpeechKey = null;
      this.activeSpeechKey = null;
      this.state.isLoading = false;
      this.state.isPlaying = false;
      this.state.isPaused = false;
      this.emit();
    };

    utterance.onerror = (event) => {
      if (generation !== this.playbackGeneration) return;

      const errorCode = this.getSpeechErrorCode(event);
      const isExpectedCancel =
        errorCode === 'canceled' ||
        errorCode === 'interrupted' ||
        (!errorCode && this.isRecentCancelIntent());

      this.pendingSpeechKey = null;
      this.activeSpeechKey = null;
      this.state.isLoading = false;
      this.state.isPlaying = false;
      this.state.isPaused = false;
      this.state.error = isExpectedCancel ? null : this.mapSpeechErrorToMessage(errorCode);
      this.emit();
    };

    window.speechSynthesis.speak(utterance);
  }

  private syncLanguageFromSession() {
    const sessionLanguage = getTourSession().language;
    if (sessionLanguage !== this.state.language) {
      this.state.language = sessionLanguage;
      this.state.isAvailable = this.hasScriptForSelectedLanguage(this.state.currentLocation);
    }
  }

  setLanguage(lang: State['language']) {
    // Keep language tied to selected tour session language.
    this.syncLanguageFromSession();
    const enforcedLang = this.state.language;
    if (lang !== enforcedLang) {
      this.emit();
      return;
    }
    this.state.language = lang;
    this.state.isAvailable = this.hasScriptForSelectedLanguage(this.state.currentLocation);
    // If playing, restart in new language
    if (this.state.isPlaying) {
      this.stop();
      this.play();
    } else {
      this.emit();
    }
  }

  registerUserGesture() {
    this.hasUserGesture = true;
  }

  loadLocation(location?: CampusLocation | null) {
    this.syncLanguageFromSession();
    this.stop();
    this.state.currentLocation = location || null;
    this.state.error = null;
    this.state.isAvailable = this.hasScriptForSelectedLanguage(location);
    this.emit();
  }

  play() {
    this.syncLanguageFromSession();
    const location = this.state.currentLocation;
    if (!location) return;

    if (!this.hasUserGesture) {
      this.state.isLoading = false;
      this.state.error = 'Tap play once to enable audio';
      this.emit();
      return;
    }

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.state.isLoading = false;
      this.state.error = 'Speech synthesis not supported in this browser';
      this.emit();
      return;
    }

    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      this.state.isLoading = false;
      this.state.isPaused = false;
      this.state.isPlaying = true;
      this.state.error = null;
      this.emit();
      return;
    }

    const text = this.buildNarrationText(location);

    if (!text) {
      this.state.isLoading = false;
      this.state.error = `No ${this.state.language.toUpperCase()} script available for this location`;
      this.emit();
      return;
    }

    const chunks = this.splitNarrationIntoChunks(text);
    if (chunks.length === 0) {
      this.state.isLoading = false;
      this.state.error = `No ${this.state.language.toUpperCase()} script available for this location`;
      this.emit();
      return;
    }

    const speechKey = `${location.id}|${this.state.language}|${chunks.length}|${chunks[0]}`;
    if (this.pendingSpeechKey === speechKey || this.activeSpeechKey === speechKey) {
      return;
    }
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused && this.activeSpeechKey === speechKey) {
      return;
    }

    const utteranceLang = this.getUtteranceLang();
    const preferredVoice = this.getPreferredVoice(utteranceLang);

    // Cancel any existing speech and play
    const generation = this.playbackGeneration + 1;
    this.playbackGeneration = generation;
    this.state.isLoading = true;
    this.state.error = null;
    this.emit();
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      this.cancelSpeech();
    }
    this.pendingSpeechKey = speechKey;
    this.speakTextChunks(chunks, utteranceLang, preferredVoice, speechKey, generation);
  }

  pause() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
    this.state.isLoading = false;
    this.state.isPlaying = false;
    this.state.isPaused = true;
    this.emit();
  }

  resume() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        this.state.isLoading = false;
        this.state.isPlaying = true;
        this.state.isPaused = false;
        this.emit();
      } else {
        this.play();
      }
    }
  }

  replay() {
    this.stop();
    this.play();
  }

  stop() {
    this.playbackGeneration += 1;
    this.cancelSpeech();
    this.pendingSpeechKey = null;
    this.activeSpeechKey = null;
    this.state.isLoading = false;
    this.state.isPlaying = false;
    this.state.isPaused = false;
    this.state.error = null;
    this.emit();
  }

  getState() {
    this.syncLanguageFromSession();
    return this.state;
  }
}

const engine = new AudioGuideEngine();
export default engine;
