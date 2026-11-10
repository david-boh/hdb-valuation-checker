import { SingaporeRegion, TownInfo } from '../types/hdb';

export const SINGAPORE_TOWNS: TownInfo[] = [
  // Central Region
  { name: 'BISHAN', region: 'Central', displayName: 'Bishan', lat: 1.3526, lng: 103.8352 },
  { name: 'BUKIT MERAH', region: 'Central', displayName: 'Bukit Merah', lat: 1.2819, lng: 103.8239 },
  { name: 'BUKIT TIMAH', region: 'Central', displayName: 'Bukit Timah', lat: 1.3294, lng: 103.8021 },
  { name: 'CENTRAL AREA', region: 'Central', displayName: 'Central Area / CBD', lat: 1.2789, lng: 103.8428 },
  { name: 'GEYLANG', region: 'Central', displayName: 'Geylang', lat: 1.3201, lng: 103.8918 },
  { name: 'KALLANG/WHAMPOA', region: 'Central', displayName: 'Kallang / Whampoa', lat: 1.3100, lng: 103.8651 },
  { name: 'MARINE PARADE', region: 'Central', displayName: 'Marine Parade', lat: 1.3020, lng: 103.9073 },
  { name: 'QUEENSTOWN', region: 'Central', displayName: 'Queenstown', lat: 1.2942, lng: 103.8060 },
  { name: 'TOA PAYOH', region: 'Central', displayName: 'Toa Payoh', lat: 1.3343, lng: 103.8563 },

  // East Region
  { name: 'BEDOK', region: 'East', displayName: 'Bedok', lat: 1.3236, lng: 103.9273 },
  { name: 'PASIR RIS', region: 'East', displayName: 'Pasir Ris', lat: 1.3721, lng: 103.9474 },
  { name: 'TAMPINES', region: 'East', displayName: 'Tampines', lat: 1.3532, lng: 103.9452 },

  // North Region
  { name: 'SEMBAWANG', region: 'North', displayName: 'Sembawang', lat: 1.4491, lng: 103.8185 },
  { name: 'WOODLANDS', region: 'North', displayName: 'Woodlands', lat: 1.4382, lng: 103.7891 },
  { name: 'YISHUN', region: 'North', displayName: 'Yishun', lat: 1.4304, lng: 103.8354 },

  // North-East Region
  { name: 'ANG MO KIO', region: 'North-East', displayName: 'Ang Mo Kio', lat: 1.3691, lng: 103.8454 },
  { name: 'HOUGANG', region: 'North-East', displayName: 'Hougang', lat: 1.3720, lng: 103.8936 },
  { name: 'PUNGGOL', region: 'North-East', displayName: 'Punggol', lat: 1.4052, lng: 103.9023 },
  { name: 'SENGKANG', region: 'North-East', displayName: 'Sengkang', lat: 1.3917, lng: 103.8954 },
  { name: 'SERANGOON', region: 'North-East', displayName: 'Serangoon', lat: 1.3554, lng: 103.8679 },

  // West Region
  { name: 'BUKIT BATOK', region: 'West', displayName: 'Bukit Batok', lat: 1.3590, lng: 103.7637 },
  { name: 'BUKIT PANJANG', region: 'West', displayName: 'Bukit Panjang', lat: 1.3774, lng: 103.7719 },
  { name: 'CHOA CHU KANG', region: 'West', displayName: 'Choa Chu Kang', lat: 1.3840, lng: 103.7470 },
  { name: 'CLEMENTI', region: 'West', displayName: 'Clementi', lat: 1.3162, lng: 103.7649 },
  { name: 'JURONG EAST', region: 'West', displayName: 'Jurong East', lat: 1.3329, lng: 103.7436 },
  { name: 'JURONG WEST', region: 'West', displayName: 'Jurong West', lat: 1.3404, lng: 103.7090 },
];

export const REGIONS_LIST: SingaporeRegion[] = ['Central', 'East', 'North', 'North-East', 'West'];

export const FLAT_TYPES_LIST = [
  '2 ROOM',
  '3 ROOM',
  '4 ROOM',
  '5 ROOM',
  'EXECUTIVE',
  'MULTI-GENERATION',
] as const;

export const REGION_COLORS: Record<SingaporeRegion, { light: string; dark: string; border: string; bg: string }> = {
  Central: { light: 'text-amber-600', dark: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/10' },
  East: { light: 'text-sky-600', dark: 'text-sky-400', border: 'border-sky-500/30', bg: 'bg-sky-500/10' },
  North: { light: 'text-emerald-600', dark: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10' },
  'North-East': { light: 'text-indigo-600', dark: 'text-indigo-400', border: 'border-indigo-500/30', bg: 'bg-indigo-500/10' },
  West: { light: 'text-rose-600', dark: 'text-rose-400', border: 'border-rose-500/30', bg: 'bg-rose-500/10' },
};
