import React, { useState } from 'react';
import { MonthlyTrendPoint } from '../types/hdb';
import { formatCurrency, formatPsf } from '../utils/formatters';
import { Calendar, BarChart2 } from 'lucide-react';

interface PriceTrendChartProps {
  trendData: MonthlyTrendPoint[];
}

export const PriceTrendChart: React.FC<PriceTrendChartProps> = ({ trendData }) => {
  const [metric, setMetric] = useState<'median' | 'average' | 'psf'>('median');
  const [hoveredPoint, setHoveredPoint] = useState<MonthlyTrendPoint | null>(null);
  const [hoverX, setHoverX] = useState<number | null>(null);

  if (!trendData || trendData.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center text-slate-500">
        No transaction history available for the selected filters.
      </div>
    );
  }

  // Values based on selected metric
  const getMetricValue = (p: MonthlyTrendPoint) => {
    if (metric === 'median') return p.medianPrice;
    if (metric === 'average') return p.avgPrice;
    return p.avgPsf;
  };

  const values = trendData.map(getMetricValue);
  const volumes = trendData.map((p) => p.volume);

  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const valuePadding = (maxValue - minValue) * 0.15 || 50000;
  const yMin = Math.max(0, minValue - valuePadding);
  const yMax = maxValue + valuePadding;

  const maxVolume = Math.max(...volumes, 1);

  // SVG dimensions
  const svgWidth = 800;
  const svgHeight = 280;
  const padding = { top: 20, right: 30, bottom: 45, left: 65 };
  const chartWidth = svgWidth - padding.left - padding.right;
  const chartHeight = svgHeight - padding.top - padding.bottom;

  // Coordinate mappers
  const getX = (index: number) => padding.left + (index / (trendData.length - 1 || 1)) * chartWidth;
  const getY = (val: number) => padding.top + chartHeight - ((val - yMin) / (yMax - yMin || 1)) * chartHeight;

  // Build path
  const points = trendData.map((d, i) => `${getX(i)},${getY(getMetricValue(d))}`).join(' ');
  const areaPoints = `${getX(0)},${padding.top + chartHeight} ${points} ${getX(trendData.length - 1)},${padding.top + chartHeight}`;

  // Y-axis ticks (4 ticks)
  const yTicks = [
    yMin,
    yMin + (yMax - yMin) * 0.33,
    yMin + (yMax - yMin) * 0.66,
    yMax,
  ];

  // Format tick
  const formatTick = (val: number) => {
    if (metric === 'psf') return `$${Math.round(val)}`;
    return formatCurrency(val, true);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
      {/* Header & Metric Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-red-600" />
            Historical Price & PSF Trend
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Monthly resale movement with transaction volume bars
          </p>
        </div>

        {/* Metric Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs self-start sm:self-auto">
          <button
            onClick={() => setMetric('median')}
            className={`px-3 py-1 font-medium rounded-md transition-colors cursor-pointer ${
              metric === 'median'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Median Price
          </button>
          <button
            onClick={() => setMetric('average')}
            className={`px-3 py-1 font-medium rounded-md transition-colors cursor-pointer ${
              metric === 'average'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Avg Price
          </button>
          <button
            onClick={() => setMetric('psf')}
            className={`px-3 py-1 font-medium rounded-md transition-colors cursor-pointer ${
              metric === 'psf'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Avg PSF
          </button>
        </div>
      </div>

      {/* Hover info pill / callout */}
      <div className="h-7 flex items-center justify-between text-xs font-mono text-slate-600 dark:text-slate-300">
        {hoveredPoint ? (
          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-semibold text-slate-900 dark:text-white">
              {hoveredPoint.displayMonth}
            </span>
            <span>
              Median:{' '}
              <strong className="text-red-600 dark:text-red-400">
                {formatCurrency(hoveredPoint.medianPrice)}
              </strong>
            </span>
            <span>Avg: {formatCurrency(hoveredPoint.avgPrice)}</span>
            <span>PSF: {formatPsf(hoveredPoint.avgPsf)}</span>
            <span className="text-slate-500">Volume: {hoveredPoint.volume} units</span>
          </div>
        ) : (
          <span className="text-slate-400 text-xs italic">
            Hover over the trend chart to inspect month metrics
          </span>
        )}
      </div>

      {/* SVG Chart */}
      <div className="relative w-full overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto overflow-visible"
          onMouseLeave={() => {
            setHoveredPoint(null);
            setHoverX(null);
          }}
        >
          <defs>
            <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#dc2626" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#dc2626" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {yTicks.map((tick, i) => {
            const y = getY(tick);
            return (
              <g key={i}>
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
                  y={y + 4}
                  textAnchor="end"
                  className="text-[10px] fill-slate-400 font-mono"
                >
                  {formatTick(tick)}
                </text>
              </g>
            );
          })}

          {/* Volume bars at bottom */}
          {trendData.map((d, i) => {
            const x = getX(i);
            const barWidth = Math.max(chartWidth / trendData.length - 4, 3);
            const barHeight = (d.volume / maxVolume) * (chartHeight * 0.35);
            const y = padding.top + chartHeight - barHeight;
            return (
              <rect
                key={`vol-${i}`}
                x={x - barWidth / 2}
                y={y}
                width={barWidth}
                height={barHeight}
                className="fill-slate-200 dark:fill-slate-800 hover:fill-slate-300 dark:hover:fill-slate-700 transition-colors"
                rx={1}
              />
            );
          })}

          {/* Area fill */}
          <polygon points={areaPoints} fill="url(#trendGradient)" />

          {/* Main trend line */}
          <polyline
            points={points}
            fill="none"
            stroke="#dc2626"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data dots */}
          {trendData.map((d, i) => {
            const x = getX(i);
            const y = getY(getMetricValue(d));
            const isHovered = hoveredPoint?.month === d.month;
            return (
              <circle
                key={`dot-${i}`}
                cx={x}
                cy={y}
                r={isHovered ? 5.5 : 3}
                className={`transition-all ${
                  isHovered
                    ? 'fill-red-600 stroke-white stroke-2'
                    : 'fill-white dark:fill-slate-900 stroke-red-600 stroke-2'
                }`}
              />
            );
          })}

          {/* X-axis labels (every 2-3 months to prevent clutter) */}
          {trendData.map((d, i) => {
            if (i % Math.ceil(trendData.length / 8) !== 0 && i !== trendData.length - 1) return null;
            const x = getX(i);
            return (
              <text
                key={`lbl-${i}`}
                x={x}
                y={svgHeight - 12}
                textAnchor="middle"
                className="text-[10px] fill-slate-400 font-mono"
              >
                {d.displayMonth}
              </text>
            );
          })}

          {/* Mouse tracking overlay rectangles */}
          {trendData.map((d, i) => {
            const x = getX(i);
            const bandWidth = chartWidth / trendData.length;
            return (
              <rect
                key={`hit-${i}`}
                x={x - bandWidth / 2}
                y={padding.top}
                width={bandWidth}
                height={chartHeight}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => {
                  setHoveredPoint(d);
                  setHoverX(x);
                }}
              />
            );
          })}

          {/* Crosshair vertical line */}
          {hoverX !== null && (
            <line
              x1={hoverX}
              y1={padding.top}
              x2={hoverX}
              y2={padding.top + chartHeight}
              stroke="#dc2626"
              strokeDasharray="2 2"
              strokeWidth="1"
            />
          )}
        </svg>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 dark:border-slate-800/80 pt-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-red-600 inline-block rounded-xs" />
            <span>Price / PSF Line</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-slate-300 dark:bg-slate-700 inline-block rounded-xs" />
            <span>Monthly Volume Bars</span>
          </span>
        </div>
        <span className="font-mono tabular-nums">
          Historical Span: {trendData[0]?.displayMonth} - {trendData[trendData.length - 1]?.displayMonth}
        </span>
      </div>
    </div>
  );
};
