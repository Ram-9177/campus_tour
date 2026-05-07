import type { CampusLocation, CampusLocationCategory } from '@/types/campusLocation';
import type { MapPoint } from '@/types/mapData';

function getCategoryFromId(id: string): CampusLocationCategory {
  const lower = id.toLowerCase();
  
  if (lower.includes('gate') || lower.includes('entrance')) return 'gate';
  if (lower.includes('admin') || lower.includes('admission') || lower.includes('office')) return 'admin';
  if (lower.includes('library')) return 'library';
  if (lower.includes('hostel')) return 'hostel';
  if (lower.includes('canteen') || lower.includes('food')) return 'food';
  if (lower.includes('sport') || lower.includes('ground')) return 'sports';
  if (lower.includes('hospital') || lower.includes('rehab') || lower.includes('therapy')) return 'rehab';
  if (lower.includes('parking')) return 'parking';
  if (lower.includes('garden')) return 'garden';
  if (lower.includes('bus') || lower.includes('cart') || lower.includes('transport')) return 'transport';
  if (lower.includes('block') || lower.includes('class') || lower.includes('lab') || lower.includes('school')) return 'academic';
  
  return 'other';
}

function getRadiusFromCategory(category: CampusLocationCategory): number {
  switch (category) {
    case 'gate': 
      return 35;
    case 'admin':
    case 'academic':
    case 'library':
    case 'hostel':
    case 'rehab': 
      return 30;
    case 'food':
    case 'sports':
    case 'parking':
    case 'garden':
    case 'transport':
    case 'facility': 
      return 20;
    case 'other':
    default: 
      return 15;
  }
}

export function mapRawPointToCampusLocation(point: MapPoint, index: number): CampusLocation {
  const nameStr = point.name || point.id;
  const category = getCategoryFromId(point.id);
  const radiusMeters = getRadiusFromCategory(category);
  const descStr = point.description || '';

  return {
    id: point.id,
    slug: point.id,
    name: {
      en: nameStr,
      te: nameStr,
      hi: nameStr
    },
    category,
    latitude: point.latitude || 0,
    longitude: point.longitude || 0,
    mapPointId: point.id,
    x: point.x,
    y: point.y,
    radiusMeters,
    
    // Default fallback content
    description: {
      en: descStr,
      te: '',
      hi: ''
    },
    script: {
      en: '',
      te: '',
      hi: ''
    },
    audio: {
      en: '',
      te: '',
      hi: ''
    },
    
    // Admissions metadata defaults
    uspTags: [],
    parentTrustPoints: [],
    studentHighlights: [],
    
    images: [],
    videos: [],
    routeOrder: index + 1,
    recommendedFor: ['student', 'parent', 'consultant', 'other'],
    active: true
  };
}

export function mapCampusLocations(points: MapPoint[]): CampusLocation[] {
  return points.map((point, index) => mapRawPointToCampusLocation(point, index));
}
