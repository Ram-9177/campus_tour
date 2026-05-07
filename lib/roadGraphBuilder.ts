import { smruMapConfig } from '@/data/map/smruMapConfig';
import { getDistance } from './haversine';

export interface RoadNode {
  id: string;
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
    // 1. Add all coordinates as nodes and connect consecutive points in roads
    smruMapConfig.data.roads.forEach((road) => {
      for (let i = 0; i < road.coordinates.length; i++) {
        const p = road.coordinates[i];
        const id = `${p.latitude},${p.longitude}`;
        
        if (!this.nodes.has(id)) {
          this.nodes.set(id, { id, latitude: p.latitude, longitude: p.longitude });
          this.adj.set(id, []);
        }

        if (i > 0) {
          const prev = road.coordinates[i - 1];
          const prevId = `${prev.latitude},${prev.longitude}`;
          const dist = getDistance(prev.latitude, prev.longitude, p.latitude, p.longitude);
          
          this.adj.get(id)!.push({ from: id, to: prevId, distance: dist });
          this.adj.get(prevId)!.push({ from: prevId, to: id, distance: dist });
        }
      }
    });

    // 2. Junction Detection: Connect nodes that are within 5 meters of each other (junctions)
    const nodeIds = Array.from(this.nodes.keys());
    for (let i = 0; i < nodeIds.length; i++) {
      for (let j = i + 1; j < nodeIds.length; j++) {
        const n1 = this.nodes.get(nodeIds[i])!;
        const n2 = this.nodes.get(nodeIds[j])!;
        
        const dist = getDistance(n1.latitude, n1.longitude, n2.latitude, n2.longitude);
        if (dist < 5) {
          this.adj.get(n1.id)!.push({ from: n1.id, to: n2.id, distance: dist });
          this.adj.get(n2.id)!.push({ from: n2.id, to: n1.id, distance: dist });
        }
      }
    }
  }

  getNearestNode(lat: number, lon: number): string | null {
    let nearestId = null;
    let minDist = Infinity;

    this.nodes.forEach((node) => {
      const dist = getDistance(node.latitude, node.longitude, lat, lon);
      if (dist < minDist) {
        minDist = dist;
        nearestId = node.id;
      }
    });

    return nearestId;
  }
}

export const roadGraph = new RoadGraph();
