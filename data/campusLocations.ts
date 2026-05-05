import { smruMapConfig } from '@/data/map/smruMapConfig';
import { mapCampusLocations } from '@/lib/campusLocationMapper';

export const campusLocations = mapCampusLocations(smruMapConfig.data.campusLocations);
