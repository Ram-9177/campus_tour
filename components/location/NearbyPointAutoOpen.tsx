'use client';

import React, { useEffect, useState } from 'react';
import { LocationStore } from '@/lib/locationStore';
import type { CampusLocation } from '@/types/campusLocation';

export default function NearbyPointAutoOpen() {
  const [lastTriggered, setLastTriggered] = useState<CampusLocation | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleTrigger = (e: Event) => {
      const customEvent = e as CustomEvent;
      const id = customEvent.detail?.locationId;
      if (!id) return;

      const loc = LocationStore.getAllLocations().find(l => l.id === id);
      if (loc) {
        setLastTriggered(loc);
        setVisible(true);
        // Hide after 5 seconds
        setTimeout(() => setVisible(false), 5000);
      }
    };

    window.addEventListener('smru_location_autotriggered', handleTrigger);
    return () => window.removeEventListener('smru_location_autotriggered', handleTrigger);
  }, []);

  if (!visible || !lastTriggered) return null;

  return (
    <div className="fixed top-24 left-1/2 z-100 -translate-x-1/2 animate-in slide-in-from-top-full duration-700">
      <div className="flex items-center gap-3 rounded-full border border-blue-200 bg-blue-600 px-6 py-3 text-white shadow-2xl shadow-blue-900/40 backdrop-blur-md">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-lg">✨</div>
        <div>
          <div className="text-[10px] font-black uppercase tracking-widest text-blue-200">Arrived At</div>
          <div className="text-sm font-black tracking-tight">{lastTriggered.name.en}</div>
        </div>
      </div>
    </div>
  );
}
