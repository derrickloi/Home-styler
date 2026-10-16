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

/**
 * Returns a fallback coordinate and town name for any Singapore 6-digit postal code
 * based on the official Singapore postal sector (first 2 digits).
 */
export function getSectorFallbackLocation(postalCode: string): HomeOwnerLocation {
  const clean = postalCode.replace(/\D/g, '').padStart(6, '0').slice(0, 6);
  const sector = clean.slice(0, 2);
  
  let lat = 1.298;
  let lng = 103.850;
  let town = 'Central Singapore';

  switch (sector) {
    case '01': case '02': case '03': case '04': case '05': case '06':
      lat = 1.280; lng = 103.850; town = 'Raffles Place / Marina Bay'; break;
    case '07': case '08':
      lat = 1.274; lng = 103.843; town = 'Tanjong Pagar / Anson'; break;
    case '09': case '10':
      lat = 1.271; lng = 103.815; town = 'Telok Blangah / Harbourfront'; break;
    case '11': case '12': case '13':
      lat = 1.299; lng = 103.764; town = 'Pasir Panjang / Clementi'; break;
    case '14': case '15': case '16':
      lat = 1.290; lng = 103.815; town = 'Queenstown / Tiong Bahru / Redhill'; break;
    case '17': case '18': case '19':
      lat = 1.298; lng = 103.852; town = 'High Street / Beach Road / Bugis'; break;
    case '20': case '21':
      lat = 1.310; lng = 103.855; town = 'Little India / Farrer Park'; break;
    case '22': case '23':
      lat = 1.302; lng = 103.835; town = 'Orchard / River Valley / Somerset'; break;
    case '24': case '25': case '26': case '27':
      lat = 1.310; lng = 103.805; town = 'Tanglin / Holland / Bukit Timah'; break;
    case '28': case '29': case '30':
      lat = 1.320; lng = 103.840; town = 'Novena / Thomson'; break;
    case '31': case '32': case '33':
      lat = 1.333; lng = 103.850; town = 'Toa Payoh / Balestier'; break;
    case '34': case '35': case '36': case '37':
      lat = 1.330; lng = 103.875; town = 'MacPherson / Potong Pasir / Aljunied'; break;
    case '38': case '39': case '40': case '41':
      lat = 1.325; lng = 103.895; town = 'Geylang / Eunos / Kaki Bukit / Ubi'; break;
    case '42': case '43': case '44': case '45':
      lat = 1.305; lng = 103.905; town = 'Katong / Marine Parade / East Coast'; break;
    case '46': case '47': case '48':
      lat = 1.322; lng = 103.935; town = 'Bedok / Chai Chee / Bayshore'; break;
    case '49': case '50':
      lat = 1.360; lng = 103.970; town = 'Loyang / Changi'; break;
    case '51': case '52':
      lat = 1.354; lng = 103.945; town = 'Pasir Ris / Tampines Town'; break;
    case '53': case '54': case '55':
      lat = 1.365; lng = 103.885; town = 'Hougang / Kovan / Sengkang / Serangoon'; break;
    case '56': case '57':
      lat = 1.360; lng = 103.850; town = 'Bishan / Ang Mo Kio'; break;
    case '58': case '59':
      lat = 1.355; lng = 103.765; town = 'Upper Bukit Timah / Hillview'; break;
    case '60': case '61': case '62': case '63': case '64':
      lat = 1.335; lng = 103.740; town = 'Jurong East / Jurong West / Boon Lay'; break;
    case '65': case '66': case '67': case '68':
      lat = 1.375; lng = 103.755; town = 'Bukit Batok / Bukit Panjang / Choa Chu Kang'; break;
    case '69': case '70': case '71':
      lat = 1.370; lng = 103.710; town = 'Tengah / Lim Chu Kang'; break;
    case '72': case '73':
      lat = 1.430; lng = 103.775; town = 'Woodlands / Kranji / Sungei Kadut'; break;
    case '75': case '76':
      lat = 1.440; lng = 103.830; town = 'Yishun / Sembawang'; break;
    case '77': case '78':
      lat = 1.390; lng = 103.825; town = 'Upper Thomson / Springleaf'; break;
    case '79': case '80':
      lat = 1.395; lng = 103.865; town = 'Seletar / Yio Chu Kang'; break;
    case '81': case '82':
      lat = 1.405; lng = 103.905; town = 'Punggol Waterway / Northshore'; break;
  }

  return {
    postalCode: clean,
    buildingName: `Residential Building (Postal ${clean})`,
    address: `Postal ${clean}, Singapore (${town})`,
    lat,
    lng,
  };
}
