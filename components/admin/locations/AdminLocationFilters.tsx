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
    <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-11 px-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-hidden"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-11 px-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-hidden"
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
