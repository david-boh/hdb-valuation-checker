import { FlatType, HdbFilterState, HdbRecord, MonthlyTrendPoint, SummaryKPIs, TownAnalytics } from '../types/hdb';
import { formatMonthDisplay } from './formatters';

export function calculateMedian(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return Math.round((sorted[mid - 1] + sorted[mid]) / 2);
  }
  return Math.round(sorted[mid]);
}

export function filterTransactions(records: HdbRecord[], filters: HdbFilterState): HdbRecord[] {
  return records.filter((rec) => {
    // Note: town and flatType are filtered primarily at service level, but also safely matched here
    if (filters.towns.length > 0 && !filters.towns.includes(rec.town)) {
      return false;
    }

    if (filters.flatTypes.length > 0 && !filters.flatTypes.includes(rec.flat_type)) {
      return false;
    }

    // Floor area
    if (rec.floor_area_sqm < filters.floorAreaMin || rec.floor_area_sqm > filters.floorAreaMax) {
      return false;
    }

    // Resale price
    if (rec.resale_price < filters.priceMin || rec.resale_price > filters.priceMax) {
      return false;
    }

    // Date range (YYYY-MM string comparison works chronologically)
    if (filters.dateRangeStart && rec.month < filters.dateRangeStart) {
      return false;
    }
    if (filters.dateRangeEnd && rec.month > filters.dateRangeEnd) {
      return false;
    }

    // Storey tier
    if (filters.storeyTier !== 'all') {
      const match = rec.storey_range.match(/^(\d+)/);
      const lowFloor = match ? parseInt(match[1], 10) : 1;
      if (filters.storeyTier === 'low' && lowFloor > 6) return false;
      if (filters.storeyTier === 'mid' && (lowFloor < 7 || lowFloor > 15)) return false;
      if (filters.storeyTier === 'high' && (lowFloor < 16 || lowFloor > 27)) return false;
      if (filters.storeyTier === 'very_high' && lowFloor < 28) return false;
    }

    // Text search query: searches street_name, block, town, flat_model, and API _id
    if (filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase().trim();
      const matchId = String(rec.raw_id || rec.id).toLowerCase().includes(q);
      const matchStreet = rec.street_name.toLowerCase().includes(q);
      const matchBlock = rec.block.toLowerCase().includes(q);
      const matchTown = rec.town.toLowerCase().includes(q);
      const matchModel = rec.flat_model.toLowerCase().includes(q);
      const matchFullAddress = `${rec.block} ${rec.street_name}`.toLowerCase().includes(q);
      if (!matchStreet && !matchBlock && !matchTown && !matchModel && !matchFullAddress && !matchId) {
        return false;
      }
    }

    return true;
  });
}

export function computeSummaryKPIs(records: HdbRecord[]): SummaryKPIs {
  if (records.length === 0) {
    return {
      totalVolume: 0,
      avgPrice: 0,
      medianPrice: 0,
      avgPsf: 0,
      medianPsf: 0,
      minPrice: 0,
      maxPrice: 0,
      avgFloorAreaSqm: 0,
      avgFloorAreaSqft: 0,
      avgRemainingLease: 0,
      millionDollarCount: 0,
    };
  }

  const prices = records.map((r) => r.resale_price);
  const psfs = records.map((r) => r.price_per_sqft);
  const totalVolume = records.length;
  const totalPrice = prices.reduce((a, b) => a + b, 0);
  const totalPsf = psfs.reduce((a, b) => a + b, 0);
  const totalFloorArea = records.reduce((a, b) => a + b.floor_area_sqm, 0);
  const totalRemainingLease = records.reduce((a, b) => a + b.remaining_lease_years, 0);

  const avgPrice = Math.round(totalPrice / totalVolume);
  const medianPrice = calculateMedian(prices);
  const avgPsf = Math.round(totalPsf / totalVolume);
  const medianPsf = calculateMedian(psfs);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const avgFloorAreaSqm = Math.round((totalFloorArea / totalVolume) * 10) / 10;
  const avgFloorAreaSqft = Math.round(avgFloorAreaSqm * 10.7639);
  const avgRemainingLease = Math.round((totalRemainingLease / totalVolume) * 10) / 10;
  const millionDollarCount = records.filter((r) => r.resale_price >= 1000000).length;

  return {
    totalVolume,
    avgPrice,
    medianPrice,
    avgPsf,
    medianPsf,
    minPrice,
    maxPrice,
    avgFloorAreaSqm,
    avgFloorAreaSqft,
    avgRemainingLease,
    millionDollarCount,
  };
}

export function computeMonthlyTrend(records: HdbRecord[]): MonthlyTrendPoint[] {
  const groups: Record<string, HdbRecord[]> = {};

  records.forEach((rec) => {
    if (!groups[rec.month]) {
      groups[rec.month] = [];
    }
    groups[rec.month].push(rec);
  });

  const sortedMonths = Object.keys(groups).sort();

  return sortedMonths.map((m) => {
    const list = groups[m];
    const prices = list.map((r) => r.resale_price);
    const psfs = list.map((r) => r.price_per_sqft);
    const totalP = prices.reduce((a, b) => a + b, 0);
    const totalPsf = psfs.reduce((a, b) => a + b, 0);

    return {
      month: m,
      displayMonth: formatMonthDisplay(m),
      volume: list.length,
      avgPrice: Math.round(totalP / list.length),
      medianPrice: calculateMedian(prices),
      avgPsf: Math.round(totalPsf / list.length),
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
    };
  });
}

export function computeTownAnalytics(records: HdbRecord[]): Record<string, TownAnalytics> {
  const townMap: Record<string, HdbRecord[]> = {};

  records.forEach((rec) => {
    if (!townMap[rec.town]) {
      townMap[rec.town] = [];
    }
    townMap[rec.town].push(rec);
  });

  const result: Record<string, TownAnalytics> = {};

  Object.entries(townMap).forEach(([town, list]) => {
    const prices = list.map((r) => r.resale_price);
    const psfs = list.map((r) => r.price_per_sqft);
    const totalArea = list.reduce((a, b) => a + b.floor_area_sqm, 0);
    const totalLease = list.reduce((a, b) => a + b.remaining_lease_years, 0);

    // Flat type breakdown
    const ftGroups: Record<string, number[]> = {};
    list.forEach((r) => {
      if (!ftGroups[r.flat_type]) ftGroups[r.flat_type] = [];
      ftGroups[r.flat_type].push(r.resale_price);
    });

    const flatTypeBreakdown: Record<string, { count: number; avgPrice: number; medianPrice: number }> = {};
    Object.entries(ftGroups).forEach(([ft, pList]) => {
      flatTypeBreakdown[ft] = {
        count: pList.length,
        avgPrice: Math.round(pList.reduce((a, b) => a + b, 0) / pList.length),
        medianPrice: calculateMedian(pList),
      };
    });

    result[town] = {
      town,
      volume: list.length,
      avgPrice: Math.round(prices.reduce((a, b) => a + b, 0) / list.length),
      medianPrice: calculateMedian(prices),
      avgPsf: Math.round(psfs.reduce((a, b) => a + b, 0) / list.length),
      medianPsf: calculateMedian(psfs),
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      avgFloorArea: Math.round((totalArea / list.length) * 10) / 10,
      avgRemainingLease: Math.round((totalLease / list.length) * 10) / 10,
      flatTypeBreakdown,
    };
  });

  return result;
}

export function computeFlatTypeDistribution(records: HdbRecord[]): Array<{
  flatType: FlatType;
  count: number;
  percentage: number;
  avgPrice: number;
  medianPrice: number;
  avgPsf: number;
}> {
  const groups: Partial<Record<FlatType, HdbRecord[]>> = {};

  records.forEach((r) => {
    if (!groups[r.flat_type]) groups[r.flat_type] = [];
    groups[r.flat_type]!.push(r);
  });

  const total = records.length || 1;
  const typesOrder: FlatType[] = ['2 ROOM', '3 ROOM', '4 ROOM', '5 ROOM', 'EXECUTIVE', 'MULTI-GENERATION'];

  return typesOrder
    .filter((ft) => groups[ft] && groups[ft]!.length > 0)
    .map((ft) => {
      const list = groups[ft]!;
      const prices = list.map((r) => r.resale_price);
      const psfs = list.map((r) => r.price_per_sqft);
      return {
        flatType: ft,
        count: list.length,
        percentage: Math.round((list.length / total) * 1000) / 10,
        avgPrice: Math.round(prices.reduce((a, b) => a + b, 0) / list.length),
        medianPrice: calculateMedian(prices),
        avgPsf: Math.round(psfs.reduce((a, b) => a + b, 0) / list.length),
      };
    });
}
