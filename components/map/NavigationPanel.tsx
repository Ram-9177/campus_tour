'use client';

import { useState, useEffect, useMemo, useRef, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import type { OffroadConfidence } from '@/lib/campusPathfinding';
import type { CampusLocation } from '@/types/campusLocation';

export interface NavigationInstructionStep {
  text: string;
  distanceMeters?: number;
}

interface NavigationPanelProps {
  locations: CampusLocation[];
  onRouteSelect?: (start: CampusLocation, end: CampusLocation) => void;
  selectedStart?: CampusLocation | null;
  selectedEnd?: CampusLocation | null;
  routeDistanceMeters?: number | null;
  routeWalkMinutes?: number | null;
  hasRoadRoute?: boolean;
  hasConnectedRoadRoute?: boolean;
  offRoadDistanceMeters?: number | null;
  roadDistanceMeters?: number | null;
  offroadConfidence?: OffroadConfidence | null;
  instructionSteps?: NavigationInstructionStep[];
}

const START_LISTBOX_ID = 'navigation-start-listbox';
const END_LISTBOX_ID = 'navigation-end-listbox';

export default function NavigationPanel({
  locations,
  onRouteSelect,
  selectedStart,
  selectedEnd,
  routeDistanceMeters,
  routeWalkMinutes,
  hasRoadRoute = false,
  hasConnectedRoadRoute = false,
  offRoadDistanceMeters = null,
  roadDistanceMeters = null,
  offroadConfidence = null,
  instructionSteps = [],
}: NavigationPanelProps) {
  const [startLocation, setStartLocation] = useState<CampusLocation | null>(selectedStart || null);
  const [endLocation, setEndLocation] = useState<CampusLocation | null>(selectedEnd || null);
  const [searchStart, setSearchStart] = useState(selectedStart?.name.en || '');
  const [searchEnd, setSearchEnd] = useState(selectedEnd?.name.en || '');
  const [showStartDropdown, setShowStartDropdown] = useState(false);
  const [showEndDropdown, setShowEndDropdown] = useState(false);
  const [activeStartIndex, setActiveStartIndex] = useState(-1);
  const [activeEndIndex, setActiveEndIndex] = useState(-1);

  const startContainerRef = useRef<HTMLDivElement | null>(null);
  const endContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (selectedStart) {
      setStartLocation(selectedStart);
      setSearchStart(selectedStart.name.en);
    }
  }, [selectedStart]);

  useEffect(() => {
    if (selectedEnd) {
      setEndLocation(selectedEnd);
      setSearchEnd(selectedEnd.name.en);
    }
  }, [selectedEnd]);

  const filteredStartLocations = useMemo(
    () =>
      locations.filter((loc) =>
        loc.name.en.toLowerCase().includes(searchStart.trim().toLowerCase())
      ),
    [locations, searchStart]
  );

  const filteredEndLocations = useMemo(
    () =>
      locations.filter((loc) =>
        loc.name.en.toLowerCase().includes(searchEnd.trim().toLowerCase())
      ),
    [locations, searchEnd]
  );
  const startOptions = filteredStartLocations.slice(0, 8);
  const endOptions = filteredEndLocations.slice(0, 8);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (startContainerRef.current && !startContainerRef.current.contains(target)) {
        setShowStartDropdown(false);
        setActiveStartIndex(-1);
      }
      if (endContainerRef.current && !endContainerRef.current.contains(target)) {
        setShowEndDropdown(false);
        setActiveEndIndex(-1);
      }
    };

    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowStartDropdown(false);
        setShowEndDropdown(false);
        setActiveStartIndex(-1);
        setActiveEndIndex(-1);
      }
    };

    window.addEventListener('mousedown', handleOutsideClick);
    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleStartSelect = (loc: CampusLocation) => {
    setStartLocation(loc);
    setSearchStart(loc.name.en);
    setShowStartDropdown(false);
    setActiveStartIndex(-1);
  };

  const handleEndSelect = (loc: CampusLocation) => {
    setEndLocation(loc);
    setSearchEnd(loc.name.en);
    setShowEndDropdown(false);
    setActiveEndIndex(-1);
  };

  const handleGetDirections = () => {
    if (startLocation && endLocation && onRouteSelect) {
      onRouteSelect(startLocation, endLocation);
    }
  };

  const handleSwap = () => {
    const tempLoc = startLocation;
    setStartLocation(endLocation);
    setEndLocation(tempLoc);

    const tempSearch = searchStart;
    setSearchStart(searchEnd);
    setSearchEnd(tempSearch);

    setShowStartDropdown(false);
    setShowEndDropdown(false);
    setActiveStartIndex(-1);
    setActiveEndIndex(-1);
  };

  const handleStartInputKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setShowStartDropdown(false);
      setActiveStartIndex(-1);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setShowStartDropdown(true);
      if (startOptions.length === 0) return;
      setActiveStartIndex((prev) => {
        const current = prev < 0 ? -1 : prev;
        return (current + 1) % startOptions.length;
      });
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setShowStartDropdown(true);
      if (startOptions.length === 0) return;
      setActiveStartIndex((prev) => {
        if (prev <= 0) return startOptions.length - 1;
        return prev - 1;
      });
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      if (showStartDropdown && activeStartIndex >= 0 && startOptions[activeStartIndex]) {
        handleStartSelect(startOptions[activeStartIndex]);
        return;
      }
      const exactMatch = filteredStartLocations.find(
        (loc) => loc.name.en.toLowerCase() === searchStart.trim().toLowerCase()
      );
      const firstMatch = exactMatch || startOptions[0];
      if (firstMatch) handleStartSelect(firstMatch);
    }
  };

  const handleEndInputKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setShowEndDropdown(false);
      setActiveEndIndex(-1);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setShowEndDropdown(true);
      if (endOptions.length === 0) return;
      setActiveEndIndex((prev) => {
        const current = prev < 0 ? -1 : prev;
        return (current + 1) % endOptions.length;
      });
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setShowEndDropdown(true);
      if (endOptions.length === 0) return;
      setActiveEndIndex((prev) => {
        if (prev <= 0) return endOptions.length - 1;
        return prev - 1;
      });
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      if (showEndDropdown && activeEndIndex >= 0 && endOptions[activeEndIndex]) {
        handleEndSelect(endOptions[activeEndIndex]);
        return;
      }
      const exactMatch = filteredEndLocations.find(
        (loc) => loc.name.en.toLowerCase() === searchEnd.trim().toLowerCase()
      );
      const firstMatch = exactMatch || endOptions[0];
      if (firstMatch) handleEndSelect(firstMatch);
    }
  };

  const totalDistanceMeters =
    routeDistanceMeters !== null && routeDistanceMeters !== undefined
      ? Math.round(routeDistanceMeters)
      : null;
  const roadMeters =
    roadDistanceMeters !== null && roadDistanceMeters !== undefined
      ? Math.round(roadDistanceMeters)
      : null;
  const offRoadMeters =
    offRoadDistanceMeters !== null && offRoadDistanceMeters !== undefined
      ? Math.round(offRoadDistanceMeters)
      : null;
  const walkingMinutes = routeWalkMinutes && routeWalkMinutes > 0 ? routeWalkMinutes : null;
  const hasExactSamePoint = startLocation && endLocation && startLocation.id === endLocation.id;
  const steps = hasExactSamePoint
    ? [{ text: 'You are already at this destination.' }]
    : instructionSteps;

  const isGetDirectionsDisabled = !startLocation || !endLocation;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-lg">
      <h3 className="mb-3 text-sm font-bold text-slate-900">Admission Visit Navigation</h3>

      <div className="relative mb-3" ref={startContainerRef}>
        <label htmlFor="navigation-start" className="text-xs font-semibold text-slate-600">
          From
        </label>
        <div className="relative">
          <input
            id="navigation-start"
            type="text"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={showStartDropdown}
            aria-controls={START_LISTBOX_ID}
            aria-activedescendant={
              showStartDropdown && activeStartIndex >= 0 && startOptions[activeStartIndex]
                ? `start-option-${startOptions[activeStartIndex].id}`
                : undefined
            }
            placeholder="Select start location..."
            value={searchStart}
            onChange={(e) => {
              setSearchStart(e.target.value);
              setShowStartDropdown(true);
              setActiveStartIndex(e.target.value ? 0 : -1);
            }}
            onFocus={() => {
              setShowStartDropdown(true);
              setActiveStartIndex(startOptions.length > 0 ? 0 : -1);
            }}
            onKeyDown={handleStartInputKeyDown}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-[#0b57d0] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0b57d0]/30"
          />
          {showStartDropdown && (
            <div
              id={START_LISTBOX_ID}
              role="listbox"
              className="absolute left-0 right-0 top-full z-10 mt-1 max-h-40 overflow-y-auto rounded-lg border border-slate-300 bg-white shadow-lg"
            >
              {startOptions.map((loc, index) => {
                const isActive = index === activeStartIndex;
                return (
                  <button
                    key={loc.id}
                    id={`start-option-${loc.id}`}
                    role="option"
                    aria-selected={isActive}
                    onMouseEnter={() => setActiveStartIndex(index)}
                    onClick={() => handleStartSelect(loc)}
                    className={`w-full border-b border-slate-200 px-3 py-2 text-left text-xs last:border-b-0 focus-visible:outline-none ${
                      isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    📍 {loc.name.en}
                  </button>
                );
              })}
              {filteredStartLocations.length === 0 && (
                <div className="px-3 py-2 text-xs text-slate-500">No matching locations.</div>
              )}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handleSwap}
        className="mb-3 w-full rounded-lg bg-slate-100 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b57d0]/30"
      >
        ⇅ Swap
      </button>

      <div className="relative mb-3" ref={endContainerRef}>
        <label htmlFor="navigation-end" className="text-xs font-semibold text-slate-600">
          To
        </label>
        <div className="relative">
          <input
            id="navigation-end"
            type="text"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={showEndDropdown}
            aria-controls={END_LISTBOX_ID}
            aria-activedescendant={
              showEndDropdown && activeEndIndex >= 0 && endOptions[activeEndIndex]
                ? `end-option-${endOptions[activeEndIndex].id}`
                : undefined
            }
            placeholder="Select destination..."
            value={searchEnd}
            onChange={(e) => {
              setSearchEnd(e.target.value);
              setShowEndDropdown(true);
              setActiveEndIndex(e.target.value ? 0 : -1);
            }}
            onFocus={() => {
              setShowEndDropdown(true);
              setActiveEndIndex(endOptions.length > 0 ? 0 : -1);
            }}
            onKeyDown={handleEndInputKeyDown}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-[#0b57d0] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0b57d0]/30"
          />
          {showEndDropdown && (
            <div
              id={END_LISTBOX_ID}
              role="listbox"
              className="absolute left-0 right-0 top-full z-10 mt-1 max-h-40 overflow-y-auto rounded-lg border border-slate-300 bg-white shadow-lg"
            >
              {endOptions.map((loc, index) => {
                const isActive = index === activeEndIndex;
                return (
                  <button
                    key={loc.id}
                    id={`end-option-${loc.id}`}
                    role="option"
                    aria-selected={isActive}
                    onMouseEnter={() => setActiveEndIndex(index)}
                    onClick={() => handleEndSelect(loc)}
                    className={`w-full border-b border-slate-200 px-3 py-2 text-left text-xs last:border-b-0 focus-visible:outline-none ${
                      isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    📍 {loc.name.en}
                  </button>
                );
              })}
              {filteredEndLocations.length === 0 && (
                <div className="px-3 py-2 text-xs text-slate-500">No matching locations.</div>
              )}
            </div>
          )}
        </div>
      </div>

      {totalDistanceMeters !== null && walkingMinutes && startLocation && endLocation && (
        <div className="mb-3 rounded-lg bg-blue-50 p-2 text-center">
          <p className="text-xs font-semibold text-[#0b57d0]">
            Distance: {totalDistanceMeters}m (~{walkingMinutes} min walk)
          </p>
        </div>
      )}

      {roadMeters !== null && offRoadMeters !== null && startLocation && endLocation && !hasConnectedRoadRoute && hasRoadRoute && (
        <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 p-2 text-center">
          <p className="text-xs font-semibold text-amber-800">
            Road route: {roadMeters}m + final walk: {offRoadMeters}m
          </p>
          {offroadConfidence && (
            <p className="mt-1 text-[11px] font-semibold text-amber-700">
              Final segment is approximate ({offroadConfidence} confidence).
            </p>
          )}
        </div>
      )}

      {offRoadMeters !== null &&
        offRoadMeters > 0 &&
        startLocation &&
        endLocation &&
        offroadConfidence &&
        !(roadMeters !== null && !hasConnectedRoadRoute && hasRoadRoute) && (
        <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 p-2 text-center">
          <p className="text-[11px] font-semibold text-amber-700">
            Final segment is approximate ({offroadConfidence} confidence).
          </p>
        </div>
      )}

      {startLocation && endLocation && startLocation.id !== endLocation.id && !hasRoadRoute && (
        <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-2 py-2 text-center text-xs font-semibold text-amber-800">
          No connected road route found for this selection.
        </div>
      )}

      <button
        onClick={handleGetDirections}
        disabled={isGetDirectionsDisabled}
        className="w-full rounded-lg bg-[#0b57d0] py-2 text-xs font-bold text-white hover:bg-[#0948ad] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b57d0]/30 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        🗺️ Get Directions
      </button>

      {steps.length > 0 && (
        <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="mb-2 text-xs font-bold text-slate-700">Steps</p>
          <ol className="space-y-1 text-xs text-slate-600">
            {steps.map((step, index) => (
              <li key={`${step.text}-${index}`}>
                {index + 1}. {step.text}
                {step.distanceMeters !== undefined ? ` (${Math.round(step.distanceMeters)}m)` : ''}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
