import React from 'react';
import type { CampusLocation, CampusLocationCategory } from '@/types/campusLocation';

interface Props {
  data: Partial<CampusLocation>;
  onChange: (data: Partial<CampusLocation>) => void;
}

const CATEGORY_DEFAULTS: Record<string, number> = {
  gate: 35,
  admin: 30,
  academic: 30,
  library: 30,
  hostel: 30,
  food: 20,
  sports: 25,
  rehab: 40,
  parking: 20,
  facility: 20,
  viewpoint: 15,
  transport: 20,
  garden: 25,
  other: 20
};

export default function LocationRadiusForm({ data, onChange }: Props) {
  const applyDefault = () => {
    if (data.category && CATEGORY_DEFAULTS[data.category]) {
      onChange({ ...data, radiusMeters: CATEGORY_DEFAULTS[data.category] });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-end gap-4">
        <div className="flex-1">
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Radius (Meters) *</label>
          <input
            type="number"
            min="5"
            max="100"
            value={data.radiusMeters ?? ''}
            onChange={(e) => onChange({ ...data, radiusMeters: parseInt(e.target.value) || undefined })}
            className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-hidden text-sm font-mono"
            placeholder="30"
          />
        </div>
        <button
          type="button"
          onClick={applyDefault}
          disabled={!data.category}
          className="h-11 px-4 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Use Default for Category
        </button>
      </div>

      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
        <h4 className="text-xs font-bold text-slate-700 uppercase mb-2">Guide for Radius</h4>
        <ul className="text-xs text-slate-500 space-y-1 list-disc pl-4">
          <li><strong>Gates / Building Entrance:</strong> 30m - 35m</li>
          <li><strong>Academic Blocks:</strong> 30m</li>
          <li><strong>Facilities (Canteen/Gym):</strong> 20m - 25m</li>
          <li><strong>Small Points (ATM/Viewpoint):</strong> 15m</li>
        </ul>
      </div>
    </div>
  );
}
