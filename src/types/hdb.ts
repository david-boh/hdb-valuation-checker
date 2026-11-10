export type FlatType =
  | '1 ROOM'
  | '2 ROOM'
  | '3 ROOM'
  | '4 ROOM'
  | '5 ROOM'
  | 'EXECUTIVE'
  | 'MULTI-GENERATION';

export type FlatModel =
  | 'Model A'
  | 'Improved'
  | 'New Generation'
  | 'Premium Apartment'
  | 'DBSS'
  | 'Maisonette'
  | 'Standard'
  | 'Simplified'
  | 'Apartment'
  | 'Terrace'
  | 'Multi Generation';

export type SingaporeRegion = 'Central' | 'East' | 'North' | 'North-East' | 'West';

export interface TownInfo {
  name: string;
  region: SingaporeRegion;
  displayName: string;
  lat: number;
  lng: number;
}

export interface RawHdbApiRecord {
  _id: number | string;
  month: string;
  town: string;
  flat_type: string;
  block: string;
  street_name: string;
  storey_range: string;
  floor_area_sqm: string | number;
  flat_model: string;
  lease_commence_date: string | number;
  remaining_lease: string;
  resale_price: string | number;
}

export interface HdbRecord {
  id: string;
  raw_id?: number | string; // Official API _id (e.g. 238977)
  month: string; // YYYY-MM
  town: string;
  flat_type: FlatType;
  block: string;
  street_name: string;
  storey_range: string;
  floor_area_sqm: number;
  flat_model: string;
  lease_commence_date: number;
  remaining_lease: string; // e.g. "56 years 05 months"
  resale_price: number;
  // Computed fields
  price_per_sqm: number;
  price_per_sqft: number;
  floor_area_sqft: number;
  remaining_lease_years: number;
}

export interface HdbFilterState {
  towns: string[];
  flatTypes: FlatType[];
  floorAreaMin: number;
  floorAreaMax: number;
  priceMin: number;
  priceMax: number;
  dateRangeStart: string;
  dateRangeEnd: string;
  storeyTier: 'all' | 'low' | 'mid' | 'high' | 'very_high';
  searchQuery: string;
  unitSystem: 'sqm' | 'sqft';
}

export interface MonthlyTrendPoint {
  month: string;
  displayMonth: string;
  volume: number;
  avgPrice: number;
  medianPrice: number;
  avgPsf: number;
  minPrice: number;
  maxPrice: number;
}

export interface TownAnalytics {
  town: string;
  volume: number;
  avgPrice: number;
  medianPrice: number;
  avgPsf: number;
  medianPsf: number;
  minPrice: number;
  maxPrice: number;
  avgFloorArea: number;
  avgRemainingLease: number;
  flatTypeBreakdown: Record<string, { count: number; avgPrice: number; medianPrice: number }>;
}

export interface SummaryKPIs {
  totalVolume: number;
  avgPrice: number;
  medianPrice: number;
  avgPsf: number;
  medianPsf: number;
  minPrice: number;
  maxPrice: number;
  avgFloorAreaSqm: number;
  avgFloorAreaSqft: number;
  avgRemainingLease: number;
  millionDollarCount: number;
}
