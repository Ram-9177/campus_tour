import React, { useState } from 'react';
import type { CampusLocation } from '@/types/campusLocation';
import LanguageTabs from './LanguageTabs';
import MediaUrlEditor from './MediaUrlEditor';
import AudioUrlEditor from './AudioUrlEditor';

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
  const audioData = data.audio || { en: '', te: '', hi: '' };

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
            
            <div className="mb-4 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
              <h4 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-tight text-blue-800">
                <span>💡</span> Default Script Guidance
              </h4>
              <p className="mt-2 text-xs leading-relaxed text-slate-700">
                The default script is used when no mode-specific variant is provided. 
                Keep it <strong>versatile, direct, and factual</strong>.
              </p>
              <div className="mt-3 border-t border-blue-100 pt-3">
                 <p className="text-[10px] font-bold text-blue-900/60 uppercase tracking-widest">
                   🚫 Institutional Rules: No fake claims, No rankings, No guaranteed placements, No fake fees.
                 </p>
              </div>
            </div>

            <div className="relative">
              <textarea
                value={scriptText}
                onChange={(e) => updateField('script', activeLang, e.target.value)}
                className={`w-full h-80 p-4 rounded-xl border text-sm focus:ring-2 outline-hidden resize-none font-serif leading-relaxed ${
                  scriptText.length > SCRIPT_MAX_CHARS ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-blue-500'
                }`}
                placeholder="Write the narration script here. This text is paired with the uploaded audio file for the same language."
              />
            </div>
            {!scriptText && (
              <p className="text-[10px] text-amber-600 font-medium mt-1 italic">
                ⚠️ Missing script: The app won't be able to provide an audio guide for this location.
              </p>
            )}
            {scriptText && (
              <p className="text-[10px] text-slate-400 font-medium mt-2 flex items-center gap-1">
                <span>ℹ️</span>
                Upload the matching audio file URL below. The script is shown for editor reference only.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Audio File URLs</h4>
              <p className="mt-1 text-xs leading-5 text-slate-600">
                These uploaded audio files are the primary playback source for the public PWA.
              </p>
            </div>

            <AudioUrlEditor audio={audioData} onChange={(audio) => onChange({ ...data, audio })} lang={activeLang} />
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
            <div className="bg-white p-4 rounded-xl border border-slate-100 min-h-25 text-sm text-slate-700 leading-relaxed italic">
              {scriptText || <span className="text-slate-300 italic">No script content entered for {activeLang.toUpperCase()}.</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

