'use client';

import React, { useEffect, useState } from 'react';
import { Polyline } from 'react-leaflet';
import { campusRouteEngine, type RouteResult } from '@/lib/campusRouteEngine';
import mediaSync from '@/lib/mediaSyncEngine';
import { useTourSession } from '@/hooks/useTourSession';

export default function RouteHighlightLayer() {
  const { session } = useTourSession();
  const [route, setRoute] = useState<RouteResult | null>(null);
  
  // For demo/standalone purposes, we might use user location.
  // But here we'll simulate a route from a "Home/Start" or between points if needed.
  // The user wants navigation for campus_cart, walk_with_me, etc.
  
  useEffect(() => {
    const unsub = mediaSync.subscribe((currentLocation) => {
      if (!currentLocation) {
        setRoute(null);
        return;
      }

      // If we are in a tour mode, we might want to show the route to the CURRENT point.
      // Since we don't have real-time GPS here, we'll simulate from the "Main Gate" 
      // if it's the first stop, or from the PREVIOUS stop.
      
      const locations = mediaSync.getLocations();
      const currentIndex = locations.findIndex(l => l.id === currentLocation.id);
      
      if (currentIndex <= 0) {
        // From Entrance (approx)
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
    <>
      {/* Route Glow */}
      <Polyline
        positions={route.path}
        pathOptions={{
          color: '#3b82f6',
          weight: 12,
          opacity: 0.2,
          lineCap: 'round',
          lineJoin: 'round',
        }}
      />
      {/* Active Route Path */}
      <Polyline
        positions={route.path}
        pathOptions={{
          color: '#2563eb', // blue-600
          weight: 4,
          opacity: 0.9,
          dashArray: '1, 10',
          lineCap: 'round',
          lineJoin: 'round',
          className: 'animate-dash'
        }}
      />
    </>
  );
}
