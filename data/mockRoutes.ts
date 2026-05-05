/**
 * Mock route seed data for the six official SMRU campus tours.
 * The content is intentionally limited to safe placeholder information.
 */

export type RouteNavigationMode = 'guided' | 'self_paced' | 'walk_manual' | 'audio_only';

export interface MockRouteSeed {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  category: string;
  estimatedDuration: number;
  availableNavigationModes: RouteNavigationMode[];
  orderedStopIds: string[];
  locked: true;
  active: true;
}

export const mockRoutes: MockRouteSeed[] = [
  {
    id: 'route-admissions',
    slug: 'main-admissions-tour',
    title: 'Main Admissions Tour',
    shortDescription: 'A simple campus introduction for prospective students and families.',
    category: 'Admissions',
    estimatedDuration: 60,
    availableNavigationModes: ['guided', 'walk_manual'],
    orderedStopIds: ['stop-main-gate', 'stop-welcome-center', 'stop-academic-block', 'stop-library', 'stop-cafeteria'],
    locked: true,
    active: true,
  },
  {
    id: 'route-rehab-health',
    slug: 'rehabilitation-allied-health-tour',
    title: 'Rehabilitation & Allied Health Tour',
    shortDescription: 'A route focused on rehabilitation and allied health learning spaces.',
    category: 'Health Sciences',
    estimatedDuration: 55,
    availableNavigationModes: ['self_paced', 'guided'],
    orderedStopIds: ['stop-academic-block', 'stop-health-sciences', 'stop-therapy-labs', 'stop-research-center'],
    locked: true,
    active: true,
  },
  {
    id: 'route-engineering',
    slug: 'engineering-digital-health-tour',
    title: 'Engineering & Digital Health Tour',
    shortDescription: 'A route covering engineering and digital health learning areas.',
    category: 'Engineering',
    estimatedDuration: 60,
    availableNavigationModes: ['self_paced', 'guided'],
    orderedStopIds: ['stop-academic-block', 'stop-engineering-lab', 'stop-innovation-hub', 'stop-digital-health-center'],
    locked: true,
    active: true,
  },
  {
    id: 'route-hostel-life',
    slug: 'hostel-life-tour',
    title: 'Hostel Life Tour',
    shortDescription: 'A short look at residential spaces and student living areas.',
    category: 'Residential Life',
    estimatedDuration: 50,
    availableNavigationModes: ['walk_manual', 'guided'],
    orderedStopIds: ['stop-hostel-entrance', 'stop-hostel-block-a', 'stop-common-room', 'stop-sports-field'],
    locked: true,
    active: true,
  },
  {
    id: 'route-parent-trust',
    slug: 'parent-trust-tour',
    title: 'Parent Trust Tour',
    shortDescription: 'A calm overview of common support and safety touchpoints for parents and guardians.',
    category: 'Parent Information',
    estimatedDuration: 60,
    availableNavigationModes: ['guided', 'audio_only'],
    orderedStopIds: ['stop-welcome-center', 'stop-academic-support', 'stop-counseling-center', 'stop-safety-security', 'stop-hostel-block-a'],
    locked: true,
    active: true,
  },
  {
    id: 'route-accessibility',
    slug: 'accessibility-inclusion-tour',
    title: 'Accessibility & Inclusion Tour',
    shortDescription: 'A route highlighting accessible pathways and inclusive campus areas.',
    category: 'Accessibility',
    estimatedDuration: 55,
    availableNavigationModes: ['walk_manual', 'guided'],
    orderedStopIds: ['stop-main-gate', 'stop-accessible-pathways', 'stop-accessibility-services', 'stop-inclusive-spaces'],
    locked: true,
    active: true,
  },
];

export function getRouteBySlug(slug: string): MockRouteSeed | undefined {
  return mockRoutes.find((route) => route.slug === slug);
}

export function getAllRoutes(): MockRouteSeed[] {
  return mockRoutes;
}
