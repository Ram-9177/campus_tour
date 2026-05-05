import type { VMSContext } from '@/types';

export const VMS_ADAPTER_ENABLED = false as const;

type SearchParamsInput =
  | URLSearchParams
  | Record<string, string | string[] | undefined>
  | null
  | undefined;

interface VMSNoopEventResult {
  enabled: false;
  sent: false;
  event: 'tourStarted' | 'routeSelected' | 'stopOpened' | 'brochureClicked' | 'whatsappClicked' | 'tourCompleted';
  timestamp: Date;
  context?: VMSContext;
}

function getSearchValue(
  searchParams: SearchParamsInput,
  key: string
): string | undefined {
  if (!searchParams) return undefined;

  if (searchParams instanceof URLSearchParams) {
    return searchParams.get(key) ?? undefined;
  }

  const raw = searchParams[key];
  if (Array.isArray(raw)) return raw[0];
  return raw;
}

export function readVMSContextFromSearchParams(
  searchParams: SearchParamsInput
): VMSContext | undefined {
  const source = getSearchValue(searchParams, 'source');
  const visit_id = getSearchValue(searchParams, 'visit_id');
  const route = getSearchValue(searchParams, 'route');
  const token = getSearchValue(searchParams, 'token');

  if (!source && !visit_id && !route && !token) {
    return undefined;
  }

  return {
    source,
    visit_id,
    route,
    token,
    timestamp: new Date(),
  };
}

export function isVMSSource(context?: VMSContext): boolean {
  return context?.source?.toLowerCase() === 'vms';
}

function createNoopEvent(
  event: VMSNoopEventResult['event'],
  context?: VMSContext
): VMSNoopEventResult {
  return {
    enabled: VMS_ADAPTER_ENABLED,
    sent: false,
    event,
    timestamp: new Date(),
    context,
  };
}

export function tourStarted(context?: VMSContext): VMSNoopEventResult {
  return createNoopEvent('tourStarted', context);
}

export function routeSelected(
  context?: VMSContext,
  _routeSlug?: string
): VMSNoopEventResult {
  return createNoopEvent('routeSelected', context);
}

export function stopOpened(
  context?: VMSContext,
  _stopSlug?: string
): VMSNoopEventResult {
  return createNoopEvent('stopOpened', context);
}

export function brochureClicked(
  context?: VMSContext,
  _brochureSlug?: string
): VMSNoopEventResult {
  return createNoopEvent('brochureClicked', context);
}

export function whatsappClicked(context?: VMSContext): VMSNoopEventResult {
  return createNoopEvent('whatsappClicked', context);
}

export function tourCompleted(context?: VMSContext): VMSNoopEventResult {
  return createNoopEvent('tourCompleted', context);
}

export const vmsAdapter = {
  enabled: VMS_ADAPTER_ENABLED,
  readVMSContextFromSearchParams,
  isVMSSource,
  tourStarted,
  routeSelected,
  stopOpened,
  brochureClicked,
  whatsappClicked,
  tourCompleted,
};
