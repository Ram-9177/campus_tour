'use client';

import React, { useMemo } from 'react';
import type { CampusLocation } from '@/types/campusLocation';
import LocationMediaGallery from './LocationMediaGallery';
import LocationScriptBlock from './LocationScriptBlock';
import LocationActions from './LocationActions';
import AdmissionsCTASection from './AdmissionsCTASection';
import { useTourSession } from '@/hooks/useTourSession';
import { resolveLocationExperience } from '@/lib/locationExperienceResolver';

interface Props {
  location: CampusLocation;
  language: 'en' | 'te' | 'hi';
}

export default function LocationExperienceCard({ location, language }: Props) {
  const { session } = useTourSession();
  
  const exp = useMemo(() => {
    return resolveLocationExperience({
      location,
      mode: session?.navigationMode || 'manual_explore',
      language
    });
  }, [location, session, language]);

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Point Name & 2. Category */}
      <div>
        <div className="mb-2 flex items-center gap-2">
          <span className="rounded-lg border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-black uppercase tracking-wide text-blue-700">
            {location.category}
          </span>
          {exp.missingAudio && (
            <span className="rounded-lg border border-amber-100 bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-700">
               Audio Coming Soon
            </span>
          )}
        </div>
        <h3 className="text-3xl font-black leading-tight text-slate-900 tracking-tight">
          {exp.title}
        </h3>
      </div>

      {/* 3. Hero Image/Gallery */}
      <LocationMediaGallery 
        images={exp.images} 
        videos={exp.videos} 
        virtual360Url={exp.virtual360Url} 
      />

      {/* 4. Short USP description */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-lg font-medium leading-relaxed text-slate-800">
          {exp.description}
        </p>
        {exp.uspTags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
             {exp.uspTags.map(tag => (
               <span key={tag} className="bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-slate-200">
                 {tag}
               </span>
             ))}
          </div>
        )}
      </div>

      {/* 5. Parent Trust Points & 6. Student Highlights */}
      {(exp.parentTrustPoints.length > 0 || exp.studentHighlights.length > 0) && (
        <div className="grid grid-cols-1 gap-4">
           {exp.parentTrustPoints.length > 0 && (
             <div className="p-5 bg-emerald-50 rounded-3xl border-2 border-emerald-100 shadow-xs">
                <div className="text-[11px] font-black uppercase tracking-widest text-emerald-800 mb-3 flex items-center gap-2">
                   <span className="h-2 w-2 rounded-full bg-emerald-500" /> Parent Trust Points
                </div>
                <ul className="space-y-2">
                   {exp.parentTrustPoints.map((p, i) => (
                     <li key={i} className="text-sm font-bold text-emerald-900 flex gap-3">
                       <span className="text-emerald-500 font-black">✓</span> {p}
                     </li>
                   ))}
                </ul>
             </div>
           )}
           {exp.studentHighlights.length > 0 && (
             <div className="p-5 bg-blue-50 rounded-3xl border-2 border-blue-100 shadow-xs">
                <div className="text-[11px] font-black uppercase tracking-widest text-blue-800 mb-3 flex items-center gap-2">
                   <span className="h-2 w-2 rounded-full bg-blue-500" /> Student Highlights
                </div>
                <ul className="space-y-2">
                   {exp.studentHighlights.map((p, i) => (
                     <li key={i} className="text-sm font-bold text-blue-900 flex gap-3">
                       <span className="text-blue-500 font-black">★</span> {p}
                     </li>
                   ))}
                </ul>
             </div>
           )}
        </div>
      )}

      {/* 7. Script in selected language */}
      <LocationScriptBlock script={exp.script} language={language} />

      {/* 10. CTAs (Admissions Conversion) */}
      <AdmissionsCTASection cta={exp.admissionsCta} />

      <div className="h-px bg-slate-100 my-4" />

      {/* Navigation Actions */}
      <LocationActions locationId={location.id} />
    </div>
  );
}
