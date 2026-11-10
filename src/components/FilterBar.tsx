import React, { useState } from 'react';
import { FlatType, HdbFilterState, SingaporeRegion } from '../types/hdb';
import { SINGAPORE_TOWNS, FLAT_TYPES_LIST, REGIONS_LIST } from '../data/singaporeTowns';
import { formatCurrency, formatArea } from '../utils/formatters';
import { Search, RotateCcw, ChevronDown, ChevronUp, Filter, Sparkles, Layers } from 'lucide-react';

interface FilterBarProps {
  filters: HdbFilterState;
  setFilters: React.Dispatch<React.SetStateAction<HdbFilterState>>;
  onReset: () => void;
  totalAvailableRecords: number;
  totalFilteredRecords: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  setFilters,
  onReset,
  totalAvailableRecords,
  totalFilteredRecords,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<SingaporeRegion | 'All'>('All');

  // Toggle town selection
  const handleToggleTown = (townName: string) => {
    setFilters((prev) => {
      const exists = prev.towns.includes(townName);
      const newTowns = exists ? prev.towns.filter((t) => t !== townName) : [...prev.towns, townName];
      return { ...prev, towns: newTowns };
    });
  };

  // Select all towns in a region
  const handleSelectRegionTowns = (region: SingaporeRegion) => {
    const regionTowns = SINGAPORE_TOWNS.filter((t) => t.region === region).map((t) => t.name);
    setFilters((prev) => {
      const current = new Set(prev.towns);
      const allSelected = regionTowns.every((t) => current.has(t));
      if (allSelected) {
        // Deselect
        return { ...prev, towns: prev.towns.filter((t) => !regionTowns.includes(t)) };
      } else {
        // Add all
        return { ...prev, towns: Array.from(new Set([...prev.towns, ...regionTowns])) };
      }
    });
  };

  // Toggle flat type
  const handleToggleFlatType = (flatType: FlatType) => {
    setFilters((prev) => {
      const exists = prev.flatTypes.includes(flatType);
      const newTypes = exists ? prev.flatTypes.filter((f) => f !== flatType) : [...prev.flatTypes, flatType];
      return { ...prev, flatTypes: newTypes };
    });
  };

  // Filter towns list by chosen region tab in selector
  const displayTowns =
    selectedRegion === 'All'
      ? SINGAPORE_TOWNS
      : SINGAPORE_TOWNS.filter((t) => t.region === selectedRegion);

  // Quick presets
  const applyPreset = (preset: 'million' | 'high_floor' | 'young_mop' | 'budget') => {
    if (preset === 'million') {
      setFilters((prev) => ({
        ...prev,
        priceMin: 1000000,
        priceMax: 1800000,
      }));
    } else if (preset === 'high_floor') {
      setFilters((prev) => ({
        ...prev,
        storeyTier: 'high',
      }));
    } else if (preset === 'young_mop') {
      setFilters((prev) => ({
        ...prev,
        towns: ['PUNGGOL', 'SENGKANG', 'SEMBAWANG', 'QUEENSTOWN'],
      }));
    } else if (preset === 'budget') {
      setFilters((prev) => ({
        ...prev,
        priceMin: 200000,
        priceMax: 550000,
      }));
    }
  };

  const hasActiveFilters =
    filters.towns.length > 0 ||
    filters.flatTypes.length > 0 ||
    filters.floorAreaMin > 30 ||
    filters.floorAreaMax < 180 ||
    filters.priceMin > 200000 ||
    filters.priceMax < 1600000 ||
    filters.storeyTier !== 'all' ||
    filters.searchQuery !== '';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs p-4 space-y-4">
      {/* Top Filter Row: Search & Quick Presets & Collapse Toggle */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-lg">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
            placeholder="Search street, block, town (e.g. Cantonment, Tampines, Blk 123)..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
          />
          {filters.searchQuery && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="text-slate-500 text-[11px] font-medium shrink-0 mr-1 hidden sm:inline">
            Quick Filters:
          </span>
          <button
            onClick={() => applyPreset('million')}
            className="px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 hover:bg-amber-100 dark:hover:bg-amber-900/40 whitespace-nowrap cursor-pointer flex items-center gap-1 font-medium"
          >
            <Sparkles className="w-3 h-3" />
            S$1M+ Only
          </button>
          <button
            onClick={() => applyPreset('budget')}
            className="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 whitespace-nowrap cursor-pointer font-medium"
          >
            &lt; S$550K Budget
          </button>
          <button
            onClick={() => applyPreset('young_mop')}
            className="px-2.5 py-1 rounded-md bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800/60 hover:bg-sky-100 dark:hover:bg-sky-900/40 whitespace-nowrap cursor-pointer font-medium"
          >
            Young Towns
          </button>

          {/* Reset button */}
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900/50 whitespace-nowrap cursor-pointer font-medium ml-1"
              title="Reset all filters"
            >
              <RotateCcw className="w-3 h-3" />
              Reset All
            </button>
          )}

          {/* Expand / Collapse advanced filters */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 whitespace-nowrap cursor-pointer font-medium"
          >
            <Filter className="w-3 h-3" />
            <span>{isExpanded ? 'Less Filters' : 'More Filters'}</span>
            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Primary Filter Strip: Flat Type Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Flat Type</span>
            <span className="text-[11px] text-slate-600 dark:text-slate-300">
              (API Filter: {filters.flatTypes.length === 0 ? 'All Types' : `${filters.flatTypes.length} selected`})
            </span>
          </div>
          {filters.flatTypes.length > 0 && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, flatTypes: [] }))}
              className="text-xs text-red-600 dark:text-red-400 hover:underline cursor-pointer"
            >
              Clear Type Filter
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {FLAT_TYPES_LIST.map((ft) => {
            const isSelected = filters.flatTypes.includes(ft as FlatType);
            return (
              <button
                key={ft}
                onClick={() => handleToggleFlatType(ft as FlatType)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500'
                }`}
              >
                {ft}
              </button>
            );
          })}
        </div>
      </div>

      {/* Town Multi-Selection Section */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Town Filter</span>
            <span className="text-[11px] text-slate-600 dark:text-slate-300">
              (API Filter: {filters.towns.length === 0 ? 'All 26 Towns' : `${filters.towns.length} selected`})
            </span>
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800/80 rounded-md">
            <button
              onClick={() => setSelectedRegion('All')}
              className={`px-2 py-0.5 text-[11px] font-medium rounded-xs transition-colors cursor-pointer ${
                selectedRegion === 'All'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              All Regions
            </button>
            {REGIONS_LIST.map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-2 py-0.5 text-[11px] font-medium rounded-xs transition-colors cursor-pointer ${
                  selectedRegion === reg
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>
        </div>

        {/* Town Chips Grid */}
        <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
          {displayTowns.map((t) => {
            const isSelected = filters.towns.includes(t.name);
            return (
              <button
                key={t.name}
                onClick={() => handleToggleTown(t.name)}
                className={`px-2.5 py-1 text-xs rounded-md border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-red-600 text-white border-red-600 font-medium shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/80 hover:border-slate-400 dark:hover:border-slate-500'
                }`}
              >
                {t.displayName}
              </button>
            );
          })}
        </div>

        {filters.towns.length > 0 && (
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
            <span>
              Active Towns: <strong className="text-slate-700 dark:text-slate-200">{filters.towns.join(', ')}</strong>
            </span>
            <button
              onClick={() => setFilters((prev) => ({ ...prev, towns: [] }))}
              className="text-red-600 dark:text-red-400 hover:underline cursor-pointer"
            >
              Clear Towns
            </button>
          </div>
        )}
      </div>

      {/* Expanded Advanced Filters: Price, Floor Area, Storey, Date */}
      {isExpanded && (
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Price Range Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Price Range</span>
              <span className="font-mono text-slate-600 dark:text-slate-400 tabular-nums">
                {formatCurrency(filters.priceMin, true)} - {formatCurrency(filters.priceMax, true)}
              </span>
            </div>
            <div className="space-y-1">
              <input
                type="range"
                min="200000"
                max="1600000"
                step="25000"
                value={filters.priceMax}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    priceMax: Math.max(parseInt(e.target.value, 10), prev.priceMin + 50000),
                  }))
                }
                className="w-full accent-red-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-600 dark:text-slate-300 font-mono">
                <span>$200K</span>
                <span>$800K</span>
                <span>$1.6M+</span>
              </div>
            </div>
          </div>

          {/* Floor Area Range Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Floor Area</span>
              <span className="font-mono text-slate-600 dark:text-slate-400 tabular-nums">
                {formatArea(filters.floorAreaMin, filters.unitSystem)} - {formatArea(filters.floorAreaMax, filters.unitSystem)}
              </span>
            </div>
            <div className="space-y-1">
              <input
                type="range"
                min="30"
                max="180"
                step="5"
                value={filters.floorAreaMax}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    floorAreaMax: Math.max(parseInt(e.target.value, 10), prev.floorAreaMin + 10),
                  }))
                }
                className="w-full accent-red-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-600 dark:text-slate-300 font-mono">
                <span>30 sqm (320 sqft)</span>
                <span>180 sqm (1,938 sqft)</span>
              </div>
            </div>
          </div>

          {/* Storey Tier */}
          <div className="space-y-1.5">
            <span className="block font-semibold text-xs text-slate-700 dark:text-slate-300">
              Storey Level
            </span>
            <select
              value={filters.storeyTier}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  storeyTier: e.target.value as HdbFilterState['storeyTier'],
                }))
              }
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-hidden"
            >
              <option value="all">All Storeys (1 - 42+)</option>
              <option value="low">Low Floor (Storey 01 - 06)</option>
              <option value="mid">Mid Floor (Storey 07 - 15)</option>
              <option value="high">High Floor (Storey 16 - 27)</option>
              <option value="very_high">Sky Suite / Very High (Storey 28+)</option>
            </select>
          </div>

          {/* Date Range Start */}
          <div className="space-y-1.5">
            <span className="block font-semibold text-xs text-slate-700 dark:text-slate-300">
              Transaction Period
            </span>
            <div className="flex items-center gap-1.5">
              <select
                value={filters.dateRangeStart}
                onChange={(e) => setFilters((prev) => ({ ...prev, dateRangeStart: e.target.value }))}
                className="w-1/2 px-2 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-hidden"
              >
                <option value="2023-01">From Jan 2023</option>
                <option value="2024-01">From Jan 2024</option>
                <option value="2024-06">From Jun 2024</option>
                <option value="2025-01">From Jan 2025</option>
                <option value="2025-06">From Jun 2025</option>
              </select>
              <span className="text-slate-400 text-xs">to</span>
              <select
                value={filters.dateRangeEnd}
                onChange={(e) => setFilters((prev) => ({ ...prev, dateRangeEnd: e.target.value }))}
                className="w-1/2 px-2 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-hidden"
              >
                <option value="2026-12">Latest (Nov 2026)</option>
                <option value="2026-06">Mid 2026</option>
                <option value="2025-12">End 2025</option>
                <option value="2025-06">Mid 2025</option>
                <option value="2024-12">End 2024</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Status / Architecture Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-slate-400" />
          <span>
            Showing <strong className="text-slate-800 dark:text-slate-200 font-mono tabular-nums">{totalFilteredRecords.toLocaleString('en-SG')}</strong> of <span className="font-mono tabular-nums">{totalAvailableRecords.toLocaleString('en-SG')}</span> retrieved transactions
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-slate-600 dark:text-slate-300">
          <span>API Filter: Town & Flat Type</span>
          <span>·</span>
          <span>In-Memory Analytics: Price, Area, Date & PSF</span>
        </div>
      </div>
    </div>
  );
};
