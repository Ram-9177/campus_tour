/**
 * AI Guide types
 * Smart campus assistant for answering questions
 */

/**
 * AI question categories
 */
export enum AICategory {
  NAVIGATION = 'navigation',
  FACILITIES = 'facilities',
  ACADEMICS = 'academics',
  ADMISSIONS = 'admissions',
  GENERAL = 'general',
  EVENTS = 'events',
  TRANSPORT = 'transport',
  DINING = 'dining',
  SPORTS = 'sports',
  TECHNOLOGY = 'technology',
}

/**
 * FAQ question entry
 */
export interface AIQuestion {
  id: string;
  question: string;
  category: AICategory;
  tags?: string[];
  keywords?: string[]; // For search matching
  relatedStops?: string[]; // Related tour stop IDs
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * AI Answer with metadata
 */
export interface AIAnswer {
  id: string;
  questionId: string;
  answer: string;
  category: AICategory;
  confidence: number; // 0-1 confidence score
  sources?: string[]; // URLs or references
  relatedLinks?: {
    text: string;
    url: string;
  }[];
  suggestedFollowUps?: string[]; // Related question IDs
  language?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * AI Response with context
 */
export interface AIResponse {
  id: string;
  question: string;
  answer: string;
  category: AICategory;
  confidence: number;
  suggestedFollowUps?: AIQuestion[];
  relatedStops?: string[];
  timestamp: Date;
  language?: string;
}

/**
 * AI Guide conversation state
 */
export interface AIGuideState {
  sessionId: string;
  conversationHistory: {
    question: string;
    answer: string;
    timestamp: Date;
    category: AICategory;
  }[];
  currentContext?: {
    currentStop?: string;
    currentRoute?: string;
  };
  language: string; // Language code e.g., 'en', 'hi'
  preferredCategories?: AICategory[];
  startTime: Date;
  lastUpdated: Date;
}

/**
 * AI training feedback
 */
export interface AIFeedback {
  id: string;
  questionId: string;
  answerAccuracy: number; // 1-5 rating
  isHelpful: boolean;
  userComment?: string;
  sessionId?: string;
  timestamp: Date;
}
