/**
 * Media types
 */

/**
 * Supported media types
 */
export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  PDF = 'pdf',
}

/**
 * Base media asset
 */
export interface MediaAsset {
  id: string;
  type: MediaType;
  url: string;
  title: string;
  description?: string;
  mimeType: string;
  size: number; // in bytes
  duration?: number; // in seconds for audio/video
  metadata?: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Image asset
 */
export interface ImageAsset extends MediaAsset {
  type: MediaType.IMAGE;
  width?: number;
  height?: number;
  alt?: string;
  thumbnail?: string;
  webpUrl?: string; // WebP version for optimization
  tags?: string[];
}

/**
 * Audio asset
 */
export interface AudioAsset extends MediaAsset {
  type: MediaType.AUDIO;
  duration: number;
  language?: string;
  speaker?: string;
  transcript?: string;
}

/**
 * Video asset
 */
export interface VideoAsset extends MediaAsset {
  type: MediaType.VIDEO;
  duration: number;
  thumbnail?: string;
  resolution?: string; // e.g., "1080p", "720p"
  fps?: number;
  subtitles?: {
    language: string;
    url: string;
  }[];
}

/**
 * Document asset (PDF, Word, etc.)
 */
export interface DocumentAsset extends MediaAsset {
  type: MediaType.DOCUMENT | MediaType.PDF;
  fileName: string;
  pageCount?: number;
  downloadCount?: number;
}

/**
 * Campus brochure
 */
export interface Brochure {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  content?: string;
  fileUrl: string;
  fileSize: number; // in MB
  language: string; // Language code e.g., 'en', 'hi'
  category?: 'general' | 'admissions' | 'academics' | 'facilities' | 'hostel' | 'placement' | 'sports';
  featured?: boolean;
  featured_position?: number;
  downloadCount?: number;
  image?: string;
  thumbnail?: string;
  tags?: string[];
  lastUpdated?: Date;
  validUntil?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
