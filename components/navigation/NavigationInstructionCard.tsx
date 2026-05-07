'use client';

import React, { useEffect, useState } from 'react';
import { campusRouteEngine, type RouteResult } from '@/lib/campusRouteEngine';
import mediaSync from '@/lib/mediaSyncEngine';
import { useTourSession } from '@/hooks/useTourSession';

export default function NavigationInstructionCard() {
  const { session } = useTourSession();
  const [route, setRoute] = useState<RouteResult | null>(null);

  useEffect(() => {
    const unsub = mediaSync.subscribe((currentLocation) => {
      if (!currentLocation) {
        setRoute(null);
        return;
      }
      
      const locations = mediaSync.getLocations();
      const currentIndex = locations.findIndex(l => l.id === currentLocation.id);
      
      if (currentIndex <= 0) {
        const result = campusRouteEngine.findRoute(
           17.3320276, 78.7278257, // Main Gate
           currentLocation.latitude,
           currentLocation.longitude
        );
        setRoute(result);
      } else {
        const prev = locations[currentIndex - 1];
        const result = campusRouteEngine.findRoute(
           prev.latitude,
           prev.longitude,
           currentLocation.latitude,
           currentLocation.longitude
        );
        setRoute(result);
      }
    });

    return unsub;
  }, [session?.navigationMode]);

  if (!route) return null;

  return (
    <div className="mt-4 animate-in slide-in-from-top duration-500">
      <div className="rounded-3xl border-2 border-blue-100 bg-blue-50/50 p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </div>
          <div>
            <div className="text-[11px] font-black uppercase tracking-widest text-blue-800 mb-1">Navigation Guidance</div>
            <div className="text-xl font-black text-slate-900 tracking-tight">
               Approx. {route.distance} meters
            </div>
            <p className="mt-2 text-sm font-bold text-blue-900/70 leading-relaxed">
               {route.instructions[0]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
