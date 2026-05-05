import type { MapPoint, MapRoad, ParsedMapData } from '@/types/mapData';

type Geometry =
  | { type: 'Point'; coordinates: [number, number] }
  | { type: 'LineString'; coordinates: [number, number][] }
  | { type: 'MultiLineString'; coordinates: [number, number][][] }
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
  return typeof input === 'string' ? input : '';
}

function detectFeatureType(properties: Record<string, unknown>, geometryType: string): 'road' | 'campusLocation' | 'junction_point' | 'boundary' | 'unknown' {
  const name = asText(properties.name).toLowerCase();
  const description = asText(properties.description).toLowerCase();
  const featureType = asText(properties.feature_type).toLowerCase();
  const merged = `${name} ${featureType} ${description}`;

  if (merged.includes('boundary')) return 'boundary';
  if (merged.includes('junction_point') || merged.includes('junction')) return 'junction_point';
  
  if (geometryType === 'LineString' || geometryType === 'MultiLineString') {
    return 'road';
  }
  if (geometryType === 'Point') {
    return 'campusLocation';
  }
  
  return 'unknown';
}

function featureId(feature: GeoJsonFeature, index: number): string {
  if (typeof feature.id === 'string') return feature.id;
  if (typeof feature.id === 'number') return `feature-${feature.id}`;
  const name = asText(feature.properties?.name);
  if (name) return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return `feature-${index}`;
}

function toPoint(feature: GeoJsonFeature, index: number): MapPoint | null {
  if (!feature.geometry || feature.geometry.type !== 'Point') return null;
  const pointGeometry = feature.geometry as { type: 'Point'; coordinates: [number, number] };
  const [longitude, latitude] = pointGeometry.coordinates;
  return {
    id: featureId(feature, index),
    name: asText(feature.properties?.name) || undefined,
    latitude,
    longitude,
    description: asText(feature.properties?.description) || undefined,
    properties: feature.properties,
  };
}

function lineCoords(geometry: Geometry): Array<{ latitude: number; longitude: number }> {
  if (geometry.type === 'LineString') {
    const line = geometry as { type: 'LineString'; coordinates: [number, number][] };
    return line.coordinates.map(([longitude, latitude]) => ({ latitude, longitude }));
  }
  if (geometry.type === 'MultiLineString') {
    const multiLine = geometry as { type: 'MultiLineString'; coordinates: [number, number][][] };
    return multiLine.coordinates.flat().map(([longitude, latitude]) => ({ latitude, longitude }));
  }
  return [];
}

function toRoad(feature: GeoJsonFeature, index: number): MapRoad | null {
  if (!feature.geometry) return null;
  if (feature.geometry.type !== 'LineString' && feature.geometry.type !== 'MultiLineString') return null;
  const coordinates = lineCoords(feature.geometry);
  if (!coordinates.length) return null;
  return {
    id: featureId(feature, index),
    name: asText(feature.properties?.name) || undefined,
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
    const props = feature.properties ?? {};
    const declaredType = detectFeatureType(props, feature.geometry.type);

    if (feature.geometry.type === 'LineString' || feature.geometry.type === 'MultiLineString') {
      const road = toRoad(feature, index);
      if (road) {
        if (declaredType === 'boundary') {
          base.boundary = road;
        } else {
          base.roads.push(road);
        }
      }
      return;
    }

    if (feature.geometry.type === 'Point') {
      const point = toPoint(feature, index);
      if (!point) return;
      if (declaredType === 'junction_point') {
        base.junctionPoints.push(point);
      } else {
        base.campusLocations.push(point);
      }
    }
  });

  return base;
}

export async function loadAndParseGeoJsonMapData(url: string): Promise<ParsedMapData> {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) return { roads: [], campusLocations: [], junctionPoints: [], boundary: null };
  const raw = (await response.json()) as unknown;
  return parseGeoJsonMapData(raw);
}
