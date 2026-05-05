import PageShell from '@/components/layout/PageShell';
import SectionHeader from '@/components/common/SectionHeader';

interface Facility {
  id: string;
  name: string;
  description: string;
  category: string;
  hours: string;
  contact?: string;
}

const FACILITIES: Facility[] = [
  {
    id: 'cafeteria',
    name: 'Main Cafeteria',
    description:
      'Multi-cuisine dining facility with vegetarian and non-vegetarian options',
    category: 'Dining',
    hours: '7:00 AM - 9:00 PM',
    contact: 'cafeteria@smru.edu.in',
  },
  {
    id: 'sports',
    name: 'Sports Complex',
    description: 'State-of-the-art sports facility with gymnasium and outdoor grounds',
    category: 'Sports',
    hours: '6:00 AM - 9:00 PM',
    contact: 'sports@smru.edu.in',
  },
  {
    id: 'medical',
    name: 'Medical Center',
    description: 'On-campus health clinic with emergency services',
    category: 'Medical',
    hours: '8:00 AM - 6:00 PM',
    contact: 'medical@smru.edu.in',
  },
  {
    id: 'transport',
    name: 'Transport Center',
    description: 'Campus shuttle and transportation services',
    category: 'Transport',
    hours: '5:00 AM - 10:00 PM',
    contact: 'transport@smru.edu.in',
  },
  {
    id: 'hostels',
    name: 'Student Hostels',
    description: 'Residential facilities for domestic and international students',
    category: 'Residential',
    hours: '24 Hours',
    contact: 'hostels@smru.edu.in',
  },
  {
    id: 'it-center',
    name: 'IT Help Center',
    description: 'Technical support and computer facility assistance',
    category: 'Technology',
    hours: '8:00 AM - 5:00 PM',
    contact: 'ithelpdesk@smru.edu.in',
  },
  {
    id: 'counseling',
    name: 'Counseling Center',
    description: 'Student support and career counseling services',
    category: 'Support',
    hours: '9:00 AM - 5:00 PM',
    contact: 'counseling@smru.edu.in',
  },
  {
    id: 'bookstore',
    name: 'Campus Bookstore',
    description: 'Books, stationery, and educational materials',
    category: 'Retail',
    hours: '8:00 AM - 7:00 PM',
    contact: 'bookstore@smru.edu.in',
  },
  {
    id: 'parking',
    name: 'Parking Facility',
    description: 'Multi-level parking for vehicles',
    category: 'Parking',
    hours: '24 Hours',
    contact: 'parking@smru.edu.in',
  },
  {
    id: 'wifi',
    name: 'WiFi Network',
    description: 'Campus-wide high-speed WiFi connectivity',
    category: 'Connectivity',
    hours: '24 Hours',
    contact: 'network@smru.edu.in',
  },
];

export default function FacilitiesPage() {
  return (
    <PageShell title="Facilities" subtitle="Campus services" backHref="/">
      <SectionHeader
        title="Facilities"
        description="Key support areas are listed below in a simple mobile-friendly layout."
      />

      <section className="space-y-4">
        {FACILITIES.map((facility) => (
          <div key={facility.id} className="card-hover">
            <div className="mb-2 flex items-start justify-between gap-3">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                {facility.name}
              </h3>
              <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {facility.category}
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {facility.description}
            </p>
            <div className="mt-3 space-y-1 text-sm text-slate-600 dark:text-slate-400">
              <p>Hours: {facility.hours}</p>
              {facility.contact ? <p>Contact: {facility.contact}</p> : null}
            </div>
          </div>
        ))}
      </section>
    </PageShell>
  );
}
