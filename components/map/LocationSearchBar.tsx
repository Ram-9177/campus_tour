'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { LocationStore } from '@/lib/locationStore';
import type { CampusLocation } from '@/types/campusLocation';
import mediaSync from '@/lib/mediaSyncEngine';

const SearchIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="12" />
  </svg>
);

const MapPinIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export default function LocationSearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    if (query.trim().length < 2) return [];
    
    const all = LocationStore.getAllLocations().filter(l => l.active);
    return all.filter(l => 
      l.name.en.toLowerCase().includes(query.toLowerCase()) ||
      l.category.toLowerCase().includes(query.toLowerCase()) ||
      l.id.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (loc: CampusLocation) => {
    mediaSync.setCurrentByLocationId(loc.id);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md mx-auto z-50">
      <div className={`flex items-center gap-2 px-4 py-2.5 bg-white/90 backdrop-blur-md border ${isOpen ? 'border-blue-400 ring-2 ring-blue-100' : 'border-slate-200'} rounded-2xl shadow-sm transition-all duration-200`}>
        <SearchIcon className={`w-5 h-5 ${isOpen ? 'text-blue-500' : 'text-slate-400'}`} />
        <input
          type="text"
          placeholder="Search locations..."
          className="flex-1 bg-transparent border-none outline-none text-[0.95rem] text-slate-700 placeholder:text-slate-400"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        {query && (
          <button onClick={() => setQuery('')} className="p-1 hover:bg-slate-100 rounded-full text-slate-400">
            <XIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && (query.trim().length >= 2 || results.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-lg border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {results.length > 0 ? (
            <div className="py-1">
              {results.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => handleSelect(loc)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-slate-50 last:border-none"
                >
                  <div className="shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <MapPinIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">{loc.name.en}</div>
                    <div className="text-xs text-slate-500 capitalize">{loc.category}</div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-slate-500 text-sm">
              No locations found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
