import Link from 'next/link';
import type { TourStop } from '@/types';
import StopCard from './StopCard';
import BrochureCTA from '@/components/cta/BrochureCTA';
import WhatsAppCTA from '@/components/cta/WhatsAppCTA';
import CallCTA from '@/components/cta/CallCTA';

interface StopDetailShellProps {
  stop: TourStop;
  campusPhone?: string;
  brochureHref?: string;
}

export default function StopDetailShell({ stop, campusPhone, brochureHref }: StopDetailShellProps) {
  const callHref = campusPhone ? `tel:${campusPhone}` : '#';

  return (
    <div className="space-y-3">
      <StopCard title="Category">{stop.category ?? 'General'}</StopCard>
      <StopCard title="Location / Block">
        {stop.category ? `${stop.category} block` : 'Campus block placeholder'}
      </StopCard>
      <StopCard title="Official Description">{stop.short_description ?? stop.description}</StopCard>
      <StopCard title="Photo Gallery">Photo gallery placeholder</StopCard>
      <StopCard title="Video">Video placeholder</StopCard>
      <StopCard title="360 View">360 view placeholder</StopCard>
      <StopCard title="Audio Narration">Audio narration placeholder</StopCard>

      <div className="grid gap-2">
        <BrochureCTA href={brochureHref} />
        <WhatsAppCTA />
        <CallCTA href={callHref} />
      </div>

      <div className="grid gap-2">
        <Link href="/map" className="btn-primary inline-flex min-h-11 w-full items-center justify-center">
          Open Map
        </Link>
        <Link href="/locations" className="btn-secondary inline-flex min-h-11 w-full items-center justify-center">
          Back to Locations
        </Link>
      </div>
    </div>
  );
}
