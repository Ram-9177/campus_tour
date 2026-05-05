/**
 * Navigation utilities
 */

import { ROUTES_NAV, ADMIN_ROUTES } from './constants';

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  children?: NavItem[];
}

export const publicNavigation: NavItem[] = [
  {
    label: 'Home',
    href: ROUTES_NAV.HOME,
  },
  {
    label: 'Routes',
    href: ROUTES_NAV.ROUTES,
  },
  {
    label: 'Map',
    href: ROUTES_NAV.MAP,
  },
  {
    label: 'AI Guide',
    href: ROUTES_NAV.AI_GUIDE,
  },
  {
    label: 'Brochures',
    href: ROUTES_NAV.BROCHURES,
  },
];

export const adminNavigation: NavItem[] = [
  {
    label: 'Dashboard',
    href: ADMIN_ROUTES.DASHBOARD,
  },
  {
    label: 'Routes',
    href: ADMIN_ROUTES.ROUTES,
  },
  {
    label: 'Stops',
    href: ADMIN_ROUTES.STOPS,
  },
  {
    label: 'Map',
    href: ADMIN_ROUTES.MAP,
  },
  {
    label: 'Media',
    href: ADMIN_ROUTES.MEDIA,
  },
  {
    label: 'Brochures',
    href: ADMIN_ROUTES.BROCHURES,
  },
  {
    label: 'AI Guide',
    href: ADMIN_ROUTES.AI_GUIDE,
  },
  {
    label: 'Settings',
    href: ADMIN_ROUTES.SETTINGS,
  },
];

export function isAdminRoute(pathname: string): boolean {
  return pathname.startsWith('/admin');
}
