import React, { useState } from 'react';
import { TownAnalytics } from '../types/hdb';
import { SINGAPORE_TOWNS } from '../data/singaporeTowns';
import { formatCurrency, formatPsf } from '../utils/formatters';
import { ArrowUpDown, Check, Plus, X, BarChart3, Building } from 'lucide-react';

interface TownComparisonProps {
  townAnalytics: Record<string, TownAnalytics>;
}

export const TownComparison: React.FC<TownComparisonProps> = ({ townAnalytics }) => {
  // Default selected towns for comparison
  const [selectedTowns, setSelectedTowns] = useState<string[]>([
    'BISHAN',
    'QUEENSTOWN',
    'TAMPINES',
    'PUNGGOL',
  ]);

  const [compareMetric, setCompareMetric] = useState<'median' | 'psf' | '4room' | '5room'>('median');

  // Toggle town in comparison
  const handleToggleTown = (town: string) => {
    if (selectedTowns.includes(town)) {
      if (selectedTowns.length > 2) {
        setSelectedTowns(selectedTowns.filter((t) => t !== town));
      }
    } else {
      if (selectedTowns.length < 5) {
        setSelectedTowns([...selectedTowns, town]);
      }
    }
  };

  // Presets
  const applyPreset = (preset: 'central_prime' | 'northeast_young' | 'east_west') => {
    if (preset === 'central_prime') {
      setSelectedTowns(['BISHAN', 'QUEENSTOWN', 'BUKIT MERAH', 'CENTRAL AREA']);
    } else if (preset === 'northeast_young') {
      setSelectedTowns(['PUNGGOL', 'SENGKANG', 'HOUGANG', 'ANG MO KIO']);
    } else if (preset === 'east_west') {
      setSelectedTowns(['TAMPINES', 'BEDOK', 'JURONG WEST', 'CLEMENTI']);
    }
  };

  const activeAnalytics = selectedTowns
    .map((t) => townAnalytics[t])
    .filter((a): a is TownAnalytics => Boolean(a));

  // Max value for comparative bars
  const getTownMetricValue = (a: TownAnalytics) => {
    if (compareMetric === 'median') return a.medianPrice;
    if (compareMetric === 'psf') return a.avgPsf;
    if (compareMetric === '4room') return a.flatTypeBreakdown['4 ROOM']?.medianPrice || a.medianPrice;
    return a.flatTypeBreakdown['5 ROOM']?.medianPrice || a.medianPrice;
  };

  const metricValues = activeAnalytics.map(getTownMetricValue);
  const maxVal = Math.max(...metricValues, 1);

  // SVG bar chart parameters
  const svgHeight = 220;
  const barWidth = 44;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-6 shadow-xs space-y-6">
      {/* Title & Presets */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building className="w-4 h-4 text-red-600" />
            Cross-Town Resale Price Comparison
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Select 2 to 5 towns to compare median prices, PSF values, lease profiles, and flat type premiums
          </p>
        </div>

        {/* Comparison Presets */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          <span className="text-[11px] text-slate-500 font-medium">Presets:</span>
          <button
            onClick={() => applyPreset('central_prime')}
            className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium cursor-pointer transition-colors"
          >
            Central Mature
          </button>
          <button
            onClick={() => applyPreset('northeast_young')}
            className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium cursor-pointer transition-colors"
          >
            North-East Hubs
          </button>
          <button
            onClick={() => applyPreset('east_west')}
            className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium cursor-pointer transition-colors"
          >
            East vs West
          </button>
        </div>
      </div>

      {/* Town Selectors */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          Selected Towns for Comparison ({selectedTowns.length} / 5):
        </span>
        <div className="flex flex-wrap gap-2">
          {SINGAPORE_TOWNS.map((town) => {
            const isSelected = selectedTowns.includes(town.name);
            return (
              <button
                key={town.name}
                onClick={() => handleToggleTown(town.name)}
                className={`px-3 py-1.5 text-xs rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-red-600 text-white border-red-600 font-semibold shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                }`}
              >
                {isSelected && <Check className="w-3 h-3" />}
                <span>{town.displayName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparative Bar Chart */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-red-600" />
            Direct Metric Benchmark
          </span>
          <div className="flex items-center gap-1 text-xs">
            <button
              onClick={() => setCompareMetric('median')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                compareMetric === 'median'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Median Price
            </button>
            <button
              onClick={() => setCompareMetric('psf')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                compareMetric === 'psf'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Avg PSF
            </button>
            <button
              onClick={() => setCompareMetric('4room')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                compareMetric === '4room'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              4-Room Median
            </button>
            <button
              onClick={() => setCompareMetric('5room')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                compareMetric === '5room'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              5-Room Median
            </button>
          </div>
        </div>

        {/* Visual Bars */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-2">
          {activeAnalytics.map((item) => {
            const val = getTownMetricValue(item);
            const heightPercent = Math.max(Math.round((val / maxVal) * 100), 12);
            return (
              <div
                key={item.town}
                className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col justify-between"
              >
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {item.town}
                </div>
                <div className="my-3">
                  <div className="h-20 flex items-end">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full bg-gradient-to-t from-red-600 to-rose-400 rounded-t-sm transition-all duration-300"
                    />
                  </div>
                </div>
                <div>
                  <div className="text-sm font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                    {compareMetric === 'psf' ? formatPsf(val) : formatCurrency(val, true)}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {item.volume} transactions
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Side-by-Side Comparison Matrix Table */}
      <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="py-3 px-4 font-semibold">Metrics</th>
              {activeAnalytics.map((t) => (
                <th key={t.town} className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                  {t.town}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono tabular-nums">
            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
              <td className="py-2.5 px-4 font-sans font-medium text-slate-600 dark:text-slate-400">
                Median Resale Price
              </td>
              {activeAnalytics.map((t) => (
                <td key={t.town} className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">
                  {formatCurrency(t.medianPrice)}
                </td>
              ))}
            </tr>
            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
              <td className="py-2.5 px-4 font-sans font-medium text-slate-600 dark:text-slate-400">
                Average Resale Price
              </td>
              {activeAnalytics.map((t) => (
                <td key={t.town} className="py-2.5 px-4 text-slate-700 dark:text-slate-300">
                  {formatCurrency(t.avgPrice)}
                </td>
              ))}
            </tr>
            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
              <td className="py-2.5 px-4 font-sans font-medium text-slate-600 dark:text-slate-400">
                Average PSF (S$/sqft)
              </td>
              {activeAnalytics.map((t) => (
                <td key={t.town} className="py-2.5 px-4 text-red-600 dark:text-red-400 font-semibold">
                  {formatPsf(t.avgPsf)}
                </td>
              ))}
            </tr>
            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
              <td className="py-2.5 px-4 font-sans font-medium text-slate-600 dark:text-slate-400">
                4-Room Median Price
              </td>
              {activeAnalytics.map((t) => (
                <td key={t.town} className="py-2.5 px-4 text-slate-800 dark:text-slate-200">
                  {t.flatTypeBreakdown['4 ROOM']
                    ? formatCurrency(t.flatTypeBreakdown['4 ROOM'].medianPrice)
                    : 'N/A'}
                </td>
              ))}
            </tr>
            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
              <td className="py-2.5 px-4 font-sans font-medium text-slate-600 dark:text-slate-400">
                5-Room Median Price
              </td>
              {activeAnalytics.map((t) => (
                <td key={t.town} className="py-2.5 px-4 text-slate-800 dark:text-slate-200">
                  {t.flatTypeBreakdown['5 ROOM']
                    ? formatCurrency(t.flatTypeBreakdown['5 ROOM'].medianPrice)
                    : 'N/A'}
                </td>
              ))}
            </tr>
            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
              <td className="py-2.5 px-4 font-sans font-medium text-slate-600 dark:text-slate-400">
                Avg Remaining Lease
              </td>
              {activeAnalytics.map((t) => (
                <td key={t.town} className="py-2.5 px-4 text-slate-700 dark:text-slate-300">
                  {t.avgRemainingLease} years
                </td>
              ))}
            </tr>
            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
              <td className="py-2.5 px-4 font-sans font-medium text-slate-600 dark:text-slate-400">
                Transaction Volume
              </td>
              {activeAnalytics.map((t) => (
                <td key={t.town} className="py-2.5 px-4 text-slate-600 dark:text-slate-400">
                  {t.volume} units
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
