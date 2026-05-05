import React, { useState } from 'react';
import type { CampusLocation } from '@/types/campusLocation';
import LanguageTabs from './LanguageTabs';
import MediaUrlEditor from './MediaUrlEditor';

interface Props {
  data: Partial<CampusLocation>;
  onChange: (data: Partial<CampusLocation>) => void;
}

const SCRIPT_MAX_CHARS = 2500;

export default function LocationContentEditor({ data, onChange }: Props) {
  const [activeLang, setActiveLang] = useState<'en' | 'te' | 'hi'>('en');

  const updateField = (field: 'description' | 'script', lang: 'en' | 'te' | 'hi', val: any) => {
    const current = data[field] || { en: '', te: '', hi: '' };
    onChange({
      ...data,
      [field]: { ...current, [lang]: val }
    });
  };

  const hasContent = {
    en: !!data.description?.en && !!data.script?.en,
    te: !!data.description?.te && !!data.script?.te,
    hi: !!data.description?.hi && !!data.script?.hi,
  };

  const scriptText = data.script?.[activeLang] || '';

  return (
    <div className="space-y-6">
      <LanguageTabs 
        activeLang={activeLang} 
        onLangChange={setActiveLang} 
        hasContent={hasContent} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Script and Description */}
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
              Short Description ({activeLang.toUpperCase()})
            </label>
            <textarea
              value={data.description?.[activeLang] || ''}
              onChange={(e) => updateField('description', activeLang, e.target.value)}
              className="w-full h-24 p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-hidden resize-none"
              placeholder={`Enter brief description in ${activeLang === 'en' ? 'English' : activeLang === 'te' ? 'Telugu' : 'Hindi'}...`}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-500 uppercase">
                Tour Script / Audio Guide ({activeLang.toUpperCase()})
              </label>
              <span className={`text-[10px] font-bold ${scriptText.length > SCRIPT_MAX_CHARS ? 'text-red-600' : 'text-slate-400'}`}>
                {scriptText.length} / {SCRIPT_MAX_CHARS}
              </span>
            </div>
            <div className="relative">
              <textarea
                value={scriptText}
                onChange={(e) => updateField('script', activeLang, e.target.value)}
                className={`w-full h-80 p-4 rounded-xl border text-sm focus:ring-2 outline-hidden resize-none font-serif leading-relaxed ${
                  scriptText.length > SCRIPT_MAX_CHARS ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-blue-500'
                }`}
                placeholder="Write the narration script here. The PWA will automatically read this text aloud using AI voice."
              />
              <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 shadow-sm pointer-events-none">
                <span className="text-[10px] font-bold uppercase tracking-wider">AI Audio Enabled</span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
              </div>
            </div>
            {!scriptText && (
              <p className="text-[10px] text-amber-600 font-medium mt-1 italic">
                ⚠️ Missing script: The app won't be able to provide an audio guide for this location.
              </p>
            )}
            {scriptText && (
              <p className="text-[10px] text-slate-400 font-medium mt-2 flex items-center gap-1">
                <span>ℹ️</span>
                Audio is automatically generated from the script above. No MP3 upload needed.
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Global Media & Previews */}
        <div className="space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <h4 className="text-sm font-bold text-slate-800 uppercase mb-4">Location Media (Global)</h4>
          
          <MediaUrlEditor
            label="Image Gallery URLs"
            urls={data.images || []}
            onChange={(images) => onChange({ ...data, images })}
            type="image"
          />

          <MediaUrlEditor
            label="Video URLs"
            urls={data.videos || []}
            onChange={(videos) => onChange({ ...data, videos })}
            type="video"
            placeholder="https://www.youtube.com/watch?v=..."
          />

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Virtual 360 Tour URL</label>
            <input
              type="text"
              value={data.virtual360Url || ''}
              onChange={(e) => onChange({ ...data, virtual360Url: e.target.value })}
              className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-hidden font-mono"
              placeholder="/virtual360/main-gate"
            />
          </div>

          <div className="pt-4 border-t border-slate-200">
            <h5 className="text-[10px] font-bold text-slate-400 uppercase mb-2">Voice Guide Preview</h5>
            <div className="bg-white p-4 rounded-xl border border-slate-100 min-h-[100px] text-sm text-slate-700 leading-relaxed italic">
              {scriptText || <span className="text-slate-300 italic">No script content entered for {activeLang.toUpperCase()}.</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

