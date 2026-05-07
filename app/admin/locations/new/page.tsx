'use client';

import React from 'react';
import AdminShell from '@/components/admin/AdminShell';
import LocationForm from '@/components/admin/locations/LocationForm';
import { LocationStore } from '@/lib/locationStore';
import { useRouter } from 'next/navigation';
import type { CampusLocation } from '@/types/campusLocation';
import { useState } from 'react';

export default function NewLocationPage() {
  const router = useRouter();
  const [savedId, setSavedId] = useState<string | null>(null);

  const upsert = (data: CampusLocation): CampusLocation => {
    if (savedId) {
      const updated = LocationStore.updateLocation(savedId, data);
      return updated || data;
    }
    const created = LocationStore.createLocation(data);
    setSavedId(created.id);
    return created;
  };

  const handleSave = (data: CampusLocation) => {
    upsert(data);
    router.push('/admin/locations');
  };

  const handleSaveAndStay = (data: CampusLocation) => {
    const saved = upsert(data);
    if (!savedId) {
      router.replace(`/admin/locations/edit/${saved.id}`);
    }
    return saved;
  };

  return (
    <AdminShell title="Add New Location" subtitle="Create a new campus USP or point of interest" backHref="/admin/locations">
      <div className="py-6">
        <LocationForm 
          title="Create Location"
          onSave={handleSave}
          onSaveAndStay={handleSaveAndStay}
          onCancel={() => router.push('/admin/locations')}
        />
      </div>
    </AdminShell>
  );
}
