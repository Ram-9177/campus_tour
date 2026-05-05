import { smruMapConfig } from '@/data/map/smruMapConfig';
import type { CampusLocation } from '@/types/campusLocation';

interface RoadNode {
  lat: number;
  lon: number;
  roadId: string;
  index: number;
  key: string;
}

interface GraphNode {
  key: string;
  lat: number;
  lon: number;
  neighbors: { key: string; distance: number }[];
}

export type RouteSegmentKind = 'start_connector' | 'road' | 'offroad';
export type OffroadConfidence = 'high' | 'medium' | 'low';

export interface RouteSegment {
  kind: RouteSegmentKind;
  points: [number, number][];
  distanceMeters: number;
  confidence?: OffroadConfidence;
}

export interface RoadRoutePlan {
  roadPath: [number, number][];
  isConnected: boolean;
  roadEnd: [number, number] | null;
  offRoadPath: [number, number][];
  offRoadDistanceMeters: number;
  startConnectorPath: [number, number][];
  startConnectorDistanceMeters: number;
  roadDistanceMeters: number;
  routeSegments: RouteSegment[];
  offroadConfidence: OffroadConfidence | null;
}

// Calculate distance between two points in meters
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Find the closest point on any road
function findClosestRoadPoint(location: CampusLocation): RoadNode | null {
  let closest: RoadNode | null = null;
  let minDistance = Infinity;

  const roads = smruMapConfig.data.roads || [];

  roads.forEach((road) => {
    road.coordinates.forEach((coord, index) => {
      const dist = haversineDistance(location.latitude, location.longitude, coord.latitude, coord.longitude);
      if (dist < minDistance) {
        minDistance = dist;
        closest = {
          lat: coord.latitude,
          lon: coord.longitude,
          roadId: road.id,
          index,
          key: `${road.id}-${index}`,
        };
      }
    });
  });

  return closest;
}

// Build a connectivity graph for all road nodes
function buildRoadGraph(): Map<string, GraphNode> {
  const graph = new Map<string, GraphNode>();
  const roads = smruMapConfig.data.roads || [];
  const INTERSECTION_THRESHOLD = 5; // Keep strict to avoid cross-cutting between nearby parallel roads

  // Create nodes for all road coordinates
  roads.forEach((road) => {
    road.coordinates.forEach((coord, index) => {
      const key = `${road.id}-${index}`;
      graph.set(key, {
        key,
        lat: coord.latitude,
        lon: coord.longitude,
        neighbors: [],
      });
    });
  });

  // Connect adjacent points on the same road
  roads.forEach((road) => {
    for (let i = 0; i < road.coordinates.length - 1; i++) {
      const currentKey = `${road.id}-${i}`;
      const nextKey = `${road.id}-${i + 1}`;
      const currentCoord = road.coordinates[i];
      const nextCoord = road.coordinates[i + 1];

      const dist = haversineDistance(
        currentCoord.latitude,
        currentCoord.longitude,
        nextCoord.latitude,
        nextCoord.longitude
      );

      const currentNode = graph.get(currentKey)!;
      const nextNode = graph.get(nextKey)!;

      currentNode.neighbors.push({ key: nextKey, distance: dist });
      nextNode.neighbors.push({ key: currentKey, distance: dist });
    }
  });

  // Detect and connect intersections between different roads
  const roadCoordinates = new Map<string, RoadNode[]>();
  roads.forEach((road) => {
    roadCoordinates.set(
      road.id,
      road.coordinates.map((coord, index) => ({
        lat: coord.latitude,
        lon: coord.longitude,
        roadId: road.id,
        index,
        key: `${road.id}-${index}`,
      }))
    );
  });

  // Find intersections
  Array.from(roadCoordinates.values()).forEach((coords1, idx1) => {
    Array.from(roadCoordinates.values()).slice(idx1 + 1).forEach((coords2) => {
      coords1.forEach((point1) => {
        coords2.forEach((point2) => {
          const dist = haversineDistance(point1.lat, point1.lon, point2.lat, point2.lon);
          if (dist <= INTERSECTION_THRESHOLD && point1.key !== point2.key) {
            const node1 = graph.get(point1.key)!;
            const node2 = graph.get(point2.key)!;

            // Don't add duplicate connections
            if (!node1.neighbors.find((n) => n.key === point2.key)) {
              node1.neighbors.push({ key: point2.key, distance: dist });
            }
            if (!node2.neighbors.find((n) => n.key === point1.key)) {
              node2.neighbors.push({ key: point1.key, distance: dist });
            }
          }
        });
      });
    });
  });

  return graph;
}

// Dijkstra's algorithm to find shortest path
function dijkstra(
  graph: Map<string, GraphNode>,
  startKey: string,
  endKey: string
): { path: string[]; distance: number } {
  const distances = new Map<string, number>();
  const previous = new Map<string, string | null>();
  const unvisited = new Set<string>();

  // Initialize
  for (const [key] of graph) {
    distances.set(key, Infinity);
    previous.set(key, null);
    unvisited.add(key);
  }

  distances.set(startKey, 0);

  while (unvisited.size > 0) {
    // Find unvisited node with minimum distance
    let current: string | null = null;
    let minDist = Infinity;

    for (const key of unvisited) {
      const dist = distances.get(key) || Infinity;
      if (dist < minDist) {
        minDist = dist;
        current = key;
      }
    }

    if (!current || current === endKey) break;

    unvisited.delete(current);
    const currentNode = graph.get(current)!;
    const currentDist = distances.get(current)!;

    for (const neighbor of currentNode.neighbors) {
      if (!unvisited.has(neighbor.key)) continue;

      const alt = currentDist + neighbor.distance;
      const neighborDist = distances.get(neighbor.key)!;

      if (alt < neighborDist) {
        distances.set(neighbor.key, alt);
        previous.set(neighbor.key, current);
      }
    }
  }

  const finalDistance = distances.get(endKey) || Infinity;
  if (!Number.isFinite(finalDistance)) {
    return { path: [], distance: Infinity };
  }

  // Reconstruct path
  const path: string[] = [];
  let current: string | null = endKey;

  while (current !== null) {
    path.unshift(current);
    current = previous.get(current) || null;
  }

  return { path, distance: finalDistance };
}

function pathKeysToCoordinates(graph: Map<string, GraphNode>, keys: string[]): [number, number][] {
  const coords: [number, number][] = [];
  for (const key of keys) {
    const node = graph.get(key);
    if (node) coords.push([node.lat, node.lon]);
  }
  return coords;
}

function getReachableNodeKeys(graph: Map<string, GraphNode>, startKey: string): Set<string> {
  const visited = new Set<string>();
  const queue: string[] = [startKey];
  visited.add(startKey);

  while (queue.length > 0) {
    const current = queue.shift()!;
    const node = graph.get(current);
    if (!node) continue;
    for (const neighbor of node.neighbors) {
      if (!visited.has(neighbor.key)) {
        visited.add(neighbor.key);
        queue.push(neighbor.key);
      }
    }
  }

  return visited;
}

function findClosestNodeToLocation(
  graph: Map<string, GraphNode>,
  nodeKeys: Set<string>,
  location: CampusLocation
): string | null {
  let closestKey: string | null = null;
  let minDistance = Infinity;

  for (const key of nodeKeys) {
    const node = graph.get(key);
    if (!node) continue;
    const dist = haversineDistance(node.lat, node.lon, location.latitude, location.longitude);
    if (dist < minDistance) {
      minDistance = dist;
      closestKey = key;
    }
  }

  return closestKey;
}

function pointsEqual(a: [number, number], b: [number, number]): boolean {
  return haversineDistance(a[0], a[1], b[0], b[1]) < 0.5;
}

function compactPoints(points: [number, number][]): [number, number][] {
  if (points.length === 0) return [];
  const compacted: [number, number][] = [points[0]];
  for (let i = 1; i < points.length; i++) {
    if (!pointsEqual(points[i], compacted[compacted.length - 1])) {
      compacted.push(points[i]);
    }
  }
  return compacted;
}

function polylineDistanceMeters(points: [number, number][]): number {
  if (points.length < 2) return 0;
  let total = 0;
  for (let i = 0; i < points.length - 1; i++) {
    total += haversineDistance(points[i][0], points[i][1], points[i + 1][0], points[i + 1][1]);
  }
  return total;
}

function interpolatePoint(
  start: [number, number],
  end: [number, number],
  fraction: number
): [number, number] {
  return [
    start[0] + (end[0] - start[0]) * fraction,
    start[1] + (end[1] - start[1]) * fraction,
  ];
}

function samplePolyline(points: [number, number][], spacingMeters: number): [number, number][] {
  if (points.length < 2) return [...points];
  const samples: [number, number][] = [points[0]];
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    const segmentDistance = haversineDistance(a[0], a[1], b[0], b[1]);
    if (segmentDistance <= 0) continue;
    const sampleCount = Math.floor(segmentDistance / spacingMeters);
    for (let s = 1; s <= sampleCount; s++) {
      const fraction = (s * spacingMeters) / segmentDistance;
      if (fraction >= 1) break;
      samples.push(interpolatePoint(a, b, fraction));
    }
    samples.push(b);
  }
  return compactPoints(samples);
}

function getAllRoadCoordinates(): [number, number][] {
  const roads = smruMapConfig.data.roads || [];
  const points: [number, number][] = [];
  roads.forEach((road) => {
    road.coordinates.forEach((coord) => {
      points.push([coord.latitude, coord.longitude]);
    });
  });
  return points;
}

function nearestRoadDistanceMeters(point: [number, number], roadPoints: [number, number][]): number {
  if (roadPoints.length === 0) return 0;
  let minDistance = Infinity;
  for (const roadPoint of roadPoints) {
    const distance = haversineDistance(point[0], point[1], roadPoint[0], roadPoint[1]);
    if (distance < minDistance) minDistance = distance;
  }
  return Number.isFinite(minDistance) ? minDistance : 0;
}

interface OffRoadCandidate {
  points: [number, number][];
  totalLengthMeters: number;
  avgDistanceToNearestRoadMeters: number;
  score: number;
}

function evaluateOffRoadCandidate(
  points: [number, number][],
  roadPoints: [number, number][]
): OffRoadCandidate {
  const compacted = compactPoints(points);
  const totalLengthMeters = polylineDistanceMeters(compacted);
  const sampled = samplePolyline(compacted, 8);
  let distanceSum = 0;
  for (const sample of sampled) {
    distanceSum += nearestRoadDistanceMeters(sample, roadPoints);
  }
  const avgDistanceToNearestRoadMeters = sampled.length > 0 ? distanceSum / sampled.length : 0;
  const score = totalLengthMeters + 1.8 * avgDistanceToNearestRoadMeters;

  return {
    points: compacted,
    totalLengthMeters,
    avgDistanceToNearestRoadMeters,
    score,
  };
}

function confidenceFromAverageRoadDistance(avgDistanceToNearestRoadMeters: number): OffroadConfidence {
  if (avgDistanceToNearestRoadMeters <= 12) return 'high';
  if (avgDistanceToNearestRoadMeters <= 25) return 'medium';
  return 'low';
}

function chooseBestOffRoadPath(
  start: [number, number],
  end: [number, number],
  roadPoints: [number, number][]
): { points: [number, number][]; distanceMeters: number; confidence: OffroadConfidence } {
  const direct = evaluateOffRoadCandidate([start, end], roadPoints);
  const doglegA = evaluateOffRoadCandidate([start, [start[0], end[1]], end], roadPoints);
  const doglegB = evaluateOffRoadCandidate([start, [end[0], start[1]], end], roadPoints);
  const candidates = [direct, doglegA, doglegB];

  let best = direct;
  for (const candidate of candidates) {
    if (candidate.score < best.score) {
      best = candidate;
    }
  }

  const improvement = direct.score > 0 ? (direct.score - best.score) / direct.score : 0;
  const selected = best !== direct && improvement >= 0.1 ? best : direct;

  return {
    points: selected.points,
    distanceMeters: selected.totalLengthMeters,
    confidence: confidenceFromAverageRoadDistance(selected.avgDistanceToNearestRoadMeters),
  };
}

function buildRouteSegments(
  startConnectorPath: [number, number][],
  startConnectorDistanceMeters: number,
  roadPath: [number, number][],
  roadDistanceMeters: number,
  offRoadPath: [number, number][],
  offRoadDistanceMeters: number,
  offroadConfidence: OffroadConfidence | null
): RouteSegment[] {
  const segments: RouteSegment[] = [];
  if (startConnectorPath.length >= 2 && startConnectorDistanceMeters > 0) {
    segments.push({
      kind: 'start_connector',
      points: startConnectorPath,
      distanceMeters: startConnectorDistanceMeters,
    });
  }
  if (roadPath.length >= 2 && roadDistanceMeters > 0) {
    segments.push({
      kind: 'road',
      points: roadPath,
      distanceMeters: roadDistanceMeters,
    });
  }
  if (offRoadPath.length >= 2 && offRoadDistanceMeters > 0) {
    segments.push({
      kind: 'offroad',
      points: offRoadPath,
      distanceMeters: offRoadDistanceMeters,
      confidence: offroadConfidence || undefined,
    });
  }
  return segments;
}

export function findRoadRoutePlan(startLocation: CampusLocation, endLocation: CampusLocation): RoadRoutePlan {
  const emptyPlan: RoadRoutePlan = {
    roadPath: [],
    isConnected: false,
    roadEnd: null,
    offRoadPath: [],
    offRoadDistanceMeters: 0,
    startConnectorPath: [],
    startConnectorDistanceMeters: 0,
    roadDistanceMeters: 0,
    routeSegments: [],
    offroadConfidence: null,
  };

  const startRoad = findClosestRoadPoint(startLocation);
  const endRoad = findClosestRoadPoint(endLocation);
  if (!startRoad || !endRoad) return emptyPlan;

  const graph = buildRoadGraph();
  const allRoadCoordinates = getAllRoadCoordinates();
  const direct = dijkstra(graph, startRoad.key, endRoad.key);

  if (
    Number.isFinite(direct.distance) &&
    direct.path.length >= 2 &&
    direct.path[0] === startRoad.key &&
    direct.path[direct.path.length - 1] === endRoad.key
  ) {
    const roadPath = pathKeysToCoordinates(graph, direct.path);
    const roadStart = roadPath.length > 0 ? roadPath[0] : null;
    const roadEnd = roadPath.length > 0 ? roadPath[roadPath.length - 1] : null;
    const startConnectorDistanceMeters = roadStart
      ? haversineDistance(startLocation.latitude, startLocation.longitude, roadStart[0], roadStart[1])
      : 0;
    const startConnectorPath: [number, number][] =
      startConnectorDistanceMeters > 1
        ? [[startLocation.latitude, startLocation.longitude], roadStart!]
        : [];
    const bestOffRoad = roadEnd
      ? chooseBestOffRoadPath(roadEnd, [endLocation.latitude, endLocation.longitude], allRoadCoordinates)
      : null;
    const offRoadDistanceMeters = bestOffRoad ? bestOffRoad.distanceMeters : 0;
    const offRoadPath: [number, number][] = offRoadDistanceMeters > 1 && bestOffRoad ? bestOffRoad.points : [];
    const offroadConfidence: OffroadConfidence | null = offRoadPath.length >= 2 && bestOffRoad ? bestOffRoad.confidence : null;
    return {
      roadPath,
      isConnected: true,
      roadEnd,
      offRoadPath,
      offRoadDistanceMeters,
      startConnectorPath,
      startConnectorDistanceMeters,
      roadDistanceMeters: direct.distance,
      routeSegments: buildRouteSegments(
        startConnectorPath,
        startConnectorDistanceMeters,
        roadPath,
        direct.distance,
        offRoadPath,
        offRoadDistanceMeters,
        offroadConfidence
      ),
      offroadConfidence,
    };
  }

  const reachableFromStart = getReachableNodeKeys(graph, startRoad.key);
  const roadEndKey = findClosestNodeToLocation(graph, reachableFromStart, endLocation);
  if (!roadEndKey) return emptyPlan;

  const partial = dijkstra(graph, startRoad.key, roadEndKey);
  if (!Number.isFinite(partial.distance) || partial.path.length < 1) return emptyPlan;

  const roadPath = pathKeysToCoordinates(graph, partial.path);
  const roadStart = roadPath.length > 0 ? roadPath[0] : null;
  const roadEndNode = graph.get(roadEndKey);
  if (!roadEndNode) return emptyPlan;

  const roadEnd: [number, number] = [roadEndNode.lat, roadEndNode.lon];
  const startConnectorDistanceMeters = roadStart
    ? haversineDistance(startLocation.latitude, startLocation.longitude, roadStart[0], roadStart[1])
    : 0;
  const startConnectorPath: [number, number][] =
    startConnectorDistanceMeters > 1
      ? [[startLocation.latitude, startLocation.longitude], roadStart!]
      : [];
  const bestOffRoad = chooseBestOffRoadPath(
    roadEnd,
    [endLocation.latitude, endLocation.longitude],
    allRoadCoordinates
  );
  const offRoadDistanceMeters = bestOffRoad.distanceMeters;
  const offRoadPath: [number, number][] = offRoadDistanceMeters > 1 ? bestOffRoad.points : [];
  const offroadConfidence: OffroadConfidence | null = offRoadPath.length >= 2 ? bestOffRoad.confidence : null;

  return {
    roadPath,
    isConnected: false,
    roadEnd,
    offRoadPath,
    offRoadDistanceMeters,
    startConnectorPath,
    startConnectorDistanceMeters,
    roadDistanceMeters: partial.distance,
    routeSegments: buildRouteSegments(
      startConnectorPath,
      startConnectorDistanceMeters,
      roadPath,
      partial.distance,
      offRoadPath,
      offRoadDistanceMeters,
      offroadConfidence
    ),
    offroadConfidence,
  };
}

// Simple Dijkstra's algorithm to find shortest path on roads
export function findRoadBasedPath(
  startLocation: CampusLocation,
  endLocation: CampusLocation
): [number, number][] {
  return findRoadRoutePlan(startLocation, endLocation).roadPath;
}
