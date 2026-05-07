'use client';

import React, { useState, useEffect, useMemo } from 'react';
import type { CampusLocation } from '@/types/campusLocation';
import { LocationStore } from '@/lib/locationStore';
import AdminLocationCard from './AdminLocationCard';
import AdminLocationFilters from './AdminLocationFilters';
import Link from 'next/link';

export default function AdminLocationsList() {
  const [locations, setLocations] = useState<CampusLocation[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchLocations = () => {
    const data = LocationStore.getAllLocations();
    setLocations(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLocations();

    // Subscribe to updates
    const handleUpdate = () => fetchLocations();
    window.addEventListener('smru_locations_updated', handleUpdate);
    return () => window.removeEventListener('smru_locations_updated', handleUpdate);
  }, []);

  const filteredLocations = useMemo(() => {
    return locations.filter(loc => {
      const matchesSearch = loc.name.en.toLowerCase().includes(search.toLowerCase()) || 
                            loc.slug.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'all' || loc.category === category;
      const matchesStatus = status === 'all' || 
                            (status === 'active' && loc.active) || 
                            (status === 'inactive' && !loc.active);
      
      return matchesSearch && matchesCategory && matchesStatus;
    }).sort((a, b) => a.routeOrder - b.routeOrder);
  }, [locations, search, category, status]);

  const handleDuplicate = (location: CampusLocation) => {
    const { id, createdAt, updatedAt, ...rest } = location;
    LocationStore.createLocation({
      ...rest,
      slug: `${rest.slug}-copy`,
      name: {
        ...rest.name,
        en: `${rest.name.en} (Copy)`
      }
    });
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading locations...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-900">
          Campus Locations ({filteredLocations.length})
        </h2>
        <Link 
          href="/admin/locations/new"
          className="flex h-12 items-center justify-center rounded-xl bg-blue-600 px-6 text-base font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
        >
          Add Location
        </Link>
      </div>

      <AdminLocationFilters
        search={search} setSearch={setSearch}
        category={category} setCategory={setCategory}
        status={status} setStatus={setStatus}
      />

      {filteredLocations.length === 0 ? (
        <div className="py-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
          <p className="text-base text-slate-600">No locations found matching your filters.</p>
          <button 
            onClick={() => { setSearch(''); setCategory('all'); setStatus('all'); }}
            className="mt-2 text-base font-semibold text-blue-600 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLocations.map(loc => (
            <AdminLocationCard
              key={loc.id}
              location={loc}
              onRefresh={fetchLocations}
              onEdit={(l) => window.location.href = `/admin/locations/edit/${l.id}`}
              onDuplicate={handleDuplicate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
