import React from 'react';
import type { CampusLocation } from '@/types/campusLocation';

interface Props {
  data: Partial<CampusLocation>;
  onChange: (data: Partial<CampusLocation>) => void;
}

export default function LocationCoordinateForm({ data, onChange }: Props) {
  const handleChange = (field: keyof CampusLocation, val: string) => {
    const numVal = val === '' ? undefined : parseFloat(val);
    onChange({ ...data, [field]: numVal });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Latitude *</label>
          <input
            type="number"
            step="0.000001"
            value={data.latitude ?? ''}
            onChange={(e) => handleChange('latitude', e.target.value)}
            className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-hidden text-sm font-mono"
            placeholder="17.36756"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Longitude *</label>
          <input
            type="number"
            step="0.000001"
            value={data.longitude ?? ''}
            onChange={(e) => handleChange('longitude', e.target.value)}
            className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-hidden text-sm font-mono"
            placeholder="78.47455"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Map Point ID (Optional)</label>
          <input
            type="text"
            value={data.mapPointId || ''}
            onChange={(e) => onChange({ ...data, mapPointId: e.target.value })}
            className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-hidden text-sm font-mono"
            placeholder="stop-main-gate"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Canvas X (Optional)</label>
          <input
            type="number"
            value={data.x ?? ''}
            onChange={(e) => handleChange('x', e.target.value)}
            className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-hidden text-sm font-mono"
            placeholder="851"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Canvas Y (Optional)</label>
          <input
            type="number"
            value={data.y ?? ''}
            onChange={(e) => handleChange('y', e.target.value)}
            className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-hidden text-sm font-mono"
            placeholder="153"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Route Order</label>
        <input
          type="number"
          value={data.routeOrder ?? ''}
          onChange={(e) => handleChange('routeOrder', e.target.value)}
          className="w-24 h-11 px-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-hidden text-sm font-mono"
          placeholder="1"
        />
        <p className="text-[10px] text-slate-500 mt-1">Numerical order for the guided tour.</p>
      </div>
    </div>
  );
}
