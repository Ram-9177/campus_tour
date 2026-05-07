import type { TourSession } from '@/types/tourSession';
import { getLocalStorageItem, removeLocalStorageItem, setLocalStorageItem } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/constants';

const KEY = STORAGE_KEYS.TOUR_SESSION;

export const DEFAULT_TOUR_SESSION: TourSession = {
  visitorType: 'other',
  language: 'en',
  navigationMode: 'manual_explore',
  campusAccessDecision: null,
  currentLocationId: null,
  visitedLocationIds: [],
  audioStarted: false,
  lastUpdatedAt: new Date(0).toISOString(),
};

function nowIso(): string {
  return new Date().toISOString();
}

function emitSessionUpdated() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event('smru_tour_session_updated'));
}

function sanitizeSession(input: Partial<TourSession> | null | undefined): TourSession {
  const visited = Array.isArray(input?.visitedLocationIds)
    ? Array.from(new Set(input?.visitedLocationIds.filter((id): id is string => typeof id === 'string' && id.length > 0)))
    : [];

  return {
    visitorType: input?.visitorType ?? DEFAULT_TOUR_SESSION.visitorType,
    language: input?.language ?? DEFAULT_TOUR_SESSION.language,
    navigationMode: input?.navigationMode ?? DEFAULT_TOUR_SESSION.navigationMode,
    campusAccessDecision:
      input?.campusAccessDecision === 'inside-campus' ||
      input?.campusAccessDecision === 'outside-campus' ||
      input?.campusAccessDecision === 'unknown-location'
        ? input.campusAccessDecision
        : DEFAULT_TOUR_SESSION.campusAccessDecision,
    currentLocationId: typeof input?.currentLocationId === 'string' ? input.currentLocationId : null,
    visitedLocationIds: visited,
    audioStarted: Boolean(input?.audioStarted),
    lastUpdatedAt: typeof input?.lastUpdatedAt === 'string' && input.lastUpdatedAt ? input.lastUpdatedAt : nowIso(),
  };
}

export function getTourSession(): TourSession {
  const stored = getLocalStorageItem<Partial<TourSession>>(KEY);
  return sanitizeSession(stored);
}

export function setTourSession(session: TourSession): TourSession {
  const next = sanitizeSession({ ...session, lastUpdatedAt: nowIso() });
  setLocalStorageItem(KEY, next);
  emitSessionUpdated();
  return next;
}

export function patchTourSession(patch: Partial<TourSession>): TourSession {
  const current = getTourSession();
  const next = sanitizeSession({ ...current, ...patch, lastUpdatedAt: nowIso() });
  setLocalStorageItem(KEY, next);
  emitSessionUpdated();
  return next;
}

export function resetTourSession(): TourSession {
  removeLocalStorageItem(KEY);
  const next = { ...DEFAULT_TOUR_SESSION, lastUpdatedAt: nowIso() };
  setLocalStorageItem(KEY, next);
  emitSessionUpdated();
  return next;
}
