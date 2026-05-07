'use client';

import React from 'react';
import type { AdmissionsCta } from '@/types/campusLocation';
import { trackApplyClick, trackBrochureClick, trackWhatsAppClick } from '@/lib/publicTourEvents';

interface Props {
  cta?: AdmissionsCta;
  locationId?: string;
}

const ExternalLinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.483 8.413-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.308 1.654zm6.757-4.032c1.599.951 3.159 1.428 4.776 1.428 5.25 0 9.52-4.272 9.523-9.522.001-2.545-1.001-4.931-2.822-6.753s-4.208-2.823-6.753-2.823c-5.25 0-9.521 4.272-9.523 9.522-.001 1.767.487 3.493 1.413 4.997l-.996 3.637 3.733-.979zm11.365-6.666c-.11-.184-.403-.294-.77-.478s-2.164-1.066-2.502-1.176c-.326-.123-.55-.184-.77.123s-.843 1.066-1.033 1.277-.384.23-.75.051c-.366-.184-1.547-.57-2.946-1.819-1.088-.971-1.821-2.171-2.041-2.546-.22-.375-.023-.578.161-.762s.366-.439.55-.661c.184-.22.244-.375.366-.633s.061-.478-.03-.661c-.091-.184-.77-1.854-1.056-2.546-.282-.685-.563-.591-.77-.601-.202-.01-.433-.01-.661-.01s-.599.084-.91.439-1.18 1.155-1.18 2.812.91 3.255 1.033 3.415c.123.161 2.316 3.535 5.612 4.954.783.337 1.393.538 1.868.689.789.251 1.507.216 2.072.131.631-.091 2.164-.881 2.47-1.733.306-.851.306-1.579.213-1.732z" />
  </svg>
);

export default function AdmissionsCTASection({ cta, locationId }: Props) {
  if (!cta) return null;

  const hasCTAs = cta.applyUrl || cta.brochureUrl || cta.whatsappUrl;
  if (!hasCTAs) return null;

  return (
    <div className="mt-8 space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-1 flex-1 bg-slate-100 rounded-full" />
        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Admissions Office</span>
        <div className="h-1 flex-1 bg-slate-100 rounded-full" />
      </div>

      <div className="grid grid-cols-1 gap-3">
        {cta.applyUrl && (
          <a
            href={cta.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackApplyClick(locationId)}
            className="flex h-16 w-full items-center justify-center gap-3 rounded-2xl bg-blue-600 text-white shadow-[0_12px_24px_-8px_rgba(37,99,235,0.4)] transition-all hover:bg-blue-700 active:scale-[0.98]"
          >
            <span className="text-lg font-black tracking-tight">Apply Online for 2026</span>
            <ExternalLinkIcon />
          </a>
        )}

        <div className="grid grid-cols-2 gap-3">
          {cta.brochureUrl && (
            <a
              href={cta.brochureUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackBrochureClick(locationId)}
              className="flex h-14 items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white text-slate-800 transition-all hover:bg-slate-50 active:scale-[0.98]"
            >
              <span className="text-sm font-black tracking-tight">Brochure</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </a>
          )}

          {cta.whatsappUrl && (
            <a
              href={cta.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick(locationId)}
              className="flex h-14 items-center justify-center gap-2 rounded-2xl border-2 border-emerald-100 bg-emerald-50 text-emerald-800 transition-all hover:bg-emerald-100 active:scale-[0.98]"
            >
              <WhatsAppIcon />
              <span className="text-sm font-black tracking-tight">Chat</span>
            </a>
          )}
        </div>
      </div>

      {cta.counsellorText && (
        <p className="text-center text-xs font-bold text-slate-400 italic">
          “{cta.counsellorText}”
        </p>
      )}
    </div>
  );
}
