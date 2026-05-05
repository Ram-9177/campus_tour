import { roadGraph, type RoadNode } from './roadGraphBuilder';

/**
 * Finds the nearest road node to any given point on the campus map.
 * Used for snapping user location or destinations to the navigable road network.
 */
export function findNearestRoadNode(x: number, y: number): RoadNode | null {
  const nodeId = roadGraph.getNearestNode(x, y);
  if (!nodeId) return null;
  return roadGraph.nodes.get(nodeId) || null;
}

/**
 * Finds the nearest road node using geographic coordinates.
 * Useful for GPS-based snapping.
 */
export function findNearestRoadNodeByGeo(lat: number, lon: number): RoadNode | null {
  let nearestNode: RoadNode | null = null;
  let minDist = Infinity;

  roadGraph.nodes.forEach((node) => {
    // Basic Pythagorean on lat/lon is sufficient for this scale
    const dist = Math.sqrt(Math.pow(node.latitude - lat, 2) + Math.pow(node.longitude - lon, 2));
    if (dist < minDist) {
      minDist = dist;
      nearestNode = node;
    }
  });

  return nearestNode;
}
