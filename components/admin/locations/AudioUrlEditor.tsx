import React from 'react';
import type { CampusLocationI18nMedia } from '@/types/campusLocation';

interface Props {
  audio: CampusLocationI18nMedia;
  onChange: (audio: CampusLocationI18nMedia) => void;
  lang: 'en' | 'te' | 'hi';
}

export default function AudioUrlEditor({ audio, onChange, lang }: Props) {
  const currentVal = audio[lang] || '';

  const handleChange = (val: string) => {
    onChange({ ...audio, [lang]: val });
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-slate-500 uppercase">
        Audio URL / File Path ({lang.toUpperCase()})
      </label>
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔊</span>
          <input
            type="text"
            value={currentVal}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-hidden font-mono"
            placeholder={`/audio/locations/main-gate-${lang}.mp3`}
          />
        </div>
      </div>
      {!currentVal && (
        <p className="text-[10px] text-amber-600 font-medium">
          ⚠️ Missing audio: Public PWA will show "Audio coming soon".
        </p>
      )}
    </div>
  );
}
