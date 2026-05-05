'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import SMRUCampusWorldMap from '@/components/map/SMRUCampusWorldMap';
import ManualExplorePanel from '@/components/map/ManualExplorePanel';
import WalkWithMePanel from '@/components/map/WalkWithMePanel';
import CartModePanel from '@/components/cart/CartModePanel';
import MapLegend from '@/components/map/MapLegend';
import CampusMapBottomSheet from '@/components/map/CampusMapBottomSheet';
import MiniAudioPlayer from '@/components/audio/MiniAudioPlayer';
import { useDelayedLocationAudio } from '@/hooks/useDelayedLocationAudio';
import { locationSequence } from '@/lib/locationSequence';
import TourCompletionCard from '@/components/tour/TourCompletionCard';
import mediaSync from '@/lib/mediaSyncEngine';
import { ModeExperienceStore } from '@/lib/modeExperienceStore';
import { getModeLabel, queryModeToTourMode } from '@/lib/modeUtils';
import type { AppTourMode } from '@/types/appRules';
import type { ModeExperienceConfig } from '@/types/modeExperience';
import { useSelectedLanguage } from '@/hooks/useSelectedLanguage';
import audioEngine from '@/lib/audioGuideEngine';

export default function MapPageClient() {
  useDelayedLocationAudio();
  const searchParams = useSearchParams();
  const selectedLanguage = useSelectedLanguage();
  const [progress, setProgress] = useState(locationSequence.getProgress());
  const [activeMode, setActiveMode] = useState<AppTourMode>('manual_explore');
  const [modeConfig, setModeConfig] = useState<ModeExperienceConfig | null>(null);
  const [modeNotice, setModeNotice] = useState<string | null>(null);
  
  useEffect(() => {
    return locationSequence.subscribe(setProgress);
  }, []);

  useEffect(() => {
    audioEngine.setLanguage(selectedLanguage);
  }, [selectedLanguage]);

  const requestedMode = queryModeToTourMode(searchParams.get('mode'));
  useEffect(() => {
    const applyModeScope = () => {
      const state = ModeExperienceStore.getState();
      const requestedConfig = state.modes[requestedMode];
      const fallbackMode: AppTourMode = 'manual_explore';
      const effectiveMode = requestedConfig.enabled ? requestedMode : fallbackMode;
      const effectiveConfig = state.modes[effectiveMode];
      const scopedIds = effectiveMode === 'campus_cart' ? null : effectiveConfig.locationIds;

      setActiveMode(effectiveMode);
      setModeConfig(effectiveConfig);
      setModeNotice(
        requestedConfig.enabled
          ? null
          : `${getModeLabel(requestedMode)} is disabled by admin. Showing ${getModeLabel(fallbackMode)}.`
      );

      locationSequence.reset();
      mediaSync.setCurrentByLocationId(null);
      mediaSync.setScopeLocationIds(scopedIds);
      locationSequence.setScopeLocationIds(scopedIds);
    };

    applyModeScope();
    window.addEventListener('smru_mode_config_updated', applyModeScope);
    window.addEventListener('smru_locations_updated', applyModeScope);

    return () => {
      window.removeEventListener('smru_mode_config_updated', applyModeScope);
      window.removeEventListener('smru_locations_updated', applyModeScope);
      mediaSync.setScopeLocationIds(null);
      locationSequence.setScopeLocationIds(null);
    };
  }, [requestedMode]);

  const isWalkMode = activeMode === 'walk_with_me';
  const isCartMode = activeMode === 'campus_cart';

  if (progress.isComplete) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] px-4">
        <TourCompletionCard />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        <SMRUCampusWorldMap isWalkMode={isWalkMode} allowedLocationIds={isCartMode ? undefined : modeConfig?.locationIds} language={selectedLanguage} />
        <MapLegend />

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm font-bold text-slate-900">{getModeLabel(activeMode)}</div>
            <div className="text-xs font-semibold text-slate-600">
              Duration: {modeConfig?.durationMinutes ?? '--'} min
            </div>
          </div>
          <div className="mt-1 text-xs text-slate-500">Active points: {isCartMode ? 'All active map points' : modeConfig?.locationIds.length ?? 0}</div>
          {modeNotice ? (
            <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
              {modeNotice}
            </div>
          ) : null}
        </div>

        {isCartMode ? (
          <CartModePanel allowedLocationIds={undefined} language={selectedLanguage} />
        ) : isWalkMode ? (
          <WalkWithMePanel allowedLocationIds={modeConfig?.locationIds} language={selectedLanguage} />
        ) : (
          <ManualExplorePanel allowedLocationIds={modeConfig?.locationIds} language={selectedLanguage} />
        )}
      </div>
      <CampusMapBottomSheet />
      <MiniAudioPlayer />
    </>
  );
}
