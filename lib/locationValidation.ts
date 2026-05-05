import type { CampusLocation } from '@/types/campusLocation';

export interface ValidationError {
  field: string;
  message: string;
}

export function validateLocation(location: Partial<CampusLocation>): ValidationError[] {
  const errors: ValidationError[] = [];

  // Required basic fields
  if (!location.slug) errors.push({ field: 'slug', message: 'Slug is required' });
  if (!location.category) errors.push({ field: 'category', message: 'Category is required' });

  // I18n Name (English is mandatory, others are optional)
  if (!location.name?.en) errors.push({ field: 'name.en', message: 'English name is required' });

  // Latitude / Longitude
  if (location.latitude === undefined || location.latitude === null) {
    errors.push({ field: 'latitude', message: 'Latitude is required' });
  } else if (location.latitude < -90 || location.latitude > 90) {
    errors.push({ field: 'latitude', message: 'Latitude must be between -90 and 90' });
  }

  if (location.longitude === undefined || location.longitude === null) {
    errors.push({ field: 'longitude', message: 'Longitude is required' });
  } else if (location.longitude < -180 || location.longitude > 180) {
    errors.push({ field: 'longitude', message: 'Longitude must be between -180 and 180' });
  }

  // Radius
  if (location.radiusMeters === undefined || location.radiusMeters === null) {
    errors.push({ field: 'radiusMeters', message: 'Radius is required' });
  } else if (location.radiusMeters <= 0) {
    errors.push({ field: 'radiusMeters', message: 'Radius must be greater than 0' });
  }

  // Route Order
  if (location.routeOrder === undefined || location.routeOrder === null) {
    errors.push({ field: 'routeOrder', message: 'Route order is required' });
  }

  return errors;
}
