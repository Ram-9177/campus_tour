import AdminShell from '@/components/admin/AdminShell';
import AdminModuleCard from '@/components/admin/AdminModuleCard';
import AdminCrudPanel from '@/components/admin/AdminCrudPanel';

export default function AdminRoutesPage() {
  return (
    <AdminShell title="Routes Admin" subtitle="Manage seeded routes">
      <AdminModuleCard
        title="Routes Module"
        description="Routes CMS placeholder. Future route publishing and ordering tools can connect here."
      />
      <div className="mt-3">
        <AdminCrudPanel
          title="Routes CRUD"
          itemLabel="Route"
          initialItems={[
            { id: 'r1', name: 'Main Admissions Tour', note: 'Published' },
            { id: 'r2', name: 'Engineering & Digital Health Tour', note: 'Published' },
          ]}
        />
      </div>
    </AdminShell>
  );
}
