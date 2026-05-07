'use client';

import React from 'react';

interface Props {
  script?: string;
  language: string;
}

export default function LocationScriptBlock({ script, language }: Props) {
  return (
    <div className="rounded-3xl border-2 border-slate-100 bg-slate-50/50 p-6 shadow-xs">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-[11px] font-black uppercase tracking-widest text-slate-400">
          Guided Narration
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-black text-slate-500 uppercase tracking-wider">
          {language}
        </div>
      </div>

      <p className="text-[1.05rem] font-medium leading-relaxed text-slate-700">
        {script}
      </p>

      {script && script.length > 50 && (
        <div className="mt-5 flex items-center gap-2 text-xs font-bold text-blue-600">
          <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          Script verified for audio playback.
        </div>
      )}
    </div>
  );
}
