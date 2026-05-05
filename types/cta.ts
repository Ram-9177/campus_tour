/**
 * Call-to-Action (CTA) types
 * For contact and engagement without collecting personal data
 */

/**
 * Generic CTA contact information
 */
export interface CTAContact {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  displayOrder?: number;
  enabled?: boolean;
}

/**
 * WhatsApp CTA for messaging
 */
export interface WhatsAppCTA extends CTAContact {
  phoneNumber: string;
  defaultMessage?: string; // Message to pre-fill in WhatsApp
  businessName?: string;
  responseTime?: string; // e.g., "Usually replies in 1 hour"
  availableHours?: {
    startTime: string;
    endTime: string;
    days?: string[]; // e.g., ['Monday', 'Tuesday', ...]
  };
}

/**
 * Phone call CTA
 */
export interface CallCTA extends CTAContact {
  phoneNumber: string;
  departmentName?: string;
  extension?: string;
  supportType?: 'admissions' | 'general' | 'technical' | 'student_services' | 'other';
  availableHours?: {
    startTime: string;
    endTime: string;
    days?: string[];
  };
  voicemail?: boolean;
}

/**
 * Email CTA
 */
export interface EmailCTA extends CTAContact {
  emailAddress: string;
  departmentName?: string;
  responseTime?: string; // e.g., "Within 24 hours"
  subject?: string; // Suggested subject line
}

/**
 * CTA Collection
 */
export interface CTACollection {
  id: string;
  name: string;
  description?: string;
  ctaItems: (CTAContact | WhatsAppCTA | CallCTA | EmailCTA)[];
  createdAt?: Date;
  updatedAt?: Date;
}
