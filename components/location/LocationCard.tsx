import React from 'react';
import LocationMediaGallery from './LocationMediaGallery';
import audioEngine from '@/lib/audioGuideEngine';
import type { CampusLocation } from '@/types/campusLocation';

type Props = {
  location: CampusLocation;
  language?: 'en' | 'te' | 'hi';
};

export default function LocationCard({ location, language = 'en' }: Props) {
  const description = location.description[language] || 'Content coming soon in selected language.';
  const script = location.script[language] || 'Content coming soon in selected language.';

  const [audioState, setAudioState] = React.useState(audioEngine.getState());

  React.useEffect(() => {
    const unsub = audioEngine.subscribe(setAudioState);
    return unsub;
  }, []);

  const isAudioAvailable = audioState.isAvailable && audioState.currentLocation?.id === location.id;

  return (
    <div className="flex flex-col gap-4">
      {/* Header with title and category */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-slate-900 leading-tight">{location.name[language] || location.name.en}</h3>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="inline-block px-2.5 py-1 rounded-lg bg-blue-100 text-blue-900 text-xs font-semibold uppercase">
              {location.category}
            </span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {language}
            </span>
          </div>
        </div>
      </div>

      {/* Media gallery */}
      <LocationMediaGallery 
        images={location.images} 
        videos={location.videos} 
        virtual360Url={location.virtual360Url} 
      />

      {/* Description */}
      <p className="text-sm text-slate-700 leading-relaxed">{description}</p>

      {/* Editable guide script (from Admin Audio) */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Narration Script</div>
        <p className="text-sm italic text-slate-700 leading-relaxed whitespace-pre-wrap">{script}</p>
      </div>

      {/* Audio button */}
      <div className="space-y-2">
        <button 
          type="button" 
          onClick={() => { audioEngine.registerUserGesture(); audioEngine.play(); }} 
          disabled={!isAudioAvailable}
          className={`h-12 w-full inline-flex items-center justify-center gap-3 rounded-xl px-4 text-sm font-bold text-white transition-all active:scale-95 shadow-[0_4px_12px_rgba(11,87,208,0.2)] ${
            isAudioAvailable 
              ? 'bg-linear-to-r from-[#0b57d0] to-[#0a4cc0] hover:shadow-lg' 
              : 'bg-slate-400 cursor-not-allowed opacity-50'
          }`}
        >
          <span className="text-lg">🎙</span>
          <span>{audioState.isLoading ? 'Loading Audio...' : 'Play Audio Guide'}</span>
        </button>
        {!isAudioAvailable && !audioState.isLoading && (
          <p className="text-[10px] text-center text-amber-600 font-medium italic">
            Audio coming soon.
          </p>
        )}
      </div>
    </div>
  );
}
