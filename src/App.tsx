/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { HdbFilterState, HdbRecord, FlatType } from './types/hdb';
import { fetchHdbTransactions } from './services/hdbService';
import {
  filterTransactions,
  computeSummaryKPIs,
  computeMonthlyTrend,
  computeTownAnalytics,
  computeFlatTypeDistribution,
} from './utils/analytics';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { SummaryMetrics } from './components/SummaryMetrics';
import { PriceTrendChart } from './components/PriceTrendChart';
import { TownComparison } from './components/TownComparison';
import { DistributionChart } from './components/DistributionChart';
import { RegionalMap } from './components/RegionalMap';
import { TransactionTable } from './components/TransactionTable';
import { TransactionDetailModal } from './components/TransactionDetailModal';
import { ApiSettingsModal } from './components/ApiSettingsModal';
import { ValuationCalculator } from './components/ValuationCalculator';
import { Building2, RefreshCw, AlertCircle, FileSpreadsheet, MapPin, TrendingUp, Table } from 'lucide-react';

const INITIAL_FILTERS: HdbFilterState = {
  towns: [], // Empty means all towns
  flatTypes: [], // Empty means all flat types
  floorAreaMin: 30,
  floorAreaMax: 180,
  priceMin: 200000,
  priceMax: 1600000,
  dateRangeStart: '2023-01',
  dateRangeEnd: '2026-12',
  storeyTier: 'all',
  searchQuery: '',
  unitSystem: 'sqm',
};

export default function App() {
  const [filters, setFilters] = useState<HdbFilterState>(INITIAL_FILTERS);
  const [activeTab, setActiveTab] = useState<'overview' | 'comparison' | 'trends' | 'valuation' | 'table'>('overview');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [unitSystem, setUnitSystem] = useState<'sqm' | 'sqft'>('sqm');

  // Upstream retrieved records (filtered at service level by town & flatType only)
  const [retrievedRecords, setRetrievedRecords] = useState<HdbRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [selectedRecord, setSelectedRecord] = useState<HdbRecord | null>(null);
  const [isApiSettingsOpen, setIsApiSettingsOpen] = useState<boolean>(false);

  // Sync dark mode class with root html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Fetch upstream transactions whenever town or flatType API filters change
  const loadTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // The API contract supports filtering by town and flatType only
      const data = await fetchHdbTransactions({
        town: filters.towns.length > 0 ? filters.towns : undefined,
        flatType: filters.flatTypes.length > 0 ? filters.flatTypes : undefined,
      });
      setRetrievedRecords(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch HDB transactions.');
    } finally {
      setIsLoading(false);
    }
  }, [filters.towns, filters.flatTypes]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  // In-memory client-side filtering: applies floor area, price range, date range, storey, and search
  const filteredRecords = useMemo(() => {
    return filterTransactions(retrievedRecords, {
      ...filters,
      unitSystem,
    });
  }, [retrievedRecords, filters, unitSystem]);

  // Analytics computation
  const summaryKpis = useMemo(() => computeSummaryKPIs(filteredRecords), [filteredRecords]);
  const monthlyTrends = useMemo(() => computeMonthlyTrend(filteredRecords), [filteredRecords]);
  const townAnalytics = useMemo(() => computeTownAnalytics(filteredRecords), [filteredRecords]);
  const flatTypeStats = useMemo(() => computeFlatTypeDistribution(filteredRecords), [filteredRecords]);

  // Reset filters
  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  // Toggle single town from Regional Map
  const handleToggleTown = (town: string) => {
    setFilters((prev) => {
      const exists = prev.towns.includes(town);
      return {
        ...prev,
        towns: exists ? prev.towns.filter((t) => t !== town) : [...prev.towns, town],
      };
    });
  };

  // Select only one town exclusively
  const handleSelectOnlyTown = (town: string) => {
    setFilters((prev) => ({
      ...prev,
      towns: [town],
    }));
  };

  // Export filtered transactions to CSV
  const handleExportCsv = () => {
    if (filteredRecords.length === 0) return;

    const headers = [
      'Transaction Month',
      'Town',
      'Flat Type',
      'Block',
      'Street Name',
      'Flat Model',
      'Storey Range',
      'Floor Area (sqm)',
      'Floor Area (sqft)',
      'Lease Commence Date',
      'Remaining Lease',
      'Resale Price (SGD)',
      'Price Per Sqft (SGD)',
      'Price Per Sqm (SGD)',
    ];

    const rows = filteredRecords.map((r) => [
      r.month,
      `"${r.town}"`,
      `"${r.flat_type}"`,
      `"${r.block}"`,
      `"${r.street_name}"`,
      `"${r.flat_model}"`,
      `"${r.storey_range}"`,
      r.floor_area_sqm,
      r.floor_area_sqft,
      r.lease_commence_date,
      `"${r.remaining_lease}"`,
      r.resale_price,
      r.price_per_sqft,
      r.price_per_sqm,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `hdb_resale_transactions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Bar Contract Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        unitSystem={unitSystem}
        setUnitSystem={setUnitSystem}
        onOpenApiSettings={() => setIsApiSettingsOpen(true)}
        onExportCsv={handleExportCsv}
        totalFilteredCount={filteredRecords.length}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Universal Filter Control Bar */}
        <FilterBar
          filters={filters}
          setFilters={setFilters}
          onReset={handleResetFilters}
          totalAvailableRecords={retrievedRecords.length}
          totalFilteredRecords={filteredRecords.length}
        />

        {/* Loading State Overlay / Skeleton */}
        {isLoading && (
          <div className="p-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-6 h-6 text-red-600 animate-spin" />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Querying HDB transactions...
            </span>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-center gap-3 text-red-700 dark:text-red-300">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div className="text-xs">
              <strong>Data Fetch Error:</strong> {error}
            </div>
          </div>
        )}

        {!isLoading && !error && (
          <>
            {/* TAB 1: OVERVIEW & KEY METRICS */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* 1. Summary KPIs Strip */}
                <SummaryMetrics kpis={summaryKpis} unitSystem={unitSystem} />

                {/* 2. Historical Price & Volume Trend */}
                <PriceTrendChart trendData={monthlyTrends} />

                {/* 3. Singapore Regional Town Explorer */}
                <RegionalMap
                  townAnalytics={townAnalytics}
                  selectedTowns={filters.towns}
                  onToggleTown={handleToggleTown}
                  onSelectOnlyTown={handleSelectOnlyTown}
                />

                {/* 4. Flat Type Volume & Size Matrix */}
                <DistributionChart
                  records={filteredRecords}
                  flatTypeStats={flatTypeStats}
                  unitSystem={unitSystem}
                />

                {/* 5. Recent Transactions Quick Table */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Table className="w-4 h-4 text-red-600" />
                        Transactions Preview
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Interactive transaction ledger matching active filters
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('table')}
                      className="text-xs text-red-600 dark:text-red-400 font-semibold hover:underline cursor-pointer"
                    >
                      View all {filteredRecords.length} in full table →
                    </button>
                  </div>

                  <TransactionTable
                    records={filteredRecords}
                    unitSystem={unitSystem}
                    onSelectRecord={(rec) => setSelectedRecord(rec)}
                  />
                </div>
              </div>
            )}

            {/* TAB 2: CROSS-TOWN COMPARISON */}
            {activeTab === 'comparison' && (
              <div className="space-y-6">
                <SummaryMetrics kpis={summaryKpis} unitSystem={unitSystem} />
                <TownComparison townAnalytics={townAnalytics} />
              </div>
            )}

            {/* TAB 3: PRICE & PSF TRENDS */}
            {activeTab === 'trends' && (
              <div className="space-y-6">
                <SummaryMetrics kpis={summaryKpis} unitSystem={unitSystem} />
                <PriceTrendChart trendData={monthlyTrends} />
                <DistributionChart
                  records={filteredRecords}
                  flatTypeStats={flatTypeStats}
                  unitSystem={unitSystem}
                />
              </div>
            )}

            {/* TAB 4: VALUATION ASSESSMENT & COV ESTIMATOR */}
            {activeTab === 'valuation' && (
              <div className="space-y-6">
                <ValuationCalculator
                  allTransactions={retrievedRecords}
                  unitSystem={unitSystem}
                  onSelectRecord={(rec) => setSelectedRecord(rec)}
                />
              </div>
            )}

            {/* TAB 5: COMPLETE TRANSACTION TABLE */}
            {activeTab === 'table' && (
              <div className="space-y-6">
                <SummaryMetrics kpis={summaryKpis} unitSystem={unitSystem} />
                <TransactionTable
                  records={filteredRecords}
                  unitSystem={unitSystem}
                  onSelectRecord={(rec) => setSelectedRecord(rec)}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Property Detail & Mortgage Calculator Modal */}
      <TransactionDetailModal
        record={selectedRecord}
        townAnalytics={selectedRecord ? townAnalytics[selectedRecord.town] : undefined}
        unitSystem={unitSystem}
        allTransactions={retrievedRecords}
        onClose={() => setSelectedRecord(null)}
      />

      {/* API Configuration Modal */}
      <ApiSettingsModal
        isOpen={isApiSettingsOpen}
        onClose={() => setIsApiSettingsOpen(false)}
        onReloadData={loadTransactions}
      />
    </div>
  );
}
