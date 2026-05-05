export interface MapPoint {
  id: string;
  name?: string;
  x?: number;
  y?: number;
  latitude?: number;
  longitude?: number;
  description?: string;
  properties?: Record<string, unknown>;
}

export interface MapRoad {
  id: string;
  name?: string;
  description?: string;
  coordinates: Array<{ latitude: number; longitude: number; x?: number; y?: number }>;
  properties?: Record<string, unknown>;
}

export interface ParsedMapData {
  roads: MapRoad[];
  campusLocations: MapPoint[];
  junctionPoints: MapPoint[];
  boundary: MapRoad | null;
}
