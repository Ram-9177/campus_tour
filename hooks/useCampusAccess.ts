'use client';

import { useCallback, useState } from 'react';
import { getBestLocationFix } from '@/lib/locationFix';
import { decideTourAccess, type TourAccessOutcome } from '@/lib/tourAccessDecision';
import { patchTourSession } from '@/lib/tourSession';

export interface CampusAccessState {
  isCheckingLocation: boolean;
  accessOutcome: TourAccessOutcome | null;
}

const DEFAULT_STATE: CampusAccessState = {
  isCheckingLocation: false,
  accessOutcome: null,
};

export function useCampusAccess() {
  const [state, setState] = useState<CampusAccessState>(DEFAULT_STATE);

  const requestCampusAccess = useCallback(async () => {
    setState((current) => ({ ...current, isCheckingLocation: true }));

    const fix = await getBestLocationFix({ desiredAccuracyMeters: 35, timeoutMs: 18000 });
    const accessOutcome = decideTourAccess(fix);

    patchTourSession({ campusAccessDecision: accessOutcome.decision });

    setState({
      isCheckingLocation: false,
      accessOutcome,
    });

    return accessOutcome;
  }, []);

  const clearCampusAccess = useCallback(() => {
    setState(DEFAULT_STATE);
  }, []);

  return {
    ...state,
    requestCampusAccess,
    clearCampusAccess,
  };
}