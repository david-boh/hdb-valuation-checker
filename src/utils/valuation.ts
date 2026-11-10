import { FlatType, HdbRecord } from '../types/hdb';
import { calculateMedian } from './analytics';

export interface ValuationAssessment {
  indicativePrice: number;
  priceRangeLow: number;
  priceRangeHigh: number;
  valuationRating: 'undervalued' | 'fair' | 'premium';
  ratingLabel: string;
  variancePercent: number; // Positive = above valuation, Negative = below valuation
  estimatedCOV: number; // Cash-Over-Valuation in SGD (if price > indicativePrice)
  confidence: 'High' | 'Moderate' | 'Limited';
  sampleSize: number;
  factors: {
    baseTownPsf: number;
    storeyMultiplier: number;
    leaseMultiplier: number;
    modelMultiplier: number;
  };
  comparables: HdbRecord[];
}

export interface ValuationInput {
  town: string;
  flat_type: FlatType;
  floor_area_sqm: number;
  storey_range: string;
  flat_model: string;
  remaining_lease_years: number;
  asking_price?: number;
}

/**
 * Storey adjustment factors in Singapore HDB resale market.
 * Higher floors command higher views and lower noise/insects.
 */
function getStoreyMultiplier(storeyRange: string): number {
  const match = storeyRange.match(/^(\d+)/);
  const floor = match ? parseInt(match[1], 10) : 7;

  if (floor <= 3) return 0.96; // Ground/low floor discount (-4%)
  if (floor <= 6) return 0.98; // Low-mid floor (-2%)
  if (floor <= 9) return 1.00; // Benchmark mid floor
  if (floor <= 12) return 1.02; // Mid-high (+2%)
  if (floor <= 18) return 1.05; // High floor (+5%)
  if (floor <= 24) return 1.08; // Very high floor (+8%)
  if (floor <= 30) return 1.12; // Sky suite / 25+ (+12%)
  return 1.15; // 30+ floors premium (+15%)
}

/**
 * Lease decay factor based on Singapore SLA Bala's Table leasehold depreciation curve
 */
function getLeaseMultiplier(remainingYears: number): number {
  if (remainingYears >= 90) return 1.05; // Fresh MOP flat premium
  if (remainingYears >= 80) return 1.02;
  if (remainingYears >= 70) return 1.00; // Baseline
  if (remainingYears >= 60) return 0.95;
  if (remainingYears >= 50) return 0.90;
  return 0.84; // Older flat with severe CPF usage limits
}

/**
 * Flat model premium factors
 */
function getModelMultiplier(flatModel: string): number {
  const m = flatModel.toLowerCase();
  if (m.includes('dbss')) return 1.18;
  if (m.includes('maisonette')) return 1.14;
  if (m.includes('terrace')) return 1.25;
  if (m.includes('premium')) return 1.04;
  if (m.includes('simplified') || m.includes('standard')) return 0.96;
  return 1.00; // Model A / Improved benchmark
}

/**
 * Computes an indicative valuation assessment for a given HDB flat based on
 * recent transactions in that town and comparable sales.
 */
export function assessValuation(
  target: ValuationInput,
  allTransactions: HdbRecord[]
): ValuationAssessment {
  // 1. Filter town & flat type matches
  const townMatches = allTransactions.filter(
    (r) => r.town.toUpperCase() === target.town.toUpperCase() && r.flat_type === target.flat_type
  );

  const fallbackMatches = townMatches.length > 0 ? townMatches : allTransactions.filter((r) => r.flat_type === target.flat_type);

  // 2. Base PSF calculation
  const psfList = fallbackMatches.map((r) => r.price_per_sqft);
  const baseTownPsf = calculateMedian(psfList) || 550;

  // 3. Multiplier adjustments
  const storeyMultiplier = getStoreyMultiplier(target.storey_range);
  const leaseMultiplier = getLeaseMultiplier(target.remaining_lease_years);
  const modelMultiplier = getModelMultiplier(target.flat_model);

  // Adjusted PSF
  const adjustedPsf = baseTownPsf * storeyMultiplier * leaseMultiplier * modelMultiplier;
  const areaSqft = target.floor_area_sqm * 10.7639;

  // Indicative Price
  const rawEstimatedPrice = Math.round((adjustedPsf * areaSqft) / 1000) * 1000;
  const priceRangeLow = Math.round((rawEstimatedPrice * 0.96) / 1000) * 1000;
  const priceRangeHigh = Math.round((rawEstimatedPrice * 1.04) / 1000) * 1000;

  // 4. Find closest comparable transactions (same town, same flat type, closest floor area and storey)
  const sortedComps = [...fallbackMatches].sort((a, b) => {
    const areaDiffA = Math.abs(a.floor_area_sqm - target.floor_area_sqm);
    const areaDiffB = Math.abs(b.floor_area_sqm - target.floor_area_sqm);
    const leaseDiffA = Math.abs(a.remaining_lease_years - target.remaining_lease_years);
    const leaseDiffB = Math.abs(b.remaining_lease_years - target.remaining_lease_years);
    return areaDiffA + leaseDiffA * 0.5 - (areaDiffB + leaseDiffB * 0.5);
  });

  const comparables = sortedComps.slice(0, 4);

  // 5. Variance and Rating against asking/resale price
  const comparePrice = target.asking_price || rawEstimatedPrice;
  const variancePercent = Math.round(((comparePrice - rawEstimatedPrice) / rawEstimatedPrice) * 1000) / 10;

  let valuationRating: 'undervalued' | 'fair' | 'premium' = 'fair';
  let ratingLabel = 'Fair Market Value';
  let estimatedCOV = 0;

  if (variancePercent < -3.0) {
    valuationRating = 'undervalued';
    ratingLabel = `Below Fair Value (${Math.abs(variancePercent)}% Value Buy)`;
    estimatedCOV = 0;
  } else if (variancePercent > 3.0) {
    valuationRating = 'premium';
    ratingLabel = `Above Fair Value (+${variancePercent}% Premium)`;
    estimatedCOV = Math.max(0, comparePrice - rawEstimatedPrice);
  } else {
    valuationRating = 'fair';
    ratingLabel = 'Fair Market Value (±3%)';
    estimatedCOV = 0;
  }

  // Confidence determination
  const sampleSize = townMatches.length;
  const confidence: 'High' | 'Moderate' | 'Limited' =
    sampleSize >= 15 ? 'High' : sampleSize >= 6 ? 'Moderate' : 'Limited';

  return {
    indicativePrice: rawEstimatedPrice,
    priceRangeLow,
    priceRangeHigh,
    valuationRating,
    ratingLabel,
    variancePercent,
    estimatedCOV,
    confidence,
    sampleSize,
    factors: {
      baseTownPsf: Math.round(baseTownPsf),
      storeyMultiplier: Math.round(storeyMultiplier * 100) / 100,
      leaseMultiplier: Math.round(leaseMultiplier * 100) / 100,
      modelMultiplier: Math.round(modelMultiplier * 100) / 100,
    },
    comparables,
  };
}
