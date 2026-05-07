'use client';

import React from 'react';
import LocalCampusWorldMap from './LocalCampusWorldMap';

interface SatelliteCampusMapProps {
  allowedLocationIds?: string[];
  language: 'en' | 'te' | 'hi';
}

/**
 * Backward-compatible wrapper: now renders the local campus-only map.
 */
export default function SatelliteCampusMap({ allowedLocationIds, language }: SatelliteCampusMapProps) {
  return <LocalCampusWorldMap allowedLocationIds={allowedLocationIds} language={language} />;
}
