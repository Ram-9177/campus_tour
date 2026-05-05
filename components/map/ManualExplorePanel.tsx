'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { LocationStore } from '@/lib/locationStore';
import mediaSync from '@/lib/mediaSyncEngine';
import { applyFilters, getCategories } from '@/lib/locationSearch';
import type { CampusLocation } from '@/types/campusLocation';

interface ManualExplorePanelProps {
  allowedLocationIds?: string[];
  language?: 'en' | 'te' | 'hi';
}

export default function ManualExplorePanel({ allowedLocationIds, language = 'en' }: ManualExplorePanelProps) {
  const [locations, setLocations] = useState<CampusLocation[]>([]);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const allowed = allowedLocationIds && allowedLocationIds.length > 0 ? new Set(allowedLocationIds) : null;
    const data = LocationStore.getAllLocations().filter((l) => l.active && (!allowed || allowed.has(l.id)));
    setLocations(data);
  }, [allowedLocationIds?.join('|')]);

  const categories = useMemo(() => getCategories(locations), [locations]);
  const filtered = useMemo(() => applyFilters(query, selectedCategory, locations), [query, selectedCategory, locations]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-lg font-bold text-slate-900">Explore Locations</h3>

        {/* Search input */}
        <input
          type="text"
          placeholder="🔍 Search locations..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mb-4 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm placeholder-slate-500 focus:border-[#0b57d0] focus:outline-none focus:ring-2 focus:ring-[#0b57d0]/20 transition"
        />

        {/* Category filters */}
        <div className="mb-4">
          <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Categories</div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`rounded-full px-3 py-2 text-xs font-semibold transition-all ${
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
                  className={`rounded-full px-3 py-2 text-xs font-semibold capitalize transition-all ${
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
              <div className="text-3xl mb-2">🔍</div>
              <div className="text-sm font-medium text-slate-700">No locations found</div>
              <div className="text-xs text-slate-500 mt-1">Try different search terms or filters</div>
            </div>
          ) : (
            filtered.map((loc) => (
              <button
                key={loc.id}
                onClick={() => mediaSync.setCurrentByLocationId(loc.id)}
                className="w-full text-left rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 p-4 transition-all active:scale-95"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">📍</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-slate-900 truncate">{loc.name[language] || loc.name.en}</div>
                    <div className="text-xs text-slate-600 mt-1 line-clamp-2">{loc.description[language] || 'Content coming soon'}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 text-xs font-semibold capitalize">
                        {loc.category}
                      </span>
                    </div>
                  </div>
                  <span className="text-slate-400 text-lg shrink-0">›</span>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="text-xs text-slate-500 text-center pt-2 border-t border-slate-100 mt-2">
          Showing {filtered.length} of {locations.length} locations
        </div>
      </div>
    </div>
  );
}
