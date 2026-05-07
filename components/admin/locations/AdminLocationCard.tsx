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
    <div className={`rounded-2xl border bg-white p-5 shadow-sm transition-all ${location.active ? 'border-slate-200' : 'border-slate-200 opacity-80'}`}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900">{location.name.en}</h3>
            {!location.active && (
              <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">Inactive</span>
            )}
          </div>
          <p className="line-clamp-1 font-mono text-sm text-slate-500">{location.slug}</p>
        </div>
        <span className="shrink-0 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold uppercase text-blue-700">
          {location.category}
        </span>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-x-4 gap-y-3">
        <div>
          <div className="mb-0.5 text-xs font-bold uppercase tracking-wide text-slate-500">Coordinates</div>
          <div className="font-mono text-sm text-slate-700">
            {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
          </div>
        </div>
        <div>
          <div className="mb-0.5 text-xs font-bold uppercase tracking-wide text-slate-500">Radius / Order</div>
          <div className="text-sm text-slate-700">
            {location.radiusMeters}m / #{location.routeOrder}
          </div>
        </div>
        <div>
          <div className="mb-0.5 text-xs font-bold uppercase tracking-wide text-slate-500">Languages</div>
          <div className="flex gap-1">
            <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">EN</span>
            <span className={`rounded px-2 py-0.5 text-xs font-bold ${hasTe ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>TE</span>
            <span className={`rounded px-2 py-0.5 text-xs font-bold ${hasHi ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>HI</span>
          </div>
        </div>
        <div>
          <div className="mb-0.5 text-xs font-bold uppercase tracking-wide text-slate-500">Media</div>
          <div className="flex gap-3 text-sm text-slate-700">
            <span>Images: {location.images.length}</span>
            <span>Videos: {location.videos.length}</span>
            <span>Audio: {Object.keys(location.audio).filter((k) => !!(location.audio as any)[k]).length}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
        <button
          onClick={() => onEdit(location)}
          className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
        >
          Edit
        </button>
        <button
          onClick={() => onDuplicate(location)}
          className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
        >
          Duplicate
        </button>
        <button
          onClick={handleToggleActive}
          className={`h-10 rounded-xl px-4 text-sm font-semibold transition-colors ${location.active ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}
        >
          {location.active ? 'Deactivate' : 'Activate'}
        </button>
        <button
          onClick={handleDelete}
          className="h-10 rounded-xl bg-red-50 px-4 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
