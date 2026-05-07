'use client';

import { useEffect, useMemo, useState } from 'react';
import type { CampusLocation } from '@/types/campusLocation';
import audioEngine from '@/lib/audioGuideEngine';
import { resolveLocationExperience } from '@/lib/locationExperienceResolver';
import { useTourSession } from '@/hooks/useTourSession';
import AdmissionsCTASection from '@/components/location/AdmissionsCTASection';

type Language = 'en' | 'te' | 'hi';

interface VirtualLocationPanelProps {
  location: CampusLocation;
  language: Language;
  currentIndex: number;
  totalLocations: number;
}

export default function VirtualLocationPanel({
  location,
  language,
  currentIndex,
  totalLocations,
}: VirtualLocationPanelProps) {
  const { session } = useTourSession();
  const [imageIndex, setImageIndex] = useState(0);

  const exp = useMemo(() => {
    return resolveLocationExperience({
      location,
      mode: session?.navigationMode || 'virtual_tour',
      language
    });
  }, [location, session, language]);

  const images = exp.images.length > 0 ? exp.images : ['/images/location-fallback.svg'];
  const activeImage = images[Math.min(imageIndex, images.length - 1)] || '/images/location-fallback.svg';

  // Keep audio source aligned with selected location and language.
  useEffect(() => {
    audioEngine.setLanguage(language);
    audioEngine.loadLocation(location);
  }, [location, language]);

  useEffect(() => {
    setImageIndex(0);
  }, [location.id]);

  const handlePrevImage = () => {
    setImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNextImage = () => {
    setImageIndex((prev) => (prev + 1) % images.length);
  };

  const isPlayableVideo = (url: string | null) => {
    if (!url) return false;
    return url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg');
  };

  return (
    <div className="space-y-6">
      <div className="group relative flex aspect-video items-center justify-center overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-[0_20px_44px_-30px_rgba(15,23,42,0.4)]">
        <img
          src={activeImage}
          alt={`${exp.title} gallery ${imageIndex + 1}`}
          className="absolute inset-0 h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.src = '/images/location-fallback.svg';
          }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-900/70 via-transparent to-transparent" />

        {images.length > 1 ? (
          <>
            <button
              type="button"
              onClick={handlePrevImage}
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/80 bg-white/95 px-3 py-1.5 text-sm font-semibold text-slate-800 hover:bg-white"
            >
              Prev
            </button>
            <button
              type="button"
              onClick={handleNextImage}
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/80 bg-white/95 px-3 py-1.5 text-sm font-semibold text-slate-800 hover:bg-white"
            >
              Next
            </button>
          </>
        ) : null}

        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent flex flex-col justify-end p-6">
          <div className="mb-3">
            <span className="mb-2 inline-block rounded-full bg-blue-600/90 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
              {location.category}
            </span>
            <span className="ml-2 inline-block rounded-full border border-slate-500 bg-slate-900/70 px-2.5 py-1 text-xs font-medium text-white">
              {imageIndex + 1}/{images.length}
            </span>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white drop-shadow-lg sm:text-4xl">{exp.title}</h2>
        </div>
      </div>

      {images.length > 1 ? (
        <div className="grid grid-cols-4 gap-2">
          {images.map((img, idx) => (
            <button
              type="button"
              key={`${img}-${idx}`}
              onClick={() => setImageIndex(idx)}
              className={`overflow-hidden rounded-lg border transition ${
                idx === imageIndex ? 'border-blue-400 ring-2 ring-blue-500/40' : 'border-slate-700'
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="h-20 w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/images/location-fallback.svg';
                }}
              />
            </button>
          ))}
        </div>
      ) : null}

      {/* Admissions USPs */}
      {exp.uspTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
           {exp.uspTags.map(tag => (
             <span key={tag} className="bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-blue-100">
               {tag}
             </span>
           ))}
        </div>
      )}

      {exp.videos.length > 0 ? (
        <div className="panel-soft p-4 shadow-sm">
          <div className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600">Campus Video</div>
          {isPlayableVideo(exp.videos[0]) ? (
            <video className="w-full rounded-lg border border-slate-200 bg-black" controls preload="metadata">
              <source src={exp.videos[0]} />
              Your browser does not support the video tag.
            </video>
          ) : (
            <a
              href={exp.videos[0]}
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Open Video
            </a>
          )}
        </div>
      ) : null}

      <div className="panel-soft p-6 shadow-sm">
        <div className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600">
          Location Details
        </div>
        <p className="mb-4 text-lg font-medium leading-relaxed text-slate-800">
          {exp.description}
        </p>

        {/* Storytelling Blocks */}
        {(exp.parentTrustPoints.length > 0 || exp.studentHighlights.length > 0) && (
          <div className="grid grid-cols-1 gap-3 mb-6">
             {exp.parentTrustPoints.map((p, i) => (
               <div key={i} className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl text-sm font-bold text-emerald-800 border border-emerald-100">
                  <span className="shrink-0 text-xl">🛡️</span> {p}
               </div>
             ))}
             {exp.studentHighlights.map((p, i) => (
               <div key={i} className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl text-sm font-bold text-blue-800 border border-blue-100">
                  <span className="shrink-0 text-xl">✨</span> {p}
               </div>
             ))}
          </div>
        )}

        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="mb-2 text-xs font-black uppercase tracking-widest text-slate-400">
            Guided Narration
          </div>
          <p className="text-base leading-relaxed text-slate-700">
            {exp.script}
          </p>
        </div>

        {/* CTAs */}
        <AdmissionsCTASection cta={exp.admissionsCta} />
      </div>

      <div className="mt-8 pb-4 text-center text-sm text-slate-500">
        <div>Step {currentIndex + 1} of {totalLocations} in your virtual journey</div>
        <div className="mt-2">Use Previous and Next to continue.</div>
      </div>
    </div>
  );
}
