/**
 * Tour and route types
 */

/**
 * Navigation mode for tour guidance
 */
export enum NavigationMode {
  GUIDED = 'guided', // Step-by-step with narration
  SELF_PACED = 'self_paced', // Visitor controls pace
  AUDIO_ONLY = 'audio_only', // Audio without visual guide
  INTERACTIVE = 'interactive', // With quizzes and activities
}

/**
 * Type of visitor using the tour
 */
export enum VisitorType {
  STUDENT = 'student',
  PARENT = 'parent',
  PROSPECTIVE_STUDENT = 'prospective_student',
  FACULTY = 'faculty',
  VISITOR = 'visitor',
  ALUMNI = 'alumni',
  SPONSOR = 'sponsor',
}

/**
 * Interest categories for tour personalization
 */
export enum TourInterest {
  ACADEMICS = 'academics',
  SPORTS = 'sports',
  CULTURAL = 'cultural',
  INFRASTRUCTURE = 'infrastructure',
  FACILITIES = 'facilities',
  RESIDENTIAL = 'residential',
  TECHNOLOGY = 'technology',
  RESEARCH = 'research',
}

/**
 * Complete tour route definition
 */
export interface TourRoute {
  id: string;
  slug: string;
  name: string;
  description: string;
  duration: number; // in minutes
  distance: number; // in km
  difficulty: 'Easy' | 'Medium' | 'Hard';
  stops: string[]; // Stop IDs in order
  navigationMode: NavigationMode | string;
  interests: TourInterest[];
  image?: string;
  thumbnail?: string;
  featured?: boolean;
  featured_position?: number;
  locked?: boolean; // True for official routes
  active?: boolean; // True if currently available
  tags?: string[];
  accessibility_notes?: string;
  best_time_to_visit?: string;
  season?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Individual tour stop/location
 */
export interface TourStop {
  id: string;
  slug: string;
  name: string;
  description: string;
  details?: string;
  short_description?: string;
  image?: string;
  images?: string[];
  audio?: string;
  video?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  order: number;
  duration?: number; // in minutes to spend here
  category?: string;
  highlights?: string[];
  fun_facts?: string[];
  accessibility_info?: string;
  operating_hours?: {
    open: string;
    close: string;
    days?: string[];
  };
  contact_info?: {
    phone?: string;
    email?: string;
  };
  amenities?: string[];
  nearby_stops?: string[]; // IDs of nearby stops
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Tour progress tracking (no personal data stored)
 */
export interface TourProgress {
  id: string;
  routeId: string;
  completedStops: string[];
  currentStop?: string;
  navigationMode: NavigationMode;
  interests?: TourInterest[];
  startedAt: Date;
  completedAt?: Date;
  totalDuration?: number; // in minutes
  totalDistance?: number; // in km
  sessionToken?: string; // For offline tracking
}
