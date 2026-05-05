import { smruMapConfig } from '@/data/map/smruMapConfig';

export interface RoadNode {
  id: string;
  x: number;
  y: number;
  latitude: number;
  longitude: number;
}

export interface RoadEdge {
  from: string;
  to: string;
  distance: number;
}

export class RoadGraph {
  nodes: Map<string, RoadNode> = new Map();
  adj: Map<string, RoadEdge[]> = new Map();

  constructor() {
    this.build();
  }

  private build() {
    smruMapConfig.data.roads.forEach((road) => {
      for (let i = 0; i < road.coordinates.length - 1; i++) {
        const p1 = road.coordinates[i];
        const p2 = road.coordinates[i + 1];

        // Ensure we have projected coordinates
        if (p1.x === undefined || p1.y === undefined || p2.x === undefined || p2.y === undefined) {
          continue;
        }

        const id1 = `${p1.x},${p1.y}`;
        const id2 = `${p2.x},${p2.y}`;

        if (!this.nodes.has(id1)) {
          this.nodes.set(id1, { id: id1, x: p1.x, y: p1.y, latitude: p1.latitude, longitude: p1.longitude });
        }
        if (!this.nodes.has(id2)) {
          this.nodes.set(id2, { id: id2, x: p2.x, y: p2.y, latitude: p2.latitude, longitude: p2.longitude });
        }

        const dist = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));

        if (!this.adj.has(id1)) this.adj.set(id1, []);
        if (!this.adj.has(id2)) this.adj.set(id2, []);

        this.adj.get(id1)!.push({ from: id1, to: id2, distance: dist });
        this.adj.get(id2)!.push({ from: id2, to: id1, distance: dist });
      }
    });
  }

  getNearestNode(x: number, y: number): string | null {
    let nearestId = null;
    let minDist = Infinity;

    this.nodes.forEach((node) => {
      const dist = Math.sqrt(Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2));
      if (dist < minDist) {
        minDist = dist;
        nearestId = node.id;
      }
    });

    return nearestId;
  }
}

export const roadGraph = new RoadGraph();
