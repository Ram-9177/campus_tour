import React from 'react';
import type { CampusLocation } from '@/types/campusLocation';
import { LocationStore } from '@/lib/locationStore';

interface AdminLocationCardProps {
  location: CampusLocation;
  onRefresh: () => void;
  onEdit: (location: CampusLocation) => void;
  onDuplicate: (location: CampusLocation) => void;
}

export default function AdminLocationCard({ location, onRefresh, onEdit, onDuplicate }: AdminLocationCardProps) {
  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${location.name.en}"?`)) {
      LocationStore.deleteLocation(location.id);
      onRefresh();
    }
  };

  const handleToggleActive = () => {
    LocationStore.toggleLocationActive(location.id);
    onRefresh();
  };

  const hasTe = !!location.name.te && !!location.description.te && !!location.script.te;
  const hasHi = !!location.name.hi && !!location.description.hi && !!location.script.hi;

  return (
    <div className={`rounded-xl border bg-white p-4 shadow-sm transition-all ${location.active ? 'border-slate-200' : 'border-slate-200 opacity-75'}`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-slate-900">{location.name.en}</h3>
            {!location.active && (
              <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">INACTIVE</span>
            )}
          </div>
          <p className="text-xs text-slate-500 font-mono line-clamp-1">{location.slug}</p>
        </div>
        <span className="rounded-lg bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700 uppercase shrink-0">
          {location.category}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-4">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-0.5">Coordinates</div>
          <div className="text-xs text-slate-700 font-mono">
            {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-0.5">Radius / Order</div>
          <div className="text-xs text-slate-700">
            {location.radiusMeters}m / #{location.routeOrder}
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-0.5">Languages</div>
          <div className="flex gap-1">
            <span className="text-[9px] font-bold bg-green-100 text-green-700 px-1 rounded">EN</span>
            <span className={`text-[9px] font-bold px-1 rounded ${hasTe ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'}`}>TE</span>
            <span className={`text-[9px] font-bold px-1 rounded ${hasHi ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'}`}>HI</span>
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-0.5">Media</div>
          <div className="text-xs text-slate-700 flex gap-2">
            <span title="Images">🖼️ {location.images.length}</span>
            <span title="Videos">🎬 {location.videos.length}</span>
            <span title="Audio">🔊 {Object.keys(location.audio).filter(k => !!(location.audio as any)[k]).length}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-slate-50 pt-3">
        <button
          onClick={() => onEdit(location)}
          className="flex-1 h-9 rounded-lg border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onDuplicate(location)}
          className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
          title="Duplicate"
        >
          👯
        </button>
        <button
          onClick={handleToggleActive}
          className={`h-9 px-3 rounded-lg text-xs font-semibold transition-colors ${location.active ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}
        >
          {location.active ? 'Deactivate' : 'Activate'}
        </button>
        <button
          onClick={handleDelete}
          className="h-9 w-9 flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
          title="Delete"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
