const fs = require('fs');
const path = require('path');

function extractPlacemarks(kmlText) {
  const placemarks = [];
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

function detectFeatureType(properties, geometryType) {
  const name = (properties.name || '').toLowerCase();
  const description = (properties.description || '').toLowerCase();
  const featureType = (properties.feature_type || '').toLowerCase();
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

function featureId(feature, index) {
  if (typeof feature.id === 'string') return feature.id;
  if (typeof feature.id === 'number') return `feature-${feature.id}`;
  const name = feature.properties?.name;
  if (name) return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return `feature-${index}`;
}

const pointsPath = path.join(process.cwd(), 'data', 'imported_kmz', 'points', 'doc.kml');
const roadsPath = path.join(process.cwd(), 'data', 'imported_kmz', 'roads', 'doc.kml');

let features = [];
try {
  const pointsKml = fs.readFileSync(pointsPath, 'utf8');
  features = features.concat(extractPlacemarks(pointsKml));
} catch (e) {
  console.error(e);
}
try {
  const roadsKml = fs.readFileSync(roadsPath, 'utf8');
  features = features.concat(extractPlacemarks(roadsKml));
} catch (e) {
  console.error(e);
}

const base = { roads: [], campusLocations: [], junctionPoints: [], boundary: null };

features.forEach((feature, index) => {
  const props = feature.properties || {};
  const declaredType = detectFeatureType(props, feature.geometry.type);

  if (feature.geometry.type === 'LineString' || feature.geometry.type === 'MultiLineString') {
    const coordinates = feature.geometry.coordinates.map(c => ({ longitude: c[0], latitude: c[1] }));
    const road = {
      id: featureId(feature, index),
      name: props.name || undefined,
      description: props.description || undefined,
      coordinates,
      properties: props,
    };
    if (declaredType === 'boundary') {
      base.boundary = road;
    } else {
      base.roads.push(road);
    }
  } else if (feature.geometry.type === 'Point') {
    const point = {
      id: featureId(feature, index),
      name: props.name || undefined,
      longitude: feature.geometry.coordinates[0],
      latitude: feature.geometry.coordinates[1],
      description: props.description || undefined,
      properties: props,
    };
    if (declaredType === 'junction_point') {
      base.junctionPoints.push(point);
    } else {
      base.campusLocations.push(point);
    }
  }
});

let minLat = Infinity, maxLat = -Infinity, minLon = Infinity, maxLon = -Infinity;
[...base.campusLocations, ...base.junctionPoints].forEach(p => {
  if (p.latitude < minLat) minLat = p.latitude;
  if (p.latitude > maxLat) maxLat = p.latitude;
  if (p.longitude < minLon) minLon = p.longitude;
  if (p.longitude > maxLon) maxLon = p.longitude;
});
base.roads.forEach(r => {
  r.coordinates.forEach(c => {
    if (c.latitude < minLat) minLat = c.latitude;
    if (c.latitude > maxLat) maxLat = c.latitude;
    if (c.longitude < minLon) minLon = c.longitude;
    if (c.longitude > maxLon) maxLon = c.longitude;
  });
});
if (base.boundary) {
  base.boundary.coordinates.forEach(c => {
    if (c.latitude < minLat) minLat = c.latitude;
    if (c.latitude > maxLat) maxLat = c.latitude;
    if (c.longitude < minLon) minLon = c.longitude;
    if (c.longitude > maxLon) maxLon = c.longitude;
  });
}

const bounds = { minLat, maxLat, minLon, maxLon };

// Calculate X and Y coordinates (1000x700 mapping)
const mapWidth = 1000;
const mapHeight = 700;

function latLonToXY(lat, lon) {
  const x = ((lon - minLon) / (maxLon - minLon)) * mapWidth;
  // Lat is inverted for Y because screen Y goes down
  const y = (1 - (lat - minLat) / (maxLat - minLat)) * mapHeight;
  return { x: Math.round(x), y: Math.round(y) };
}

base.campusLocations.forEach(p => {
  const xy = latLonToXY(p.latitude, p.longitude);
  p.x = xy.x; p.y = xy.y;
});
base.junctionPoints.forEach(p => {
  const xy = latLonToXY(p.latitude, p.longitude);
  p.x = xy.x; p.y = xy.y;
});

base.roads.forEach(r => {
  r.coordinates.forEach(c => {
    const xy = latLonToXY(c.latitude, c.longitude);
    c.x = xy.x; c.y = xy.y;
  });
});
if (base.boundary) {
  base.boundary.coordinates.forEach(c => {
    const xy = latLonToXY(c.latitude, c.longitude);
    c.x = xy.x; c.y = xy.y;
  });
}

const content = `import type { ParsedMapData } from '@/types/mapData';

export const smruMapConfig = {
  name: "SMRU Campus Map",
  coordinateSystem: { width: ${mapWidth}, height: ${mapHeight} },
  bounds: ${JSON.stringify(bounds, null, 2)},
  data: ${JSON.stringify(base, null, 2)} as ParsedMapData
};
`;

fs.mkdirSync(path.join(process.cwd(), 'data', 'map'), { recursive: true });
fs.writeFileSync(path.join(process.cwd(), 'data', 'map', 'smruMapConfig.ts'), content);
console.log("Created data/map/smruMapConfig.ts");
