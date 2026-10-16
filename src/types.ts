export interface OneMapAddressItem {
  SEARCHVAL: string;
  BLK_NO: string;
  ROAD_NAME: string;
  BUILDING: string;
  ADDRESS: string;
  POSTAL: string;
  X: string;
  Y: string;
  LATITUDE: string;
  LONGITUDE: string;
}

export interface OneMapApiResponse {
  found?: number;
  totalNumPages?: number;
  pageNum?: number;
  results?: OneMapAddressItem[];
  error?: string;
  details?: string;
}

export type OneMapStatus = 'idle' | 'loading' | 'slow' | 'refused' | 'empty' | 'key_not_configured' | 'success';

export interface RenovationService {
  id: string;
  title: string;
  category: 'renovation' | 'interior_design' | 'direct_contractor' | 'marketplace' | 'specialist';
  description: string;
  badge: string;
  highlights: string[];
  pricingModel: string;
  iconName: string;
}

export interface ProjectQuoteRequest {
  id: string;
  ownerName: string;
  propertyType: 'HDB' | 'Condominium' | 'Landed Property' | 'Commercial';
  serviceType: string;
  postalCode: string;
  budgetRange: string;
  estimatedTimeline: string;
  description: string;
  createdAt: string;
  bidsReceived: number;
}

export interface Contractor {
  id: string;
  uen: string;
  companyName: string;
  address: string;
  postalCode: string;
  email: string;
  contactNo: string;
  sector: string;
  area: string;
  region: 'Central' | 'North' | 'North-East' | 'East' | 'West' | 'South' | 'North-West';
  lat: number;
  lng: number;
  distanceKm?: number;
}

export interface HomeOwnerLocation {
  postalCode: string;
  buildingName: string;
  address: string;
  lat: number;
  lng: number;
}

