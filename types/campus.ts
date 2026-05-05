/**
 * Campus and building types
 */

/**
 * Geographic coordinate on campus
 */
export interface CampusCoordinate {
  lat: number;
  lng: number;
  elevation?: number; // in meters
}

/**
 * Academic/administrative block on campus
 */
export interface CampusBlock {
  id: string;
  name: string;
  code?: string; // e.g., "A1", "B2"
  description: string;
  blockType: 'academic' | 'administrative' | 'residential' | 'sports' | 'dining' | 'medical' | 'library' | 'auditorium' | 'other';
  location: CampusCoordinate;
  image?: string;
  floorCount: number;
  yearConstructed?: number;
  totalArea?: number; // in sq meters
  facilities?: string[];
  departments?: string[];
  offices?: string[];
  classrooms?: number;
  labs?: number;
  accessibility?: {
    wheelchair_access: boolean;
    ramps: boolean;
    elevators: boolean;
    accessible_restrooms: boolean;
  };
  contact?: {
    phone?: string;
    email?: string;
  };
  operating_hours?: {
    open: string;
    close: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Road/pathway on campus
 */
export interface CampusRoad {
  id: string;
  name: string;
  roadType: 'main_road' | 'internal_road' | 'lane' | 'alley';
  description?: string;
  coordinates: CampusCoordinate[];
  width?: number; // in meters
  surface?: 'asphalt' | 'concrete' | 'paved' | 'gravel';
  streetLights?: boolean;
  isOneWay?: boolean;
  speedLimit?: number; // in km/h
  connectedBlocks?: string[]; // Block IDs
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Walking path for pedestrians
 */
export interface WalkingPath {
  id: string;
  name: string;
  description?: string;
  coordinates: CampusCoordinate[];
  pathType: 'main_path' | 'shortcut' | 'scenic' | 'accessible';
  width?: number; // in meters
  surface?: 'tiles' | 'paved' | 'natural';
  lightingAvailable?: boolean;
  benches?: number;
  shelters?: number;
  difficulty?: 'easy' | 'moderate' | 'challenging';
  duration?: number; // in minutes to traverse
  scenic_description?: string;
  connectedStops?: string[]; // Stop IDs
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Shopping cart stop (food/beverage vendor location)
 */
export interface CartStop {
  id: string;
  name: string;
  description: string;
  location: CampusCoordinate;
  operatingHours?: {
    open: string;
    close: string;
  };
  vendorType?: 'beverage' | 'snacks' | 'meals' | 'desserts' | 'mixed';
  specialties?: string[];
  acceptsCash?: boolean;
  acceptsCard?: boolean;
  image?: string;
  rating?: number; // 1-5
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Route connecting multiple cart stops
 */
export interface CartRoute {
  id: string;
  name: string;
  description?: string;
  cartStops: string[]; // CartStop IDs in order
  duration?: number; // in minutes
  distance?: number; // in km
  bestTimeToVisit?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Parking point for vehicles
 */
export interface ParkingPoint {
  id: string;
  name: string;
  location: CampusCoordinate;
  type: 'regular' | 'guest' | 'faculty' | 'disabled' | 'motorcycle' | 'scooter' | 'bicycle';
  capacity?: number;
  availableSpots?: number;
  rate?: {
    hourly?: number;
    daily?: number;
    monthly?: number;
  };
  features?: string[];
  nearbyBlock?: string;
  operatingHours?: {
    open: string;
    close: string;
  };
  contactInfo?: {
    phone?: string;
    email?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Drop/pickup point for transport
 */
export interface DropPoint {
  id: string;
  name: string;
  location: CampusCoordinate;
  pointType: 'main_gate' | 'academic_block' | 'hostel' | 'sports' | 'dining' | 'library' | 'other';
  description?: string;
  operatingHours?: {
    open: string;
    close: string;
  };
  busRoutes?: string[];
  transportServices?: string[];
  shelterAvailable?: boolean;
  contactInfo?: {
    phone?: string;
    email?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Complete campus map
 */
export interface CampusMap {
  id: string;
  name: string;
  institution: string;
  center: CampusCoordinate;
  zoom: number;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  blocks: CampusBlock[];
  roads: CampusRoad[];
  paths: WalkingPath[];
  cartStops?: CartStop[];
  cartRoutes?: CartRoute[];
  parkingPoints?: ParkingPoint[];
  dropPoints?: DropPoint[];
  totalArea?: number; // in sq km
  mapImage?: string;
  mapLayer?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
