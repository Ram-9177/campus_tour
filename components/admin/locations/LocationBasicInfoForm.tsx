import React from 'react';
import type { CampusLocation, CampusLocationCategory } from '@/types/campusLocation';

interface Props {
  data: Partial<CampusLocation>;
  onChange: (data: Partial<CampusLocation>) => void;
}

const CATEGORIES: CampusLocationCategory[] = [
  'gate', 'admin', 'academic', 'library', 'hostel', 'food', 'sports', 'rehab', 'parking', 'facility', 'viewpoint', 'transport', 'garden', 'other'
];

export default function LocationBasicInfoForm({ data, onChange }: Props) {
  const updateName = (lang: 'en' | 'te' | 'hi', val: string) => {
    onChange({
      ...data,
      name: { ...(data.name || { en: '', te: '', hi: '' }), [lang]: val }
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Name (English) *</label>
          <input
            type="text"
            value={data.name?.en || ''}
            onChange={(e) => updateName('en', e.target.value)}
            className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-hidden text-sm"
            placeholder="Main Gate"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Name (Telugu)</label>
          <input
            type="text"
            value={data.name?.te || ''}
            onChange={(e) => updateName('te', e.target.value)}
            className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-hidden text-sm"
            placeholder="ప్రధాన ద్వారం"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Name (Hindi)</label>
          <input
            type="text"
            value={data.name?.hi || ''}
            onChange={(e) => updateName('hi', e.target.value)}
            className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-hidden text-sm"
            placeholder="मुख्य द्वार"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Slug (URL identifier) *</label>
          <input
            type="text"
            value={data.slug || ''}
            onChange={(e) => onChange({ ...data, slug: e.target.value })}
            className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-hidden text-sm font-mono"
            placeholder="main-gate"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category *</label>
          <select
            value={data.category || ''}
            onChange={(e) => onChange({ ...data, category: e.target.value as CampusLocationCategory })}
            className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-hidden text-sm"
          >
            <option value="">Select Category</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
        <input
          type="checkbox"
          id="active"
          checked={data.active || false}
          onChange={(e) => onChange({ ...data, active: e.target.checked })}
          className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="active" className="text-sm font-semibold text-slate-700">
          Mark as Active (Visible on Public Map)
        </label>
      </div>
    </div>
  );
}
