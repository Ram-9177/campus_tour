/**
 * CMS Mock - For future CMS integration
 * Currently uses mock data, can be replaced with actual CMS API
 */

import { mockRoutes } from '@/data/mockRoutes';
import { mockStops } from '@/data/mockStops';
import { mockSettings } from '@/data/mockSettings';
import { mockBrochures } from '@/data/mockBrochures';

export class CMSMock {
  async getRoutes() {
    return mockRoutes;
  }

  async getRoute(slug: string) {
    return mockRoutes.find((r) => r.slug === slug);
  }

  async getStops() {
    return mockStops;
  }

  async getStop(slug: string) {
    return mockStops.find((s) => s.slug === slug);
  }

  async getSettings() {
    return mockSettings;
  }

  async getBrochures() {
    return mockBrochures;
  }

  async getBrochure(slug: string) {
    return mockBrochures.find((b) => b.slug === slug);
  }

  // Future: Add methods for creating/updating content
}

export const cmsMock = new CMSMock();
