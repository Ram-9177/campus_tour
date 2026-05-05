'use client';

import React from 'react';
import type { CampusLocation } from '@/types/campusLocation';
import LocationMediaGallery from './LocationMediaGallery';
import LocationScriptBlock from './LocationScriptBlock';
import LocationActions from './LocationActions';
import { getScriptForLocation } from '@/lib/scriptStore';

interface Props {
  location: CampusLocation;
  language: 'en' | 'te' | 'hi';
}

export default function LocationExperienceCard({ location, language }: Props) {
  const title = location.name[language] || location.name.en;
  const description = location.description[language] || 'Content coming soon';
  const script = getScriptForLocation(location, language);

  return (
    <div className="flex flex-col gap-6">
      {/* Title & Metadata */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-widest border border-blue-100">
            {location.category}
          </span>
          <div className="h-1 w-1 rounded-full bg-slate-300" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Admission Season Highlight
          </span>
        </div>
        <h3 className="text-2xl font-bold text-slate-900 leading-tight">
          {title}
        </h3>
      </div>

      {/* Primary Media */}
      <LocationMediaGallery 
        images={location.images} 
        videos={location.videos} 
        virtual360Url={location.virtual360Url} 
      />

      {/* Description */}
      <div className="prose prose-slate prose-sm max-w-none">
        <p className="text-slate-600 leading-relaxed font-medium">
          {description}
        </p>
      </div>

      {/* Script Section */}
      <LocationScriptBlock script={script} language={language} />

      {/* Interaction Layer */}
      <LocationActions locationId={location.id} />
    </div>
  );
}
