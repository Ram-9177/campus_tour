'use client';

import React from 'react';
import LocalCampusWorldMap from './LocalCampusWorldMap';

interface Props {
  isWalkMode?: boolean;
  hideControls?: boolean;
  hideTopBar?: boolean;
  allowedLocationIds?: string[];
  language?: 'en' | 'te' | 'hi';
}

export default function SMRUCampusWorldMap({
  isWalkMode = false,
  allowedLocationIds,
  language = 'en',
}: Props) {
  return (
    <div className="relative aspect-4/3 w-full sm:aspect-video">
      <LocalCampusWorldMap
        allowedLocationIds={allowedLocationIds}
        language={language}
      />
      {isWalkMode && (
         <div className="absolute left-4 top-4 z-10 rounded-full bg-blue-600 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-lg">
           Walk Mode Active
         </div>
      )}
    </div>
  );
}
