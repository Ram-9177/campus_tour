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
          id: "sample-point",
          slug: "sample-point",
          name: { en: "Sample Point", te: "", hi: "" },
          category: "academic",
          latitude: 17.3315,
          longitude: 78.7275,
          radiusMeters: 25,
          description: { en: "Description here", te: "", hi: "" },
          script: { en: "Narration here", te: "", hi: "" },
          audio: { en: "", te: "", hi: "" },
          images: [],
          videos: [],
          routeOrder: 1,
          recommendedFor: ["student"],
          active: true
        }
      ]
    };
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "smru-locations-template.json";
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
        const importedLocations = parsed.locations;

        if (!Array.isArray(importedLocations)) {
          throw new Error('Invalid format: "locations" array not found.');
        }

        const currentLocations = LocationStore.getAllLocations();
        const results = {
          added: 0,
          updated: 0,
          skipped: 0,
          errors: [] as string[]
        };

        const updatedList = [...currentLocations];

        importedLocations.forEach((loc: any, index: number) => {
          const validationErrors = validateLocation(loc);
          if (validationErrors.length > 0) {
            results.errors.push(`Row ${index + 1} (${loc.id || 'Unknown'}): ${validationErrors[0].message}`);
            results.skipped++;
            return;
          }

          const existingIndex = updatedList.findIndex(item => item.id === loc.id || item.slug === loc.slug);
          
          const now = new Date().toISOString();
          const cleanLoc = {
            ...loc,
            updatedAt: now,
            createdAt: loc.createdAt || now
          };

          if (existingIndex > -1) {
            updatedList[existingIndex] = cleanLoc;
            results.updated++;
          } else {
            updatedList.push(cleanLoc);
            results.added++;
          }
        });

        if (results.errors.length < importedLocations.length) {
          if (confirm(`Import Summary:\n- Added: ${results.added}\n- Updated: ${results.updated}\n- Errors: ${results.errors.length}\n\nProceed with saving changes?`)) {
            // Save to storage using store method
            LocationStore.saveAll(updatedList);
          } else {
            results.skipped = results.added + results.updated;
            results.added = 0;
            results.updated = 0;
          }
        }

        setSummary(results);
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
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Bulk Data Tools</h3>
          <p className="text-sm text-slate-500 mt-1">Import or export your campus location points as JSON</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleDownloadTemplate}
            className="h-10 px-4 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition"
          >
            📄 Template
          </button>
          <button
            onClick={handleExport}
            className="h-10 px-4 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition"
          >
            📤 Export JSON
          </button>
          <label className="h-10 px-6 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center justify-center cursor-pointer hover:bg-black transition shadow-sm active:scale-95">
            📥 Import JSON
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
        <div className={`p-4 rounded-xl border ${summary.errors.length > 0 ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Import Result</h4>
            <button onClick={() => setSummary(null)} className="text-slate-400 hover:text-slate-600">×</button>
          </div>
          <div className="flex gap-6 mb-3">
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">{summary.added}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase">Added</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600">{summary.updated}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase">Updated</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-amber-600">{summary.skipped}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase">Skipped</div>
            </div>
          </div>
          {summary.errors.length > 0 && (
            <div className="mt-4 pt-4 border-t border-red-100">
              <p className="text-xs font-bold text-red-700 mb-2">Errors ({summary.errors.length}):</p>
              <ul className="text-[11px] text-red-600 list-disc pl-4 space-y-1 max-h-40 overflow-y-auto">
                {summary.errors.map((err, idx) => <li key={idx}>{err}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
