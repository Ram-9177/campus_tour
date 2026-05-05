import Link from 'next/link';
import PageShell from '@/components/layout/PageShell';
import SectionHeader from '@/components/common/SectionHeader';

interface Building {
  id: string;
  name: string;
  description: string;
  type: string;
  floors: number;
  facilities: string[];
}

const BUILDINGS: Building[] = [
  {
    id: 'academic-block',
    name: 'Academic Block',
    description:
      'Main building housing classrooms, lecture halls, and faculty offices',
    type: 'Academic',
    floors: 5,
    facilities: ['Classrooms', 'Lecture Halls', 'Faculty Offices', 'Computer Labs'],
  },
  {
    id: 'library',
    name: 'Central Library',
    description:
      'State-of-the-art library with digital resources and study areas',
    type: 'Library',
    floors: 3,
    facilities: ['Reading Rooms', 'Computer Labs', 'Digital Archive', 'Study Areas'],
  },
  {
    id: 'science-block',
    name: 'Science Block',
    description: 'Dedicated facility for science laboratories and research',
    type: 'Sciences',
    floors: 4,
    facilities: ['Physics Lab', 'Chemistry Lab', 'Biology Lab', 'Research Facility'],
  },
  {
    id: 'admin-block',
    name: 'Administration Block',
    description: 'Administrative offices and student services center',
    type: 'Administration',
    floors: 3,
    facilities: ['Admissions Office', 'Registrar', 'Student Services', 'Finance Office'],
  },
  {
    id: 'it-block',
    name: 'IT Block',
    description: 'Information technology and computer science facility',
    type: 'Technology',
    floors: 3,
    facilities: ['Computer Labs', 'Server Room', 'IT Department Office', 'Dev Lab'],
  },
  {
    id: 'auditorium',
    name: 'Main Auditorium',
    description: 'Multi-purpose auditorium for events and seminars',
    type: 'Auditorium',
    floors: 2,
    facilities: ['Main Hall', 'Conference Rooms', 'Green Room', 'Sound System'],
  },
];

export default function BuildingsPage() {
  return (
    <PageShell title="Buildings" subtitle="Campus places" backHref="/">
      <SectionHeader
        title="Campus buildings"
        description="A quick list of major campus spaces for the mobile tour experience."
      />

      <section className="space-y-4">
        {BUILDINGS.map((building) => (
          <div key={building.id} className="card-hover">
            <div className="mb-2 flex items-start justify-between gap-3">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                {building.name}
              </h3>
              <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {building.type}
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {building.description}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {building.floors} floors
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {building.facilities.map((facility) => (
                <span
                  key={facility}
                  className="rounded-full bg-blue-50 px-2.5 py-1 text-xs text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                >
                  {facility}
                </span>
              ))}
            </div>
          </div>
        ))}
      </section>
    </PageShell>
  );
}
