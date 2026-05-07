import { roadGraph } from './roadGraphBuilder';

export interface RouteResult {
  path: [number, number][]; // Array of [lat, lon]
  distance: number; // In meters
  instructions: string[];
}

export class CampusRouteEngine {
  findRoute(startLat: number, startLon: number, endLat: number, endLon: number): RouteResult | null {
    const startNodeId = roadGraph.getNearestNode(startLat, startLon);
    const endNodeId = roadGraph.getNearestNode(endLat, endLon);

    if (!startNodeId || !endNodeId) return null;
    if (startNodeId === endNodeId) {
      return { path: [[startLat, startLon], [endLat, endLon]], distance: 0, instructions: ['You have arrived at your destination.'] };
    }

    const distances: Map<string, number> = new Map();
    const previous: Map<string, string | null> = new Map();
    const nodes = Array.from(roadGraph.nodes.keys());
    const queue = new Set(nodes);

    nodes.forEach(node => {
      distances.set(node, Infinity);
      previous.set(node, null);
    });

    distances.set(startNodeId, 0);

    while (queue.size > 0) {
      let minNode: string | null = null;
      let minDist = Infinity;

      queue.forEach(node => {
        const d = distances.get(node)!;
        if (d < minDist) {
          minDist = d;
          minNode = node;
        }
      });

      if (!minNode || distances.get(minNode) === Infinity) break;
      if (minNode === endNodeId) break;

      queue.delete(minNode);

      const neighbors = roadGraph.adj.get(minNode) || [];
      neighbors.forEach(edge => {
        if (!queue.has(edge.to)) return;
        const alt = distances.get(minNode!)! + edge.distance;
        if (alt < distances.get(edge.to)!) {
          distances.set(edge.to, alt);
          previous.set(edge.to, minNode);
        }
      });
    }

    if (previous.get(endNodeId) === null) return null;

    const path: [number, number][] = [];
    let curr: string | null = endNodeId;
    while (curr) {
      const node = roadGraph.nodes.get(curr)!;
      path.unshift([node.latitude, node.longitude]);
      curr = previous.get(curr)!;
    }

    // Add actual start/end points for precision
    path.unshift([startLat, startLon]);
    path.push([endLat, endLon]);

    const totalDistance = distances.get(endNodeId)!;

    return {
      path,
      distance: Math.round(totalDistance),
      instructions: [
        `Walk approximately ${Math.round(totalDistance)} meters along the campus roads.`,
        'Follow the orange highlighted path on your map.'
      ]
    };
  }
}

export const campusRouteEngine = new CampusRouteEngine();
