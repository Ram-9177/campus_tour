import { promises as fs } from 'fs';
import path from 'path';
import { parseGeoJsonMapData } from './mapDataParser';
import type { ParsedMapData } from '@/types/mapData';

// Simple regex-based KML parser since we don't have xml2js or DOMParser on server
function extractPlacemarks(kmlText: string): any[] {
  const placemarks: any[] = [];
  const placemarkRegex = /<Placemark>([\s\S]*?)<\/Placemark>/g;
  let match;

  while ((match = placemarkRegex.exec(kmlText)) !== null) {
    const inner = match[1];
    const nameMatch = /<name>(.*?)<\/name>/.exec(inner);
    const descMatch = /<description>([\s\S]*?)<\/description>/.exec(inner);
    
    const name = nameMatch ? nameMatch[1].trim() : '';
    const description = descMatch ? descMatch[1].trim() : '';

    const pointMatch = /<Point>[\s\S]*?<coordinates>([\s\S]*?)<\/coordinates>[\s\S]*?<\/Point>/.exec(inner);
    const lineMatch = /<LineString>[\s\S]*?<coordinates>([\s\S]*?)<\/coordinates>[\s\S]*?<\/LineString>/.exec(inner);

    if (pointMatch) {
      const coords = pointMatch[1].trim().split(',');
      placemarks.push({
        type: 'Feature',
        properties: { name, description },
        geometry: {
          type: 'Point',
          coordinates: [parseFloat(coords[0]), parseFloat(coords[1])]
        }
      });
    } else if (lineMatch) {
      const coordsLines = lineMatch[1].trim().split(/[\s\n]+/);
      const coordinates = coordsLines.filter(Boolean).map(line => {
        const parts = line.split(',');
        return [parseFloat(parts[0]), parseFloat(parts[1])];
      });
      placemarks.push({
        type: 'Feature',
        properties: { name, description },
        geometry: {
          type: 'LineString',
          coordinates
        }
      });
    }
  }

  return placemarks;
}

export async function loadKmzData(): Promise<ParsedMapData> {
  const pointsPath = path.join(process.cwd(), 'data', 'imported_kmz', 'points', 'doc.kml');
  const roadsPath = path.join(process.cwd(), 'data', 'imported_kmz', 'roads', 'doc.kml');

  let features: any[] = [];

  try {
    const pointsKml = await fs.readFile(pointsPath, 'utf8');
    features = features.concat(extractPlacemarks(pointsKml));
  } catch (err) {
    console.error('Error loading points KML:', err);
  }

  try {
    const roadsKml = await fs.readFile(roadsPath, 'utf8');
    features = features.concat(extractPlacemarks(roadsKml));
  } catch (err) {
    console.error('Error loading roads KML:', err);
  }

  const geoJson = {
    type: 'FeatureCollection',
    features
  };

  return parseGeoJsonMapData(geoJson);
}
