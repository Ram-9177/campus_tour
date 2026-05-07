interface LocationUnavailableFallbackProps {
  message?: string | null;
  onOpenVirtualTour: () => void;
  onTryLocationAgain: () => void;
  isCheckingLocation?: boolean;
}

export default function LocationUnavailableFallback({
  message,
  onOpenVirtualTour,
  onTryLocationAgain,
  isCheckingLocation = false,
}: LocationUnavailableFallbackProps) {
  return (
    <section className="mx-auto w-full max-w-xl px-4 text-center">
      <div className="mb-10 flex flex-col items-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100 text-4xl mb-6">
          ⚠️
        </div>
        <h1 className="text-3xl font-black text-slate-900">Location Not Found</h1>
        <p className="mt-3 text-lg text-slate-600">We could not confirm you are on campus.</p>
      </div>

      <div className="rounded-3xl bg-amber-50 p-6 text-amber-900 font-medium leading-relaxed mb-10">
        {message || "Please ensure your GPS is turned on and you have allowed location access in your browser."}
      </div>

      <div className="space-y-4">
        <button
          type="button"
          onClick={onOpenVirtualTour}
          className="flex h-16 w-full items-center justify-center rounded-3xl bg-blue-600 px-8 text-xl font-black text-white shadow-[0_20px_40px_-15px_rgba(37,99,235,0.6)]"
        >
          Open Virtual Tour
        </button>

        <button
          type="button"
          onClick={onTryLocationAgain}
          disabled={isCheckingLocation}
          className="flex h-16 w-full items-center justify-center rounded-3xl border-2 border-slate-200 bg-white px-8 text-xl font-bold text-slate-700 active:scale-95 disabled:opacity-50"
        >
          {isCheckingLocation ? 'Checking Location...' : 'Try Location Again'}
        </button>
      </div>

      <p className="mt-8 text-xs font-bold text-slate-400 uppercase tracking-widest">
         Location data is never stored or shared.
      </p>
    </section>
  );
}
