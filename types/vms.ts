/**
 * VMS (Visitor Management System) types
 * For future integration - no personal data collected
 */

/**
 * VMS Context - Integration point for visitor management system
 * Does NOT collect personal data (name, mobile, email, address, etc.)
 * Location is NOT stored as personal data
 */
export interface VMSContext {
  /**
   * Optional source of the visit
   * e.g., "google_search", "campus_website", "qr_code", "direct"
   */
  source?: string;

  /**
   * Optional unique visit identifier from VMS
   * Used to correlate with external VMS system if needed
   */
  visit_id?: string;

  /**
   * Optional tour route being taken
   * Identifies which campus tour route is being used
   */
  route?: string;

  /**
   * Optional authentication token for VMS integration
   * Used if VMS system requires token-based authentication
   */
  token?: string;

  /**
   * Timestamp when context was created
   */
  timestamp: Date;
}

/**
 * VMS Integration Configuration
 * Settings for connecting to external VMS systems
 */
export interface VMSIntegration {
  enabled: boolean;
  apiEndpoint?: string;
  authMethod?: 'token' | 'oauth' | 'basic' | 'none';
  timeout?: number; // in milliseconds
}

/**
 * VMS Event Log
 * Logs tour interactions without personal data
 */
export interface VMSEventLog {
  id: string;
  eventType: 'tour_start' | 'stop_visit' | 'route_completed' | 'ai_query' | 'brochure_download';
  vmsContext?: VMSContext;
  timestamp: Date;
  metadata?: {
    routeId?: string;
    stopId?: string;
    duration?: number;
  };
}
