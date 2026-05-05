'use client';

import { LocationStore } from './locationStore';

export interface TourProgress {
  visitedIds: Set<string>;
  skippedIds: Set<string>;
  isComplete: boolean;
}

type Listener = (p: TourProgress) => void;

class LocationSequenceManager {
  private progress: TourProgress = {
    visitedIds: new Set(),
    skippedIds: new Set(),
    isComplete: false
  };
  private listeners: Listener[] = [];
  private scopeLocationIds: Set<string> | null = null;

  subscribe(fn: Listener) {
    this.listeners.push(fn);
    fn({ ...this.progress });
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  private emit() {
    this.listeners.forEach(fn => fn({ ...this.progress }));
  }

  markVisited(id: string) {
    if (this.progress.visitedIds.has(id)) return;
    this.progress.visitedIds.add(id);
    this.checkCompletion();
    this.emit();
  }

  markSkipped(id: string) {
    if (this.progress.skippedIds.has(id)) return;
    this.progress.skippedIds.add(id);
    this.checkCompletion();
    this.emit();
  }

  setScopeLocationIds(ids?: string[] | null) {
    this.scopeLocationIds = ids && ids.length > 0 ? new Set(ids) : null;
    this.checkCompletion();
    this.emit();
  }

  private checkCompletion() {
    const allLocations = LocationStore.getAllLocations().filter((l) => {
      if (!l.active) return false;
      if (!this.scopeLocationIds) return true;
      return this.scopeLocationIds.has(l.id);
    });
    const totalCount = allLocations.length;
    
    // Check if at least all locations have been visited or skipped
    const allAddressed = allLocations.every(l => 
      this.progress.visitedIds.has(l.id) || this.progress.skippedIds.has(l.id)
    );

    this.progress.isComplete = totalCount > 0 && allAddressed;
  }

  getProgress(): TourProgress {
    return { ...this.progress };
  }

  reset() {
    this.progress = {
      visitedIds: new Set(),
      skippedIds: new Set(),
      isComplete: false
    };
    this.emit();
  }
}

export const locationSequence = new LocationSequenceManager();
