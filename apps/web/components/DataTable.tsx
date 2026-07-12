'use client';

import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  ArrowUpDown,
  Search,
  FileDown,
} from 'lucide-react';

interface Column<T> {
  header: string;
  accessorKey: keyof T | string;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  searchKey?: keyof T;
  onRowClick?: (row: T) => void;
  actions?: (row: T) => React.ReactNode;
  isLoading?: boolean;
}

export default function DataTable<T extends Record<string, any>>({
  columns,
  data,
  searchPlaceholder = 'Search records...',
  searchKey,
  onRowClick,
  actions,
  isLoading = false,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Sorting Handler
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter Data based on search query
  const filteredData = React.useMemo(() => {
    if (!searchQuery || !searchKey) return data;
    return data.filter((item) => {
      const val = item[searchKey];
      if (val === undefined || val === null) return false;
      return String(val).toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [data, searchQuery, searchKey]);

  // Sort Data
  const sortedData = React.useMemo(() => {
    if (!sortConfig) return filteredData;
    const sorted = [...filteredData];
    sorted.sort((a, b) => {
      const valA = a[sortConfig.key];
      const valB = b[sortConfig.key];
      if (valA === undefined || valB === undefined) return 0;

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
      }

      return sortConfig.direction === 'asc'
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
    return sorted;
  }, [filteredData, sortConfig]);

  // Pagination bounds
  const totalPages = Math.max(1, Math.ceil(sortedData.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex flex-col w-full">
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
        {searchKey ? (
          <div className="relative w-full sm:w-80">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
              <Search size={16} />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={searchPlaceholder}
              className="w-full bg-brand-panel text-white border border-brand-border rounded-input pl-9 pr-4 py-2 text-xs focus:border-accent-purple outline-none transition-all placeholder:text-text-muted"
            />
          </div>
        ) : (
          <div />
        )}
        <button
          onClick={() => alert('Exporting data as CSV...')}
          className="flex items-center gap-2 bg-brand-panel border border-brand-border hover:bg-brand-card hover:text-white text-text-secondary px-3.5 py-2 rounded-button text-xs transition-colors"
        >
          <FileDown size={14} /> Export CSV
        </button>
      </div>

      {/* Main Table Grid */}
      <div className="bg-brand-card border border-brand-border rounded-card overflow-hidden shadow-subtle w-full">
        <div className="overflow-x-auto w-full">
          <table className="w-full border-collapse text-left text-xs text-text-primary">
            <thead>
              <tr className="bg-brand-panel border-b border-brand-border select-none">
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    className="p-4 font-semibold text-text-secondary uppercase tracking-wider text-[11px]"
                  >
                    {col.sortable ? (
                      <button
                        onClick={() => handleSort(col.accessorKey as string)}
                        className="flex items-center gap-1 hover:text-white transition-colors"
                      >
                        {col.header}
                        <ArrowUpDown size={12} className="text-text-muted" />
                      </button>
                    ) : (
                      col.header
                    )}
                  </th>
                ))}
                {actions && <th className="p-4 text-right">Actions</th>}
              </tr>
            </thead>

            <tbody className="divide-y divide-brand-divider">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, rIdx) => (
                  <tr key={rIdx}>
                    {columns.map((_, cIdx) => (
                      <td key={cIdx} className="p-4">
                        <div className="h-4 shimmer-bg rounded w-24"></div>
                      </td>
                    ))}
                    {actions && <td className="p-4"></td>}
                  </tr>
                ))
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (actions ? 1 : 0)}
                    className="text-center py-12 text-text-muted"
                  >
                    No matching records found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={`transition-colors border-b border-brand-divider ${
                      onRowClick ? 'cursor-pointer hover:bg-brand-panel' : 'hover:bg-brand-panel/40'
                    }`}
                  >
                    {columns.map((col, cIdx) => (
                      <td key={cIdx} className="p-4 font-medium max-w-[200px] truncate">
                        {col.cell ? col.cell(row) : row[col.accessorKey as string]}
                      </td>
                    ))}
                    {actions && (
                      <td
                        className="p-4 text-right"
                        onClick={(e) => e.stopPropagation()} // Prevent row click trigger
                      >
                        {actions(row)}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer */}
        <div className="flex items-center justify-between px-4 py-3 bg-brand-panel border-t border-brand-border text-xs text-text-secondary select-none">
          <span>
            Showing{' '}
            <strong className="text-white">{Math.min(startIndex + 1, sortedData.length)}</strong> to{' '}
            <strong className="text-white">
              {Math.min(startIndex + itemsPerPage, sortedData.length)}
            </strong>{' '}
            of <strong className="text-white">{sortedData.length}</strong> records
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded bg-brand-card border border-brand-border disabled:opacity-40 text-[11px] hover:text-white"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded bg-brand-card border border-brand-border disabled:opacity-40 text-[11px] hover:text-white"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
