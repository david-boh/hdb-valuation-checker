import React, { useState, useMemo } from 'react';
import { HdbRecord } from '../types/hdb';
import { formatCurrency, formatPsf, formatArea } from '../utils/formatters';
import { ArrowUpDown, ArrowUp, ArrowDown, ExternalLink, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

interface TransactionTableProps {
  records: HdbRecord[];
  unitSystem: 'sqm' | 'sqft';
  onSelectRecord: (record: HdbRecord) => void;
}

type SortField =
  | 'id'
  | 'month'
  | 'town'
  | 'flat_type'
  | 'street_name'
  | 'floor_area_sqm'
  | 'storey_range'
  | 'remaining_lease_years'
  | 'resale_price'
  | 'price_per_sqft';

export const TransactionTable: React.FC<TransactionTableProps> = ({
  records,
  unitSystem,
  onSelectRecord,
}) => {
  const [sortField, setSortField] = useState<SortField>('month');
  const [sortAsc, setSortAsc] = useState<boolean>(false); // default descending (newest first)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);

  // Precompute town benchmark PSF for quick row valuation status
  const townPsfMap = useMemo(() => {
    const map: Record<string, { total: number; count: number }> = {};
    records.forEach((r) => {
      const key = `${r.town}_${r.flat_type}`;
      if (!map[key]) map[key] = { total: 0, count: 0 };
      map[key].total += r.price_per_sqft;
      map[key].count += 1;
    });
    const avgMap: Record<string, number> = {};
    Object.entries(map).forEach(([k, v]) => {
      avgMap[k] = Math.round(v.total / v.count);
    });
    return avgMap;
  }, [records]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      // For price and month, default descending, for string fields ascending
      setSortAsc(field === 'town' || field === 'flat_type' || field === 'street_name');
    }
    setCurrentPage(1);
  };

  const sortedRecords = useMemo(() => {
    const list = [...records];
    list.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'id') {
        const idA = typeof a.raw_id === 'number' ? a.raw_id : parseInt(String(a.raw_id || a.id).replace(/\D/g, ''), 10) || 0;
        const idB = typeof b.raw_id === 'number' ? b.raw_id : parseInt(String(b.raw_id || b.id).replace(/\D/g, ''), 10) || 0;
        comparison = idA - idB;
      } else if (sortField === 'month') {
        comparison = a.month.localeCompare(b.month);
      } else if (sortField === 'town') {
        comparison = a.town.localeCompare(b.town);
      } else if (sortField === 'flat_type') {
        comparison = a.flat_type.localeCompare(b.flat_type);
      } else if (sortField === 'street_name') {
        comparison = a.street_name.localeCompare(b.street_name);
      } else if (sortField === 'floor_area_sqm') {
        comparison = a.floor_area_sqm - b.floor_area_sqm;
      } else if (sortField === 'storey_range') {
        comparison = a.storey_range.localeCompare(b.storey_range);
      } else if (sortField === 'remaining_lease_years') {
        comparison = a.remaining_lease_years - b.remaining_lease_years;
      } else if (sortField === 'resale_price') {
        comparison = a.resale_price - b.resale_price;
      } else if (sortField === 'price_per_sqft') {
        comparison = a.price_per_sqft - b.price_per_sqft;
      }
      return sortAsc ? comparison : -comparison;
    });
    return list;
  }, [records, sortField, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(sortedRecords.length / pageSize));
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedRecords.slice(start, start + pageSize);
  }, [sortedRecords, currentPage, pageSize]);

  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />;
    }
    return sortAsc ? (
      <ArrowUp className="w-3 h-3 text-red-600" />
    ) : (
      <ArrowDown className="w-3 h-3 text-red-600" />
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden flex flex-col">
      {/* Table Header controls */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/40">
        <div className="text-xs text-slate-600 dark:text-slate-400">
          Showing{' '}
          <strong className="text-slate-900 dark:text-white font-mono tabular-nums">
            {records.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
          </strong>{' '}
          to{' '}
          <strong className="text-slate-900 dark:text-white font-mono tabular-nums">
            {Math.min(currentPage * pageSize, records.length)}
          </strong>{' '}
          of{' '}
          <strong className="text-slate-900 dark:text-white font-mono tabular-nums">
            {records.length.toLocaleString('en-SG')}
          </strong>{' '}
          filtered transactions
        </div>

        {/* Page size selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden"
          >
            <option value={15}>15</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-100/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800 select-none">
            <tr>
              <th
                onClick={() => handleSort('id')}
                className="py-3 px-3 cursor-pointer group hover:text-slate-900 dark:hover:text-white"
              >
                <div className="flex items-center gap-1 font-mono">
                  <span>_id</span>
                  {renderSortIndicator('id')}
                </div>
              </th>
              <th
                onClick={() => handleSort('month')}
                className="py-3 px-3.5 cursor-pointer group hover:text-slate-900 dark:hover:text-white"
              >
                <div className="flex items-center gap-1">
                  <span>Month</span>
                  {renderSortIndicator('month')}
                </div>
              </th>
              <th
                onClick={() => handleSort('town')}
                className="py-3 px-3.5 cursor-pointer group hover:text-slate-900 dark:hover:text-white"
              >
                <div className="flex items-center gap-1">
                  <span>Town</span>
                  {renderSortIndicator('town')}
                </div>
              </th>
              <th
                onClick={() => handleSort('flat_type')}
                className="py-3 px-3.5 cursor-pointer group hover:text-slate-900 dark:hover:text-white"
              >
                <div className="flex items-center gap-1">
                  <span>Flat Type</span>
                  {renderSortIndicator('flat_type')}
                </div>
              </th>
              <th
                onClick={() => handleSort('street_name')}
                className="py-3 px-3.5 cursor-pointer group hover:text-slate-900 dark:hover:text-white"
              >
                <div className="flex items-center gap-1">
                  <span>Address / Street</span>
                  {renderSortIndicator('street_name')}
                </div>
              </th>
              <th className="py-3 px-3.5">
                <span>Model</span>
              </th>
              <th
                onClick={() => handleSort('storey_range')}
                className="py-3 px-3.5 cursor-pointer group hover:text-slate-900 dark:hover:text-white text-center"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Storey</span>
                  {renderSortIndicator('storey_range')}
                </div>
              </th>
              <th
                onClick={() => handleSort('floor_area_sqm')}
                className="py-3 px-3.5 cursor-pointer group hover:text-slate-900 dark:hover:text-white text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Area ({unitSystem})</span>
                  {renderSortIndicator('floor_area_sqm')}
                </div>
              </th>
              <th
                onClick={() => handleSort('remaining_lease_years')}
                className="py-3 px-3.5 cursor-pointer group hover:text-slate-900 dark:hover:text-white text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Lease Left</span>
                  {renderSortIndicator('remaining_lease_years')}
                </div>
              </th>
              <th
                onClick={() => handleSort('resale_price')}
                className="py-3 px-3.5 cursor-pointer group hover:text-slate-900 dark:hover:text-white text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Price (SGD)</span>
                  {renderSortIndicator('resale_price')}
                </div>
              </th>
              <th
                onClick={() => handleSort('price_per_sqft')}
                className="py-3 px-3.5 cursor-pointer group hover:text-slate-900 dark:hover:text-white text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>PSF</span>
                  {renderSortIndicator('price_per_sqft')}
                </div>
              </th>
              <th className="py-3 px-3 text-center">
                <span>Valuation</span>
              </th>
              <th className="py-3 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {paginatedRecords.length === 0 ? (
              <tr>
                <td colSpan={13} className="py-12 text-center text-slate-500">
                  No transactions match your current filters. Try resetting search or widening price/town selection.
                </td>
              </tr>
            ) : (
              paginatedRecords.map((r) => {
                const isMillion = r.resale_price >= 1000000;
                const benchmark = townPsfMap[`${r.town}_${r.flat_type}`] || r.price_per_sqft;
                const variance = Math.round(((r.price_per_sqft - benchmark) / (benchmark || 1)) * 100);

                return (
                  <tr
                    key={r.id}
                    onClick={() => onSelectRecord(r)}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer transition-colors group"
                  >
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                      #{r.raw_id || r.id}
                    </td>
                    <td className="py-2.5 px-3.5 font-mono text-slate-600 dark:text-slate-400 tabular-nums">
                      {r.month}
                    </td>
                    <td className="py-2.5 px-3.5 font-semibold text-slate-900 dark:text-white">
                      {r.town}
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-800 dark:text-slate-200">
                      {r.flat_type}
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-700 dark:text-slate-300">
                      <span className="font-semibold text-slate-900 dark:text-white mr-1.5 font-mono">
                        Blk {r.block}
                      </span>
                      <span>{r.street_name}</span>
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-600 dark:text-slate-300">
                      {r.flat_model}
                    </td>
                    <td className="py-2.5 px-3.5 text-center font-mono text-slate-600 dark:text-slate-400">
                      {r.storey_range}
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-mono tabular-nums text-slate-800 dark:text-slate-200">
                      {formatArea(r.floor_area_sqm, unitSystem)}
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-mono tabular-nums text-slate-600 dark:text-slate-400">
                      {r.remaining_lease_years} yrs
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-mono tabular-nums font-bold">
                      <span
                        className={
                          isMillion
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-slate-900 dark:text-white'
                        }
                      >
                        {formatCurrency(r.resale_price)}
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-mono tabular-nums font-medium text-red-600 dark:text-red-400">
                      {formatPsf(r.price_per_sqft)}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono">
                      {variance <= -4 ? (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          Value ({variance}%)
                        </span>
                      ) : variance >= 5 ? (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                          +{variance}% COV
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">
                          Fair Value
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectRecord(r);
                        }}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="View details & mortgage"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs bg-slate-50/50 dark:bg-slate-800/40">
        <span className="text-slate-500">
          Page <strong className="text-slate-900 dark:text-white font-mono">{currentPage}</strong> of{' '}
          <strong className="text-slate-900 dark:text-white font-mono">{totalPages}</strong>
        </span>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-md border border-slate-200 dark:border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-2 font-mono tabular-nums text-slate-600 dark:text-slate-300">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage >= totalPages}
            className="p-1.5 rounded-md border border-slate-200 dark:border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
