/**
 * Formatting utilities for Singapore currency, floor areas, lease, and mortgage.
 */

export function formatCurrency(amount: number, compact: boolean = false): string {
  if (isNaN(amount) || amount === 0) return 'S$0';

  if (compact) {
    if (amount >= 1_000_000) {
      return `S$${(amount / 1_000_000).toFixed(2)}M`;
    }
    if (amount >= 1_000) {
      return `S$${(amount / 1_000).toFixed(0)}K`;
    }
  }

  return new Intl.NumberFormat('en-SG', {
    style: 'currency',
    currency: 'SGD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPsf(amount: number): string {
  if (isNaN(amount) || amount === 0) return 'S$0 psf';
  return `S$${Math.round(amount).toLocaleString('en-SG')} psf`;
}

export function formatPsm(amount: number): string {
  if (isNaN(amount) || amount === 0) return 'S$0/sqm';
  return `S$${Math.round(amount).toLocaleString('en-SG')}/sqm`;
}

export function formatArea(sqm: number, unit: 'sqm' | 'sqft' = 'sqm'): string {
  if (unit === 'sqft') {
    const sqft = Math.round(sqm * 10.7639);
    return `${sqft.toLocaleString('en-SG')} sq ft`;
  }
  return `${Math.round(sqm)} sqm`;
}

export function formatMonthDisplay(monthStr: string): string {
  if (!monthStr || monthStr.length < 7) return monthStr;
  const [year, month] = monthStr.split('-');
  const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
  return date.toLocaleDateString('en-SG', { month: 'short', year: 'numeric' });
}

/**
 * Calculates Buyer's Stamp Duty (BSD) for Singapore residential property
 */
export function calculateBSD(price: number): number {
  if (price <= 0) return 0;
  let bsd = 0;

  // Tier 1: First $180,000 at 1%
  const t1 = Math.min(price, 180000);
  bsd += t1 * 0.01;

  // Tier 2: Next $180,000 at 2% ($180k - $360k)
  if (price > 180000) {
    const t2 = Math.min(price - 180000, 180000);
    bsd += t2 * 0.02;
  }

  // Tier 3: Next $640,000 at 3% ($360k - $1M)
  if (price > 360000) {
    const t3 = Math.min(price - 360000, 640000);
    bsd += t3 * 0.03;
  }

  // Tier 4: Next $500,000 at 4% ($1M - $1.5M)
  if (price > 1000000) {
    const t4 = Math.min(price - 1000000, 500000);
    bsd += t4 * 0.04;
  }

  // Tier 5: Next $1,500,000 at 5% ($1.5M - $3M)
  if (price > 1500000) {
    const t5 = Math.min(price - 1500000, 1500000);
    bsd += t5 * 0.05;
  }

  // Tier 6: Above $3M at 6%
  if (price > 3000000) {
    bsd += (price - 3000000) * 0.06;
  }

  return Math.round(bsd);
}

/**
 * Monthly mortgage payment calculation using standard amortization
 * @param principal Loan principal amount
 * @param annualRatePercentage e.g. 2.6 for 2.6%
 * @param tenureYears e.g. 25
 */
export function calculateMonthlyMortgage(principal: number, annualRatePercentage: number, tenureYears: number): number {
  if (principal <= 0 || annualRatePercentage <= 0 || tenureYears <= 0) return 0;
  const monthlyRate = annualRatePercentage / 100 / 12;
  const totalMonths = tenureYears * 12;
  const monthlyPayment = (principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
  return Math.round(monthlyPayment);
}
