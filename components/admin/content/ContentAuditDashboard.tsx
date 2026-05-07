'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { LocationStore } from '@/lib/locationStore';
import type { CampusLocation } from '@/types/campusLocation';
import Link from 'next/link';

type IssueType = 'script' | 'audio' | 'media' | 'data' | 'critical';

interface LocationIssue {
  locationId: string;
  slug: string;
  name: string;
  type: IssueType;
  description: string;
  language?: 'en' | 'te' | 'hi';
  variant?: 'physical' | 'virtual' | 'buggy';
}

export default function ContentAuditDashboard() {
  const [locations, setLocations] = useState<CampusLocation[]>([]);
  const [filterType, setFilterType] = useState<IssueType | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    const load = () => setLocations(LocationStore.getAllLocations());
    load();
    window.addEventListener('smru_locations_updated', load);
    return () => window.removeEventListener('smru_locations_updated', load);
  }, []);

  const issues = useMemo(() => {
    const list: LocationIssue[] = [];
    const slugs = new Set<string>();
    const seenSlugs = new Set<string>();

    locations.forEach(loc => {
      const active = loc.active;
      const prefix = active ? '' : '[Inactive] ';

      // Duplicate Slug
      if (seenSlugs.has(loc.slug)) {
        list.push({ locationId: loc.id, slug: loc.slug, name: loc.name.en, type: 'critical', description: 'Duplicate Slug detected' });
      }
      seenSlugs.add(loc.slug);

      // Data Issues
      if (!loc.category) {
        list.push({ locationId: loc.id, slug: loc.slug, name: loc.name.en, type: 'data', description: 'Missing Category' });
      }
      if (loc.radiusMeters < 5 || loc.radiusMeters > 100) {
        list.push({ locationId: loc.id, slug: loc.slug, name: loc.name.en, type: 'data', description: `Invalid Radius: ${loc.radiusMeters}m` });
      }

      // Media Issues
      if (!loc.images || loc.images.length === 0) {
        list.push({ locationId: loc.id, slug: loc.slug, name: loc.name.en, type: 'media', description: 'No images uploaded' });
      }

      // Script & Audio Variants
      const variants: ('physical' | 'virtual' | 'buggy')[] = ['physical', 'virtual', 'buggy'];
      const langs: ('en' | 'te' | 'hi')[] = ['en', 'te', 'hi'];

      variants.forEach(v => {
        const variant = loc.contentVariants?.[v];
        langs.forEach(l => {
          // Check Script
          if (!variant?.script?.[l]) {
            list.push({ 
              locationId: loc.id, slug: loc.slug, name: loc.name.en, 
              type: 'script', 
              variant: v, language: l,
              description: `Missing ${v} script in ${l.toUpperCase()}` 
            });
          }
          // Check Audio
          if (!variant?.audio?.[l]) {
            list.push({ 
              locationId: loc.id, slug: loc.slug, name: loc.name.en, 
              type: 'audio', 
              variant: v, language: l,
              description: `Missing ${v} audio in ${l.toUpperCase()}` 
            });
          }
        });
      });
    });

    return list;
  }, [locations]);

  const filteredIssues = useMemo(() => {
    return issues.filter(issue => {
      const matchType = filterType === 'all' || issue.type === filterType;
      const loc = locations.find(l => l.id === issue.locationId);
      const matchCat = filterCategory === 'all' || loc?.category === filterCategory;
      return matchType && matchCat;
    });
  }, [issues, filterType, filterCategory, locations]);

  const stats = {
    total: locations.length,
    active: locations.filter(l => l.active).length,
    issues: issues.length,
    critical: issues.filter(i => i.type === 'critical').length
  };

  const handleExportCsv = () => {
    const headers = ['Location', 'Slug', 'Type', 'Issue', 'Variant', 'Language'];
    const rows = filteredIssues.map(i => [
      i.name, i.slug, i.type, i.description, i.variant || '', i.language || ''
    ]);
    const content = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smru-content-audit-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="panel-soft p-5 bg-white border border-slate-200">
           <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Locations</div>
           <div className="text-3xl font-black text-slate-900">{stats.total}</div>
        </div>
        <div className="panel-soft p-5 bg-white border border-slate-200">
           <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Active Stops</div>
           <div className="text-3xl font-black text-blue-600">{stats.active}</div>
        </div>
        <div className="panel-soft p-5 bg-amber-50 border border-amber-100">
           <div className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-1">Total Issues</div>
           <div className="text-3xl font-black text-amber-700">{stats.issues}</div>
        </div>
        <div className="panel-soft p-5 bg-red-50 border border-red-100">
           <div className="text-[10px] font-black uppercase tracking-widest text-red-600 mb-1">Critical Faults</div>
           <div className="text-3xl font-black text-red-700">{stats.critical}</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="panel-soft p-4 bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-4">
         <div className="flex flex-wrap gap-2">
            {(['all', 'critical', 'script', 'audio', 'media', 'data'] as const).map(t => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-tight transition-all ${
                  filterType === t ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
         </div>
         <button 
           onClick={handleExportCsv}
           className="px-4 py-2 bg-emerald-600 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-900/20 active:scale-95 transition"
         >
           Export CSV Audit
         </button>
      </div>

      {/* Issues Table */}
      <div className="panel-soft bg-white border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Location</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Issue Type</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Description</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredIssues.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-sm font-bold text-slate-400 italic">
                  No issues found for the selected filters. SMRU Content is in elite health! ✨
                </td>
              </tr>
            ) : (
              filteredIssues.map((issue, idx) => (
                <tr key={`${issue.locationId}-${idx}`} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4">
                    <div className="text-sm font-black text-slate-900">{issue.name}</div>
                    <div className="text-[10px] font-bold text-slate-400 font-mono">{issue.slug}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter ${
                      issue.type === 'critical' ? 'bg-red-100 text-red-700' :
                      issue.type === 'script' ? 'bg-blue-100 text-blue-700' :
                      issue.type === 'audio' ? 'bg-purple-100 text-purple-700' :
                      issue.type === 'media' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {issue.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs font-bold text-slate-700">{issue.description}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      href={`/admin/locations/edit/${issue.locationId}`}
                      className="inline-flex h-8 items-center justify-center rounded-lg bg-blue-50 px-3 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-100 transition"
                    >
                      Fix Issue
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
