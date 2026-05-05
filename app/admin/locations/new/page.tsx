'use client';

import React from 'react';
import AdminShell from '@/components/admin/AdminShell';
import LocationForm from '@/components/admin/locations/LocationForm';
import { LocationStore } from '@/lib/locationStore';
import { useRouter } from 'next/navigation';

export default function NewLocationPage() {
  const router = useRouter();

  const handleSave = (data: any) => {
    LocationStore.createLocation(data);
    router.push('/admin/locations');
  };

  return (
    <AdminShell title="Add New Location" subtitle="Create a new campus USP or point of interest" backHref="/admin/locations">
      <div className="py-6">
        <LocationForm 
          title="Create Location"
          onSave={handleSave}
          onCancel={() => router.push('/admin/locations')}
        />
      </div>
    </AdminShell>
  );
}
