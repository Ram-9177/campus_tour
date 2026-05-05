'use client';

import React from 'react';

interface Props {
  script?: string;
  language: string;
}

export default function LocationScriptBlock({ script, language }: Props) {
  const hasScript = !!script && script.trim().length > 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-inner">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
          Guided Narration
        </div>
        <div className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[9px] font-bold text-slate-500">
          {language.toUpperCase()}
        </div>
      </div>
      
      <p className={`text-sm leading-relaxed ${hasScript ? 'text-slate-700 italic' : 'text-slate-400 font-medium'}`}>
        {hasScript ? script : `Content coming soon in selected language`}
      </p>

      {hasScript && (
        <div className="mt-4 flex items-center gap-2">
          <div className="flex gap-0.5">
            {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-blue-400/40" />)}
          </div>
          <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">Script Active</span>
        </div>
      )}
    </div>
  );
}
