'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Polygon, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { smruMapConfig } from '@/data/map/smruMapConfig';
import { findRoadRoutePlan } from '@/lib/campusPathfinding';
import { buildRouteInstructions } from '@/lib/routeInstructionEngine';
import { LocationStore } from '@/lib/locationStore';
import type { CampusLocation } from '@/types/campusLocation';
import NavigationPanel, { type NavigationInstructionStep } from './NavigationPanel';
import RouteVisualizer from './RouteVisualizer';
import mediaSync from '@/lib/mediaSyncEngine';

// Calculate center of campus bounds
const campusCenter: [number, number] = [
  (smruMapConfig.bounds.minLat + smruMapConfig.bounds.maxLat) / 2,
  (smruMapConfig.bounds.minLon + smruMapConfig.bounds.maxLon) / 2,
];
const DEFAULT_CENTER: [number, number] = campusCenter;
const CAMPUS_BOUNDS: [[number, number], [number, number]] = [
  [smruMapConfig.bounds.minLat, smruMapConfig.bounds.minLon],
  [smruMapConfig.bounds.maxLat, smruMapConfig.bounds.maxLon],
];
const CAMPUS_POLYGON: [number, number][] = [
  [smruMapConfig.bounds.maxLat, smruMapConfig.bounds.minLon],
  [smruMapConfig.bounds.maxLat, smruMapConfig.bounds.maxLon],
  [smruMapConfig.bounds.minLat, smruMapConfig.bounds.maxLon],
  [smruMapConfig.bounds.minLat, smruMapConfig.bounds.minLon],
];

interface SatelliteCampusMapProps {
  allowedLocationIds?: string[];
}

interface MapInteractionCaptureProps {
  onInteract: () => void;
}

function MapInteractionCapture({ onInteract }: MapInteractionCaptureProps) {
  useMapEvents({
    dragstart: onInteract,
    zoomstart: onInteract,
    movestart: onInteract,
    mousedown: onInteract,
  });
  return null;
}

interface RouteAutoFitProps {
  points: [number, number][];
  forceFitKey: number;
  lastInteractedAt: number;
}

function RouteAutoFit({ points, forceFitKey, lastInteractedAt }: RouteAutoFitProps) {
  const map = useMap();
  const previousForceFitKey = useRef(forceFitKey);

  useEffect(() => {
    if (points.length === 0) return;

    const forceChanged = previousForceFitKey.current !== forceFitKey;
    previousForceFitKey.current = forceFitKey;

    const recentlyInteracted = Date.now() - lastInteractedAt < 5000;
    if (!forceChanged && recentlyInteracted) return;

    if (points.length === 1) {
      map.setView(points[0], 19, { animate: true });
      return;
    }

    map.fitBounds(points, {
      padding: [48, 48],
      maxZoom: 19,
      animate: true,
    });
  }, [forceFitKey, lastInteractedAt, map, points]);

  return null;
}

function getCenter(locations: CampusLocation[]): [number, number] {
  if (locations.length === 0) return DEFAULT_CENTER;
  const valid = locations.filter((loc) => loc.latitude && loc.longitude);
  if (valid.length === 0) return DEFAULT_CENTER;
  const lat = valid.reduce((sum, loc) => sum + loc.latitude, 0) / valid.length;
  const lng = valid.reduce((sum, loc) => sum + loc.longitude, 0) / valid.length;
  return [lat, lng];
}

function getDefaultStartLocation(locations: CampusLocation[]): CampusLocation | null {
  if (locations.length === 0) return null;
  return (
    locations.find((loc) => loc.slug === 'main-gate') ||
    locations.find((loc) => String(loc.category).toLowerCase().includes('gate')) ||
    locations[0]
  );
}

function haversineMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function buildCurrentLocationPoint(latitude: number, longitude: number): CampusLocation {
  return {
    id: 'current-location',
    slug: 'current-location',
    name: {
      en: 'My Current Location',
      te: 'నా ప్రస్తుత స్థానం',
      hi: 'मेरा वर्तमान स्थान',
    },
    category: 'current-location',
    latitude,
    longitude,
    radiusMeters: 5,
    description: {
      en: 'Your current GPS position.',
      te: 'మీ ప్రస్తుత GPS స్థానం.',
      hi: 'आपकी वर्तमान GPS स्थिति।',
    },
    script: {
      en: 'You are here.',
      te: 'మీరు ఇక్కడ ఉన్నారు.',
      hi: 'आप यहाँ हैं।',
    },
    audio: { en: '', te: '', hi: '' },
    images: [],
    videos: [],
    routeOrder: 0,
    recommendedFor: ['other'],
    active: true,
  };
}

function parseGeoError(error: GeolocationPositionError): string {
  if (error.code === 1) return 'Location permission denied.';
  if (error.code === 2) return 'Location unavailable. Please try again.';
  if (error.code === 3) return 'Location request timed out.';
  return error.message || 'Unable to fetch current location.';
}

export default function SatelliteCampusMap({ allowedLocationIds }: SatelliteCampusMapProps) {
  const [locations, setLocations] = useState<CampusLocation[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedStartRoute, setSelectedStartRoute] = useState<CampusLocation | null>(null);
  const [selectedEndRoute, setSelectedEndRoute] = useState<CampusLocation | null>(null);
  const [mapType, setMapType] = useState<'normal' | 'satellite'>('normal');
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number; accuracy: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isUsingLiveStart, setIsUsingLiveStart] = useState(false);
  const [fitKey, setFitKey] = useState(0);
  const [lastMapInteractionAt, setLastMapInteractionAt] = useState(0);
  const geolocationWatchIdRef = useRef<number | null>(null);
  const locationResolversRef = useRef<Array<{ resolve: (value: CampusLocation | null) => void; timeoutId: number }>>([]);
  const lastAcceptedLocationRef = useRef<{ lat: number; lon: number; accuracy: number; at: number } | null>(null);
  const lastInteractionUpdateRef = useRef(0);
  const isUsingLiveStartRef = useRef(isUsingLiveStart);
  const selectedStartRouteRef = useRef<CampusLocation | null>(selectedStartRoute);
  const latestUserLocationRef = useRef(userLocation);

  // Wait for hydration before loading
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const load = () => {
      const all = LocationStore.getAllLocations();
      // Filter to active locations
      const activeOnly = all.filter((loc) => loc.active === true);

      // ALWAYS show all active locations on the map
      // allowedLocationIds should only filter if explicitly provided and non-empty
      let result = activeOnly;
      if (allowedLocationIds && Array.isArray(allowedLocationIds) && allowedLocationIds.length > 0) {
        const allowedSet = new Set(allowedLocationIds);
        result = activeOnly.filter((loc) => allowedSet.has(loc.id));
      }

      setLocations(result);
    };

    load();
    window.addEventListener('smru_locations_updated', load);
    return () => window.removeEventListener('smru_locations_updated', load);
  }, [allowedLocationIds, isHydrated]);

  useEffect(() => {
    if (selectedStartRoute || locations.length === 0) return;
    const defaultStart = getDefaultStartLocation(locations);
    if (defaultStart) setSelectedStartRoute(defaultStart);
  }, [locations, selectedStartRoute]);

  useEffect(() => {
    isUsingLiveStartRef.current = isUsingLiveStart;
  }, [isUsingLiveStart]);

  useEffect(() => {
    selectedStartRouteRef.current = selectedStartRoute;
  }, [selectedStartRoute]);

  useEffect(() => {
    latestUserLocationRef.current = userLocation;
  }, [userLocation]);

  const center = useMemo(() => getCenter(locations), [locations]);
  const locationById = useMemo(() => {
    const map = new Map<string, CampusLocation>();
    locations.forEach((loc) => {
      map.set(loc.id, loc);
    });
    return map;
  }, [locations]);
  const routePlan = useMemo(() => {
    if (!selectedStartRoute || !selectedEndRoute) return null;
    return findRoadRoutePlan(selectedStartRoute, selectedEndRoute);
  }, [selectedEndRoute, selectedStartRoute]);
  const routeSegments = routePlan?.routeSegments || [];
  const hasRoadRoute = routeSegments.some((segment) => segment.kind === 'road' && segment.distanceMeters > 0);
  const hasOffRoadRoute = routeSegments.some((segment) => segment.kind === 'offroad' && segment.distanceMeters > 0);
  const hasRenderableRoute = routeSegments.some((segment) => segment.points.length >= 2);
  const hasConnectedRoadRoute = routePlan?.isConnected || false;
  const offroadConfidence = routePlan?.offroadConfidence || null;
  const roadDistanceMeters = routePlan?.roadDistanceMeters !== undefined ? Math.round(routePlan.roadDistanceMeters) : null;
  const offRoadDistanceMeters = routePlan?.offRoadDistanceMeters ? Math.round(routePlan.offRoadDistanceMeters) : null;
  const totalWalkDistanceMetersRaw =
    (routePlan?.startConnectorDistanceMeters || 0) +
    (routePlan?.roadDistanceMeters || 0) +
    (routePlan?.offRoadDistanceMeters || 0);
  const totalWalkDistanceMeters = totalWalkDistanceMetersRaw > 0 ? Math.round(totalWalkDistanceMetersRaw) : null;
  const routeWalkMinutes = totalWalkDistanceMeters ? Math.max(1, Math.round(totalWalkDistanceMeters / 80)) : null;
  const googleSatelliteUrl = `https://www.google.com/maps?q=${center[0]},${center[1]}&z=18&t=k`;
  const autoFitPoints = useMemo(() => {
    const points: [number, number][] = [];
    if (userLocation) points.push([userLocation.latitude, userLocation.longitude]);
    routeSegments.forEach((segment) => {
      if (segment.points.length >= 2) points.push(...segment.points);
    });
    if (selectedEndRoute) points.push([selectedEndRoute.latitude, selectedEndRoute.longitude]);
    return points;
  }, [routeSegments, selectedEndRoute, userLocation]);

  const handleMapInteract = useCallback(() => {
    const now = Date.now();
    if (now - lastInteractionUpdateRef.current < 250) return;
    lastInteractionUpdateRef.current = now;
    setLastMapInteractionAt(now);
  }, []);

  const instructionSteps = useMemo<NavigationInstructionStep[]>(() => {
    if (!selectedStartRoute || !selectedEndRoute || !routePlan) return [];
    if (selectedStartRoute.id === selectedEndRoute.id) return [{ text: 'You are already at this destination.' }];
    return buildRouteInstructions({
      routeSegments,
      destinationName: selectedEndRoute.name.en,
      isConnectedRoadRoute: routePlan.isConnected,
      offroadConfidence,
    });
  }, [offroadConfidence, routePlan, routeSegments, selectedEndRoute, selectedStartRoute]);

  const shouldAcceptLocationUpdate = (latitude: number, longitude: number, accuracy: number) => {
    const now = Date.now();
    const previous = lastAcceptedLocationRef.current;
    if (!previous) return true;
    const movedMeters = haversineMeters(previous.lat, previous.lon, latitude, longitude);
    const elapsedMs = now - previous.at;
    const accuracyImproved = previous.accuracy - accuracy >= 8;
    return movedMeters >= 2 || elapsedMs >= 1500 || accuracyImproved;
  };

  const applyLocationUpdate = (position: GeolocationPosition) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const accuracy = position.coords.accuracy || 0;
    if (!shouldAcceptLocationUpdate(latitude, longitude, accuracy)) return;
    if (accuracy > 120) {
      setLocationError(`Low GPS accuracy (±${Math.round(accuracy)}m). Move to open sky for better precision.`);
    } else {
      setLocationError(null);
    }

    lastAcceptedLocationRef.current = { lat: latitude, lon: longitude, accuracy, at: Date.now() };
    setUserLocation({ latitude, longitude, accuracy });
    setIsLocating(false);
    const currentPoint = buildCurrentLocationPoint(latitude, longitude);

    if (isUsingLiveStartRef.current || selectedStartRouteRef.current?.slug === 'current-location') {
      setSelectedStartRoute(currentPoint);
    }

    if (locationResolversRef.current.length > 0) {
      locationResolversRef.current.forEach((entry) => {
        window.clearTimeout(entry.timeoutId);
        entry.resolve(currentPoint);
      });
      locationResolversRef.current = [];
    }
  };

  const beginLiveLocationTracking = async (): Promise<CampusLocation | null> => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setLocationError('Geolocation not supported on this device.');
      return null;
    }

    setIsLocating(true);
    setLocationError(null);

    if (geolocationWatchIdRef.current === null) {
      geolocationWatchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          applyLocationUpdate(position);
        },
        (error) => {
          setIsLocating(false);
          setLocationError(parseGeoError(error));
          if (locationResolversRef.current.length > 0) {
            locationResolversRef.current.forEach((entry) => {
              window.clearTimeout(entry.timeoutId);
              entry.resolve(null);
            });
            locationResolversRef.current = [];
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        }
      );
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        applyLocationUpdate(position);
      },
      (error) => {
        setLocationError(parseGeoError(error));
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0,
      }
    );

    const latest = latestUserLocationRef.current;
    if (latest) {
      return buildCurrentLocationPoint(latest.latitude, latest.longitude);
    }

    return new Promise((resolve) => {
      const timeoutId = window.setTimeout(() => {
        const current = latestUserLocationRef.current;
        resolve(current ? buildCurrentLocationPoint(current.latitude, current.longitude) : null);
        locationResolversRef.current = locationResolversRef.current.filter((entry) => entry.timeoutId !== timeoutId);
      }, 10000);

      locationResolversRef.current.push({ resolve, timeoutId });
    });
  };

  const useCurrentLocationAsStart = async () => {
    const current = await beginLiveLocationTracking();
    if (current) {
      setIsUsingLiveStart(true);
      setSelectedStartRoute(current);
      setFitKey((prev) => prev + 1);
    }
  };

  const handleMarkerClick = async (location: CampusLocation) => {
    setMapType('normal');
    setSelectedEndRoute(location);
    setFitKey((prev) => prev + 1);
    mediaSync.setCurrentByLocationId(location.id);

    if (userLocation) {
      setIsUsingLiveStart(true);
      setSelectedStartRoute(buildCurrentLocationPoint(userLocation.latitude, userLocation.longitude));
      return;
    }

    void beginLiveLocationTracking().then((current) => {
      if (current) {
        setIsUsingLiveStart(true);
        setSelectedStartRoute(current);
      }
    });

    if (!selectedStartRoute || selectedStartRoute.slug === 'current-location') {
      const fallbackStart = getDefaultStartLocation(locations);
      if (fallbackStart) {
        setIsUsingLiveStart(false);
        setSelectedStartRoute(fallbackStart);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (geolocationWatchIdRef.current !== null && typeof navigator !== 'undefined' && navigator.geolocation) {
        navigator.geolocation.clearWatch(geolocationWatchIdRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const unsubscribe = mediaSync.subscribe((loc) => {
      if (!loc) return;
      const target = locationById.get(loc.id);
      if (!target) return;

      setSelectedEndRoute((prev) => (prev?.id === target.id ? prev : target));
      setMapType('normal');
      setFitKey((prev) => prev + 1);
    });

    return () => {
      unsubscribe();
    };
  }, [locationById]);

  return (
    <div className="flex flex-col gap-4">
      {/* Map Container */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 shadow-2xl" style={{ height: '500px' }}>
        <MapContainer center={center} zoom={19} maxZoom={19} minZoom={17} maxBounds={CAMPUS_BOUNDS} className="h-full w-full" scrollWheelZoom={true}>
          <MapInteractionCapture onInteract={handleMapInteract} />
          <RouteAutoFit points={autoFitPoints} forceFitKey={fitKey} lastInteractedAt={lastMapInteractionAt} />

          {/* Conditional Tile Layer - Normal Map or Satellite */}
          {mapType === 'normal' ? (
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
            />
          ) : (
            <TileLayer
              attribution='Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and others'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxZoom={19}
            />
          )}
          <Polygon
            positions={CAMPUS_POLYGON}
            pathOptions={{ 
              color: '#0b57d0', 
              weight: 4, 
              opacity: 0.9,
              fillColor: '#0b57d0', 
              fillOpacity: 0.12,
              dashArray: '8, 4'
            }}
          />

          {userLocation && (
            <CircleMarker
              center={[userLocation.latitude, userLocation.longitude]}
              radius={8}
              pathOptions={{
                color: '#16a34a',
                weight: 2,
                fillColor: '#22c55e',
                fillOpacity: 0.95,
              }}
            >
              <Popup>
                <div className="text-sm font-semibold text-green-700">
                  You are here (±{Math.round(userLocation.accuracy)}m)
                </div>
              </Popup>
            </CircleMarker>
          )}

          {locations.map((location) => (
            <CircleMarker
              key={location.id}
              center={[location.latitude, location.longitude]}
              radius={selectedEndRoute?.id === location.id ? 9 : selectedStartRoute?.id === location.id ? 8 : 6}
              pathOptions={{
                color: selectedEndRoute?.id === location.id ? '#dc2626' : selectedStartRoute?.id === location.id ? '#16a34a' : '#0b57d0',
                weight: selectedEndRoute?.id === location.id ? 3 : 2,
                fillColor: selectedEndRoute?.id === location.id ? '#ef4444' : selectedStartRoute?.id === location.id ? '#22c55e' : '#1d6bdf',
                fillOpacity: 0.95,
              }}
              eventHandlers={{
                click: () => {
                  void handleMarkerClick(location);
                },
              }}
            >
              <Popup>
                <div className="text-sm font-semibold">{location.name.en}</div>
                <div className="text-xs text-slate-600">{location.category}</div>
              </Popup>
            </CircleMarker>
          ))}

          {selectedStartRoute && !selectedEndRoute && (
            <CircleMarker
              center={[selectedStartRoute.latitude, selectedStartRoute.longitude]}
              radius={8}
              pathOptions={{ color: '#16a34a', weight: 2, fillColor: '#22c55e', fillOpacity: 0.95 }}
            >
              <Popup>
                <div className="text-sm font-semibold text-green-700">Start: {selectedStartRoute.name.en}</div>
              </Popup>
            </CircleMarker>
          )}

          {selectedStartRoute && selectedEndRoute && hasRenderableRoute && (
            <RouteVisualizer
              startLocation={selectedStartRoute}
              endLocation={selectedEndRoute}
              routeSegments={routeSegments}
              roadEndCoordinates={routePlan?.roadEnd || null}
              totalDistanceMeters={totalWalkDistanceMeters || 0}
              isConnectedRoadRoute={hasConnectedRoadRoute}
            />
          )}
        </MapContainer>
        <div className="pointer-events-none absolute left-3 top-3 rounded-lg bg-white/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-700 shadow">
          {mapType === 'normal' ? '🗺️ Road Map' : '🛰️ Satellite View'}
        </div>
        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <button
            onClick={() => setMapType(mapType === 'normal' ? 'satellite' : 'normal')}
            className="rounded-lg bg-[#0b57d0] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white shadow hover:bg-[#0948ad]"
          >
            {mapType === 'normal' ? '🛰️ Satellite' : '🗺️ Road Map'}
          </button>
          <button
            onClick={() => {
              void useCurrentLocationAsStart();
            }}
            disabled={isLocating}
            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white shadow hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
          >
            {isLocating ? 'Locating...' : 'Use My Location'}
          </button>
          <a
            href={googleSatelliteUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg bg-[#0b57d0] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white shadow hover:bg-[#0948ad]"
          >
            Open Google
          </a>
        </div>
        {locationError && (
          <div className="absolute left-3 top-11 max-w-[65%] rounded-lg border border-amber-200 bg-amber-50 px-2 py-1.5 text-[10px] font-semibold text-amber-800 shadow">
            {locationError}
          </div>
        )}
        {selectedStartRoute && selectedEndRoute && (
          <div className="absolute bottom-3 left-3 max-w-[75%] rounded-lg border border-blue-100 bg-white/95 px-3 py-2 shadow">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Campus Visit Route
            </p>
            <p className="text-xs font-semibold text-slate-900">
              {selectedStartRoute.name.en} → {selectedEndRoute.name.en}
            </p>
            {hasConnectedRoadRoute && totalWalkDistanceMeters !== null ? (
              <>
                <p className="text-[11px] font-medium text-[#0b57d0]">
                  {Math.round(totalWalkDistanceMeters || 0)}m • ~{routeWalkMinutes ?? '--'} min walk
                </p>
                {hasOffRoadRoute && offroadConfidence && (
                  <p className="text-[11px] font-medium text-amber-700">
                    Final segment is approximate ({offroadConfidence} confidence).
                  </p>
                )}
              </>
            ) : totalWalkDistanceMeters !== null && hasOffRoadRoute ? (
              <p className="text-[11px] font-medium text-amber-700">
                {hasRoadRoute
                  ? `Road route ${Math.round(roadDistanceMeters || 0)}m, then walk ${offRoadDistanceMeters || 0}m after road ends.`
                  : `Walk ${offRoadDistanceMeters || 0}m on final approach (no connected road segment).`}
                {!hasConnectedRoadRoute && offroadConfidence
                  ? ` Final segment is approximate (${offroadConfidence} confidence).`
                  : ''}
              </p>
            ) : (
              <p className="text-[11px] font-medium text-amber-700">
                No connected road path found between these points.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Navigation Panel */}
      <NavigationPanel
        locations={locations}
        selectedStart={selectedStartRoute}
        selectedEnd={selectedEndRoute}
        routeDistanceMeters={totalWalkDistanceMeters}
        routeWalkMinutes={routeWalkMinutes}
        hasRoadRoute={hasRoadRoute}
        hasConnectedRoadRoute={hasConnectedRoadRoute}
        roadDistanceMeters={roadDistanceMeters}
        offRoadDistanceMeters={offRoadDistanceMeters}
        offroadConfidence={offroadConfidence}
        instructionSteps={instructionSteps}
        onRouteSelect={(start, end) => {
          setIsUsingLiveStart(start.slug === 'current-location');
          setFitKey((prev) => prev + 1);
          setSelectedStartRoute(start);
          setSelectedEndRoute(end);
          mediaSync.setCurrentByLocationId(end.id);
        }}
      />
    </div>
  );
}
