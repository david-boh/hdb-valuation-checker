import React from 'react';
import { SummaryKPIs } from '../types/hdb';
import { formatCurrency, formatPsf, formatArea } from '../utils/formatters';
import { TrendingUp, DollarSign, Home, Maximize2, Clock, Sparkles } from 'lucide-react';

interface SummaryMetricsProps {
  kpis: SummaryKPIs;
  unitSystem: 'sqm' | 'sqft';
}

export const SummaryMetrics: React.FC<SummaryMetricsProps> = ({ kpis, unitSystem }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {/* 1. Median Resale Price */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
          <span className="font-medium">Median Price</span>
          <DollarSign className="w-4 h-4 text-slate-400" />
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono tabular-nums">
            {formatCurrency(kpis.medianPrice, true)}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Avg: {formatCurrency(kpis.avgPrice, true)}
          </div>
        </div>
      </div>

      {/* 2. Average PSF */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
          <span className="font-medium">Average PSF</span>
          <TrendingUp className="w-4 h-4 text-slate-400" />
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono tabular-nums">
            {formatPsf(kpis.avgPsf)}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Median: {formatPsf(kpis.medianPsf)}
          </div>
        </div>
      </div>

      {/* 3. Transaction Volume */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
          <span className="font-medium">Total Volume</span>
          <Home className="w-4 h-4 text-slate-400" />
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono tabular-nums">
            {kpis.totalVolume.toLocaleString('en-SG')}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Filtered resale transactions
          </div>
        </div>
      </div>

      {/* 4. Floor Area */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
          <span className="font-medium">Avg Floor Area</span>
          <Maximize2 className="w-4 h-4 text-slate-400" />
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono tabular-nums">
            {unitSystem === 'sqft' ? formatArea(kpis.avgFloorAreaSqm, 'sqft') : `${kpis.avgFloorAreaSqm} sqm`}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {unitSystem === 'sqft' ? `${kpis.avgFloorAreaSqm} sqm equivalent` : formatArea(kpis.avgFloorAreaSqm, 'sqft')}
          </div>
        </div>
      </div>

      {/* 5. Remaining Lease */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
          <span className="font-medium">Avg Lease Left</span>
          <Clock className="w-4 h-4 text-slate-400" />
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono tabular-nums">
            {kpis.avgRemainingLease} yrs
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            99-year leasehold baseline
          </div>
        </div>
      </div>

      {/* 6. Million-Dollar Flats */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
          <span className="font-medium">S$1M+ Sales</span>
          <Sparkles className="w-4 h-4 text-amber-500" />
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400 font-mono tabular-nums">
            {kpis.millionDollarCount.toLocaleString('en-SG')}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Peak: {formatCurrency(kpis.maxPrice, true)}
          </div>
        </div>
      </div>
    </div>
  );
};
