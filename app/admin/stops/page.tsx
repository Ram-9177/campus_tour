import AdminShell from '@/components/admin/AdminShell';
import AdminModuleCard from '@/components/admin/AdminModuleCard';
import AdminCrudPanel from '@/components/admin/AdminCrudPanel';

export default function AdminStopsPage() {
  return (
    <AdminShell title="Stops Admin" subtitle="Manage seeded stops">
      <AdminModuleCard
        title="Stops Module"
        description="Stops CMS placeholder. Future stop metadata and media mapping tools can connect here."
      />
      <div className="mt-3">
        <AdminCrudPanel
          title="Stops CRUD"
          itemLabel="Stop"
          initialItems={[
            { id: 's1', name: 'Main Gate', note: 'Entry' },
            { id: 's2', name: 'Welcome Center', note: 'Visitor Services' },
          ]}
        />
      </div>
    </AdminShell>
  );
}
