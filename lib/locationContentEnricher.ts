import type { CampusLocation, LocationContent, AdmissionsCta } from '@/types/campusLocation';

export interface ContentOverride {
  id: string;
  name?: { en?: string; te?: string; hi?: string };
  category?: string;
  radiusMeters?: number;
  active?: boolean;
  
  // Default content
  description?: { en?: string; te?: string; hi?: string };
  script?: { en?: string; te?: string; hi?: string };
  audio?: { en?: string; te?: string; hi?: string };
  
  // Variants
  contentVariants?: {
    physical?: Partial<LocationContent>;
    virtual?: Partial<LocationContent>;
    buggy?: Partial<LocationContent>;
  };

  // Admissions metadata
  uspTags?: string[];
  parentTrustPoints?: string[];
  studentHighlights?: string[];
  admissionsCta?: AdmissionsCta;
  
  images?: string[];
  videos?: string[];
  virtual360Url?: string;
  routeOrder?: number;
  nearestRoadNodeId?: string;
  recommendedFor?: string[];
}

function mergeI18n(base: any, override: any) {
  return {
    en: override?.en !== undefined ? override.en : (base?.en || ''),
    te: override?.te !== undefined ? override.te : (base?.te || ''),
    hi: override?.hi !== undefined ? override.hi : (base?.hi || ''),
  };
}

function mergeContent(base: LocationContent, override?: Partial<LocationContent>): LocationContent {
  return {
    description: mergeI18n(base?.description, override?.description),
    script: mergeI18n(base?.script, override?.script),
    audio: mergeI18n(base?.audio, override?.audio),
  };
}

export function enrichLocationContent(
  location: CampusLocation,
  overrides: Record<string, ContentOverride>
): CampusLocation {
  // Use slug as the match key for overrides as requested
  const override = overrides[location.slug] || overrides[location.id];
  if (!override) return location;

  const baseContent: LocationContent = {
    description: location.description,
    script: location.script,
    audio: location.audio,
  };

  return {
    ...location,
    name: mergeI18n(location.name, override.name),
    category: override.category || location.category,
    radiusMeters: override.radiusMeters || location.radiusMeters,
    active: override.active !== undefined ? override.active : location.active,
    
    // Default content
    description: mergeI18n(location.description, override.description),
    script: mergeI18n(location.script, override.script),
    audio: mergeI18n(location.audio, override.audio),
    
    // Variants
    contentVariants: {
      physical: mergeContent(
        location.contentVariants?.physical || baseContent,
        override.contentVariants?.physical
      ),
      virtual: mergeContent(
        location.contentVariants?.virtual || baseContent,
        override.contentVariants?.virtual
      ),
      buggy: mergeContent(
        location.contentVariants?.buggy || baseContent,
        override.contentVariants?.buggy
      ),
    },

    // Admissions metadata
    uspTags: override.uspTags || location.uspTags,
    parentTrustPoints: override.parentTrustPoints || location.parentTrustPoints,
    studentHighlights: override.studentHighlights || location.studentHighlights,
    admissionsCta: {
      ...location.admissionsCta,
      ...override.admissionsCta,
    },
    
    images: override.images || location.images,
    videos: override.videos || location.videos,
    virtual360Url: override.virtual360Url || location.virtual360Url,
    routeOrder: override.routeOrder !== undefined ? override.routeOrder : location.routeOrder,
    nearestRoadNodeId: override.nearestRoadNodeId || location.nearestRoadNodeId,
    recommendedFor: (override.recommendedFor as any) || location.recommendedFor,
  };
}
