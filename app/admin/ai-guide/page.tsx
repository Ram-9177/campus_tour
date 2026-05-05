import AdminShell from '@/components/admin/AdminShell';
import AdminModuleCard from '@/components/admin/AdminModuleCard';
import AdminCrudPanel from '@/components/admin/AdminCrudPanel';

export default function AdminAIGuidePage() {
  return (
    <AdminShell title="AI Guide Admin" subtitle="Manage assistant content">
      <AdminModuleCard
        title="AI Guide Q&A Module"
        description="AI guide CMS placeholder. Future approved question/answer management can connect here."
      />
      <div className="mt-3">
        <AdminCrudPanel
          title="AI Guide Q&A CRUD"
          itemLabel="Q&A Item"
          initialItems={[
            { id: 'a1', name: 'Where is the library?', note: 'Navigation' },
            { id: 'a2', name: 'How to reach hostel?', note: 'Navigation' },
          ]}
        />
      </div>
    </AdminShell>
  );
}
