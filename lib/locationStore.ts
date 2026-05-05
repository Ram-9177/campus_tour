import type { CampusLocation } from '@/types/campusLocation';
import { campusLocations as initialLocations } from '@/data/campusLocations';

const STORAGE_KEY = 'smru_campus_locations';

export class LocationStore {
  private static getIsClient(): boolean {
    return typeof window !== 'undefined';
  }

  static getAllLocations(): CampusLocation[] {
    if (!this.getIsClient()) return initialLocations;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      // Initialize with default data if empty
      console.log('[LocationStore] Initializing localStorage with', initialLocations.length, 'locations');
      this.saveToStorage(initialLocations);
      return initialLocations;
    }

    try {
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) {
        throw new Error('Stored locations payload is not an array');
      }

      // Auto-heal stale empty cache after map seed changes.
      // This keeps points visible when source files are replaced.
      if (parsed.length === 0 && initialLocations.length > 0) {
        console.log('[LocationStore] Empty cache detected; reseeding with', initialLocations.length, 'locations');
        this.saveToStorage(initialLocations);
        return initialLocations;
      }

      // Backfill legacy cached records with default media assets from current seed.
      const seedById = new Map(initialLocations.map((loc) => [loc.id, loc]));
      const normalized = parsed.map((loc: CampusLocation) => {
        const seed = seedById.get(loc?.id);
        const hasEnoughImages = Array.isArray(loc?.images) && loc.images.length >= 2;
        const hasVideo = Array.isArray(loc?.videos) && loc.videos.length >= 1;
        if (!seed) return loc;
        return {
          ...loc,
          images: hasEnoughImages ? loc.images : seed.images,
          videos: hasVideo ? loc.videos : seed.videos,
        } as CampusLocation;
      });

      const normalizedChanged = JSON.stringify(normalized) !== JSON.stringify(parsed);
      if (normalizedChanged) {
        this.saveToStorage(normalized);
      }

      console.log('[LocationStore] Loaded', normalized.length, 'locations from localStorage');
      return normalized;
    } catch (e) {
      console.error('Failed to parse locations from storage', e);
      console.log('[LocationStore] Falling back to initial locations:', initialLocations.length);
      return initialLocations;
    }
  }

  static getLocationById(id: string): CampusLocation | undefined {
    return this.getAllLocations().find(loc => loc.id === id);
  }

  static getLocationBySlug(slug: string): CampusLocation | undefined {
    return this.getAllLocations().find(loc => loc.slug === slug);
  }


  static createLocation(location: Omit<CampusLocation, 'id' | 'createdAt' | 'updatedAt'>): CampusLocation {
    const locations = this.getAllLocations();
    const now = new Date().toISOString();
    
    const newLocation: CampusLocation = {
      ...location,
      id: `loc-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };

    const updated = [...locations, newLocation];
    this.saveToStorage(updated);
    return newLocation;
  }

  static updateLocation(id: string, updates: Partial<CampusLocation>): CampusLocation | undefined {
    const locations = this.getAllLocations();
    const index = locations.findIndex(loc => loc.id === id);
    
    if (index === -1) return undefined;

    const updatedLocation: CampusLocation = {
      ...locations[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const updated = [...locations];
    updated[index] = updatedLocation;
    this.saveToStorage(updated);
    return updatedLocation;
  }

  static deleteLocation(id: string): boolean {
    const locations = this.getAllLocations();
    const filtered = locations.filter(loc => loc.id !== id);
    
    if (filtered.length === locations.length) return false;

    this.saveToStorage(filtered);
    return true;
  }

  static toggleLocationActive(id: string): boolean {
    const location = this.getLocationById(id);
    if (!location) return false;
    
    this.updateLocation(id, { active: !location.active });
    return true;
  }

  static importLocations(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed)) {
        this.saveToStorage(parsed);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  }

  static exportLocations(): string {
    return JSON.stringify(this.getAllLocations(), null, 2);
  }

  static saveAll(locations: CampusLocation[]): void {
    if (this.getIsClient()) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(locations));
      // Dispatch a custom event so other components can react to storage changes
      window.dispatchEvent(new Event('smru_locations_updated'));
    }
  }

  private static saveToStorage(locations: CampusLocation[]): void {
    this.saveAll(locations);
  }
}
