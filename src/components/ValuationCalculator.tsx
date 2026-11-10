import React, { useState, useMemo } from 'react';
import { FlatType, HdbRecord } from '../types/hdb';
import { SINGAPORE_TOWNS, FLAT_TYPES_LIST } from '../data/singaporeTowns';
import { assessValuation, ValuationInput } from '../utils/valuation';
import { formatCurrency, formatPsf, formatArea } from '../utils/formatters';
import {
  Calculator,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Info,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Eye,
  Sliders,
} from 'lucide-react';

interface ValuationCalculatorProps {
  allTransactions: HdbRecord[];
  unitSystem: 'sqm' | 'sqft';
  onSelectRecord: (record: HdbRecord) => void;
}

export const ValuationCalculator: React.FC<ValuationCalculatorProps> = ({
  allTransactions,
  unitSystem,
  onSelectRecord,
}) => {
  // Input parameters (defaulting to the Tampines 4-Room Blk 809 from the email)
  const [town, setTown] = useState<string>('TAMPINES');
  const [flatType, setFlatType] = useState<FlatType>('4 ROOM');
  const [flatModel, setFlatModel] = useState<string>('Model A');
  const [storeyRange, setStoreyRange] = useState<string>('07 TO 09');
  const [floorAreaSqm, setFloorAreaSqm] = useState<number>(105);
  const [remainingLeaseYears, setRemainingLeaseYears] = useState<number>(56.4);
  const [askingPrice, setAskingPrice] = useState<number>(668000);

  // Compute assessment
  const assessment = useMemo(() => {
    const input: ValuationInput = {
      town,
      flat_type: flatType,
      flat_model: flatModel,
      storey_range: storeyRange,
      floor_area_sqm: floorAreaSqm,
      remaining_lease_years: remainingLeaseYears,
      asking_price: askingPrice,
    };
    return assessValuation(input, allTransactions);
  }, [town, flatType, flatModel, storeyRange, floorAreaSqm, remainingLeaseYears, askingPrice, allTransactions]);

  // Presets
  const handleLoadPreset = (preset: 'tampines_809' | 'bishan_dbss' | 'punggol_premium') => {
    if (preset === 'tampines_809') {
      setTown('TAMPINES');
      setFlatType('4 ROOM');
      setFlatModel('Model A');
      setStoreyRange('07 TO 09');
      setFloorAreaSqm(105);
      setRemainingLeaseYears(56.4);
      setAskingPrice(668000);
    } else if (preset === 'bishan_dbss') {
      setTown('BISHAN');
      setFlatType('5 ROOM');
      setFlatModel('DBSS');
      setStoreyRange('25 TO 27');
      setFloorAreaSqm(120);
      setRemainingLeaseYears(86);
      setAskingPrice(1320000);
    } else if (preset === 'punggol_premium') {
      setTown('PUNGGOL');
      setFlatType('4 ROOM');
      setFlatModel('Premium Apartment');
      setStoreyRange('13 TO 15');
      setFloorAreaSqm(93);
      setRemainingLeaseYears(92);
      setAskingPrice(650000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Presets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calculator className="w-5 h-5 text-red-600" />
            HDB Indicative Valuation Assessment & COV Estimator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Evaluate fair market valuation, pricing benchmarks, and Cash-Over-Valuation (COV) risks
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          <span className="text-[11px] text-slate-500 font-medium">Quick Profiles:</span>
          <button
            onClick={() => handleLoadPreset('tampines_809')}
            className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium cursor-pointer transition-colors"
          >
            Tampines Blk 809 (Email)
          </button>
          <button
            onClick={() => handleLoadPreset('bishan_dbss')}
            className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium cursor-pointer transition-colors"
          >
            Bishan Natura DBSS
          </button>
          <button
            onClick={() => handleLoadPreset('punggol_premium')}
            className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium cursor-pointer transition-colors"
          >
            Punggol Premium Apt
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Form (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-red-600" />
              Target Property Specifications
            </span>
            <span className="text-[11px] text-slate-500">Live Valuation Model</span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Town */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                Town / Estate
              </label>
              <select
                value={town}
                onChange={(e) => setTown(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden"
              >
                {SINGAPORE_TOWNS.map((t) => (
                  <option key={t.name} value={t.name}>
                    {t.displayName} ({t.region})
                  </option>
                ))}
              </select>
            </div>

            {/* Flat Type */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                Flat Type
              </label>
              <select
                value={flatType}
                onChange={(e) => setFlatType(e.target.value as FlatType)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden"
              >
                {FLAT_TYPES_LIST.map((ft) => (
                  <option key={ft} value={ft}>
                    {ft}
                  </option>
                ))}
              </select>
            </div>

            {/* Flat Model */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                Flat Model
              </label>
              <select
                value={flatModel}
                onChange={(e) => setFlatModel(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden"
              >
                <option value="Model A">Model A</option>
                <option value="Improved">Improved</option>
                <option value="New Generation">New Generation</option>
                <option value="Premium Apartment">Premium Apartment</option>
                <option value="DBSS">DBSS (Design, Build & Sell)</option>
                <option value="Maisonette">Executive Maisonette</option>
                <option value="Simplified">Simplified</option>
                <option value="Standard">Standard</option>
                <option value="Terrace">HDB Terrace</option>
              </select>
            </div>

            {/* Storey Range */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                Storey Range
              </label>
              <select
                value={storeyRange}
                onChange={(e) => setStoreyRange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden"
              >
                <option value="01 TO 03">01 TO 03 (Low floor)</option>
                <option value="04 TO 06">04 TO 06 (Low-mid)</option>
                <option value="07 TO 09">07 TO 09 (Mid floor baseline)</option>
                <option value="10 TO 12">10 TO 12 (Mid-high)</option>
                <option value="13 TO 15">13 TO 15 (High floor)</option>
                <option value="16 TO 18">16 TO 18 (High floor)</option>
                <option value="19 TO 21">19 TO 21 (Very high)</option>
                <option value="25 TO 27">25 TO 27 (Sky suite)</option>
                <option value="31 TO 33">31 TO 33 (Panoramic)</option>
                <option value="40 TO 42">40 TO 42 (Pinnacle/Apex)</option>
              </select>
            </div>

            {/* Floor Area */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Floor Area ({unitSystem})
                </label>
                <span className="font-mono text-slate-500">
                  {formatArea(floorAreaSqm, unitSystem)}
                </span>
              </div>
              <input
                type="range"
                min="35"
                max="170"
                step="1"
                value={floorAreaSqm}
                onChange={(e) => setFloorAreaSqm(parseInt(e.target.value, 10))}
                className="w-full accent-red-600 cursor-pointer"
              />
            </div>

            {/* Remaining Lease */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Remaining Lease
                </label>
                <span className="font-mono text-slate-500">
                  {remainingLeaseYears.toFixed(1)} years
                </span>
              </div>
              <input
                type="range"
                min="45"
                max="98"
                step="0.5"
                value={remainingLeaseYears}
                onChange={(e) => setRemainingLeaseYears(parseFloat(e.target.value))}
                className="w-full accent-red-600 cursor-pointer"
              />
            </div>

            {/* Asking / Offer Price */}
            <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between">
                <label className="font-semibold text-slate-800 dark:text-slate-200">
                  Target / Asking Price (SGD)
                </label>
                <span className="font-mono font-bold text-red-600 dark:text-red-400">
                  {formatCurrency(askingPrice)}
                </span>
              </div>
              <input
                type="number"
                step="5000"
                min="200000"
                max="1700000"
                value={askingPrice}
                onChange={(e) => setAskingPrice(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono font-semibold focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Valuation Assessment & COV Report (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Indicative Valuation Banner */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Automated Market Valuation Assessment (AVM)</span>
              </div>
              <span className="font-mono text-[11px]">
                Confidence: <strong className="text-slate-800 dark:text-slate-200">{assessment.confidence}</strong> ({assessment.sampleSize} comps)
              </span>
            </div>

            {/* Price Numbers & Rating */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <span className="text-xs text-slate-500 block">Indicative Fair Market Valuation</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums mt-0.5">
                  {formatCurrency(assessment.indicativePrice)}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">
                  Expected Spread: {formatCurrency(assessment.priceRangeLow, true)} - {formatCurrency(assessment.priceRangeHigh, true)}
                </div>
              </div>

              {/* Assessment Status Box */}
              <div
                className={`p-3.5 rounded-xl border flex flex-col justify-between ${
                  assessment.valuationRating === 'undervalued'
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
                    : assessment.valuationRating === 'premium'
                    ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-100'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white'
                }`}
              >
                <div className="text-xs font-semibold flex items-center justify-between">
                  <span>Valuation Assessment</span>
                  {assessment.valuationRating === 'undervalued' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                  {assessment.valuationRating === 'premium' && (
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                  )}
                </div>
                <div className="text-base font-bold mt-1 font-mono">
                  {assessment.ratingLabel}
                </div>
                <div className="text-[11px] opacity-80 mt-0.5">
                  Target Price is {assessment.variancePercent > 0 ? `+${assessment.variancePercent}% above` : `${Math.abs(assessment.variancePercent)}% below`} indicative valuation
                </div>
              </div>
            </div>

            {/* Cash-Over-Valuation (COV) Risk Alert Card */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-red-600" />
                  Estimated Cash-Over-Valuation (COV)
                </span>
                <span
                  className={`font-mono font-bold text-sm ${
                    assessment.estimatedCOV > 0
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {assessment.estimatedCOV > 0 ? formatCurrency(assessment.estimatedCOV) : 'S$0 (No COV Expected)'}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                {assessment.estimatedCOV > 0
                  ? `Notice: The target price exceeds indicative valuation by ${formatCurrency(assessment.estimatedCOV)}. In Singapore, this COV amount must be settled strictly in CASH, outside of CPF housing grants and bank/HDB loan financing.`
                  : 'The asking price is within or below the benchmark valuation range. No Cash-Over-Valuation (COV) is expected, allowing maximum loan-to-value (LTV) and CPF utilization.'}
              </p>
            </div>

            {/* Valuation Factor Breakdown */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                Valuation Factor Weightings:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/70">
                  <span className="text-[10px] text-slate-500 block">Base Town PSF</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {formatPsf(assessment.factors.baseTownPsf)}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/70">
                  <span className="text-[10px] text-slate-500 block">Storey Factor</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {assessment.factors.storeyMultiplier}x ({assessment.factors.storeyMultiplier >= 1 ? '+' : ''}{Math.round((assessment.factors.storeyMultiplier - 1) * 100)}%)
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/70">
                  <span className="text-[10px] text-slate-500 block">Lease Decay (Bala)</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {assessment.factors.leaseMultiplier}x ({Math.round((assessment.factors.leaseMultiplier - 1) * 100)}%)
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/70">
                  <span className="text-[10px] text-slate-500 block">Model Premium</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {assessment.factors.modelMultiplier}x
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Closest Comparable Transactions */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-red-600" />
                Nearest Comparable Transactions ({town} {flatType})
              </span>
              <span className="text-[11px] text-slate-500">Historical Sales Evidence</span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {assessment.comparables.map((comp) => (
                <div
                  key={comp.id}
                  onClick={() => onSelectRecord(comp)}
                  className="py-2.5 flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-slate-800/40 p-2 rounded-lg cursor-pointer transition-colors group"
                >
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>Blk {comp.block} {comp.street_name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">#{comp.raw_id || comp.id}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>Storey {comp.storey_range}</span>
                      <span>·</span>
                      <span>{formatArea(comp.floor_area_sqm, unitSystem)}</span>
                      <span>·</span>
                      <span>{comp.remaining_lease}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono font-bold text-slate-900 dark:text-white">
                      {formatCurrency(comp.resale_price)}
                    </div>
                    <div className="text-[11px] text-red-600 dark:text-red-400 font-mono">
                      {formatPsf(comp.price_per_sqft)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
