'use client';

import React, { useState } from 'react';
import type { CampusLocation, LocationContent } from '@/types/campusLocation';
import LanguageTabs from './LanguageTabs';
import AudioUrlEditor from './AudioUrlEditor';

interface Props {
  data: Partial<CampusLocation>;
  onChange: (data: Partial<CampusLocation>) => void;
}

type VariantKey = 'physical' | 'virtual' | 'buggy';

const VARIANT_LABELS: Record<VariantKey, string> = {
  physical: 'Physical Tour (Walk/Own Vehicle)',
  virtual: 'Virtual Tour (Remote)',
  buggy: 'Buggy Tour (Campus Vehicle)'
};

const VARIANT_GUIDANCE: Record<VariantKey, string> = {
  physical: 'Tone: Visitor is standing near the point. Focus on arrival and immediate surroundings. Use "You are now at..."',
  virtual: 'Tone: Remote storytelling. admissions-focused, confidence-building. Use "This is..."',
  buggy: 'Tone: Moving vehicle style. Short, direction-style narration. Use "On your left/right..." or "The next stop is..."'
};

const DEFAULT_I18N_TEXT = { en: '', te: '', hi: '' };
const DEFAULT_I18N_MEDIA = { en: '', te: '', hi: '' };

export default function LocationVariantEditor({ data, onChange }: Props) {
  const [activeVariant, setActiveVariant] = useState<VariantKey>('physical');
  const [activeLang, setActiveLang] = useState<'en' | 'te' | 'hi'>('en');

  const updateVariantField = (field: 'description' | 'script', val: string) => {
    const variants = data.contentVariants || {};
    const variant = variants[activeVariant] || { description: DEFAULT_I18N_TEXT, script: DEFAULT_I18N_TEXT, audio: DEFAULT_I18N_MEDIA };
    
    const updatedVariant = {
      ...variant,
      [field]: { ...variant[field], [activeLang]: val }
    };

    onChange({
      ...data,
      contentVariants: {
        ...variants,
        [activeVariant]: updatedVariant
      }
    });
  };

  const updateVariantAudio = (audio: any) => {
    const variants = data.contentVariants || {};
    const variant = variants[activeVariant] || { description: DEFAULT_I18N_TEXT, script: DEFAULT_I18N_TEXT, audio: DEFAULT_I18N_MEDIA };

    onChange({
      ...data,
      contentVariants: {
        ...variants,
        [activeVariant]: { ...variant, audio }
      }
    });
  };

  const currentVariant = data.contentVariants?.[activeVariant];
  const scriptText = currentVariant?.script?.[activeLang] || '';
  const audioData = currentVariant?.audio || DEFAULT_I18N_MEDIA;

  return (
    <div className="space-y-6">
      <div className="flex border-b border-slate-200">
        {(['physical', 'virtual', 'buggy'] as VariantKey[]).map((v) => (
          <button
            key={v}
            onClick={() => setActiveVariant(v)}
            className={`px-4 py-2 text-sm font-bold transition-all border-b-2 ${
              activeVariant === v ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)} Content
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
        <h4 className="text-[11px] font-black uppercase tracking-tight text-blue-800 flex items-center gap-2">
          <span>💡</span> {VARIANT_LABELS[activeVariant]} Guidance
        </h4>
        <p className="mt-1 text-xs text-slate-700 leading-relaxed">
          {VARIANT_GUIDANCE[activeVariant]}
        </p>
      </div>

      <LanguageTabs 
        activeLang={activeLang} 
        onLangChange={setActiveLang} 
        hasContent={{
          en: !!currentVariant?.description?.en && !!currentVariant?.script?.en,
          te: !!currentVariant?.description?.te && !!currentVariant?.script?.te,
          hi: !!currentVariant?.description?.hi && !!currentVariant?.script?.hi,
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
              Variant Description ({activeLang.toUpperCase()})
            </label>
            <textarea
              value={currentVariant?.description?.[activeLang] || ''}
              onChange={(e) => updateVariantField('description', e.target.value)}
              className="w-full h-24 p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-hidden resize-none"
              placeholder={`Description for ${activeVariant} mode...`}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-500 uppercase">
                Variant Script ({activeLang.toUpperCase()})
              </label>
              <span className={`text-[10px] font-bold ${scriptText.length > 2500 ? 'text-red-600' : 'text-slate-400'}`}>
                {scriptText.length} / 2500
              </span>
            </div>
            <textarea
              value={scriptText}
              onChange={(e) => updateVariantField('script', e.target.value)}
              className={`w-full h-64 p-4 rounded-xl border text-sm focus:ring-2 outline-hidden resize-none font-serif leading-relaxed ${
                scriptText.length > 2500 ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-blue-500'
              }`}
              placeholder={`Write ${activeVariant} script...`}
            />
          </div>
        </div>

        <div className="space-y-6">
           <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <h4 className="text-sm font-bold text-slate-900 uppercase mb-4">Variant Audio</h4>
              <AudioUrlEditor audio={audioData} onChange={updateVariantAudio} lang={activeLang} />
           </div>
        </div>
      </div>
    </div>
  );
}
