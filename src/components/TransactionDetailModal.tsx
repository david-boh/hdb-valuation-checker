import React, { useState, useEffect, useMemo } from 'react';
import { HdbRecord, TownAnalytics } from '../types/hdb';
import { formatCurrency, formatPsf, formatArea, calculateBSD, calculateMonthlyMortgage } from '../utils/formatters';
import { assessValuation } from '../utils/valuation';
import { fetchCarparkAvailability } from '../services/hdbService';
import { X, Building, Calculator, Check, ExternalLink, Calendar, Compass, ShieldAlert, ShieldCheck, AlertTriangle, Car } from 'lucide-react';

interface TransactionDetailModalProps {
  record: HdbRecord | null;
  townAnalytics?: TownAnalytics;
  unitSystem: 'sqm' | 'sqft';
  onClose: () => void;
  allTransactions?: HdbRecord[];
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  record,
  townAnalytics,
  unitSystem,
  onClose,
  allTransactions,
}) => {
  // Mortgage parameters
  const [ltvPercent, setLtvPercent] = useState<number>(75); // 75% for bank loan, 80% for HDB loan
  const [tenureYears, setTenureYears] = useState<number>(25);
  const [interestRate, setInterestRate] = useState<number>(2.6); // 2.6% HDB loan default

  const [showRawJson, setShowRawJson] = useState(false);
  const [copied, setCopied] = useState(false);
  const [carparks, setCarparks] = useState<any[]>([]);
  const [loadingCarparks, setLoadingCarparks] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (record?.town) {
      setLoadingCarparks(true);
      fetchCarparkAvailability(record.town)
        .then((data) => {
          if (Array.isArray(data.carparks)) {
            setCarparks(data.carparks.slice(0, 4));
          }
        })
        .finally(() => setLoadingCarparks(false));
    }
  }, [record?.town]);

  // Valuation Assessment calculation
  const valuation = useMemo(() => {
    if (!record) return null;
    return assessValuation(
      {
        town: record.town,
        flat_type: record.flat_type,
        flat_model: record.flat_model,
        storey_range: record.storey_range,
        floor_area_sqm: record.floor_area_sqm,
        remaining_lease_years: record.remaining_lease_years,
        asking_price: record.resale_price,
      },
      allTransactions || []
    );
  }, [record, allTransactions]);

  if (!record) return null;

  // Exact raw JSON payload representation
  const rawApiPayload = {
    _id: record.raw_id || (record.id.startsWith('hdb-') ? parseInt(record.id.replace('hdb-', ''), 10) + 238000 : record.id),
    month: record.month,
    town: record.town,
    flat_type: record.flat_type,
    block: record.block,
    street_name: record.street_name,
    storey_range: record.storey_range,
    floor_area_sqm: record.floor_area_sqm.toFixed(2),
    flat_model: record.flat_model,
    lease_commence_date: String(record.lease_commence_date),
    remaining_lease: record.remaining_lease,
    resale_price: String(record.resale_price),
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(rawApiPayload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Stamp duty calculation
  const bsd = calculateBSD(record.resale_price);

  // Mortgage calculations
  const loanAmount = Math.round(record.resale_price * (ltvPercent / 100));
  const downpayment = record.resale_price - loanAmount;
  const monthlyInstallment = calculateMonthlyMortgage(loanAmount, interestRate, tenureYears);

  // Town benchmark delta
  const townMedian = townAnalytics?.flatTypeBreakdown[record.flat_type]?.medianPrice || townAnalytics?.medianPrice;
  const priceDelta = townMedian ? ((record.resale_price - townMedian) / townMedian) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between bg-slate-50/70 dark:bg-slate-800/40">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium flex-wrap">
              <span className="font-mono text-red-600 dark:text-red-400 font-bold">
                API _id: {String(rawApiPayload._id)}
              </span>
              <span>·</span>
              <span>{record.town}</span>
              <span>·</span>
              <span>{record.month} Transaction</span>
              <span>·</span>
              <span>{record.flat_type}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              Blk {record.block} {record.street_name}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRawJson(!showRawJson)}
              className="px-2.5 py-1 text-xs font-mono font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title="View exact raw JSON representation"
            >
              {showRawJson ? 'Hide JSON' : '{ } API JSON'}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-6">
          {/* Raw JSON View if toggled */}
          {showRawJson && (
            <div className="p-3.5 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-[11px] pb-1 border-b border-slate-800">
                <span>Expected API JSON Payload</span>
                <button
                  onClick={handleCopyJson}
                  className="text-red-400 hover:text-red-300 transition-colors cursor-pointer font-sans text-xs"
                >
                  {copied ? 'Copied!' : 'Copy JSON'}
                </button>
              </div>
              <pre className="overflow-x-auto text-[11px] leading-relaxed text-emerald-400">
                {JSON.stringify(rawApiPayload, null, 2)}
              </pre>
            </div>
          )}
          {/* Key Property Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 block">Resale Price</span>
              <span className="text-base font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                {formatCurrency(record.resale_price)}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 block">Unit PSF</span>
              <span className="text-base font-bold text-red-600 dark:text-red-400 font-mono tabular-nums">
                {formatPsf(record.price_per_sqft)}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 block">Floor Area</span>
              <span className="text-base font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                {formatArea(record.floor_area_sqm, unitSystem)}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 block">Storey Range</span>
              <span className="text-base font-bold text-slate-900 dark:text-white font-mono">
                {record.storey_range}
              </span>
            </div>
          </div>

          {/* Valuation Assessment & COV Report */}
          {valuation && (
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-3">
              <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Indicative Market Valuation Assessment</span>
                </div>
                <span className="font-mono text-[11px] text-slate-500">
                  Confidence: <strong className="text-slate-700 dark:text-slate-300">{valuation.confidence}</strong> ({valuation.sampleSize} comps)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div>
                  <span className="text-[11px] text-slate-500 block">Indicative Fair Valuation</span>
                  <div className="text-xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                    {formatCurrency(valuation.indicativePrice)}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Benchmark Spread: {formatCurrency(valuation.priceRangeLow, true)} - {formatCurrency(valuation.priceRangeHigh, true)}
                  </div>
                </div>

                <div
                  className={`p-3 rounded-lg border text-xs ${
                    valuation.valuationRating === 'undervalued'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
                      : valuation.valuationRating === 'premium'
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-100'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white'
                  }`}
                >
                  <div className="font-semibold flex items-center justify-between">
                    <span>Valuation Assessment:</span>
                    <strong className="font-mono">{valuation.variancePercent >= 0 ? `+${valuation.variancePercent}%` : `${valuation.variancePercent}%`}</strong>
                  </div>
                  <div className="font-bold text-xs mt-0.5 font-mono">
                    {valuation.ratingLabel}
                  </div>
                  <div className="text-[10px] opacity-80 mt-1 font-mono">
                    COV Risk: {valuation.estimatedCOV > 0 ? formatCurrency(valuation.estimatedCOV) : 'S$0 (Within Fair Valuation)'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Unit Specs & Town Comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30">
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                Flat Specifications
              </span>
              <div className="space-y-1.5 text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Flat Model:</span>
                  <strong className="text-slate-900 dark:text-white">{record.flat_model}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Lease Commencement:</span>
                  <strong className="text-slate-900 dark:text-white font-mono">
                    {record.lease_commence_date}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Remaining Lease:</span>
                  <strong className="text-slate-900 dark:text-white font-mono">
                    {record.remaining_lease}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Price per SQM:</span>
                  <strong className="text-slate-900 dark:text-white font-mono">
                    {formatCurrency(record.price_per_sqm)}/sqm
                  </strong>
                </div>
              </div>
            </div>

            {/* Benchmark vs Town Median */}
            <div className="space-y-2 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30">
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                Town Benchmark Analysis
              </span>
              <div className="space-y-1.5 text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Town 4-Room / Type Median:</span>
                  <strong className="text-slate-900 dark:text-white font-mono">
                    {townMedian ? formatCurrency(townMedian) : 'N/A'}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Price Variance:</span>
                  <strong
                    className={`font-mono ${
                      priceDelta > 0
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {priceDelta > 0 ? `+${priceDelta.toFixed(1)}% premium` : `${priceDelta.toFixed(1)}% discount`}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Buyer's Stamp Duty (BSD):</span>
                  <strong className="text-slate-900 dark:text-white font-mono">
                    {formatCurrency(bsd)}
                  </strong>
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-300 pt-0.5">
                  Calculated based on standard IRAS Singapore residential tiers
                </div>
              </div>
            </div>
          </div>

          {/* Integrated Mortgage & Financing Calculator */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calculator className="w-4 h-4 text-red-600" />
                Mortgage & Financing Estimator
              </h4>
              <span className="text-[11px] text-slate-500 font-mono">
                Loan: {formatCurrency(loanAmount, true)} ({ltvPercent}%)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* LTV */}
              <div className="space-y-1">
                <span className="text-[11px] text-slate-500 block">Loan-to-Value (LTV)</span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => {
                      setLtvPercent(80);
                      setInterestRate(2.6);
                    }}
                    className={`flex-1 py-1 px-2 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
                      ltvPercent === 80
                        ? 'bg-red-600 text-white border-red-600'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    80% (HDB Loan)
                  </button>
                  <button
                    onClick={() => {
                      setLtvPercent(75);
                      setInterestRate(3.2);
                    }}
                    className={`flex-1 py-1 px-2 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
                      ltvPercent === 75
                        ? 'bg-red-600 text-white border-red-600'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    75% (Bank Loan)
                  </button>
                </div>
              </div>

              {/* Tenure */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Tenure</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">
                    {tenureYears} Years
                  </span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="30"
                  step="1"
                  value={tenureYears}
                  onChange={(e) => setTenureYears(parseInt(e.target.value, 10))}
                  className="w-full accent-red-600 cursor-pointer"
                />
              </div>

              {/* Interest Rate */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Interest Rate</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">
                    {interestRate.toFixed(2)}% p.a.
                  </span>
                </div>
                <input
                  type="range"
                  min="2.0"
                  max="4.5"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                  className="w-full accent-red-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Financing Results */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-200 dark:border-slate-700 text-xs">
              <div>
                <span className="text-[11px] text-slate-500 block">Est. Monthly Installment</span>
                <span className="text-lg font-bold text-red-600 dark:text-red-400 font-mono tabular-nums">
                  {formatCurrency(monthlyInstallment)}/mo
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Min. Downpayment (Cash/CPF)</span>
                <span className="text-base font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                  {formatCurrency(downpayment)}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Buyer Stamp Duty (BSD)</span>
                <span className="text-base font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                  {formatCurrency(bsd)}
                </span>
              </div>
            </div>
          </div>

          {/* Nearby Carpark Availability Section */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Car className="w-4 h-4 text-red-600" />
                Nearby HDB Carpark Availability ({record.town})
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Live Feed: /api/carparkavailability
              </span>
            </div>

            {loadingCarparks ? (
              <div className="text-xs text-slate-500 py-2">Loading live carpark lots...</div>
            ) : carparks.length === 0 ? (
              <div className="text-xs text-slate-500 py-1">No carparks found for this estate.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {carparks.map((cp) => (
                  <div
                    key={cp.carparkNumber}
                    className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span className="font-mono text-red-600 dark:text-red-400">{cp.carparkNumber}</span>
                        <span className="truncate max-w-[130px]">{cp.development}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        Occupancy: {cp.occupancyRatePercent}%
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-slate-900 dark:text-white">
                        {cp.availableLots} / {cp.totalLots}
                      </div>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                        Lots Available
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40 text-xs text-slate-500">
          <span>HDB Resale Flat Official Historical Record</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-medium rounded-lg hover:bg-slate-800 dark:hover:bg-white transition-colors cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
