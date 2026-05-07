'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const VirtualTourShell = dynamic(() => import('@/components/virtual/VirtualTourShell'), { ssr: false });

export default function VirtualTourPage() {
  return (
    <Suspense fallback={<div className="tour-shell flex h-screen w-full items-center justify-center text-slate-800 text-lg font-semibold">Loading virtual tour...</div>}>
      <VirtualTourShell />
    </Suspense>
  );
}
