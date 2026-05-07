const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  rawRoads: 'public/maps/raw/SMRU_TOUR_MAIN1.json',
  rawPoints: 'public/maps/raw/SMRU_TOUR_MAIN2.json',
  overrides: 'data/map/locationContentOverrides.json',
  outputConfig: 'data/map/smruMapConfig.ts',
  outputLocations: 'data/campusLocations.ts',
  outputReport: 'data/map/missingContentReport.json',
  coordinateSystem: { width: 1000, height: 700 },
  bounds: {
    minLat: 17.3303493,
    maxLat: 17.3324094,
    minLon: 78.7230652,
    maxLon: 78.7284932
  }
};

function latLonToXY(lat, lon) {
  const { width, height } = CONFIG.coordinateSystem;
  const { minLat, maxLat, minLon, maxLon } = CONFIG.bounds;

  const x = ((lon - minLon) / (maxLon - minLon)) * width;
  const y = height - ((lat - minLat) / (maxLat - minLat)) * height;

  return { 
    x: Math.round(x), 
    y: Math.round(y) 
  };
}

function generateStableId(name) {
  if (!name) return null;
  return name.toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function getCategoryFromId(id) {
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

function getRadiusFromCategory(category) {
  switch (category) {
    case 'gate': return 35;
    case 'admin':
    case 'academic':
    case 'library':
    case 'hostel':
    case 'rehab': return 30;
    case 'food':
    case 'sports':
    case 'parking':
    case 'garden':
    case 'transport':
    case 'facility': return 20;
    default: return 15;
  }
}

function main() {
  console.log('Starting SMRU Map Data Normalization Pipeline (Premium Override System)...');

  const report = {
    timestamp: new Date().toISOString(),
    skippedFeatures: [],
    duplicateSlugs: [],
    missingContent: [],
    stats: {
      roadsProcessed: 0,
      roadsSkipped: 0,
      pointsProcessed: 0,
      pointsSkipped: 0
    }
  };

  // 1. Load Raw Data
  const rawRoads = JSON.parse(fs.readFileSync(CONFIG.rawRoads, 'utf8'));
  const rawPoints = JSON.parse(fs.readFileSync(CONFIG.rawPoints, 'utf8'));
  const overrides = JSON.parse(fs.readFileSync(CONFIG.overrides, 'utf8'));

  const cleanRoads = [];
  const cleanLocations = [];
  const junctionPoints = [];
  let boundary = null;

  const slugs = new Set();

  // 2. Process Roads (MAIN1)
  rawRoads.features.forEach((feature, index) => {
    const name = feature.properties?.name;
    const geometry = feature.geometry;

    if (!name || !geometry || (geometry.type !== 'LineString' && geometry.type !== 'MultiLineString')) {
      report.skippedFeatures.push({ type: 'road', index, reason: 'corrupted_road: missing name or invalid geometry' });
      report.stats.roadsSkipped++;
      return;
    }

    const coordinates = [];
    const rawCoords = geometry.type === 'LineString' ? geometry.coordinates : geometry.coordinates.flat();
    
    rawCoords.forEach(([lon, lat]) => {
      if (typeof lat === 'number' && typeof lon === 'number') {
        const { x, y } = latLonToXY(lat, lon);
        coordinates.push({ latitude: lat, longitude: lon, x, y });
      }
    });

    if (coordinates.length < 2) {
      report.skippedFeatures.push({ type: 'road', index, name, reason: 'corrupted_road: insufficient valid coordinates' });
      report.stats.roadsSkipped++;
      return;
    }

    const id = generateStableId(name);
    const road = {
      id,
      name,
      coordinates,
      properties: feature.properties
    };

    if (name.toLowerCase().includes('boundary')) {
      boundary = road;
    } else {
      cleanRoads.push(road);
    }
    report.stats.roadsProcessed++;
  });

  // 3. Process Points (MAIN2)
  rawPoints.features.forEach((feature, index) => {
    const name = feature.properties?.name;
    const geometry = feature.geometry;

    if (!name || !geometry || geometry.type !== 'Point') {
      report.skippedFeatures.push({ type: 'point', index, reason: 'corrupted_point: missing name or invalid geometry' });
      report.stats.pointsSkipped++;
      return;
    }

    const [lon, lat] = geometry.coordinates;
    if (typeof lat !== 'number' || typeof lon !== 'number') {
      report.skippedFeatures.push({ type: 'point', index, name, reason: 'corrupted_point: invalid coordinates' });
      report.stats.pointsSkipped++;
      return;
    }

    const id = generateStableId(name);
    if (slugs.has(id)) {
      report.duplicateSlugs.push({ id, name, index });
    }
    slugs.add(id);

    const { x, y } = latLonToXY(lat, lon);
    const point = {
      id,
      name,
      latitude: lat,
      longitude: lon,
      x,
      y,
      description: feature.properties?.description || '',
      properties: feature.properties
    };

    if (name.toLowerCase().includes('junction') || name.toLowerCase().includes('point')) {
      junctionPoints.push(point);
    } else {
      cleanLocations.push(point);
    }
    report.stats.pointsProcessed++;
  });

  // 4. Map to CampusLocation and Enrich
  const finalLocations = cleanLocations.map((point, index) => {
    const override = overrides[point.id] || {};
    const category = override.category || getCategoryFromId(point.id);
    const radiusMeters = override.radiusMeters || getRadiusFromCategory(category);
    
    const mergeI18n = (base, over) => ({
      en: (over?.en !== undefined ? over.en : (base?.en || '')),
      te: (over?.te !== undefined ? over.te : (base?.te || '')),
      hi: (over?.hi !== undefined ? over.hi : (base?.hi || ''))
    });

    const baseContent = {
      description: mergeI18n({ en: (typeof point.description === 'string' ? point.description : (point.description?.value || '')) }, override.description),
      script: mergeI18n({}, override.script),
      audio: mergeI18n({}, override.audio)
    };

    const location = {
      id: point.id,
      slug: point.id,
      name: mergeI18n({ en: point.name }, override.name),
      category,
      latitude: point.latitude,
      longitude: point.longitude,
      mapPointId: point.id,
      x: point.x,
      y: point.y,
      radiusMeters,
      ...baseContent,
      contentVariants: {
        physical: {
          description: mergeI18n(baseContent.description, override.contentVariants?.physical?.description),
          script: mergeI18n(baseContent.script, override.contentVariants?.physical?.script),
          audio: mergeI18n(baseContent.audio, override.contentVariants?.physical?.audio)
        },
        virtual: {
          description: mergeI18n(baseContent.description, override.contentVariants?.virtual?.description),
          script: mergeI18n(baseContent.script, override.contentVariants?.virtual?.script),
          audio: mergeI18n(baseContent.audio, override.contentVariants?.virtual?.audio)
        },
        buggy: {
          description: mergeI18n(baseContent.description, override.contentVariants?.buggy?.description),
          script: mergeI18n(baseContent.script, override.contentVariants?.buggy?.script),
          audio: mergeI18n(baseContent.audio, override.contentVariants?.buggy?.audio)
        }
      },
      uspTags: override.uspTags || [],
      parentTrustPoints: override.parentTrustPoints || [],
      studentHighlights: override.studentHighlights || [],
      admissionsCta: override.admissionsCta || {},
      images: override.images || [],
      videos: override.videos || [],
      virtual360Url: override.virtual360Url || "",
      routeOrder: override.routeOrder || (index + 1),
      recommendedFor: override.recommendedFor || ['student', 'parent', 'other'],
      active: override.active !== undefined ? override.active : true,
      nearestRoadNodeId: override.nearestRoadNodeId || undefined
    };

    // 5. Detailed Missing Content Report
    const missing = [];
    
    // Check Languages
    ['en', 'te', 'hi'].forEach(lang => {
      // Physical
      if (!location.contentVariants.physical.script[lang]) missing.push(`missing_physical_${lang}_script`);
      if (!location.contentVariants.physical.audio[lang]) missing.push(`missing_physical_${lang}_audio`);
      // Virtual
      if (!location.contentVariants.virtual.script[lang]) missing.push(`missing_virtual_${lang}_script`);
      if (!location.contentVariants.virtual.audio[lang]) missing.push(`missing_virtual_${lang}_audio`);
      // Buggy
      if (!location.contentVariants.buggy.script[lang]) missing.push(`missing_buggy_${lang}_script`);
      if (!location.contentVariants.buggy.audio[lang]) missing.push(`missing_buggy_${lang}_audio`);
    });

    if (location.images.length === 0) missing.push('missing_images');
    if (location.videos.length === 0) missing.push('missing_videos');
    if (!override.category) missing.push('missing_category_override');
    if (location.radiusMeters < 5 || location.radiusMeters > 100) missing.push('invalid_radius');
    
    if (missing.length > 0) {
      report.missingContent.push({ id: location.id, name: point.name, missing });
    }

    return location;
  });

  // 6. Write Output Files
  const configContent = `import type { ParsedMapData } from '@/types/mapData';

export const smruMapConfig = {
  name: "SMRU Campus Map",
  coordinateSystem: ${JSON.stringify(CONFIG.coordinateSystem, null, 2)},
  bounds: ${JSON.stringify(CONFIG.bounds, null, 2)},
  data: {
    roads: ${JSON.stringify(cleanRoads, null, 2)},
    campusLocations: ${JSON.stringify(cleanLocations, null, 2)},
    junctionPoints: ${JSON.stringify(junctionPoints, null, 2)},
    boundary: ${JSON.stringify(boundary, null, 2)}
  }
};
`;

  const locationsContent = `import type { CampusLocation } from '@/types/campusLocation';

export const campusLocations: CampusLocation[] = ${JSON.stringify(finalLocations, null, 2)};
`;

  fs.writeFileSync(CONFIG.outputConfig, configContent);
  fs.writeFileSync(CONFIG.outputLocations, locationsContent);
  fs.writeFileSync(CONFIG.outputReport, JSON.stringify(report, null, 2));

  console.log('Normalization complete (Premium Override System)!');
  console.log(`- Roads: ${report.stats.roadsProcessed} processed, ${report.stats.roadsSkipped} skipped`);
  console.log(`- Points: ${report.stats.pointsProcessed} processed, ${report.stats.pointsSkipped} skipped`);
  console.log(`- Detailed report generated: ${CONFIG.outputReport}`);
}

main();
