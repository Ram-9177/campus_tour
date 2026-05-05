export default function MapLegend() {
  const items = [
    { label: 'Blocks', color: 'bg-blue-600' },
    { label: 'Internal Roads', color: 'bg-slate-500' },
    { label: 'Walking Paths', color: 'bg-cyan-600' },
    { label: 'Cart Routes', color: 'bg-sky-500' },
    { label: 'Cart Stops', color: 'bg-sky-700' },
    { label: 'Parking Points', color: 'bg-indigo-500' },
    { label: 'Drop Points', color: 'bg-violet-500' },
    { label: 'Stop Markers', color: 'bg-teal-600' },
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Map Legend</h3>
      <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-700">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2.5 rounded-lg hover:bg-slate-50 px-2 py-1.5 transition">
            <span className={`h-3 w-3 rounded-full shrink-0 ${item.color}`} aria-hidden="true" />
            <span className="text-slate-700 font-medium">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
