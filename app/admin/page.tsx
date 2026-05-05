import AdminShell from '@/components/admin/AdminShell';
import AdminModuleCard from '@/components/admin/AdminModuleCard';

export default function AdminDashboard() {
  const modules = [
    {
      title: 'Locations',
      href: '/admin/locations',
      icon: '📍',
      description: 'Manage campus locations with GPS coordinates, radius detection, and media',
    },
    {
      title: 'Map Files',
      href: '/admin/map',
      icon: '🗺',
      description: 'Configure SVG map layers, roads, campus points, and coordinate systems',
    },
    {
      title: 'Audio Scripts',
      href: '/admin/audio',
      icon: '🎙',
      description: 'Record and manage multilingual audio guides (English, Telugu, Hindi)',
    },
    {
      title: 'Media Assets',
      href: '/admin/media',
      icon: '📸',
      description: 'Upload images, videos, and 360° panoramas for locations',
    },
    {
      title: 'Routes',
      href: '/admin/routes',
      icon: '🛤',
      description: 'Configure tour routes and guided sequences',
    },
    {
      title: 'Settings',
      href: '/admin/settings',
      icon: '⚙️',
      description: 'Global app configuration, languages, and feature flags',
    },
  ];

  return (
    <AdminShell title="Admin" subtitle="CMS placeholder dashboard" backHref="/">
      {/* Welcome section */}
      <section className="mb-6 rounded-2xl border border-blue-200 bg-linear-to-r from-blue-50 to-cyan-50 p-6 shadow-sm">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Welcome to Campus Tour CMS</h2>
            <p className="text-sm text-slate-600 mt-1">
              Single-campus admin for SMRU. Manage location content, scripts, and audio flow for this campus only.
            </p>
          </div>
          <div className="text-4xl">📋</div>
        </div>
      </section>

      {/* Info cards */}
      <section className="mb-6 grid md:grid-cols-3 gap-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="text-sm font-semibold text-slate-700">Total Locations</div>
          <div className="text-3xl font-bold text-slate-900 mt-1">10</div>
          <div className="text-xs text-slate-600 mt-2">All active and discoverable</div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="text-sm font-semibold text-slate-700">Exploration Modes</div>
          <div className="text-3xl font-bold text-slate-900 mt-1">5</div>
          <div className="text-xs text-slate-600 mt-2">Smart, Manual, Walk, Cart, Virtual</div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="text-sm font-semibold text-slate-700">Languages</div>
          <div className="text-3xl font-bold text-slate-900 mt-1">3</div>
          <div className="text-xs text-slate-600 mt-2">en, te, hi fully supported</div>
        </div>
      </section>

      {/* CMS Modules */}
      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">CMS Modules</h2>
        <p className="text-sm text-slate-600 mb-6">
          Manage all aspects of the campus tour application. Future features include database persistence, file uploads, and admin authentication.
        </p>

        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {modules.map((module) => (
            <a
              key={module.title}
              href={module.href}
              className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition bg-white"
            >
              <div className="text-3xl mb-2">{module.icon}</div>
              <h3 className="font-semibold text-slate-900 mb-1">{module.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{module.description}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Data Management */}
      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">🔄 Data Management</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <button className="p-4 rounded-lg border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50 text-slate-700 font-medium transition text-center">
            📥 Import Data
          </button>
          <button className="p-4 rounded-lg border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50 text-slate-700 font-medium transition text-center">
            📤 Export Data
          </button>
        </div>
        <p className="text-xs text-slate-600 mt-3">
          Import campus location data from JSON/CSV files. Export current configuration for backup or version control.
        </p>
      </section>

      {/* Future roadmap */}
      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <div className="text-sm font-semibold text-amber-900 mb-3">🔮 Future CMS Roadmap</div>
        <div className="space-y-2 text-sm text-amber-800">
          <div className="flex gap-2">
            <span>📦</span>
            <span>Database persistence (PostgreSQL/MongoDB)</span>
          </div>
          <div className="flex gap-2">
            <span>🔐</span>
            <span>Admin authentication and role-based access control</span>
          </div>
          <div className="flex gap-2">
            <span>📤</span>
            <span>File upload and media management with CDN integration</span>
          </div>
          <div className="flex gap-2">
            <span>🎨</span>
            <span>Rich text editor for location descriptions and scripts</span>
          </div>
          <div className="flex gap-2">
            <span>🗓</span>
            <span>Scheduling and versioning for content updates</span>
          </div>
          <div className="flex gap-2">
            <span>📊</span>
            <span>Analytics and user engagement tracking</span>
          </div>
          <div className="flex gap-2">
            <span>🚀</span>
            <span>Live cart tracking integration with driver app</span>
          </div>
          <div className="flex gap-2">
            <span>⚡</span>
            <span>API endpoints for mobile app and third-party integrations</span>
          </div>
        </div>
      </section>
    </AdminShell>
  );
}
