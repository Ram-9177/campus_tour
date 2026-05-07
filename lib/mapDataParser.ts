import type { MapPoint, MapRoad, ParsedMapData } from '@/types/mapData';

type Geometry =
  | { type: 'Point'; coordinates: [number, number] | [number, number, number] }
  | { type: 'LineString'; coordinates: [number, number][] | [number, number, number][] }
  | { type: 'MultiLineString'; coordinates: [number, number][][] | [number, number, number][][] }
  | { type: string; coordinates?: unknown };

interface GeoJsonFeature {
  type: 'Feature';
  id?: string | number;
  properties?: Record<string, unknown>;
  geometry: Geometry | null;
}

interface GeoJsonFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJsonFeature[];
}

function asText(input: unknown): string {
  if (typeof input === 'string') return input;
  if (input && typeof input === 'object' && 'value' in input) return String((input as any).value);
  return '';
}

function generateStableId(name: string): string {
  return name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function toPoint(feature: GeoJsonFeature, index: number): MapPoint | null {
  if (!feature.geometry || feature.geometry.type !== 'Point') return null;
  const name = asText(feature.properties?.name);
  if (!name) return null;

  const coords = feature.geometry.coordinates;
  if (!Array.isArray(coords) || coords.length < 2) return null;

  const [longitude, latitude] = coords;
  if (typeof latitude !== 'number' || typeof longitude !== 'number') return null;

  const id = generateStableId(name);

  return {
    id,
    name,
    latitude,
    longitude,
    description: asText(feature.properties?.description) || undefined,
    properties: feature.properties,
  };
}

function toRoad(feature: GeoJsonFeature, index: number): MapRoad | null {
  if (!feature.geometry) return null;
  if (feature.geometry.type !== 'LineString' && feature.geometry.type !== 'MultiLineString') return null;
  
  const name = asText(feature.properties?.name);
  if (!name) return null;

  const coordinates: Array<{ latitude: number; longitude: number }> = [];

  if (feature.geometry.type === 'LineString') {
    const coords = feature.geometry.coordinates as [number, number][] | [number, number, number][];
    coords.forEach(([lng, lat]) => {
      if (typeof lat === 'number' && typeof lng === 'number') {
        coordinates.push({ latitude: lat, longitude: lng });
      }
    });
  } else if (feature.geometry.type === 'MultiLineString') {
    const multiCoords = feature.geometry.coordinates as [number, number][][] | [number, number, number][][];
    multiCoords.flat().forEach(([lng, lat]) => {
      if (typeof lat === 'number' && typeof lng === 'number') {
        coordinates.push({ latitude: lat, longitude: lng });
      }
    });
  }

  if (coordinates.length < 2) return null;

  return {
    id: generateStableId(name),
    name,
    description: asText(feature.properties?.description) || undefined,
    coordinates,
    properties: feature.properties,
  };
}

export function parseGeoJsonMapData(raw: unknown): ParsedMapData {
  const base: ParsedMapData = { roads: [], campusLocations: [], junctionPoints: [], boundary: null };
  if (!raw || typeof raw !== 'object') return base;

  const featureCollection = raw as GeoJsonFeatureCollection;
  if (featureCollection.type !== 'FeatureCollection' || !Array.isArray(featureCollection.features)) return base;

  featureCollection.features.forEach((feature, index) => {
    if (!feature || feature.type !== 'Feature' || !feature.geometry) return;
    
    if (feature.geometry.type === 'Point') {
      const point = toPoint(feature, index);
      if (point) {
        const name = point.name?.toLowerCase() || '';
        if (name.includes('junction') || name.includes('point')) {
          base.junctionPoints.push(point);
        } else {
          base.campusLocations.push(point);
        }
      }
    } else if (feature.geometry.type === 'LineString' || feature.geometry.type === 'MultiLineString') {
      const road = toRoad(feature, index);
      if (road) {
        if (road.name?.toLowerCase().includes('boundary')) {
          base.boundary = road;
        } else {
          base.roads.push(road);
        }
      }
    }
  });

  return base;
}
