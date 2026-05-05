/**
 * Mock application settings
 */

export const mockSettings = {
  app: {
    name: 'SMRU Campus Tour',
    version: '1.0.0',
    description: 'Interactive campus tour guide',
  },
  campus: {
    name: 'SMRU',
    address: 'New Delhi, India',
    phone: '+91-XXX-XXXX-XXXX',
    email: 'info@smru.edu.in',
    website: 'https://www.smru.edu.in',
  },
  tour: {
    defaultDuration: 60,
    languages: ['en'],
    features: {
      aiGuide: true,
      audioTours: true,
      maps: true,
      brochures: true,
    },
  },
  branding: {
    primaryColor: '#667eea',
    secondaryColor: '#764ba2',
    logoUrl: '/images/logo.png',
  },
};
