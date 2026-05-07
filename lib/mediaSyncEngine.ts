import { LocationStore } from './locationStore';
import type { CampusLocation } from '@/types/campusLocation';
import audioEngine from './audioGuideEngine';
import { locationSequence } from './locationSequence';
import { trackLocationOpen } from './publicTourEvents';

type Listener = (loc?: CampusLocation | null) => void;
const LOCATION_STORAGE_KEY = 'smru_campus_locations';

class MediaSyncEngine {
  private locations: CampusLocation[] = [];
  private current?: CampusLocation | null = null;
  private listeners: Listener[] = [];
  private scopeLocationIds: Set<string> | null = null;

  constructor() {
    this.refresh();
    if (typeof window !== 'undefined') {
      window.addEventListener('smru_locations_updated', () => this.refresh());
      window.addEventListener('smru_audio_ended_autoadvance', () => this.next());
      window.addEventListener('storage', (event) => {
        if (event.key && event.key !== LOCATION_STORAGE_KEY) return;
        this.refresh();
        this.emit();
      });
    }
  }

  private refresh() {
    const all = LocationStore.getAllLocations().filter((l) => l.active);
    this.locations = all
      .filter((l) => (this.scopeLocationIds ? this.scopeLocationIds.has(l.id) : true))
      .sort((a, b) => (a.routeOrder || 0) - (b.routeOrder || 0));
    if (this.current && !this.locations.find(l => l.id === this.current?.id)) {
      this.setCurrentByLocationId(null);
    }
  }

  setScopeLocationIds(ids?: string[] | null) {
    this.scopeLocationIds = ids && ids.length > 0 ? new Set(ids) : null;
    this.refresh();
    this.emit();
  }

  subscribe(fn: Listener) {
    this.listeners.push(fn);
    fn(this.current || null);
    return () => { this.listeners = this.listeners.filter((l) => l !== fn); };
  }

  private emit() {
    this.listeners.forEach((l) => l(this.current || null));
  }

  getCurrent() {
    return this.current || null;
  }

  setCurrentByLocationId(id?: string | null) {
    if (!id) {
      if (this.current) {
        locationSequence.markSkipped(this.current.id);
      }
      this.current = null;
      audioEngine.loadLocation(null);
      this.emit();
      return;
    }

    if (this.current?.id === id) {
      this.emit();
      return;
    }

    const loc = this.locations.find((l) => l.id === id) || null;
    this.current = loc;
    if (loc) {
      locationSequence.markVisited(loc.id);
      trackLocationOpen(loc.id, loc.slug);
    }
    audioEngine.loadLocation(loc || null);
    this.emit();
  }

  setCurrentByMapPointId(mapPointId?: string | null) {
    if (!mapPointId) return this.setCurrentByLocationId(null);
    const loc = this.locations.find((l) => l.mapPointId === mapPointId) || null;
    if (this.current?.id && loc?.id && this.current.id === loc.id) {
      this.emit();
      return;
    }
    this.current = loc;
    if (loc) {
      locationSequence.markVisited(loc.id);
    }
    audioEngine.loadLocation(loc || null);
    this.emit();
  }

  next() {
    if (!this.current) {
      // If none selected, start from first
      if (this.locations.length > 0) {
        this.setCurrentByLocationId(this.locations[0].id);
      }
      return;
    }
    const idx = this.locations.findIndex((l) => l.id === this.current?.id);
    if (idx === -1) return;
    
    // Stop at last location
    if (idx < this.locations.length - 1) {
      const next = this.locations[idx + 1];
      this.setCurrentByLocationId(next.id);
    }
  }

  skip() {
    if (!this.current) return;
    const idx = this.locations.findIndex((l) => l.id === this.current?.id);
    if (idx === -1) return;

    locationSequence.markVisited(this.current.id);
    
    if (idx < this.locations.length - 1) {
      const next = this.locations[idx + 1];
      this.setCurrentByLocationId(next.id);
    } else {
      this.setCurrentByLocationId(null);
    }
  }

  prev() {
    if (!this.current) return;
    const idx = this.locations.findIndex((l) => l.id === this.current?.id);
    if (idx === -1) return;

    // Stop at first location
    if (idx > 0) {
      const prev = this.locations[idx - 1];
      this.setCurrentByLocationId(prev.id);
    }
  }

  getLocations() {
    return [...this.locations];
  }
}

const mediaSync = new MediaSyncEngine();
export default mediaSync;
