export default function MapLegend() {
  const items = [
    { label: 'Campus Roads', color: 'bg-orange-500' },
    { label: 'Tour Stops', color: 'bg-blue-500' },
    { label: 'Selected Stop', color: 'bg-blue-700' },
  ];

  return (
    <section className="panel-soft p-3.5 shadow-sm">
      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-700">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
            <span className={`h-3.5 w-3.5 shrink-0 rounded-full ${item.color}`} aria-hidden="true" />
            <span className="font-medium text-slate-700">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
