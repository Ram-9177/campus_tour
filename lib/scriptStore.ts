import type { CampusLocation } from '@/types/campusLocation';
import { STORAGE_KEYS } from '@/lib/constants';
import { getLocalStorageItem, setLocalStorageItem } from '@/lib/storage';
import type { AppTourMode } from '@/types/appRules';

type Language = 'en' | 'te' | 'hi';

type ScriptByLanguage = Partial<Record<Language, string>>;
type ScriptOverrides = Record<string, ScriptByLanguage>;

function getOverrides(): ScriptOverrides {
  return getLocalStorageItem<ScriptOverrides>(STORAGE_KEYS.SCRIPT_OVERRIDES, {}) ?? {};
}

export function getScriptForLocation(location: CampusLocation, language: Language, mode: AppTourMode = 'walk_with_me'): string {
  const overrides = getOverrides();
  const overrideScript = overrides[location.id]?.[language];
  if (typeof overrideScript === 'string' && overrideScript.trim().length > 0) {
    return overrideScript;
  }

  // Generate dynamic script based on mode and location name if no hardcoded script exists
  const name = (location.name.en || '').toLowerCase();
  const category = (location.category || '').toLowerCase();
  const baseDesc = (location.description?.en || '').toLowerCase();
  
  const isVirtual = mode === 'virtual_tour';
  const isHostel = name.includes('hostel') || category.includes('hostel') || baseDesc.includes('hostel');
  const isLibrary = name.includes('library') || category.includes('library');
  const isGround = name.includes('ground') || name.includes('area') || name.includes('pool');
  const isGate = name.includes('gate');

  if (isVirtual) {
    if (isHostel) return `Welcome to the Virtual Tour of ${location.name.en}. These residential blocks provide a comfortable home for our students with modern amenities. Tap the 360 icon to explore the rooms.`;
    if (isLibrary) return `Explore the ${location.name.en} virtually. It houses thousands of digital and physical resources. A perfect place for academic excellence.`;
    if (isGate) return `This is the ${location.name.en} virtually. It is the primary gateway to our secure and beautiful campus.`;
    return `Welcome to the virtual stop for ${location.name.en}. This facility is a key part of our campus infrastructure. ${location.description?.en || ''}`;
  } else {
    // Physical tour scripts
    if (isGate) return `You have arrived at the ${location.name.en}. Please check in with security if needed. The campus tour begins right here.`;
    if (isGround) return `You are standing by the ${location.name.en}. This open space is used for sports and university events. Enjoy the fresh air!`;
    if (isHostel) return `You are near ${location.name.en}. This is a student residential area. Please be mindful of the residential quiet zones as you pass by.`;
    return `You have reached ${location.name.en}. ${location.description?.en || ''} Take a moment to look around.`;
  }
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
