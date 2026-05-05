'use client';

import { Fragment } from 'react';
import { CircleMarker, Polyline, Popup, Tooltip } from 'react-leaflet';
import type { RouteSegment } from '@/lib/campusPathfinding';
import type { CampusLocation } from '@/types/campusLocation';

interface RouteVisualizerProps {
  startLocation: CampusLocation;
  endLocation: CampusLocation;
  routeSegments: RouteSegment[];
  roadEndCoordinates?: [number, number] | null;
  totalDistanceMeters: number;
  isConnectedRoadRoute?: boolean;
}

export default function RouteVisualizer({
  startLocation,
  endLocation,
  routeSegments,
  roadEndCoordinates = null,
  totalDistanceMeters,
  isConnectedRoadRoute = true,
}: RouteVisualizerProps) {
  const renderableSegments = routeSegments.filter((segment) => segment.points.length >= 2);
  if (renderableSegments.length === 0) return null;

  const walkingMinutes = Math.max(1, Math.round(totalDistanceMeters / 80));
  const startLabel = startLocation.slug === 'current-location' ? 'You are here' : `Start: ${startLocation.name.en}`;

  return (
    <>
      {renderableSegments.map((segment, index) => {
        if (segment.kind === 'road') {
          return (
            <Fragment key={`segment-${segment.kind}-${index}`}>
              <Polyline
                positions={segment.points}
                pathOptions={{
                  color: '#ffffff',
                  weight: 8,
                  opacity: 0.9,
                }}
              />
              <Polyline
                positions={segment.points}
                pathOptions={{
                  color: '#0b57d0',
                  weight: 5,
                  opacity: 0.95,
                }}
              >
                <Popup>
                  <div className="text-sm font-semibold">
                    Route: {startLocation.name.en} → {endLocation.name.en}
                    <br />
                    <span className="text-xs text-slate-600">
                      ~{Math.round(totalDistanceMeters)}m (~{walkingMinutes} min walk)
                    </span>
                  </div>
                </Popup>
              </Polyline>
            </Fragment>
          );
        }

        if (segment.kind === 'start_connector') {
          return (
            <Polyline
              key={`segment-${segment.kind}-${index}`}
              positions={segment.points}
              pathOptions={{
                color: '#0f766e',
                weight: 4,
                opacity: 0.95,
                dashArray: '6 6',
              }}
            >
              <Popup>
                <div className="text-sm font-semibold text-teal-700">Walk to nearest road</div>
              </Popup>
            </Polyline>
          );
        }

        return (
          <Polyline
            key={`segment-${segment.kind}-${index}`}
            positions={segment.points}
            pathOptions={{
              color: '#f59e0b',
              weight: 4,
              opacity: 0.95,
              dashArray: '8 6',
            }}
          >
            <Popup>
              <div className="text-sm font-semibold text-amber-700">
                Final walking segment
                {segment.confidence ? ` (${segment.confidence} confidence)` : ''}
              </div>
            </Popup>
          </Polyline>
        );
      })}

      {roadEndCoordinates && !isConnectedRoadRoute && (
        <CircleMarker
          center={roadEndCoordinates}
          radius={7}
          pathOptions={{
            color: '#f59e0b',
            weight: 2,
            fillColor: '#fbbf24',
            fillOpacity: 0.95,
          }}
        >
          <Tooltip direction="top" offset={[0, -8]} permanent className="border-amber-200! text-[10px]! font-bold! text-amber-700!">
            Road ends here
          </Tooltip>
        </CircleMarker>
      )}

      <CircleMarker
        center={[startLocation.latitude, startLocation.longitude]}
        radius={8}
        pathOptions={{
          color: '#22c55e',
          weight: 2,
          fillColor: '#22c55e',
          fillOpacity: 0.95,
        }}
      >
        <Popup>
          <div className="text-sm font-semibold text-green-700">{startLabel}</div>
        </Popup>
        <Tooltip direction="top" offset={[0, -8]} permanent className="border-green-200! text-[10px]! font-bold! text-green-700!">
          {startLabel}
        </Tooltip>
      </CircleMarker>

      <CircleMarker
        center={[endLocation.latitude, endLocation.longitude]}
        radius={9}
        pathOptions={{
          color: '#ef4444',
          weight: 2,
          fillColor: '#ef4444',
          fillOpacity: 0.95,
        }}
      >
        <Popup>
          <div className="text-sm font-semibold text-red-700">Destination: {endLocation.name.en}</div>
        </Popup>
        <Tooltip direction="top" offset={[0, -8]} permanent className="border-red-200! text-[10px]! font-bold! text-red-700!">
          {endLocation.name.en}
        </Tooltip>
      </CircleMarker>
    </>
  );
}
