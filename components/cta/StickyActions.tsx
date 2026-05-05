'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { mockBrochures } from '@/data/mockBrochures';

export default function StickyActions() {
  const [open, setOpen] = useState(false);
  const featured = useMemo(() => mockBrochures.find((item) => item.featured) ?? mockBrochures[0], []);

  return (
    <aside className="fixed right-3 top-1/2 z-40 -translate-y-1/2">
      <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-2 shadow-[0_12px_32px_rgba(15,23,42,0.16)] backdrop-blur-xl">
        <Link
          href="https://wa.me/917331119438"
          target="_blank"
          className="mb-2 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-[#22c55e] to-[#16a34a] text-white shadow-md transition-all hover:scale-105 hover:shadow-lg"
          aria-label="Open WhatsApp"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
            <path d="M20.5 3.5A11.7 11.7 0 0 0 1.7 17.1L0 24l7.1-1.7A11.7 11.7 0 1 0 20.5 3.5Zm-8.8 18a9.7 9.7 0 0 1-4.9-1.3l-.3-.2-4.2 1 1.1-4.1-.2-.3A9.7 9.7 0 1 1 11.7 21.5Zm5.3-7.3c-.3-.1-1.8-.9-2.1-1s-.5-.1-.7.1-.8 1-1 1.2-.4.2-.7.1a7.8 7.8 0 0 1-2.3-1.4 8.7 8.7 0 0 1-1.6-2c-.2-.3 0-.5.1-.7l.5-.6.2-.5a.8.8 0 0 0 0-.5c-.1-.1-.7-1.7-1-2.3-.2-.5-.5-.4-.7-.4h-.6a1.2 1.2 0 0 0-.8.4 3.4 3.4 0 0 0-1 2.5 5.8 5.8 0 0 0 1.2 3.1 13.2 13.2 0 0 0 5 4.4 16.9 16.9 0 0 0 1.7.6 4.1 4.1 0 0 0 1.9.1 3.1 3.1 0 0 0 2-1.4 2.4 2.4 0 0 0 .2-1.4c-.1-.1-.3-.2-.6-.3Z" />
          </svg>
        </Link>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-[#2563eb] to-[#1d4ed8] text-white shadow-md transition-all hover:scale-105 hover:shadow-lg"
          aria-expanded={open}
          aria-controls="brochure-dropdown"
          aria-label="Open brochures"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
            <path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm8 1.5V8h4.5M8 12h8M8 16h8M8 8h3" />
          </svg>
        </button>

        {open ? (
          <div id="brochure-dropdown" className="mt-2 w-64 rounded-2xl border border-slate-200/90 bg-white/95 p-2 shadow-[0_12px_30px_rgba(15,23,42,0.16)] backdrop-blur">
            <a
              href={featured?.fileUrl ?? '/brochures'}
              download
              className="mb-1 block rounded-xl bg-linear-to-r from-slate-900 to-slate-700 px-3 py-2 text-xs font-semibold text-white"
            >
              Quick Download
            </a>
            <div className="max-h-56 overflow-auto">
              {mockBrochures.map((item) => (
                <a
                  key={item.id}
                  href={item.fileUrl}
                  download
                  className="block rounded-xl px-3 py-2 text-xs text-slate-700 transition-colors hover:bg-slate-100"
                >
                  {item.title}
                </a>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
