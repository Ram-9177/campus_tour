import type { CampusLocation } from '@/types/campusLocation';

export interface ValidationError {
  field: string;
  message: string;
}

export function validateLocation(location: Partial<CampusLocation>, allLocations: CampusLocation[]): ValidationError[] {
  const errors: ValidationError[] = [];

  // Basic
  if (!location.slug) {
    errors.push({ field: 'slug', message: 'Slug is required' });
  } else if (allLocations.some(l => l.slug === location.slug && l.id !== location.id)) {
    errors.push({ field: 'slug', message: 'Slug must be unique' });
  }

  if (!location.name?.en) {
    errors.push({ field: 'name.en', message: 'English name is required' });
  }

  if (!location.category) {
    errors.push({ field: 'category', message: 'Category is required' });
  }

  // Coordinates
  if (location.latitude === undefined || location.latitude < -90 || location.latitude > 90) {
    errors.push({ field: 'latitude', message: 'Invalid latitude' });
  }
  if (location.longitude === undefined || location.longitude < -180 || location.longitude > 180) {
    errors.push({ field: 'longitude', message: 'Invalid longitude' });
  }

  // Radius
  if (location.radiusMeters === undefined || location.radiusMeters < 5 || location.radiusMeters > 100) {
    errors.push({ field: 'radiusMeters', message: 'Radius must be between 5 and 100 meters' });
  }

  // Route Order
  if (location.routeOrder === undefined || typeof location.routeOrder !== 'number') {
    errors.push({ field: 'routeOrder', message: 'Route order must be a number' });
  }

  // Content Validation
  const validateContent = (content: any, prefix: string) => {
    if (content?.script?.en && content.script.en.length > 2500) {
      errors.push({ field: `${prefix}.script.en`, message: 'Script too long (max 2500 chars)' });
    }
    if (content?.script?.te && content.script.te.length > 2500) {
      errors.push({ field: `${prefix}.script.te`, message: 'Script too long (max 2500 chars)' });
    }
    if (content?.script?.hi && content.script.hi.length > 2500) {
      errors.push({ field: `${prefix}.script.hi`, message: 'Script too long (max 2500 chars)' });
    }
  };

  validateContent(location, 'default');
  if (location.contentVariants) {
    validateContent(location.contentVariants.physical, 'physical');
    validateContent(location.contentVariants.virtual, 'virtual');
    validateContent(location.contentVariants.buggy, 'buggy');
  }

  return errors;
}

export function validateLocationCollection(locations: any[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!Array.isArray(locations)) {
    return { valid: false, errors: ['Input must be an array of locations'] };
  }

  const slugs = new Set<string>();

  locations.forEach((loc, index) => {
    const locErrors = validateLocation(loc, []);
    if (locErrors.length > 0) {
      errors.push(`Location at index ${index} (${loc.slug || 'no slug'}): ${locErrors.map(e => e.message).join(', ')}`);
    }
    if (loc.slug) {
      if (slugs.has(loc.slug)) {
        errors.push(`Duplicate slug found: ${loc.slug}`);
      }
      slugs.add(loc.slug);
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}
