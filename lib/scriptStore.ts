import type { CampusLocation } from '@/types/campusLocation';
import { STORAGE_KEYS } from '@/lib/constants';
import { getLocalStorageItem, setLocalStorageItem } from '@/lib/storage';

type Language = 'en' | 'te' | 'hi';

type ScriptByLanguage = Partial<Record<Language, string>>;
type ScriptOverrides = Record<string, ScriptByLanguage>;

function getOverrides(): ScriptOverrides {
  return getLocalStorageItem<ScriptOverrides>(STORAGE_KEYS.SCRIPT_OVERRIDES, {}) ?? {};
}

export function getScriptForLocation(location: CampusLocation, language: Language): string {
  const overrides = getOverrides();
  const overrideScript = overrides[location.id]?.[language];
  if (typeof overrideScript === 'string' && overrideScript.trim().length > 0) {
    return overrideScript;
  }
  return location.script[language] || '';
}

export function setScriptOverride(locationId: string, language: Language, script: string): void {
  const overrides = getOverrides();
  const nextByLocation = { ...(overrides[locationId] ?? {}) };
  if (script.trim().length === 0) {
    delete nextByLocation[language];
  } else {
    nextByLocation[language] = script;
  }

  const nextOverrides = { ...overrides };
  if (Object.keys(nextByLocation).length === 0) {
    delete nextOverrides[locationId];
  } else {
    nextOverrides[locationId] = nextByLocation;
  }

  setLocalStorageItem(STORAGE_KEYS.SCRIPT_OVERRIDES, nextOverrides);
}

export function clearScriptOverride(locationId: string, language: Language): void {
  setScriptOverride(locationId, language, '');
}
