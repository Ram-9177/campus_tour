import AdminShell from '@/components/admin/AdminShell';
import AdminModuleCard from '@/components/admin/AdminModuleCard';
import AdminCrudPanel from '@/components/admin/AdminCrudPanel';

export default function AdminBrochuresPage() {
  return (
    <AdminShell title="Brochures Admin" subtitle="Manage brochure content">
      <AdminModuleCard
        title="Brochures Module"
        description="Brochures CMS placeholder. Future brochure activation and file linking can connect here."
      />
      <div className="mt-3">
        <AdminCrudPanel
          title="Brochures CRUD"
          itemLabel="Brochure"
          initialItems={[
            { id: 'b1', name: 'SMRU Campus Guide', note: 'Active' },
            { id: 'b2', name: 'Admissions Brochure', note: 'Inactive' },
          ]}
        />
      </div>
    </AdminShell>
  );
}
