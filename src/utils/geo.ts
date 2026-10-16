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

export const SECTOR_COORDINATES: Record<string, { area: string; lat: number; lng: number }> = {
  "01": { area: "Raffles Place / Cecil", lat: 1.2830, lng: 103.8510 },
  "02": { area: "Marina / Shenton", lat: 1.2785, lng: 103.8520 },
  "03": { area: "Tanjong Pagar / Anson", lat: 1.2755, lng: 103.8460 },
  "04": { area: "Telok Ayer / Chinatown", lat: 1.2820, lng: 103.8475 },
  "05": { area: "Chinatown / People's Park", lat: 1.2850, lng: 103.8425 },
  "06": { area: "Clarke Quay / City Hall", lat: 1.2905, lng: 103.8480 },
  "07": { area: "Anson / Tanjong Pagar", lat: 1.2730, lng: 103.8430 },
  "08": { area: "Tanjong Pagar / Cantonment", lat: 1.2780, lng: 103.8390 },
  "09": { area: "Telok Blangah / Harbourfront", lat: 1.2680, lng: 103.8210 },
  "10": { area: "Bukit Chermin / Keppel", lat: 1.2720, lng: 103.8110 },
  "11": { area: "Pasir Panjang / Alexandra", lat: 1.2810, lng: 103.7920 },
  "12": { area: "West Coast / Clementi", lat: 1.2980, lng: 103.7650 },
  "13": { area: "Clementi West / Pasir Panjang", lat: 1.2920, lng: 103.7740 },
  "14": { area: "Queenstown / Commonwealth", lat: 1.2985, lng: 103.8010 },
  "15": { area: "Bukit Merah / Henderson", lat: 1.2835, lng: 103.8220 },
  "16": { area: "Tiong Bahru / Kim Tian", lat: 1.2870, lng: 103.8290 },
  "17": { area: "High Street / Stamford Rd", lat: 1.2940, lng: 103.8500 },
  "18": { area: "Middle Road / Bugis", lat: 1.3005, lng: 103.8550 },
  "19": { area: "Beach Road / Golden Mile", lat: 1.3040, lng: 103.8610 },
  "20": { area: "Little India / Jalan Besar", lat: 1.3110, lng: 103.8540 },
  "21": { area: "Farrer Park / Lavender", lat: 1.3140, lng: 103.8590 },
  "22": { area: "Orchard / Cairnhill", lat: 1.3045, lng: 103.8375 },
  "23": { area: "Somerset / River Valley", lat: 1.2970, lng: 103.8360 },
  "24": { area: "Tanglin / Napier", lat: 1.3070, lng: 103.8190 },
  "25": { area: "Bukit Timah / Botanic Gardens", lat: 1.3180, lng: 103.8150 },
  "26": { area: "Upper Bukit Timah / Sixth Ave", lat: 1.3280, lng: 103.7990 },
  "27": { area: "Holland Village / Ulu Pandan", lat: 1.3120, lng: 103.7910 },
  "28": { area: "Newton / Moulmein", lat: 1.3150, lng: 103.8410 },
  "29": { area: "Novena / Chancery", lat: 1.3210, lng: 103.8420 },
  "30": { area: "Balestier / Thomson", lat: 1.3260, lng: 103.8460 },
  "31": { area: "Toa Payoh Central", lat: 1.3340, lng: 103.8500 },
  "32": { area: "Balestier / Whampoa", lat: 1.3255, lng: 103.8530 },
  "33": { area: "Boon Keng / Bendemeer", lat: 1.3190, lng: 103.8620 },
  "34": { area: "MacPherson / Circuit Rd", lat: 1.3270, lng: 103.8820 },
  "35": { area: "Potong Pasir / Sennett", lat: 1.3325, lng: 103.8690 },
  "36": { area: "Aljunied / MacPherson", lat: 1.3210, lng: 103.8810 },
  "37": { area: "Tai Seng / Kim Chuan", lat: 1.3360, lng: 103.8890 },
  "38": { area: "Geylang / Guillemard", lat: 1.3130, lng: 103.8820 },
  "39": { area: "Sims / Paya Lebar", lat: 1.3180, lng: 103.8890 },
  "40": { area: "Eunos / Kaki Bukit / Ubi", lat: 1.3295, lng: 103.8995 },
  "41": { area: "Kaki Bukit / Bedok Reservoir", lat: 1.3360, lng: 103.9080 },
  "42": { area: "Joo Chiat / Katong", lat: 1.3090, lng: 103.9020 },
  "43": { area: "Tanjong Katong / Meyer", lat: 1.3010, lng: 103.8960 },
  "44": { area: "Marine Parade / East Coast", lat: 1.3030, lng: 103.9060 },
  "45": { area: "Siglap / Telok Kurau", lat: 1.3130, lng: 103.9160 },
  "46": { area: "Bedok South / Chai Chee", lat: 1.3220, lng: 103.9270 },
  "47": { area: "Bedok North / Reservoir", lat: 1.3320, lng: 103.9290 },
  "48": { area: "Upper East Coast / Bayshore", lat: 1.3170, lng: 103.9430 },
  "49": { area: "Loyang Industrial", lat: 1.3680, lng: 103.9740 },
  "50": { area: "Changi / Flora", lat: 1.3590, lng: 103.9680 },
  "51": { area: "Pasir Ris Town", lat: 1.3710, lng: 103.9510 },
  "52": { area: "Tampines Town & Industrial", lat: 1.3530, lng: 103.9450 },
  "53": { area: "Defu Lane / Hougang South", lat: 1.3521, lng: 103.8914 },
  "54": { area: "Kovan / Hougang Central", lat: 1.3660, lng: 103.8870 },
  "55": { area: "Serangoon Garden / Ang Mo Kio", lat: 1.3610, lng: 103.8690 },
  "56": { area: "Bishan / Ang Mo Kio Ave 1-3", lat: 1.3620, lng: 103.8480 },
  "57": { area: "Ang Mo Kio Industrial / Ave 4-10", lat: 1.3750, lng: 103.8560 },
  "58": { area: "Bukit Timah / Toh Tuck", lat: 1.3380, lng: 103.7710 },
  "59": { area: "Hillview / Dairy Farm", lat: 1.3550, lng: 103.7660 },
  "60": { area: "Jurong East / Toh Guan", lat: 1.3340, lng: 103.7430 },
  "61": { area: "Jurong Industrial / Pioneer", lat: 1.3180, lng: 103.7080 },
  "62": { area: "Tuas / Gul", lat: 1.3210, lng: 103.6620 },
  "63": { area: "Tuas South", lat: 1.2980, lng: 103.6390 },
  "64": { area: "Jurong West / Boon Lay", lat: 1.3460, lng: 103.7010 },
  "65": { area: "Bukit Batok East & West", lat: 1.3560, lng: 103.7540 },
  "66": { area: "Bukit Batok Industrial Park", lat: 1.3610, lng: 103.7580 },
  "67": { area: "Bukit Panjang / Cashew", lat: 1.3780, lng: 103.7680 },
  "68": { area: "Choa Chu Kang / Yew Tee", lat: 1.3890, lng: 103.7460 },
  "69": { area: "Tengah / Bulim", lat: 1.3620, lng: 103.7250 },
  "70": { area: "Lim Chu Kang / Agrotechnology", lat: 1.4120, lng: 103.7080 },
  "71": { area: "Murai / Sungei Gedong", lat: 1.4010, lng: 103.6890 },
  "72": { area: "Sungei Kadut (Timber & Carpentry Hub)", lat: 1.4210, lng: 103.7510 },
  "73": { area: "Woodlands Industrial & Town", lat: 1.4380, lng: 103.7880 },
  "74": { area: "Marsiling / Admiralty", lat: 1.4420, lng: 103.7740 },
  "75": { area: "Sembawang / Admiralty Link", lat: 1.4510, lng: 103.8250 },
  "76": { area: "Yishun Industrial & Town", lat: 1.4310, lng: 103.8390 },
  "77": { area: "Upper Thomson / Springleaf", lat: 1.3920, lng: 103.8260 },
  "78": { area: "Tagore Lane Industrial Estate", lat: 1.3843, lng: 103.8284 },
  "79": { area: "Seletar Aerospace & Hills", lat: 1.4080, lng: 103.8690 },
  "80": { area: "Yio Chu Kang / Seletar", lat: 1.3910, lng: 103.8650 },
  "81": { area: "Loyang / Changi East", lat: 1.3620, lng: 103.9850 },
  "82": { area: "Punggol Town", lat: 1.4020, lng: 103.9070 }
};

export function lookupPostalSectorCoordinates(postalCode: string): { area: string; lat: number; lng: number } {
  const clean = postalCode.trim().padStart(6, '0');
  const sector = clean.slice(0, 2);
  return SECTOR_COORDINATES[sector] || {
    area: `Singapore Postal Sector ${sector}`,
    lat: 1.3521,
    lng: 103.8198
  };
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
