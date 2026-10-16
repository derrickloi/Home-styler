import { HomeOwnerLocation } from '../types';

/**
 * Calculates the great-circle distance between two points on the earth using the Haversine formula.
 * @returns distance in kilometers rounded to 1 decimal place.
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's mean radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}

// Preset verified Singapore home locations for quick testing and selection
export const PRESET_HOME_LOCATIONS: HomeOwnerLocation[] = [
  {
    postalCode: '178903',
    buildingName: 'SMU School of Economics / Computing (Central Hub)',
    address: '90 Stamford Road, Singapore 178903',
    lat: 1.297925,
    lng: 103.848851,
  },
  {
    postalCode: '579837',
    buildingName: 'Bishan North Resale Hub',
    address: '283 Bishan Street 22, Singapore 579837',
    lat: 1.3585,
    lng: 103.8492,
  },
  {
    postalCode: '520261',
    buildingName: 'Tampines GreenGem (East Hub)',
    address: '261 Tampines Street 21, Singapore 520261',
    lat: 1.3540,
    lng: 103.9480,
  },
  {
    postalCode: '609601',
    buildingName: 'Jurong East Gateway (West Hub)',
    address: '21 Jurong Town Hall Road, Singapore 609601',
    lat: 1.3325,
    lng: 103.7435,
  },
  {
    postalCode: '730501',
    buildingName: 'Woodlands Civic Center (North Hub)',
    address: '900 South Woodlands Drive, Singapore 730501',
    lat: 1.4360,
    lng: 103.7865,
  },
  {
    postalCode: '820173',
    buildingName: 'Punggol Waterway Terraces (North-East)',
    address: '308A Punggol Walk, Singapore 820173',
    lat: 1.4050,
    lng: 103.9030,
  },
  {
    postalCode: '440078',
    buildingName: 'Marine Parade Promenade (East Coast)',
    address: '78 Marine Drive, Singapore 440078',
    lat: 1.3035,
    lng: 103.9065,
  },
];
