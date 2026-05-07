'use client';

interface OutsideCampusVirtualOnlyProps {
  message?: string | null;
  onOpenVirtualTour: () => void;
}

export default function OutsideCampusVirtualOnly({ message, onOpenVirtualTour }: OutsideCampusVirtualOnlyProps) {
  return (
    <section className="mx-auto w-full max-w-xl px-6 text-center animate-in">
      <div className="mb-12 flex flex-col items-center">
        <div className="relative mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-slate-50 text-blue-600 shadow-inner">
           <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
           <div className="absolute -right-1 -top-1 h-8 w-8 rounded-full bg-red-500 text-white flex items-center justify-center border-4 border-white">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
           </div>
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Visit Remotely</h1>
        <p className="mt-4 text-xl font-medium text-slate-600">You are currently outside the campus boundaries.</p>
      </div>

      <div className="panel-soft p-8 bg-blue-50/50 border-blue-100 text-slate-700 font-bold leading-relaxed mb-12 text-lg">
        {message || "We could not verify your location within SMRU Campus. Guided physical tours are optimized for visitors physically present on-site."}
      </div>

      <button
        type="button"
        onClick={onOpenVirtualTour}
        className="flex h-20 w-full items-center justify-center rounded-[2.5rem] bg-blue-600 px-8 text-2xl font-black text-white shadow-[0_24px_48px_-12px_rgba(37,99,235,0.45)] transition-all hover:bg-blue-700 active:scale-95"
      >
        Start Virtual Journey
      </button>

      <div className="mt-12 flex items-center justify-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
        <span className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          Global Access
        </span>
        <span className="h-1.5 w-1.5 rounded-full bg-slate-200" />
        <span className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          Safe & Secure
        </span>
      </div>
    </section>
  );
}
