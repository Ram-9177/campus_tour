import AdminShell from '@/components/admin/AdminShell';
import { smruMapConfig } from '@/data/map/smruMapConfig';

export default function AdminMapPage() {
  return (
    <AdminShell title="Campus Map" subtitle="Manage map layers, roads, and campus points" backHref="/admin">
      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Map Manager</h2>
        <p className="text-sm text-slate-600 mb-6">
          Configure SVG-based campus map with roads, locations, and coordinate systems. All data is stored locally.
        </p>

        {/* Coordinate System Info */}
        <div className="mb-6 rounded-lg bg-slate-50 border border-slate-200 p-4">
          <h3 className="font-semibold text-slate-900 mb-3">📏 Coordinate System</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <div className="text-xs text-slate-600">Canvas Width</div>
              <div className="font-semibold text-slate-900">{smruMapConfig.coordinateSystem.width} px</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Canvas Height</div>
              <div className="font-semibold text-slate-900">{smruMapConfig.coordinateSystem.height} px</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Min Bounds (Lat, Lon)</div>
              <div className="font-mono text-xs text-slate-900">{smruMapConfig.bounds.minLat.toFixed(4)}, {smruMapConfig.bounds.minLon.toFixed(4)}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Max Bounds (Lat, Lon)</div>
              <div className="font-mono text-xs text-slate-900">{smruMapConfig.bounds.maxLat.toFixed(4)}, {smruMapConfig.bounds.maxLon.toFixed(4)}</div>
            </div>
          </div>
        </div>

        {/* Roads Management */}
        <div className="mb-6">
          <h3 className="font-semibold text-slate-900 mb-3">🛣 Internal Roads ({smruMapConfig.data.roads.length})</h3>
          <div className="space-y-2">
            {smruMapConfig.data.roads.map((road) => (
              <div key={road.id} className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-900">{road.name}</div>
                  <div className="text-xs text-slate-500 font-mono mt-1">{road.id}</div>
                </div>
                <div className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded">
                  {road.coordinates.length} pts
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Campus Points Management */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-900">📍 Campus Points/Blocks ({smruMapConfig.data.campusLocations.length})</h3>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Active Locations</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {smruMapConfig.data.campusLocations.map((block) => (
              <div key={block.id} className="p-3 bg-white border border-slate-200 rounded-lg flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <span className="text-blue-600 font-bold text-xs">{block.name?.[0]}</span>
                </div>
                <div>
                  <div className="font-medium text-slate-900">{block.name}</div>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-3 w-full py-2 rounded-lg border border-dashed border-slate-300 hover:bg-slate-50 text-slate-700 font-medium transition">
            + Add Block
          </button>
        </div>

        {/* Other Map Elements */}
        <div className="grid md:grid-cols-3 gap-3">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="text-xs font-semibold text-slate-700 mb-2">Junctions</div>
            <div className="text-sm font-semibold text-slate-900 mb-2">{smruMapConfig.data.junctionPoints.length}</div>
            <button className="text-xs px-2 py-1 rounded bg-blue-100 hover:bg-blue-200 text-blue-900 font-medium transition">
              Manage
            </button>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="text-xs font-semibold text-slate-700 mb-2">Boundary Exists</div>
            <div className="text-sm font-semibold text-slate-900 mb-2">{smruMapConfig.data.boundary ? 'Yes' : 'No'}</div>
            <button className="text-xs px-2 py-1 rounded bg-blue-100 hover:bg-blue-200 text-blue-900 font-medium transition">
              Manage
            </button>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="text-xs font-semibold text-slate-700 mb-2">Total Locations</div>
            <div className="text-sm font-semibold text-slate-900 mb-2">{smruMapConfig.data.campusLocations.length}</div>
            <button className="text-xs px-2 py-1 rounded bg-blue-100 hover:bg-blue-200 text-blue-900 font-medium transition">
              Manage
            </button>
          </div>
        </div>
      </section>

      {/* Future CMS features */}
      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <div className="text-sm font-semibold text-amber-900 mb-2">🔮 Future CMS Features</div>
        <ul className="text-sm text-amber-800 space-y-1">
          <li>✓ Interactive SVG map editor with drag-and-drop</li>
          <li>✓ Road pathway drawing tool</li>
          <li>✓ Block/point placement on canvas</li>
          <li>✓ GPS coordinate to canvas coordinate conversion</li>
          <li>✓ Map layer management (roads, paths, carts, stops)</li>
          <li>✓ Real-time preview of map changes</li>
          <li>✓ Import map files (KML, GeoJSON)</li>
          <li>✓ Map export and version control</li>
        </ul>
      </section>
    </AdminShell>
  );
}
