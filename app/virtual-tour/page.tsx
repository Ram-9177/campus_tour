import { Suspense } from 'react';
import VirtualTourShell from '@/components/virtual/VirtualTourShell';

export default function VirtualTourPage() {
  return (
    <Suspense fallback={<div className="w-full h-screen flex items-center justify-center bg-slate-950 text-white">Loading virtual tour...</div>}>
      <VirtualTourShell />
    </Suspense>
  );
}
