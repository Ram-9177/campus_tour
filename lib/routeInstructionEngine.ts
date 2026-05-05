import type { OffroadConfidence, RouteSegment } from './campusPathfinding';

export interface RouteInstructionStep {
  text: string;
  distanceMeters?: number;
}

interface BuildRouteInstructionsInput {
  routeSegments: RouteSegment[];
  destinationName: string;
  isConnectedRoadRoute: boolean;
  offroadConfidence: OffroadConfidence | null;
}

interface EdgeInfo {
  distanceMeters: number;
  bearingDegrees: number;
}

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function normalizeHeadingDelta(delta: number): number {
  let normalized = delta;
  while (normalized > 180) normalized -= 360;
  while (normalized < -180) normalized += 360;
  return normalized;
}

function calculateBearingDegrees(from: [number, number], to: [number, number]): number {
  const lat1 = (from[0] * Math.PI) / 180;
  const lon1 = (from[1] * Math.PI) / 180;
  const lat2 = (to[0] * Math.PI) / 180;
  const lon2 = (to[1] * Math.PI) / 180;
  const dLon = lon2 - lon1;
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  const bearing = (Math.atan2(y, x) * 180) / Math.PI;
  return (bearing + 360) % 360;
}

function classifyTurn(previousBearing: number, nextBearing: number): string | null {
  const delta = normalizeHeadingDelta(nextBearing - previousBearing);
  const absDelta = Math.abs(delta);
  if (absDelta < 15) return null;
  const side = delta > 0 ? 'right' : 'left';
  if (absDelta <= 45) return `Take a slight ${side}`;
  if (absDelta <= 120) return `Turn ${side}`;
  return `Take a sharp ${side}`;
}

function buildRoadEdges(points: [number, number][]): EdgeInfo[] {
  if (points.length < 2) return [];
  const edges: EdgeInfo[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const from = points[i];
    const to = points[i + 1];
    const distanceMeters = haversineDistance(from[0], from[1], to[0], to[1]);
    if (distanceMeters <= 0) continue;
    edges.push({
      distanceMeters,
      bearingDegrees: calculateBearingDegrees(from, to),
    });
  }
  return edges;
}

function buildRoadTurnSteps(points: [number, number][]): RouteInstructionStep[] {
  const edges = buildRoadEdges(points);
  if (edges.length === 0) return [];

  const steps: RouteInstructionStep[] = [];
  let activeText = 'Proceed on the campus road.';
  let activeDistance = 0;

  for (let i = 0; i < edges.length; i++) {
    activeDistance += edges[i].distanceMeters;
    const nextEdge = edges[i + 1];
    if (!nextEdge) {
      steps.push({
        text: activeText,
        distanceMeters: activeDistance,
      });
      break;
    }

    const turnText = classifyTurn(edges[i].bearingDegrees, nextEdge.bearingDegrees);
    if (!turnText) continue;

    steps.push({
      text: activeText,
      distanceMeters: activeDistance,
    });
    activeText = `${turnText} and continue on the campus road.`;
    activeDistance = 0;
  }

  return steps;
}

function confidenceLabel(confidence: OffroadConfidence | null): string {
  if (!confidence) return 'medium';
  return confidence;
}

export function buildRouteInstructions({
  routeSegments,
  destinationName,
  isConnectedRoadRoute,
  offroadConfidence,
}: BuildRouteInstructionsInput): RouteInstructionStep[] {
  if (routeSegments.length === 0) {
    return [{ text: 'No walkable route geometry found for this selection.' }];
  }

  const steps: RouteInstructionStep[] = [];
  const startConnectorSegments = routeSegments.filter((segment) => segment.kind === 'start_connector');
  const roadSegments = routeSegments.filter((segment) => segment.kind === 'road');
  const offRoadSegments = routeSegments.filter((segment) => segment.kind === 'offroad');

  startConnectorSegments.forEach((segment) => {
    steps.push({
      text: 'Walk to the nearest campus road.',
      distanceMeters: segment.distanceMeters,
    });
  });

  roadSegments.forEach((segment) => {
    const turnSteps = buildRoadTurnSteps(segment.points);
    if (turnSteps.length > 0) {
      steps.push(...turnSteps);
      return;
    }

    if (segment.distanceMeters > 0) {
      steps.push({
        text: 'Proceed on the campus road.',
        distanceMeters: segment.distanceMeters,
      });
    }
  });

  if (!isConnectedRoadRoute && roadSegments.length > 0 && offRoadSegments.length > 0) {
    steps.push({ text: 'Road ends here.' });
  }

  offRoadSegments.forEach((segment) => {
    const confidence = segment.confidence || offroadConfidence;
    const confidenceHint = !isConnectedRoadRoute
      ? ` Final segment is approximate (${confidenceLabel(confidence)} confidence).`
      : '';
    steps.push({
      text: `Continue to ${destinationName}.${confidenceHint}`,
      distanceMeters: segment.distanceMeters,
    });
  });

  steps.push({ text: `Arrive at ${destinationName}.` });
  return steps;
}
