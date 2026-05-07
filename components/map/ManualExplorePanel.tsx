'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { LocationStore } from '@/lib/locationStore';
import mediaSync from '@/lib/mediaSyncEngine';
import { applyFilters, getCategories } from '@/lib/locationSearch';
import type { CampusLocation } from '@/types/campusLocation';

import { useSelectedLanguage } from '@/hooks/useSelectedLanguage';
import locationEngine from '@/lib/locationEngine';
import { findNearestPoint } from '@/lib/radiusDetection';

interface ManualExplorePanelProps {
  allowedLocationIds?: string[];
  language?: string;
}

export default function ManualExplorePanel({ allowedLocationIds }: ManualExplorePanelProps) {
  const { language, t } = useSelectedLanguage();
  const [locations, setLocations] = useState<CampusLocation[]>([]);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [gps, setGps] = useState(locationEngine.getState());

  useEffect(() => {
    return locationEngine.subscribe(setGps);
  }, []);

  const nearest = useMemo(() => {
    if (!gps.latitude || !gps.longitude) return null;
    return findNearestPoint(gps.latitude, gps.longitude, locations);
  }, [gps.latitude, gps.longitude, locations]);

  useEffect(() => {
    const load = () => {
      const allowed = allowedLocationIds && allowedLocationIds.length > 0 ? new Set(allowedLocationIds) : null;
      const data = LocationStore.getAllLocations().filter((l) => l.active && (!allowed || allowed.has(l.id)));
      setLocations(data);
    };

    load();
    window.addEventListener('smru_locations_updated', load);
    window.addEventListener('smru_tour_session_updated', load);
    window.addEventListener('storage', load);
    return () => {
      window.removeEventListener('smru_locations_updated', load);
      window.removeEventListener('smru_tour_session_updated', load);
      window.removeEventListener('storage', load);
    };
  }, [allowedLocationIds?.join('|')]);

  const categories = useMemo(() => getCategories(locations), [locations]);
  const filtered = useMemo(() => applyFilters(query, selectedCategory, locations), [query, selectedCategory, locations]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-2xl font-bold text-slate-900">Explore Locations</h3>

        {nearest && (
          <div className="mb-4 rounded-xl border border-blue-100 bg-blue-50 p-4 shadow-sm animate-in fade-in duration-500">
             <div className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1">Nearest Landmark</div>
             <div className="flex items-center justify-between gap-3">
                <div className="font-bold text-slate-900 truncate">{t(nearest.location.name, nearest.location.name.en)}</div>
                <button 
                  onClick={() => mediaSync.setCurrentByLocationId(nearest.location.id)}
                  className="shrink-0 h-8 px-3 rounded-lg bg-blue-600 text-[10px] font-black text-white uppercase tracking-widest transition hover:bg-blue-700"
                >
                  View
                </button>
             </div>
             <div className="mt-1 text-[10px] font-bold text-slate-400">
                {Math.round(nearest.distance)} meters from you
             </div>
          </div>
        )}

        <input
          type="text"
          placeholder="Search locations..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mb-4 h-12 w-full rounded-xl border border-slate-300 px-4 text-base placeholder-slate-500 transition focus:border-[#0b57d0] focus:outline-none focus:ring-2 focus:ring-[#0b57d0]/20"
        />

        <div className="mb-4">
          <div className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-600">Categories</div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${
                selectedCategory === null 
                  ? 'bg-[#0b57d0] text-white shadow-md' 
                  : 'border border-slate-300 bg-white text-slate-700 hover:border-slate-400'
              }`}
            >
              All ({locations.length})
            </button>
            {categories.map((cat) => {
              const count = locations.filter(l => l.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-4 py-2.5 text-sm font-semibold capitalize transition-all ${
                    selectedCategory === cat 
                      ? 'bg-[#0b57d0] text-white shadow-md' 
                      : 'border border-slate-300 bg-white text-slate-700 hover:border-slate-400'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Location list */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <div className="text-base font-medium text-slate-700">No locations found</div>
              <div className="mt-1 text-sm text-slate-500">Try different search terms or filters</div>
            </div>
          ) : (
            filtered.map((loc) => (
              <button
                key={loc.id}
                onClick={() => mediaSync.setCurrentByLocationId(loc.id)}
                className="w-full rounded-xl border border-slate-200 bg-white p-4 text-left transition-all hover:border-slate-300 hover:bg-slate-50 active:scale-95"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="truncate text-base font-semibold text-slate-900">{t(loc.name, loc.name.en)}</div>
                    <div className="mt-1 line-clamp-2 text-sm text-slate-600">{t(loc.description, 'Content coming soon in selected language.')}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-block rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold capitalize text-blue-900">
                        {loc.category}
                      </span>
                    </div>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-slate-500">Open</span>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="mt-2 border-t border-slate-100 pt-2 text-center text-sm text-slate-500">
          Showing {filtered.length} of {locations.length} locations
        </div>
      </div>
    </div>
  );
}
