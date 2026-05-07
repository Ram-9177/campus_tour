import type { CampusLocation, AdmissionsCta } from '@/types/campusLocation';
import type { AppTourMode, AppLanguage } from '@/types/appRules';
import { TOUR_MODE_TO_VARIANT, type ContentVariantType } from './tourModeContent';

export interface LocationExperience {
  id: string;
  slug: string;
  title: string;
  description: string;
  script: string;
  audioUrl: string;
  images: string[];
  videos: string[];
  virtual360Url: string;
  uspTags: string[];
  parentTrustPoints: string[];
  studentHighlights: string[];
  admissionsCta?: AdmissionsCta;
  contentVariantUsed: ContentVariantType | 'default';
  missingScript: boolean;
  missingAudio: boolean;
  missingContentReason: string | null;
}

interface ResolveOptions {
  location: CampusLocation;
  mode: AppTourMode;
  language: AppLanguage;
}

export function resolveLocationExperience({
  location,
  mode,
  language,
}: ResolveOptions): LocationExperience {
  const variantType = TOUR_MODE_TO_VARIANT[mode];
  const variant = location.contentVariants?.[variantType];
  
  // 1. Resolve Title
  // Special case for title: Fallback to English if native missing, as titles are labels
  const title = location.name[language]?.trim() || location.name.en || '';

  // 2. Resolve Content Sources (Priority: Variant -> Default)
  let rawDescription = '';
  let rawScript = '';
  let rawAudioUrl = '';
  let contentVariantUsed: ContentVariantType | 'default' = 'default';

  if (variant) {
    rawDescription = variant.description[language]?.trim() || '';
    rawScript = variant.script[language]?.trim() || '';
    rawAudioUrl = variant.audio[language]?.trim() || '';
    contentVariantUsed = variantType;
  }

  // Fallback to default if variant fields are empty
  if (!rawDescription) rawDescription = location.description[language]?.trim() || '';
  if (!rawScript) rawScript = location.script[language]?.trim() || '';
  if (!rawAudioUrl) rawAudioUrl = location.audio[language]?.trim() || '';

  // 3. Strict Gap Detection: If selected language text is empty, do NOT fallback to English.
  // We return missingContentReason instead.
  
  const missingScript = !rawScript;
  const missingAudio = !rawAudioUrl;
  
  let missingContentReason: string | null = null;
  if (missingScript) {
    missingContentReason = language === 'en' 
      ? 'Institutional script is not yet available for this point.' 
      : 'Content coming soon in selected language.';
  }

  return {
    id: location.id,
    slug: location.slug,
    title,
    description: rawDescription || (missingContentReason || ''),
    script: rawScript || (missingContentReason || ''),
    audioUrl: rawAudioUrl,
    images: location.images || [],
    videos: location.videos || [],
    virtual360Url: location.virtual360Url || '',
    uspTags: location.uspTags || [],
    parentTrustPoints: location.parentTrustPoints || [],
    studentHighlights: location.studentHighlights || [],
    admissionsCta: location.admissionsCta,
    contentVariantUsed,
    missingScript,
    missingAudio,
    missingContentReason,
  };
}
