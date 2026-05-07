import React from 'react';
import type { CampusLocationCategory } from '@/types/campusLocation';

interface AdminLocationFiltersProps {
  search: string;
  setSearch: (val: string) => void;
  category: string;
  setCategory: (val: string) => void;
  status: string;
  setStatus: (val: string) => void;
}

const CATEGORIES: CampusLocationCategory[] = [
  'gate', 'admin', 'academic', 'library', 'hostel', 'food', 'sports', 'rehab', 'parking', 'facility', 'viewpoint', 'transport', 'garden', 'other'
];

export default function AdminLocationFilters({ 
  search, setSearch, 
  category, setCategory, 
  status, setStatus 
}: AdminLocationFiltersProps) {
  return (
    <div className="mb-6 space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-base focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-12 rounded-xl border border-slate-200 bg-white px-3 text-base focus:outline-hidden"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-12 rounded-xl border border-slate-200 bg-white px-3 text-base focus:outline-hidden"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>
    </div>
  );
}
