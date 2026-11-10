import React, { useState } from 'react';
import { FlatType, HdbRecord } from '../types/hdb';
import { formatCurrency, formatPsf, formatArea } from '../utils/formatters';
import { PieChart, ScatterChart, Layers } from 'lucide-react';

interface DistributionChartProps {
  records: HdbRecord[];
  flatTypeStats: Array<{
    flatType: FlatType;
    count: number;
    percentage: number;
    avgPrice: number;
    medianPrice: number;
    avgPsf: number;
  }>;
  unitSystem: 'sqm' | 'sqft';
}

const FLAT_TYPE_COLORS: Record<FlatType, string> = {
  '1 ROOM': '#94a3b8',
  '2 ROOM': '#10b981',
  '3 ROOM': '#0284c7',
  '4 ROOM': '#6366f1',
  '5 ROOM': '#f59e0b',
  EXECUTIVE: '#f43f5e',
  'MULTI-GENERATION': '#8b5cf6',
};

export const DistributionChart: React.FC<DistributionChartProps> = ({
  records,
  flatTypeStats,
  unitSystem,
}) => {
  const [hoveredRecord, setHoveredRecord] = useState<HdbRecord | null>(null);

  // Subsample records for the scatter plot if too large to ensure silky smooth performance
  const displayRecords = records.length > 350 ? records.filter((_, i) => i % Math.ceil(records.length / 350) === 0) : records;

  // Scatter bounds
  const areas = records.map((r) => r.floor_area_sqm);
  const prices = records.map((r) => r.resale_price);

  const minArea = Math.min(...(areas.length ? areas : [40]));
  const maxArea = Math.max(...(areas.length ? areas : [160]));
  const minPrice = Math.min(...(prices.length ? prices : [250000]));
  const maxPrice = Math.max(...(prices.length ? prices : [1400000]));

  const svgWidth = 720;
  const svgHeight = 260;
  const padding = { top: 20, right: 25, bottom: 40, left: 70 };
  const plotWidth = svgWidth - padding.left - padding.right;
  const plotHeight = svgHeight - padding.top - padding.bottom;

  const getX = (area: number) =>
    padding.left + ((area - minArea) / (maxArea - minArea || 1)) * plotWidth;
  const getY = (price: number) =>
    padding.top + plotHeight - ((price - minPrice) / (maxPrice - minPrice || 1)) * plotHeight;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Column: Flat Type Volume Breakdown */}
      <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <PieChart className="w-4 h-4 text-red-600" />
            Flat Type Volume & Pricing
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Breakdown across HDB room configurations in current selection
          </p>
        </div>

        <div className="space-y-3">
          {flatTypeStats.map((ft) => {
            const color = FLAT_TYPE_COLORS[ft.flatType] || '#64748b';
            return (
              <div key={ft.flatType} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {ft.flatType}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono tabular-nums">
                      ({ft.count} units · {ft.percentage}%)
                    </span>
                  </div>
                  <div className="font-mono tabular-nums text-right">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {formatCurrency(ft.medianPrice, true)}
                    </span>
                    <span className="text-slate-600 dark:text-slate-300 text-[11px] ml-1.5">
                      {formatPsf(ft.avgPsf)}
                    </span>
                  </div>
                </div>

                {/* Bar progress */}
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    style={{
                      width: `${Math.max(ft.percentage, 3)}%`,
                      backgroundColor: color,
                    }}
                    className="h-full rounded-full transition-all duration-300"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: Floor Area vs Resale Price Scatter Distribution */}
      <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-red-600" />
              Floor Area vs Resale Price Matrix
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Scatter distribution mapping unit size against transaction price
            </p>
          </div>

          {/* Hover indicator */}
          <div className="text-xs font-mono text-slate-600 dark:text-slate-300 h-5">
            {hoveredRecord ? (
              <span>
                {hoveredRecord.block} {hoveredRecord.street_name} ·{' '}
                <strong className="text-red-600 dark:text-red-400">
                  {formatCurrency(hoveredRecord.resale_price)}
                </strong>{' '}
                ({formatPsf(hoveredRecord.price_per_sqft)})
              </span>
            ) : (
              <span className="text-slate-400 text-[11px] italic">Hover point to inspect unit</span>
            )}
          </div>
        </div>

        {/* Scatter SVG */}
        <div className="relative w-full overflow-hidden select-none">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto overflow-visible"
            onMouseLeave={() => setHoveredRecord(null)}
          >
            {/* Grid lines */}
            {[minPrice, (minPrice + maxPrice) / 2, maxPrice].map((p, i) => {
              const y = getY(p);
              return (
                <g key={`y-${i}`}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={svgWidth - padding.right}
                    y2={y}
                    stroke="currentColor"
                    className="text-slate-100 dark:text-slate-800"
                    strokeDasharray="3 3"
                  />
                  <text
                    x={padding.left - 8}
                    y={y + 3}
                    textAnchor="end"
                    className="text-[10px] fill-slate-400 font-mono"
                  >
                    {formatCurrency(p, true)}
                  </text>
                </g>
              );
            })}

            {/* Scatter points */}
            {displayRecords.map((r) => {
              const cx = getX(r.floor_area_sqm);
              const cy = getY(r.resale_price);
              const color = FLAT_TYPE_COLORS[r.flat_type] || '#64748b';
              const isHovered = hoveredRecord?.id === r.id;

              return (
                <circle
                  key={r.id}
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 6 : 3.5}
                  fill={color}
                  opacity={isHovered ? 1 : 0.72}
                  stroke={isHovered ? '#ffffff' : 'transparent'}
                  strokeWidth={isHovered ? 2 : 0}
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => setHoveredRecord(r)}
                />
              );
            })}

            {/* X-axis labels */}
            {[minArea, Math.round((minArea + maxArea) / 2), maxArea].map((a, i) => {
              const x = getX(a);
              return (
                <text
                  key={`x-${i}`}
                  x={x}
                  y={svgHeight - 14}
                  textAnchor="middle"
                  className="text-[10px] fill-slate-400 font-mono"
                >
                  {formatArea(a, unitSystem)}
                </text>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
          {Object.entries(FLAT_TYPE_COLORS).slice(1, 6).map(([ft, c]) => (
            <span key={ft} className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c }} />
              <span>{ft}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
