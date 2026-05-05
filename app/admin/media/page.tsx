import AdminShell from '@/components/admin/AdminShell';
import { campusLocations } from '@/data/campusLocations';

export default function AdminMediaPage() {
  return (
    <AdminShell title="Media Assets" subtitle="Manage images, videos, and 360° content" backHref="/admin">
      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Media Manager</h2>
        <p className="text-sm text-slate-600 mb-4">
          Upload and manage location media including images, videos, and immersive 360° panoramas.
        </p>

        {/* Media types overview */}
        <div className="grid md:grid-cols-4 gap-3 mb-6">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="text-2xl mb-2">📸</div>
            <div className="text-xs font-semibold text-slate-700">Images</div>
            <div className="text-sm font-bold text-slate-900 mt-1">
              {campusLocations.reduce((sum, loc) => sum + loc.images.length, 0)}
            </div>
            <div className="text-xs text-slate-600 mt-1">JPG, PNG, WebP</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="text-2xl mb-2">🎬</div>
            <div className="text-xs font-semibold text-slate-700">Videos</div>
            <div className="text-sm font-bold text-slate-900 mt-1">
              {campusLocations.reduce((sum, loc) => sum + loc.videos.length, 0)}
            </div>
            <div className="text-xs text-slate-600 mt-1">MP4, WebM</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="text-2xl mb-2">🌐</div>
            <div className="text-xs font-semibold text-slate-700">360° Tours</div>
            <div className="text-sm font-bold text-slate-900 mt-1">
              {campusLocations.filter(loc => loc.virtual360Url).length}
            </div>
            <div className="text-xs text-slate-600 mt-1">Panoramas</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="text-2xl mb-2">📁</div>
            <div className="text-xs font-semibold text-slate-700">Total Files</div>
            <div className="text-sm font-bold text-slate-900 mt-1">
              {campusLocations.reduce((sum, loc) => sum + loc.images.length + loc.videos.length, 0)}
            </div>
            <div className="text-xs text-slate-600 mt-1">All assets</div>
          </div>
        </div>

        {/* Media by location */}
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Media by Location</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {campusLocations.map((location) => (
            <div key={location.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-semibold text-slate-900">{location.name.en}</div>
                  <div className="flex gap-3 mt-2 text-xs text-slate-600">
                    <span>📸 Images: {location.images.length}</span>
                    <span>🎬 Videos: {location.videos.length}</span>
                    {location.virtual360Url && <span>🌐 360°: Available</span>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button className="px-2 py-1 rounded bg-blue-100 hover:bg-blue-200 text-blue-900 text-xs font-medium transition">
                    View
                  </button>
                  <button className="px-2 py-1 rounded bg-cyan-100 hover:bg-cyan-200 text-cyan-900 text-xs font-medium transition">
                    📤 Upload
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Upload guidelines */}
      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Upload Guidelines</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <div className="text-sm font-semibold text-slate-900 mb-2">📸 Images</div>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>✓ JPG, PNG, WebP formats</li>
              <li>✓ Min: 800×600 resolution</li>
              <li>✓ Max: 10 MB file size</li>
              <li>✓ Landscape orientation</li>
              <li>✓ High quality (72+ dpi)</li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900 mb-2">🎬 Videos</div>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>✓ MP4, WebM formats</li>
              <li>✓ 1920×1080 minimum</li>
              <li>✓ Max: 100 MB file size</li>
              <li>✓ 30 FPS frame rate</li>
              <li>✓ 2-5 minute duration</li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900 mb-2">🌐 360° Tours</div>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>✓ Equirectangular format</li>
              <li>✓ Min: 4096×2048 pixels</li>
              <li>✓ Max: 50 MB file size</li>
              <li>✓ Full spherical coverage</li>
              <li>✓ High bit-depth (8-bit+)</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Future features */}
      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <div className="text-sm font-semibold text-amber-900 mb-2">🔮 Future CMS Features</div>
        <ul className="text-sm text-amber-800 space-y-1">
          <li>✓ Drag-and-drop file upload</li>
          <li>✓ Image cropping and optimization</li>
          <li>✓ Video preview and transcoding</li>
          <li>✓ 360° panorama viewer</li>
          <li>✓ Media gallery editor</li>
          <li>✓ Automatic thumbnail generation</li>
          <li>✓ CDN integration and compression</li>
          <li>✓ Batch media management tools</li>
        </ul>
      </section>
    </AdminShell>
  );
}
