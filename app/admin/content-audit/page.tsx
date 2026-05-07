import ContentAuditDashboard from '@/components/admin/content/ContentAuditDashboard';

export const metadata = {
  title: 'Content Health Audit | SMRU Admin',
  description: 'Audit campus tour scripts, audio, and media variants.'
};

export default function ContentAuditPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Content Health Audit</h1>
        <p className="mt-1 text-slate-600 font-medium italic">
          Monitoring admissions storytelling readiness across Physical, Virtual, and Buggy modes.
        </p>
      </header>

      <ContentAuditDashboard />
    </div>
  );
}
