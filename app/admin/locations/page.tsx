import React from 'react';
import AdminShell from '@/components/admin/AdminShell';
import AdminLocationsList from '@/components/admin/locations/AdminLocationsList';
import LocationImportExport from '@/components/admin/locations/LocationImportExport';

export default function AdminLocationsPage() {
  return (
    <AdminShell 
      title="Location Management" 
      subtitle="Manage campus USP points, audio guides, and map markers"
      backHref="/admin"
    >
      <LocationImportExport />
      <AdminLocationsList />
    </AdminShell>
  );
}
