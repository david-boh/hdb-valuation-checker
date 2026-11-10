import React from 'react';
import { Building2, Sun, Moon, SlidersHorizontal, Download, Globe } from 'lucide-react';

interface HeaderProps {
  activeTab: 'overview' | 'comparison' | 'trends' | 'valuation' | 'table';
  setActiveTab: (tab: 'overview' | 'comparison' | 'trends' | 'valuation' | 'table') => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  unitSystem: 'sqm' | 'sqft';
  setUnitSystem: (unit: 'sqm' | 'sqft') => void;
  onOpenApiSettings: () => void;
  onExportCsv: () => void;
  totalFilteredCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isDarkMode,
  setIsDarkMode,
  unitSystem,
  setUnitSystem,
  onOpenApiSettings,
  onExportCsv,
  totalFilteredCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold shadow-xs">
            <Building2 className="w-4 h-4" />
          </div>
          <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
            HDB Resale Pulse
          </span>
          <span className="text-xs text-slate-600 dark:text-slate-300 hidden sm:inline">
            Singapore Housing Analytics
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs lg:text-sm font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'overview'
                ? 'text-red-600 dark:text-red-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Overview & Metrics
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'comparison'
                ? 'text-red-600 dark:text-red-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Town Comparison
          </button>
          <button
            onClick={() => setActiveTab('trends')}
            className={`transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'trends'
                ? 'text-red-600 dark:text-red-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Price Trends
          </button>
          <button
            onClick={() => setActiveTab('valuation')}
            className={`transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'valuation'
                ? 'text-red-600 dark:text-red-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Valuation Assessment
          </button>
          <button
            onClick={() => setActiveTab('table')}
            className={`transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'table'
                ? 'text-red-600 dark:text-red-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Transactions ({totalFilteredCount.toLocaleString('en-SG')})
          </button>
        </nav>

        {/* Zone 3: Primary Actions & Utilities */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Unit Toggle */}
          <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-800 text-xs">
            <button
              onClick={() => setUnitSystem('sqm')}
              className={`px-2 py-1 font-medium rounded-xs transition-colors cursor-pointer ${
                unitSystem === 'sqm'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="Display area in square meters"
            >
              sqm
            </button>
            <button
              onClick={() => setUnitSystem('sqft')}
              className={`px-2 py-1 font-medium rounded-xs transition-colors cursor-pointer ${
                unitSystem === 'sqft'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="Display area in square feet"
            >
              sqft
            </button>
          </div>

          {/* API Setup / Endpoint config modal button */}
          <button
            onClick={onOpenApiSettings}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-md transition-colors cursor-pointer"
            title="Configure HDB API Endpoint"
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">API Sync</span>
          </button>

          {/* Export CSV */}
          <button
            onClick={onExportCsv}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-md transition-colors cursor-pointer"
            title="Export filtered records to CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            aria-label="Toggle dark mode"
            className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </div>

      {/* Mobile Tab Strip */}
      <div className="flex md:hidden border-t border-slate-200 dark:border-slate-800 px-4 py-2 gap-2 overflow-x-auto text-xs bg-slate-50 dark:bg-slate-900/50">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-red-600 text-white font-medium'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('comparison')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap cursor-pointer ${
            activeTab === 'comparison'
              ? 'bg-red-600 text-white font-medium'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          Town Comparison
        </button>
        <button
          onClick={() => setActiveTab('trends')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap cursor-pointer ${
            activeTab === 'trends'
              ? 'bg-red-600 text-white font-medium'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          Price Trends
        </button>
        <button
          onClick={() => setActiveTab('valuation')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap cursor-pointer ${
            activeTab === 'valuation'
              ? 'bg-red-600 text-white font-medium'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          Valuation
        </button>
        <button
          onClick={() => setActiveTab('table')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap cursor-pointer ${
            activeTab === 'table'
              ? 'bg-red-600 text-white font-medium'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          Transactions
        </button>
      </div>
    </header>
  );
};
