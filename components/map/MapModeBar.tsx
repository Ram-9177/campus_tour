import React from 'react';

type Mode = 'standard' | 'terrain' | 'satellite';

type Props = {
  mode: Mode;
  onChange: (m: Mode) => void;
};

const MODE_LIST: Array<{ key: Mode; label: string; emoji: string }> = [
  { key: 'standard', label: 'Standard', emoji: '🗺' },
  { key: 'terrain', label: 'Terrain', emoji: '⛰' },
  { key: 'satellite', label: 'Satellite', emoji: '📡' },
];

export default function MapModeBar({ mode, onChange }: Props) {
  return (
    <div className="flex gap-1.5 bg-white rounded-lg border border-slate-300 shadow-sm p-1">
      {MODE_LIST.map((m) => (
        <button
          key={m.key}
          type="button"
          onClick={() => onChange(m.key)}
          title={m.label}
          className={`h-9 px-3 inline-flex items-center justify-center gap-1.5 rounded-md text-xs font-semibold transition-all ${
            mode === m.key 
              ? 'bg-[#0b57d0] text-white shadow-md' 
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <span>{m.emoji}</span>
          <span className="hidden sm:inline">{m.label}</span>
        </button>
      ))}
    </div>
  );
}
