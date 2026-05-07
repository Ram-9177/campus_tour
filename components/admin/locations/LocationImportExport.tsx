'use client';

import React, { useState, useRef } from 'react';
import { LocationStore } from '@/lib/locationStore';
import { validateLocation } from '@/lib/locationValidation';
import type { CampusLocation } from '@/types/campusLocation';

export default function LocationImportExport() {
  const [summary, setSummary] = useState<{
    added: number;
    updated: number;
    skipped: number;
    errors: string[];
    message?: string;
  } | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = LocationStore.getAllLocations();
    const blob = new Blob([JSON.stringify({ locations: data }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smru-locations-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadTemplate = () => {
    const template = {
      locations: [
        {
          id: "gate-sample",
          slug: "main-gate",
          name: { en: "Main Gate", te: "ముఖ్య ద్వారం", hi: "मुख्य द्वार" },
          category: "gate",
          latitude: 17.3320276,
          longitude: 78.7278257,
          radiusMeters: 50,
          routeOrder: 1,
          active: true,
          description: { en: "Main entry point", te: "", hi: "" },
          script: { en: "Welcome to SMRU...", te: "", hi: "" },
          audio: { en: "", te: "", hi: "" },
          images: ["/images/gate-1.jpg"],
          videos: [],
          contentVariants: {
            physical: { description: { en: "You are at Main Gate", te: "", hi: "" }, script: { en: "Welcome...", te: "", hi: "" }, audio: { en: "", te: "", hi: "" } },
            virtual: { description: { en: "This is Main Gate", te: "", hi: "" }, script: { en: "Explore SMRU...", te: "", hi: "" }, audio: { en: "", te: "", hi: "" } },
            buggy: { description: { en: "Starting point", te: "", hi: "" }, script: { en: "Next stop: Admin Block", te: "", hi: "" }, audio: { en: "", te: "", hi: "" } }
          },
          uspTags: ["Security", "Grand Entry"],
          parentTrustPoints: ["24/7 Surveillance"],
          studentHighlights: ["Easy Transit"],
          admissionsCta: { applyUrl: "https://smru.meritto.com", brochureUrl: "", whatsappUrl: "", counsellorText: "" }
        }
      ]
    };
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "smru-locations-template-enhanced.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        const importedLocations = Array.isArray(parsed) ? parsed : (parsed.locations || null);

        if (!importedLocations) {
          throw new Error('Invalid JSON format. Provide an array or { "locations": [...] }.');
        }

        const currentLocations = LocationStore.getAllLocations();
        const results = { added: 0, updated: 0, skipped: 0, errors: [] as string[] };
        const updatedList = [...currentLocations];
        const fileSlugSet = new Set<string>();

        importedLocations.forEach((loc: any, index: number) => {
          if (!loc || typeof loc !== 'object') {
            results.errors.push(`Row ${index + 1}: Invalid object`);
            results.skipped++;
            return;
          }

          const slug = String(loc.slug || '').trim();
          if (fileSlugSet.has(slug.toLowerCase())) {
            results.errors.push(`Row ${index + 1} (${slug}): Duplicate slug in import file`);
            results.skipped++;
            return;
          }
          if (slug) fileSlugSet.add(slug.toLowerCase());

          // Basic Validation
          const validationErrors = validateLocation(loc, updatedList);
          if (validationErrors.length > 0) {
            results.errors.push(`Row ${index + 1} (${slug || 'No Slug'}): ${validationErrors[0].message}`);
            results.skipped++;
            return;
          }

          const existingIndex = updatedList.findIndex(item => (loc.id && item.id === loc.id) || (slug && item.slug.toLowerCase() === slug.toLowerCase()));
          
          // Schema Normalization (Migration for missing variants)
          const DEFAULT_I18N = { en: '', te: '', hi: '' };
          const cleanLoc: CampusLocation = {
            ...loc,
            id: loc.id || `loc-import-${Date.now()}-${index}`,
            slug,
            name: loc.name || DEFAULT_I18N,
            description: loc.description || DEFAULT_I18N,
            script: loc.script || DEFAULT_I18N,
            audio: loc.audio || DEFAULT_I18N,
            contentVariants: loc.contentVariants || {
              physical: { description: loc.description || DEFAULT_I18N, script: loc.script || DEFAULT_I18N, audio: loc.audio || DEFAULT_I18N },
              virtual: { description: loc.description || DEFAULT_I18N, script: loc.script || DEFAULT_I18N, audio: loc.audio || DEFAULT_I18N },
              buggy: { description: loc.description || DEFAULT_I18N, script: loc.script || DEFAULT_I18N, audio: loc.audio || DEFAULT_I18N },
            },
            uspTags: Array.isArray(loc.uspTags) ? loc.uspTags : [],
            parentTrustPoints: Array.isArray(loc.parentTrustPoints) ? loc.parentTrustPoints : [],
            studentHighlights: Array.isArray(loc.studentHighlights) ? loc.studentHighlights : [],
            admissionsCta: loc.admissionsCta || { applyUrl: '', brochureUrl: '', whatsappUrl: '', counsellorText: '' },
            images: Array.isArray(loc.images) ? loc.images : [],
            videos: Array.isArray(loc.videos) ? loc.videos : [],
            updatedAt: new Date().toISOString()
          };

          if (existingIndex > -1) {
            updatedList[existingIndex] = cleanLoc;
            results.updated++;
          } else {
            updatedList.push(cleanLoc);
            results.added++;
          }
        });

        if (results.added > 0 || results.updated > 0) {
          if (confirm(`Import Summary:\n- Added: ${results.added}\n- Updated: ${results.updated}\n- Errors: ${results.errors.length}\n\nThis will OVERWRITE matching locations. Proceed?`)) {
            LocationStore.saveAll(updatedList);
            setSummary({ ...results, message: 'Import completed successfully.' });
          } else {
            setSummary({ added: 0, updated: 0, skipped: results.added + results.updated, errors: results.errors, message: 'Import cancelled.' });
          }
        } else {
          setSummary({ ...results, message: 'No new or updated locations found.' });
        }
      } catch (err: any) {
        setSummary({ added: 0, updated: 0, skipped: 0, errors: [err.message] });
      } finally {
        setIsImporting(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm mb-8 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
      </div>

      <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Institutional Data Transfer</h3>
          <p className="mt-2 text-slate-600 font-medium">Bulk import/export of campus landmarks with variant-aware content.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleDownloadTemplate}
            className="h-12 rounded-2xl border border-slate-200 px-5 text-sm font-black uppercase tracking-widest text-slate-700 transition hover:bg-slate-50 active:scale-95"
          >
            Template
          </button>
          <button
            onClick={handleExport}
            className="h-12 rounded-2xl border border-slate-200 px-5 text-sm font-black uppercase tracking-widest text-slate-700 transition hover:bg-slate-50 active:scale-95"
          >
            Export All
          </button>
          <label className="flex h-12 cursor-pointer items-center justify-center rounded-2xl bg-blue-600 px-8 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-blue-900/20 transition hover:bg-blue-700 active:scale-95">
            {isImporting ? 'Processing...' : 'Import JSON'}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImport}
              accept=".json"
              className="hidden"
              disabled={isImporting}
            />
          </label>
        </div>
      </div>

      {summary && (
        <div className={`animate-in slide-in-from-top duration-500 rounded-2xl border p-6 ${summary.errors.length > 0 ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Processing Summary</h4>
            <button onClick={() => setSummary(null)} className="text-slate-400 hover:text-slate-600 text-xl font-bold">×</button>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="panel-soft bg-white p-4 text-center border-emerald-100">
               <div className="text-2xl font-black text-emerald-600">{summary.added}</div>
               <div className="text-[9px] font-black uppercase tracking-widest text-emerald-800/40">New Points</div>
            </div>
            <div className="panel-soft bg-white p-4 text-center border-blue-100">
               <div className="text-2xl font-black text-blue-600">{summary.updated}</div>
               <div className="text-[9px] font-black uppercase tracking-widest text-blue-800/40">Updated</div>
            </div>
            <div className="panel-soft bg-white p-4 text-center border-amber-100">
               <div className="text-2xl font-black text-amber-600">{summary.skipped}</div>
               <div className="text-[9px] font-black uppercase tracking-widest text-amber-800/40">Skipped</div>
            </div>
          </div>

          {summary.message && (
            <p className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              {summary.message}
            </p>
          )}

          {summary.errors.length > 0 && (
            <div className="mt-4 pt-4 border-t border-amber-200">
              <p className="text-xs font-black text-amber-800 uppercase tracking-widest mb-3">Warnings & Errors ({summary.errors.length})</p>
              <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {summary.errors.map((err, idx) => (
                  <li key={idx} className="text-[11px] font-bold text-amber-700 bg-white/50 p-2 rounded-lg border border-amber-100/50">
                    {err}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-100">
         <div className="flex gap-4">
            <div className="shrink-0 h-10 w-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">1</div>
            <div>
               <h5 className="text-sm font-black text-slate-900 uppercase tracking-wide">Enhanced Schema</h5>
               <p className="text-xs text-slate-500 mt-1 leading-relaxed">Supports admissions metadata, mode variants (Buggy/Walk/Virtual), and 3-language content in a single file.</p>
            </div>
         </div>
         <div className="flex gap-4">
            <div className="shrink-0 h-10 w-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">2</div>
            <div>
               <h5 className="text-sm font-black text-slate-900 uppercase tracking-wide">Safe Sync</h5>
               <p className="text-xs text-slate-500 mt-1 leading-relaxed">Automatic backup is created in local storage before any destructive overwrite occurs.</p>
            </div>
         </div>
      </div>
    </div>
  );
}
