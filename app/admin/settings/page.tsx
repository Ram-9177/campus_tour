import AdminShell from '@/components/admin/AdminShell';
import ModeExperienceSettings from '@/components/admin/settings/ModeExperienceSettings';

export default function AdminSettingsPage() {
  return (
    <AdminShell title="Settings" subtitle="App configuration and global settings" backHref="/admin">
      <section className="space-y-6">
        {/* App Configuration */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">📱 App Configuration</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div>
                <div className="font-medium text-slate-900">Campus Name</div>
                <div className="text-xs text-slate-600">Public campus identifier</div>
              </div>
              <div className="font-mono text-sm text-slate-700">SMRU Campus</div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div>
                <div className="font-medium text-slate-900">Main App URL</div>
                <div className="text-xs text-slate-600">Primary access point</div>
              </div>
              <div className="font-mono text-sm text-slate-700">https://tour.smru.edu.in</div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div>
                <div className="font-medium text-slate-900">App Version</div>
                <div className="text-xs text-slate-600">Current release</div>
              </div>
              <div className="font-mono text-sm text-slate-700">1.0.0</div>
            </div>
          </div>
        </div>

        {/* Languages */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">🌐 Languages</h2>
          <p className="text-sm text-slate-600 mb-4">
            Manage available languages for location content, scripts, and audio guides.
          </p>
          <div className="space-y-2">
            {[
              { code: 'en', name: '🇬🇧 English', status: 'Active' },
              { code: 'te', name: '🇮🇳 Telugu (తెలుగు)', status: 'Active' },
              { code: 'hi', name: '🇮🇳 Hindi (हिन्दी)', status: 'Active' },
            ].map((lang) => (
              <div
                key={lang.code}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200"
              >
                <div>
                  <div className="font-medium text-slate-900">{lang.name}</div>
                  <div className="text-xs text-slate-600">Code: {lang.code}</div>
                </div>
                <div className="flex gap-1">
                  <span className="px-2 py-1 rounded bg-green-100 text-green-900 text-xs font-medium">
                    {lang.status}
                  </span>
                  <button className="px-2 py-1 rounded bg-blue-100 hover:bg-blue-200 text-blue-900 text-xs font-medium transition">
                    Settings
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <ModeExperienceSettings />

        {/* Feature Flags */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">⚙️ Feature Flags</h2>
          <div className="space-y-2">
            {[
              { flag: 'ENABLE_GPS_TRACKING', desc: 'Allow Walk With Me mode GPS', enabled: true },
              { flag: 'ENABLE_AUDIO_PLAYBACK', desc: 'Audio guide narration', enabled: true },
              { flag: 'ENABLE_OFFLINE_MODE', desc: 'Offline app functionality', enabled: true },
              { flag: 'SHOW_DEBUG_LAYERS', desc: 'Show map debug overlays', enabled: false },
            ].map((item) => (
              <div key={item.flag} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <div className="font-mono text-sm font-medium text-slate-900">{item.flag}</div>
                  <div className="text-xs text-slate-600">{item.desc}</div>
                </div>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked={item.enabled} className="rounded" />
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Campus Data */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">📊 Campus Data</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-center">
              <div className="text-xs font-semibold text-slate-600">Locations</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">10</div>
            </div>
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-center">
              <div className="text-xs font-semibold text-slate-600">Map Points</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">22</div>
            </div>
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-center">
              <div className="text-xs font-semibold text-slate-600">Cart Stops</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">8</div>
            </div>
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-center">
              <div className="text-xs font-semibold text-slate-600">Media Files</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">47</div>
            </div>
          </div>
          <button className="mt-4 w-full py-2 rounded-lg border border-dashed border-slate-300 hover:bg-slate-50 text-slate-700 font-medium transition">
            📥 Import / 📤 Export Data
          </button>
        </div>

        {/* QR Codes */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">🔗 QR Codes</h2>
          <p className="text-sm text-slate-600 mb-4">Generate QR codes for quick access to exploration modes.</p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { name: 'Main App', url: 'https://tour.smru.edu.in' },
              { name: 'Walk Mode', url: 'https://tour.smru.edu.in/map?mode=walk' },
            ].map((qr) => (
              <div key={qr.name} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="font-medium text-slate-900 mb-2">{qr.name}</div>
                <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-white mb-2">
                  <span className="text-xs text-slate-500">QR Code Placeholder</span>
                </div>
                <button className="w-full py-1.5 rounded bg-blue-100 hover:bg-blue-200 text-blue-900 text-xs font-medium transition">
                  Generate
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Future settings */}
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <div className="text-sm font-semibold text-amber-900 mb-2">🔮 Future CMS Features</div>
          <ul className="text-sm text-amber-800 space-y-1">
            <li>✓ Multi-language content management interface</li>
            <li>✓ Route sequencing and ordering tools</li>
            <li>✓ Feature toggle dashboard</li>
            <li>✓ Data import/export with backup</li>
            <li>✓ QR code generation for all access points</li>
            <li>✓ Analytics and usage tracking settings</li>
            <li>✓ Theme customization and branding</li>
            <li>✓ API key management (future backend)</li>
          </ul>
        </section>
      </section>
    </AdminShell>
  );
}
