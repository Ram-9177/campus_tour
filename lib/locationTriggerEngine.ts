import mediaSync from './mediaSyncEngine';
import { LocationStore } from './locationStore';
import { locationSequence } from './locationSequence';
import { isUserAtPoint } from './radiusDetection';

class LocationTriggerEngine {
  private triggeredIds: Set<string> = new Set();

  processUpdate(lat: number, lon: number) {
    const locations = LocationStore.getAllLocations().filter(l => l.active);
    const progress = locationSequence.getProgress();

    for (const loc of locations) {
      // Avoid spamming the same point multiple times automatically
      if (this.triggeredIds.has(loc.id) || progress.visitedIds.has(loc.id)) {
        continue;
      }

      if (isUserAtPoint(lat, lon, loc)) {
        this.triggeredIds.add(loc.id);
        mediaSync.setCurrentByLocationId(loc.id);
        
        // Dispatch a custom event for UI feedback if needed
        window.dispatchEvent(new CustomEvent('smru_location_autotriggered', { 
           detail: { locationId: loc.id } 
        }));
        
        break;
      }
    }
  }

  // Allow re-triggering (e.g., if user taps Replay)
  resetTrigger(id: string) {
    this.triggeredIds.delete(id);
  }

  resetAll() {
    this.triggeredIds.clear();
  }
}

export const locationTriggerEngine = new LocationTriggerEngine();
