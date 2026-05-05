import React from 'react';

interface Props {
  activeLang: 'en' | 'te' | 'hi';
  onLangChange: (lang: 'en' | 'te' | 'hi') => void;
  hasContent: Record<'en' | 'te' | 'hi', boolean>;
}

export default function LanguageTabs({ activeLang, onLangChange, hasContent }: Props) {
  const langs = [
    { id: 'en', label: 'English', flag: '🇬🇧' },
    { id: 'te', label: 'Telugu', flag: '🇮🇳' },
    { id: 'hi', label: 'Hindi', flag: '🇮🇳' },
  ] as const;

  return (
    <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-4">
      {langs.map((lang) => (
        <button
          key={lang.id}
          onClick={() => onLangChange(lang.id)}
          className={`flex-1 flex items-center justify-center gap-2 h-10 rounded-lg text-sm font-bold transition-all ${
            activeLang === lang.id
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <span>{lang.flag}</span>
          <span>{lang.label}</span>
          {!hasContent[lang.id] && (
            <span className="w-2 h-2 rounded-full bg-amber-400" title="Missing content"></span>
          )}
        </button>
      ))}
    </div>
  );
}
