import { roadGraph, type RoadNode } from './roadGraphBuilder';

export interface RouteResult {
  path: RoadNode[];
  distance: number;
}

export class CampusRouteEngine {
  calculatePath(startX: number, startY: number, endX: number, endY: number): RouteResult | null {
    const startNodeId = roadGraph.getNearestNode(startX, startY);
    const endNodeId = roadGraph.getNearestNode(endX, endY);

    if (!startNodeId || !endNodeId) return null;
    if (startNodeId === endNodeId) {
      const node = roadGraph.nodes.get(startNodeId)!;
      return { path: [node], distance: 0 };
    }

    // Dijkstra's Algorithm
    const distances: Map<string, number> = new Map();
    const previous: Map<string, string | null> = new Map();
    const nodes = new Set(roadGraph.nodes.keys());

    roadGraph.nodes.forEach((_, id) => {
      distances.set(id, Infinity);
      previous.set(id, null);
    });

    distances.set(startNodeId, 0);

    while (nodes.size > 0) {
      // Find node with minimum distance
      let closestNodeId: string | null = null;
      let minDistance = Infinity;

      nodes.forEach((id) => {
        if (distances.get(id)! < minDistance) {
          minDistance = distances.get(id)!;
          closestNodeId = id;
        }
      });

      if (!closestNodeId || distances.get(closestNodeId) === Infinity) break;
      if (closestNodeId === endNodeId) break;

      nodes.delete(closestNodeId);

      const neighbors = roadGraph.adj.get(closestNodeId) || [];
      for (const edge of neighbors) {
        if (!nodes.has(edge.to)) continue;
        
        const alt = distances.get(closestNodeId)! + edge.distance;
        if (alt < distances.get(edge.to)!) {
          distances.set(edge.to, alt);
          previous.set(edge.to, closestNodeId);
        }
      }
    }

    if (previous.get(endNodeId) === null) return null;

    // Reconstruct path
    const path: RoadNode[] = [];
    let currId: string | null = endNodeId;
    while (currId) {
      path.unshift(roadGraph.nodes.get(currId)!);
      currId = previous.get(currId) || null;
    }

    return {
      path,
      distance: distances.get(endNodeId)!
    };
  }
}

export const campusRouteEngine = new CampusRouteEngine();
