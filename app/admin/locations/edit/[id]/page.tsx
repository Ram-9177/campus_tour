'use client';

import React, { useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import LocationForm from '@/components/admin/locations/LocationForm';
import { LocationStore } from '@/lib/locationStore';
import { useRouter, useParams } from 'next/navigation';
import type { CampusLocation } from '@/types/campusLocation';

export default function EditLocationPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [location, setLocation] = useState<CampusLocation | null>(null);

  useEffect(() => {
    if (id) {
      const data = LocationStore.getLocationById(id);
      if (data) {
        setLocation(data);
      } else {
        alert('Location not found');
        router.push('/admin/locations');
      }
    }
  }, [id, router]);

  const handleSave = (data: CampusLocation) => {
    LocationStore.updateLocation(id, data);
    router.push('/admin/locations');
  };

  const handleSaveAndStay = (data: CampusLocation) => {
    return LocationStore.updateLocation(id, data) || data;
  };

  if (!location) return <div className="p-8 text-center">Loading location data...</div>;

  return (
    <AdminShell title="Edit Location" subtitle={`Updating details for ${location.name.en}`} backHref="/admin/locations">
      <div className="py-6">
        <LocationForm 
          title="Edit Location"
          initialData={location}
          onSave={handleSave}
          onSaveAndStay={handleSaveAndStay}
          onCancel={() => router.push('/admin/locations')}
        />
      </div>
    </AdminShell>
  );
}
