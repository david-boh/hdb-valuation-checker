import React from 'react';
import { SingaporeRegion, TownAnalytics } from '../types/hdb';
import { SINGAPORE_TOWNS, REGIONS_LIST } from '../data/singaporeTowns';
import { formatCurrency, formatPsf } from '../utils/formatters';
import { MapPin, Check } from 'lucide-react';

interface RegionalMapProps {
  townAnalytics: Record<string, TownAnalytics>;
  selectedTowns: string[];
  onToggleTown: (town: string) => void;
  onSelectOnlyTown: (town: string) => void;
}

export const RegionalMap: React.FC<RegionalMapProps> = ({
  townAnalytics,
  selectedTowns,
  onToggleTown,
  onSelectOnlyTown,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-red-600" />
            Singapore Regional Towns Explorer
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Click any town card to toggle its filter, or double-click to view exclusively
          </p>
        </div>

        {selectedTowns.length > 0 && (
          <span className="text-xs text-red-600 dark:text-red-400 font-medium">
            {selectedTowns.length} towns active in filter
          </span>
        )}
      </div>

      {/* Regional columns / clusters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {REGIONS_LIST.map((region) => {
          const regionTowns = SINGAPORE_TOWNS.filter((t) => t.region === region);
          return (
            <div
              key={region}
              className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 flex flex-col space-y-2.5"
            >
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 pb-1 border-b border-slate-200 dark:border-slate-700">
                <span>{region}</span>
                <span className="text-[10px] text-slate-600 dark:text-slate-300 font-mono">
                  {regionTowns.length} Towns
                </span>
              </div>

              <div className="space-y-1.5 flex-1">
                {regionTowns.map((town) => {
                  const stats = townAnalytics[town.name];
                  const isSelected = selectedTowns.includes(town.name);
                  return (
                    <div
                      key={town.name}
                      onClick={() => onToggleTown(town.name)}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onSelectOnlyTown(town.name);
                      }}
                      className={`p-2 rounded-md border text-xs cursor-pointer transition-all select-none ${
                        isSelected
                          ? 'bg-red-50 dark:bg-red-950/40 border-red-500 text-slate-900 dark:text-white shadow-xs'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold">
                        <span className="truncate">{town.displayName}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-red-600 shrink-0 ml-1" />}
                      </div>

                      {stats ? (
                        <div className="mt-1 flex items-center justify-between text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400">
                          <span className="font-bold text-slate-900 dark:text-slate-100">
                            {formatCurrency(stats.medianPrice, true)}
                          </span>
                          <span>{formatPsf(stats.avgPsf)}</span>
                        </div>
                      ) : (
                        <div className="text-[10px] text-slate-400 mt-1 italic">No active data</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
