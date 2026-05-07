import type { CampusLocation } from '@/types/campusLocation';
import { campusLocations as initialLocations } from '@/data/campusLocations';
import { validateLocationCollection } from '@/lib/locationValidation';

const STORAGE_KEY = 'smru_campus_locations';

export class LocationStore {
  private static getIsClient(): boolean {
    return typeof window !== 'undefined';
  }

  static getAllLocations(): CampusLocation[] {
    if (!this.getIsClient()) return initialLocations;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return initialLocations;

    try {
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) throw new Error('Invalid format');

      // Migration & Normalization
      const normalized = parsed.map((loc: any) => {
        const DEFAULT_I18N = { en: '', te: '', hi: '' };
        
        // Ensure contentVariants exist
        const variants = loc.contentVariants || {
          physical: { description: loc.description || DEFAULT_I18N, script: loc.script || DEFAULT_I18N, audio: loc.audio || DEFAULT_I18N },
          virtual: { description: loc.description || DEFAULT_I18N, script: loc.script || DEFAULT_I18N, audio: loc.audio || DEFAULT_I18N },
          buggy: { description: loc.description || DEFAULT_I18N, script: loc.script || DEFAULT_I18N, audio: loc.audio || DEFAULT_I18N },
        };

        return {
          ...loc,
          name: loc.name || DEFAULT_I18N,
          description: loc.description || DEFAULT_I18N,
          script: loc.script || DEFAULT_I18N,
          audio: loc.audio || DEFAULT_I18N,
          contentVariants: variants,
          uspTags: Array.isArray(loc.uspTags) ? loc.uspTags : [],
          parentTrustPoints: Array.isArray(loc.parentTrustPoints) ? loc.parentTrustPoints : [],
          studentHighlights: Array.isArray(loc.studentHighlights) ? loc.studentHighlights : [],
          images: Array.isArray(loc.images) ? loc.images : [],
          videos: Array.isArray(loc.videos) ? loc.videos : [],
          active: typeof loc.active === 'boolean' ? loc.active : true,
          routeOrder: typeof loc.routeOrder === 'number' ? loc.routeOrder : 0,
          radiusMeters: typeof loc.radiusMeters === 'number' ? loc.radiusMeters : 30,
        };
      }) as CampusLocation[];

      return normalized;
    } catch (e) {
      console.warn('LocationStore: Failed to parse stored locations, falling back to seed.', e);
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
    this.saveAll([...locations, newLocation]);
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
    this.saveAll(updated);
    return updatedLocation;
  }

  static deleteLocation(id: string): boolean {
    const locations = this.getAllLocations();
    const filtered = locations.filter(loc => loc.id !== id);
    if (filtered.length === locations.length) return false;
    this.saveAll(filtered);
    return true;
  }

  static importLocations(jsonString: string): { success: boolean; error?: string } {
    try {
      const parsed = JSON.parse(jsonString);
      const data = Array.isArray(parsed) ? parsed : (parsed.locations || null);
      if (!data) return { success: false, error: 'JSON must be an array or contain a locations array.' };
      
      // Backup before overwrite
      const current = localStorage.getItem(STORAGE_KEY);
      if (current) {
        localStorage.setItem(`${STORAGE_KEY}_backup_${Date.now()}`, current);
      }

      this.saveAll(data);
      return { success: true };
    } catch (e) {
      return { success: false, error: 'Invalid JSON format' };
    }
  }

  static exportLocations(): string {
    return JSON.stringify(this.getAllLocations(), null, 2);
  }

  static saveAll(locations: CampusLocation[]): void {
    if (!this.getIsClient()) return;
    const payload = JSON.stringify(locations);
    localStorage.setItem(STORAGE_KEY, payload);
    window.dispatchEvent(new Event('smru_locations_updated'));
  }

  static resetToDefaultSeed(): void {
    if (!this.getIsClient()) return;
    // Backup before destructive reset
    const current = localStorage.getItem(STORAGE_KEY);
    if (current) localStorage.setItem(`${STORAGE_KEY}_backup_${Date.now()}`, current);
    
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event('smru_locations_updated'));
  }

  static clearLocalOverrides(): void {
    this.resetToDefaultSeed();
  }

  static toggleLocationActive(id: string): boolean {
    const loc = this.getLocationById(id);
    if (!loc) return false;
    this.updateLocation(id, { active: !loc.active });
    return true;
  }
}
