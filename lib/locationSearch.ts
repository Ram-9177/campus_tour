import { campusLocations } from '@/data/campusLocations';
import type { CampusLocation } from '@/types/campusLocation';

export function searchLocations(query: string, locations: CampusLocation[] = campusLocations): CampusLocation[] {
  if (!query.trim()) return locations;
  const q = query.toLowerCase();
  return locations.filter((loc) => {
    const name = loc.name.en.toLowerCase();
    const desc = loc.description.en.toLowerCase();
    const cat = loc.category.toLowerCase();
    return name.includes(q) || desc.includes(q) || cat.includes(q);
  });
}

export function filterByCategory(category: string | null, locations: CampusLocation[] = campusLocations): CampusLocation[] {
  if (!category) return locations;
  return locations.filter((loc) => loc.category === category);
}

export function getCategories(locations: CampusLocation[] = campusLocations): string[] {
  const cats = new Set(locations.map((loc) => loc.category));
  return Array.from(cats).sort();
}

export function applyFilters(
  query: string,
  category: string | null,
  locations: CampusLocation[] = campusLocations,
): CampusLocation[] {
  let filtered = locations;
  if (category) {
    filtered = filterByCategory(category, filtered);
  }
  if (query.trim()) {
    filtered = searchLocations(query, filtered);
  }
  return filtered;
}
