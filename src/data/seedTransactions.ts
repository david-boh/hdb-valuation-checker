import { FlatType, HdbRecord } from '../types/hdb';

interface TownProfile {
  town: string;
  streets: string[];
  basePrice: Record<FlatType, number>;
  leaseYearRange: [number, number];
  models: string[];
  premiumFactor: number;
}

const TOWN_PROFILES: Record<string, TownProfile> = {
  BISHAN: {
    town: 'BISHAN',
    streets: ['BISHAN ST 12', 'BISHAN ST 22', 'BISHAN ST 24', 'BISHAN ST 13', 'SHUNFU RD', 'BRIGHT HILL DR'],
    basePrice: {
      '1 ROOM': 260000,
      '2 ROOM': 360000,
      '3 ROOM': 520000,
      '4 ROOM': 780000,
      '5 ROOM': 1020000,
      EXECUTIVE: 1180000,
      'MULTI-GENERATION': 1250000,
    },
    leaseYearRange: [1985, 2012],
    models: ['Model A', 'Improved', 'DBSS', 'Maisonette'],
    premiumFactor: 1.28,
  },
  'BUKIT MERAH': {
    town: 'BUKIT MERAH',
    streets: ['HAVELOCK RD', 'TELOK BLANGAH DR', 'JALAN MEMBINA', 'HENDERSON RD', 'TIONG BAHRU RD', 'BOON TIONG RD'],
    basePrice: {
      '1 ROOM': 280000,
      '2 ROOM': 390000,
      '3 ROOM': 510000,
      '4 ROOM': 820000,
      '5 ROOM': 1080000,
      EXECUTIVE: 1190000,
      'MULTI-GENERATION': 1280000,
    },
    leaseYearRange: [1975, 2016],
    models: ['Standard', 'Improved', 'Model A', 'Premium Apartment'],
    premiumFactor: 1.32,
  },
  'BUKIT TIMAH': {
    town: 'BUKIT TIMAH',
    streets: ['TOH YI DR', 'FARRER RD', 'JALAN SEROJA', 'QUEEN\'S RD'],
    basePrice: {
      '1 ROOM': 310000,
      '2 ROOM': 420000,
      '3 ROOM': 580000,
      '4 ROOM': 880000,
      '5 ROOM': 1120000,
      EXECUTIVE: 1290000,
      'MULTI-GENERATION': 1350000,
    },
    leaseYearRange: [1988, 2005],
    models: ['Model A', 'Maisonette', 'Improved'],
    premiumFactor: 1.35,
  },
  'CENTRAL AREA': {
    town: 'CENTRAL AREA',
    streets: ['CANTONMENT RD', 'EVERTON PARK', 'WATERLOO ST', 'SELEGIE RD', 'ROWELL RD', 'NEW BRIDGE RD'],
    basePrice: {
      '1 ROOM': 320000,
      '2 ROOM': 440000,
      '3 ROOM': 590000,
      '4 ROOM': 950000,
      '5 ROOM': 1260000,
      EXECUTIVE: 1380000,
      'MULTI-GENERATION': 1420000,
    },
    leaseYearRange: [1978, 2011],
    models: ['Improved', 'Type S1', 'Type S2', 'Model A'],
    premiumFactor: 1.45,
  },
  QUEENSTOWN: {
    town: 'QUEENSTOWN',
    streets: ['STRATHMORE AVE', 'COMMONWEALTH CL', 'MARGARET DR', 'DAWSON RD', 'STIRLING RD', 'DOVER CRES'],
    basePrice: {
      '1 ROOM': 290000,
      '2 ROOM': 410000,
      '3 ROOM': 540000,
      '4 ROOM': 860000,
      '5 ROOM': 1140000,
      EXECUTIVE: 1240000,
      'MULTI-GENERATION': 1310000,
    },
    leaseYearRange: [1972, 2020],
    models: ['Standard', 'Improved', 'Model A', 'Premium Apartment'],
    premiumFactor: 1.38,
  },
  'TOA PAYOH': {
    town: 'TOA PAYOH',
    streets: ['LOR 1 TOA PAYOH', 'LOR 2 TOA PAYOH', 'LOR 4 TOA PAYOH', 'LOR 6 TOA PAYOH', 'TOA PAYOH EAST'],
    basePrice: {
      '1 ROOM': 250000,
      '2 ROOM': 370000,
      '3 ROOM': 490000,
      '4 ROOM': 760000,
      '5 ROOM': 980000,
      EXECUTIVE: 1120000,
      'MULTI-GENERATION': 1190000,
    },
    leaseYearRange: [1973, 2019],
    models: ['Standard', 'Improved', 'DBSS', 'Model A'],
    premiumFactor: 1.25,
  },
  'KALLANG/WHAMPOA': {
    town: 'KALLANG/WHAMPOA',
    streets: ['MCNAIR RD', 'BOON KENG RD', 'LOR 3 GEYLANG', 'ST. GEORGE\'S RD', 'UPP BOON KENG RD', 'WHAMPOA DR'],
    basePrice: {
      '1 ROOM': 260000,
      '2 ROOM': 380000,
      '3 ROOM': 500000,
      '4 ROOM': 780000,
      '5 ROOM': 1020000,
      EXECUTIVE: 1140000,
      'MULTI-GENERATION': 1200000,
    },
    leaseYearRange: [1980, 2018],
    models: ['Improved', 'DBSS', 'Model A', 'Standard'],
    premiumFactor: 1.26,
  },
  GEYLANG: {
    town: 'GEYLANG',
    streets: ['PINE CL', 'ALJUNIED RD', 'CIRCUIT RD', 'EUNOS CRES', 'HAIG RD', 'CASSIA CRES'],
    basePrice: {
      '1 ROOM': 230000,
      '2 ROOM': 340000,
      '3 ROOM': 450000,
      '4 ROOM': 720000,
      '5 ROOM': 920000,
      EXECUTIVE: 1040000,
      'MULTI-GENERATION': 1090000,
    },
    leaseYearRange: [1976, 2016],
    models: ['Standard', 'Simplified', 'Model A', 'Improved'],
    premiumFactor: 1.18,
  },
  'MARINE PARADE': {
    town: 'MARINE PARADE',
    streets: ['MARINE CRES', 'MARINE TER', 'MARINE DR'],
    basePrice: {
      '1 ROOM': 280000,
      '2 ROOM': 390000,
      '3 ROOM': 520000,
      '4 ROOM': 790000,
      '5 ROOM': 1010000,
      EXECUTIVE: 1150000,
      'MULTI-GENERATION': 1220000,
    },
    leaseYearRange: [1975, 1984],
    models: ['Standard', 'Improved', 'New Generation'],
    premiumFactor: 1.22,
  },
  TAMPINES: {
    town: 'TAMPINES',
    streets: ['TAMPINES AVE 4', 'TAMPINES ST 21', 'TAMPINES ST 83', 'TAMPINES CTRL 7', 'TAMPINES ST 45', 'TAMPINES ST 11'],
    basePrice: {
      '1 ROOM': 220000,
      '2 ROOM': 320000,
      '3 ROOM': 440000,
      '4 ROOM': 620000,
      '5 ROOM': 760000,
      EXECUTIVE: 920000,
      'MULTI-GENERATION': 990000,
    },
    leaseYearRange: [1984, 2018],
    models: ['Model A', 'Simplified', 'Maisonette', 'DBSS', 'Premium Apartment'],
    premiumFactor: 1.10,
  },
  BEDOK: {
    town: 'BEDOK',
    streets: ['BEDOK RESERVOIR RD', 'BEDOK NORTH ST 3', 'BEDOK SOUTH AVE 2', 'CHAI CHEE ST', 'BEDOK CTRL'],
    basePrice: {
      '1 ROOM': 210000,
      '2 ROOM': 310000,
      '3 ROOM': 420000,
      '4 ROOM': 590000,
      '5 ROOM': 740000,
      EXECUTIVE: 890000,
      'MULTI-GENERATION': 950000,
    },
    leaseYearRange: [1978, 2016],
    models: ['New Generation', 'Model A', 'Improved', 'Maisonette'],
    premiumFactor: 1.08,
  },
  'PASIR RIS': {
    town: 'PASIR RIS',
    streets: ['PASIR RIS ST 11', 'PASIR RIS ST 21', 'PASIR RIS DR 3', 'PASIR RIS DR 1', 'PASIR RIS ST 71'],
    basePrice: {
      '1 ROOM': 200000,
      '2 ROOM': 300000,
      '3 ROOM': 410000,
      '4 ROOM': 580000,
      '5 ROOM': 720000,
      EXECUTIVE: 870000,
      'MULTI-GENERATION': 920000,
    },
    leaseYearRange: [1988, 2015],
    models: ['Model A', 'Maisonette', 'Premium Apartment', 'Apartment'],
    premiumFactor: 1.05,
  },
  PUNGGOL: {
    town: 'PUNGGOL',
    streets: ['PUNGGOL FIELD', 'EDGEDALE PLAINS', 'PUNGGOL CTRL', 'PUNGGOL WALK', 'SUMANG WALK', 'WATERWAY SUNRISE'],
    basePrice: {
      '1 ROOM': 210000,
      '2 ROOM': 310000,
      '3 ROOM': 460000,
      '4 ROOM': 640000,
      '5 ROOM': 780000,
      EXECUTIVE: 890000,
      'MULTI-GENERATION': 930000,
    },
    leaseYearRange: [2003, 2021],
    models: ['Premium Apartment', 'Model A', 'Apartment'],
    premiumFactor: 1.12,
  },
  SENGKANG: {
    town: 'SENGKANG',
    streets: ['COMPASSVALE BOW', 'RIVERVALE DR', 'ANCHORVALE LINK', 'FERNVALE RD', 'SENGKANG EAST WAY'],
    basePrice: {
      '1 ROOM': 200000,
      '2 ROOM': 300000,
      '3 ROOM': 440000,
      '4 ROOM': 610000,
      '5 ROOM': 740000,
      EXECUTIVE: 860000,
      'MULTI-GENERATION': 900000,
    },
    leaseYearRange: [1999, 2020],
    models: ['Model A', 'Premium Apartment', 'Apartment'],
    premiumFactor: 1.09,
  },
  'ANG MO KIO': {
    town: 'ANG MO KIO',
    streets: ['ANG MO KIO AVE 3', 'ANG MO KIO AVE 10', 'ANG MO KIO AVE 4', 'ANG MO KIO AVE 5', 'ANG MO KIO ST 31'],
    basePrice: {
      '1 ROOM': 220000,
      '2 ROOM': 330000,
      '3 ROOM': 450000,
      '4 ROOM': 660000,
      '5 ROOM': 840000,
      EXECUTIVE: 1020000,
      'MULTI-GENERATION': 1080000,
    },
    leaseYearRange: [1977, 2014],
    models: ['New Generation', 'Improved', 'Model A', 'DBSS'],
    premiumFactor: 1.15,
  },
  HOUGANG: {
    town: 'HOUGANG',
    streets: ['HOUGANG AVE 8', 'HOUGANG AVE 10', 'HOUGANG ST 51', 'LOR AH SOO', 'UPP SERANGOON RD'],
    basePrice: {
      '1 ROOM': 210000,
      '2 ROOM': 310000,
      '3 ROOM': 430000,
      '4 ROOM': 600000,
      '5 ROOM': 740000,
      EXECUTIVE: 890000,
      'MULTI-GENERATION': 950000,
    },
    leaseYearRange: [1983, 2017],
    models: ['Model A', 'Improved', 'Maisonette', 'Premium Apartment'],
    premiumFactor: 1.07,
  },
  SERANGOON: {
    town: 'SERANGOON',
    streets: ['SERANGOON AVE 2', 'SERANGOON AVE 3', 'SERANGOON CTRL', 'SERANGOON NORTH AVE 1'],
    basePrice: {
      '1 ROOM': 230000,
      '2 ROOM': 330000,
      '3 ROOM': 460000,
      '4 ROOM': 680000,
      '5 ROOM': 860000,
      EXECUTIVE: 1030000,
      'MULTI-GENERATION': 1090000,
    },
    leaseYearRange: [1984, 2015],
    models: ['Model A', 'Improved', 'Maisonette', 'Apartment'],
    premiumFactor: 1.16,
  },
  WOODLANDS: {
    town: 'WOODLANDS',
    streets: ['WOODLANDS RING RD', 'WOODLANDS AVE 4', 'WOODLANDS ST 31', 'WOODLANDS DR 50', 'MARSILING DR'],
    basePrice: {
      '1 ROOM': 180000,
      '2 ROOM': 270000,
      '3 ROOM': 380000,
      '4 ROOM': 520000,
      '5 ROOM': 630000,
      EXECUTIVE: 770000,
      'MULTI-GENERATION': 820000,
    },
    leaseYearRange: [1978, 2018],
    models: ['Model A', 'Simplified', 'Premium Apartment', 'Maisonette'],
    premiumFactor: 0.94,
  },
  YISHUN: {
    town: 'YISHUN',
    streets: ['YISHUN AVE 11', 'YISHUN RING RD', 'YISHUN ST 21', 'YISHUN CTRL', 'YISHUN ST 51'],
    basePrice: {
      '1 ROOM': 190000,
      '2 ROOM': 280000,
      '3 ROOM': 390000,
      '4 ROOM': 530000,
      '5 ROOM': 660000,
      EXECUTIVE: 810000,
      'MULTI-GENERATION': 860000,
    },
    leaseYearRange: [1984, 2018],
    models: ['Model A', 'Simplified', 'New Generation', 'Premium Apartment'],
    premiumFactor: 0.96,
  },
  SEMBAWANG: {
    town: 'SEMBAWANG',
    streets: ['SEMBAWANG DR', 'CANBERRA LINK', 'CANBERRA CRES', 'ADMIRALTY LINK', 'WELLINGTON CIRCLE'],
    basePrice: {
      '1 ROOM': 190000,
      '2 ROOM': 285000,
      '3 ROOM': 400000,
      '4 ROOM': 540000,
      '5 ROOM': 670000,
      EXECUTIVE: 790000,
      'MULTI-GENERATION': 840000,
    },
    leaseYearRange: [1999, 2021],
    models: ['Model A', 'Premium Apartment'],
    premiumFactor: 0.97,
  },
  'BUKIT BATOK': {
    town: 'BUKIT BATOK',
    streets: ['BUKIT BATOK WEST AVE 6', 'BUKIT BATOK ST 21', 'BUKIT BATOK EAST AVE 4', 'BUKIT BATOK ST 31'],
    basePrice: {
      '1 ROOM': 200000,
      '2 ROOM': 295000,
      '3 ROOM': 410000,
      '4 ROOM': 560000,
      '5 ROOM': 710000,
      EXECUTIVE: 840000,
      'MULTI-GENERATION': 890000,
    },
    leaseYearRange: [1984, 2019],
    models: ['Model A', 'Simplified', 'Maisonette', 'Apartment'],
    premiumFactor: 1.01,
  },
  'BUKIT PANJANG': {
    town: 'BUKIT PANJANG',
    streets: ['FAJAR RD', 'SENJA RD', 'JELEBU RD', 'SEGAR RD', 'PETIR RD', 'BANGKIT RD'],
    basePrice: {
      '1 ROOM': 195000,
      '2 ROOM': 290000,
      '3 ROOM': 405000,
      '4 ROOM': 545000,
      '5 ROOM': 690000,
      EXECUTIVE: 820000,
      'MULTI-GENERATION': 870000,
    },
    leaseYearRange: [1988, 2017],
    models: ['Model A', 'Premium Apartment', 'Apartment'],
    premiumFactor: 0.99,
  },
  'CHOA CHU KANG': {
    town: 'CHOA CHU KANG',
    streets: ['CHOA CHU KANG AVE 4', 'CHOA CHU KANG CTRL', 'KEAT HONG CL', 'TECK WHYE AVE', 'JELEBU RD'],
    basePrice: {
      '1 ROOM': 190000,
      '2 ROOM': 280000,
      '3 ROOM': 395000,
      '4 ROOM': 535000,
      '5 ROOM': 675000,
      EXECUTIVE: 805000,
      'MULTI-GENERATION': 850000,
    },
    leaseYearRange: [1988, 2018],
    models: ['Model A', 'Simplified', 'Maisonette', 'Premium Apartment'],
    premiumFactor: 0.97,
  },
  CLEMENTI: {
    town: 'CLEMENTI',
    streets: ['CLEMENTI AVE 3', 'CLEMENTI AVE 5', 'CLEMENTI WEST ST 1', 'CLEMENTI AVE 4', 'SUNSET WAY'],
    basePrice: {
      '1 ROOM': 250000,
      '2 ROOM': 370000,
      '3 ROOM': 490000,
      '4 ROOM': 770000,
      '5 ROOM': 960000,
      EXECUTIVE: 1100000,
      'MULTI-GENERATION': 1170000,
    },
    leaseYearRange: [1978, 2018],
    models: ['Improved', 'Model A', 'Maisonette', 'DBSS'],
    premiumFactor: 1.24,
  },
  'JURONG EAST': {
    town: 'JURONG EAST',
    streets: ['JURONG EAST ST 32', 'JURONG EAST ST 13', 'TOH GUAN RD', 'TEBAN GDNS RD', 'JURONG EAST AVE 1'],
    basePrice: {
      '1 ROOM': 210000,
      '2 ROOM': 310000,
      '3 ROOM': 430000,
      '4 ROOM': 590000,
      '5 ROOM': 730000,
      EXECUTIVE: 870000,
      'MULTI-GENERATION': 920000,
    },
    leaseYearRange: [1981, 2016],
    models: ['Model A', 'Simplified', 'Maisonette', 'Improved'],
    premiumFactor: 1.04,
  },
  'JURONG WEST': {
    town: 'JURONG WEST',
    streets: ['JURONG WEST ST 64', 'JURONG WEST ST 52', 'JURONG WEST AVE 5', 'BOON LAY DR', 'CORPORATION DR'],
    basePrice: {
      '1 ROOM': 190000,
      '2 ROOM': 280000,
      '3 ROOM': 385000,
      '4 ROOM': 525000,
      '5 ROOM': 645000,
      EXECUTIVE: 785000,
      'MULTI-GENERATION': 830000,
    },
    leaseYearRange: [1979, 2018],
    models: ['Model A', 'Simplified', 'Premium Apartment', 'Maisonette'],
    premiumFactor: 0.95,
  },
};

const STOREY_RANGES = [
  '01 TO 03',
  '04 TO 06',
  '07 TO 09',
  '10 TO 12',
  '13 TO 15',
  '16 TO 18',
  '19 TO 21',
  '22 TO 24',
  '25 TO 27',
  '28 TO 30',
  '31 TO 33',
  '34 TO 36',
  '37 TO 39',
  '40 TO 42',
];

const FLOOR_AREAS: Record<FlatType, [number, number]> = {
  '1 ROOM': [31, 38],
  '2 ROOM': [44, 48],
  '3 ROOM': [60, 75],
  '4 ROOM': [88, 105],
  '5 ROOM': [110, 125],
  EXECUTIVE: [140, 160],
  'MULTI-GENERATION': [155, 175],
};

// Seeded pseudorandom generator for deterministic, consistent generation
function createPrng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const MONTHS_LIST: string[] = [];
for (let y = 2023; y <= 2025; y++) {
  for (let m = 1; m <= 12; m++) {
    MONTHS_LIST.push(`${y}-${String(m).padStart(2, '0')}`);
  }
}
// Add 2026 months up to current date (2026-11)
for (let m = 1; m <= 11; m++) {
  MONTHS_LIST.push(`2026-${String(m).padStart(2, '0')}`);
}

export function generateSeedTransactions(): HdbRecord[] {
  const records: HdbRecord[] = [];
  const rand = createPrng(42891);
  let idCounter = 1;

  const towns = Object.keys(TOWN_PROFILES);
  const flatTypes: FlatType[] = ['2 ROOM', '3 ROOM', '4 ROOM', '5 ROOM', 'EXECUTIVE'];

  // Generate ~1400 realistic records spanning 2023 to 2026
  MONTHS_LIST.forEach((month, monthIndex) => {
    // Time inflation factor: slight appreciation over time (Singapore HDB index growth)
    const timeFactor = 1 + (monthIndex / MONTHS_LIST.length) * 0.12;

    towns.forEach((townName) => {
      const profile = TOWN_PROFILES[townName];
      // Popular towns have higher volume
      const volumeCount = ['PUNGGOL', 'SENGKANG', 'TAMPINES', 'WOODLANDS', 'YISHUN', 'JURONG WEST', 'BUKIT MERAH', 'QUEENSTOWN', 'BISHAN'].includes(townName)
        ? 2 + Math.floor(rand() * 2) // 2-3 records per month
        : (rand() > 0.4 ? 1 : 0); // 0-1 records

      for (let i = 0; i < volumeCount; i++) {
        // Flat type distribution: 4-room and 5-room are most common
        const ftRoll = rand();
        let flatType: FlatType = '4 ROOM';
        if (ftRoll < 0.10) flatType = '2 ROOM';
        else if (ftRoll < 0.35) flatType = '3 ROOM';
        else if (ftRoll < 0.72) flatType = '4 ROOM';
        else if (ftRoll < 0.92) flatType = '5 ROOM';
        else flatType = 'EXECUTIVE';

        const [minArea, maxArea] = FLOOR_AREAS[flatType];
        const floorArea = Math.round(minArea + rand() * (maxArea - minArea));
        const street = profile.streets[Math.floor(rand() * profile.streets.length)];
        const blockNum = Math.floor(100 + rand() * 850);
        const blockSuffix = rand() > 0.6 ? String.fromCharCode(65 + Math.floor(rand() * 4)) : '';
        const block = `${blockNum}${blockSuffix}`;

        // Storey level
        const storeyIdx = Math.floor(Math.pow(rand(), 1.5) * STOREY_RANGES.length);
        const storeyRange = STOREY_RANGES[storeyIdx];
        const storeyFloor = storeyIdx * 3 + 1;
        const storeyFactor = 1 + (storeyFloor / 40) * 0.15; // Higher floors command 0-15% premium

        // Lease commence
        const leaseStart = Math.round(profile.leaseYearRange[0] + rand() * (profile.leaseYearRange[1] - profile.leaseYearRange[0]));
        const currYear = parseInt(month.slice(0, 4), 10);
        const currMonth = parseInt(month.slice(5, 7), 10);
        const yearsElapsed = currYear - leaseStart;
        const remainingYears = Math.max(99 - yearsElapsed, 40);
        const remainingMonths = Math.floor(rand() * 12);
        const remainingLease = `${remainingYears} years ${String(remainingMonths).padStart(2, '0')} months`;
        const remainingLeaseYears = remainingYears + remainingMonths / 12;

        // Model
        const model = profile.models[Math.floor(rand() * profile.models.length)];
        const modelPremium = model === 'DBSS' ? 1.22 : model === 'Maisonette' ? 1.18 : model === 'Premium Apartment' ? 1.05 : 1.0;

        // Lease factor: older flats have a slight discount
        const leaseFactor = 0.88 + (remainingLeaseYears / 99) * 0.22;

        // Base price calculation with noise
        const base = profile.basePrice[flatType];
        const noise = 0.94 + rand() * 0.12; // +/- 6%
        let resalePrice = Math.round((base * timeFactor * storeyFactor * modelPremium * leaseFactor * noise) / 1000) * 1000;

        // Special highlight cases (e.g. iconic million dollar transactions)
        if (townName === 'CENTRAL AREA' && flatType === '5 ROOM' && storeyFloor >= 25 && rand() > 0.4) {
          resalePrice = Math.max(resalePrice, 1380000 + Math.floor(rand() * 180000));
        }
        if (townName === 'BISHAN' && model === 'DBSS' && flatType === '5 ROOM') {
          resalePrice = Math.max(resalePrice, 1260000 + Math.floor(rand() * 150000));
        }

        const floorAreaSqft = Math.round(floorArea * 10.7639 * 10) / 10;
        const pricePerSqm = Math.round(resalePrice / floorArea);
        const pricePerSqft = Math.round(resalePrice / (floorArea * 10.7639));

        records.push({
          id: `hdb-${idCounter++}`,
          month,
          town: townName,
          flat_type: flatType,
          block,
          street_name: street,
          storey_range: storeyRange,
          floor_area_sqm: floorArea,
          flat_model: model,
          lease_commence_date: leaseStart,
          remaining_lease: remainingLease,
          resale_price: resalePrice,
          price_per_sqm: pricePerSqm,
          price_per_sqft: pricePerSqft,
          floor_area_sqft: floorAreaSqft,
          remaining_lease_years: Math.round(remainingLeaseYears * 10) / 10,
        });
      }
    });
  });

  return records;
}

export const RAW_SAMPLE_API_RECORDS = [
  {
    _id: 238977,
    month: '2026-11',
    town: 'TAMPINES',
    flat_type: '4 ROOM',
    block: '809',
    street_name: 'TAMPINES AVE 4',
    storey_range: '07 TO 09',
    floor_area_sqm: '105.00',
    flat_model: 'Model A',
    lease_commence_date: '1984',
    remaining_lease: '56 years 05 months',
    resale_price: '668000',
  },
  {
    _id: 239057,
    month: '2026-11',
    town: 'TAMPINES',
    flat_type: '4 ROOM',
    block: '496G',
    street_name: 'TAMPINES AVE 9',
    storey_range: '07 TO 09',
    floor_area_sqm: '106.00',
    flat_model: 'Model A',
    lease_commence_date: '1993',
    remaining_lease: '65 years 10 months',
    resale_price: '625888',
  },
  {
    _id: 239066,
    month: '2026-11',
    town: 'TAMPINES',
    flat_type: '4 ROOM',
    block: '505',
    street_name: 'TAMPINES CTRL 1',
    storey_range: '04 TO 06',
    floor_area_sqm: '103.00',
    flat_model: 'Model A',
    lease_commence_date: '1989',
    remaining_lease: '61 years 10 months',
    resale_price: '780000',
  },
  {
    _id: 239088,
    month: '2026-11',
    town: 'TAMPINES',
    flat_type: '4 ROOM',
    block: '524B',
    street_name: 'TAMPINES CTRL 7',
    storey_range: '01 TO 03',
    floor_area_sqm: '93.00',
    flat_model: 'Model A',
    lease_commence_date: '2015',
    remaining_lease: '87 years 11 months',
    resale_price: '745000',
  },
  {
    _id: 239106,
    month: '2026-11',
    town: 'TAMPINES',
    flat_type: '4 ROOM',
    block: '519A',
    street_name: 'TAMPINES CTRL 8',
    storey_range: '13 TO 15',
    floor_area_sqm: '83.00',
    flat_model: 'DBSS',
    lease_commence_date: '2014',
    remaining_lease: '86 years 08 months',
    resale_price: '885888',
  },
];

export function parseRawApiRecord(raw: any): HdbRecord {
  const floorArea = typeof raw.floor_area_sqm === 'number' ? raw.floor_area_sqm : parseFloat(raw.floor_area_sqm || '0');
  const price = typeof raw.resale_price === 'number' ? raw.resale_price : parseFloat(raw.resale_price || '0');
  const leaseStart = typeof raw.lease_commence_date === 'number' ? raw.lease_commence_date : parseInt(raw.lease_commence_date || '1990', 10);

  // Parse remaining lease string, e.g. "56 years 05 months"
  const remStr = String(raw.remaining_lease || '');
  const yearsMatch = remStr.match(/(\d+)\s*years?/i);
  const monthsMatch = remStr.match(/(\d+)\s*months?/i);
  const years = yearsMatch ? parseInt(yearsMatch[1], 10) : 0;
  const months = monthsMatch ? parseInt(monthsMatch[1], 10) : 0;
  const remainingYears = years > 0 ? years + months / 12 : 99 - (2026 - leaseStart);

  const floorAreaSqft = Math.round(floorArea * 10.7639 * 10) / 10;
  const pricePerSqm = floorArea > 0 ? Math.round(price / floorArea) : 0;
  const pricePerSqft = floorArea > 0 ? Math.round(price / (floorArea * 10.7639)) : 0;

  return {
    id: String(raw._id || raw.id || Math.random().toString(36).slice(2)),
    raw_id: raw._id || raw.id,
    month: String(raw.month || '2026-11'),
    town: String(raw.town || '').toUpperCase(),
    flat_type: String(raw.flat_type || '4 ROOM') as FlatType,
    block: String(raw.block || ''),
    street_name: String(raw.street_name || ''),
    storey_range: String(raw.storey_range || '07 TO 09'),
    floor_area_sqm: floorArea,
    flat_model: String(raw.flat_model || 'Model A'),
    lease_commence_date: leaseStart,
    remaining_lease: remStr || `${Math.floor(remainingYears)} years`,
    resale_price: price,
    price_per_sqm: pricePerSqm,
    price_per_sqft: pricePerSqft,
    floor_area_sqft: floorAreaSqft,
    remaining_lease_years: Math.round(remainingYears * 10) / 10,
  };
}

export const SEED_HDB_TRANSACTIONS: HdbRecord[] = [
  ...RAW_SAMPLE_API_RECORDS.map(parseRawApiRecord),
  ...generateSeedTransactions(),
];
