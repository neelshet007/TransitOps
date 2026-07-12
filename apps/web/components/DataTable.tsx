'use client';

import React, { useState, useMemo, useCallback, memo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  type RowData,
} from '@tanstack/react-table';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  FileDown,
  Database,
} from 'lucide-react';

/* ─── Column shape that pages currently provide ──────────────────────────── */
interface LegacyColumn<T> {
  header:      string;
  accessorKey: keyof T | string;
  cell?:       (row: T) => React.ReactNode;
  sortable?:   boolean;
}

/* ─── DataTable Props ────────────────────────────────────────────────────── */
interface DataTableProps<T extends Record<string, any>> {
  columns:           LegacyColumn<T>[];
  data:              T[];
  searchPlaceholder?: string;
  searchKey?:        keyof T;
  onRowClick?:       (row: T) => void;
  actions?:          (row: T) => React.ReactNode;
  isLoading?:        boolean;
  pageSize?:         number;
  stickyHeader?:     boolean;
}

/* ─── Skeleton row ────────────────────────────────────────────────────────── */
const SkeletonRow = memo(({ cols }: { cols: number }) => (
  <tr>
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-4 py-3">
        <div
          className="shimmer-bg rounded"
          style={{ height: 14, width: `${60 + Math.random() * 40}%` }}
        />
      </td>
    ))}
  </tr>
));
SkeletonRow.displayName = 'SkeletonRow';

/* ─── Component ──────────────────────────────────────────────────────────── */
function DataTableComponent<T extends Record<string, any>>({
  columns: legacyCols,
  data,
  searchPlaceholder = 'Search records...',
  searchKey,
  onRowClick,
  actions,
  isLoading = false,
  pageSize = 10,
  stickyHeader = true,
}: DataTableProps<T>) {
  const [sorting,          setSorting]    = useState<SortingState>([]);
  const [globalFilter,     setGlobalFilter]= useState('');
  const [columnVisibility, setColumnVis]  = useState<VisibilityState>({});

  /* Convert legacy column shape → TanStack ColumnDef */
  const tanstackCols = useMemo<ColumnDef<T>[]>(() => {
    const cols: ColumnDef<T>[] = legacyCols.map((c) => ({
      id:          String(c.accessorKey),
      accessorKey: String(c.accessorKey) as any,
      header:      c.header,
      enableSorting: c.sortable ?? false,
      cell:        c.cell
        ? ({ row }: { row: any }) => c.cell!(row.original)
        : ({ getValue }: { getValue: () => unknown }) => {
            const v = getValue();
            return v == null ? '—' : String(v);
          },
    }));

    if (actions) {
      cols.push({
        id:           '_actions',
        header:       '',
        enableSorting: false,
        cell:         ({ row }: { row: any }) => (
          <div
            className="flex items-center justify-end gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            {actions(row.original)}
          </div>
        ),
      });
    }

    return cols;
  }, [legacyCols, actions]);

  /* Global filter — only on searchKey if provided, else full row */
  const filteredData = useMemo(() => {
    if (!globalFilter || !searchKey) return data;
    const q = globalFilter.toLowerCase();
    return data.filter((item) => {
      const v = item[searchKey as string];
      return v != null && String(v).toLowerCase().includes(q);
    });
  }, [data, globalFilter, searchKey]);

  const table = useReactTable({
    data:     filteredData,
    columns:  tanstackCols,
    state:    { sorting, columnVisibility },
    onSortingChange:          setSorting,
    onColumnVisibilityChange: setColumnVis,
    getCoreRowModel:       getCoreRowModel(),
    getSortedRowModel:     getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel:   getFilteredRowModel(),
    initialState: {
      pagination: { pageSize },
    },
  });

  const { pageIndex } = table.getState().pagination;
  const totalRows     = filteredData.length;
  const totalPages    = table.getPageCount();
  const startRow      = pageIndex * pageSize + 1;
  const endRow        = Math.min((pageIndex + 1) * pageSize, totalRows);
  const colCount      = tanstackCols.length;

  const handleRowClick = useCallback(
    (row: T) => { if (onRowClick) onRowClick(row); },
    [onRowClick],
  );

  return (
    <div className="flex flex-col gap-3">
      {/* ── Toolbar ───────────────────────────────────────────────────────── */}
      {(searchKey || true) && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search */}
          <div className="input-with-icon w-full sm:w-72">
            <Search size={14} className="input-icon" />
            <input
              type="text"
              value={globalFilter}
              onChange={(e) => {
                setGlobalFilter(e.target.value);
                table.setPageIndex(0);
              }}
              placeholder={searchPlaceholder}
              className="input-field"
              aria-label="Search table"
            />
          </div>

          {/* Export */}
          <button
            onClick={() => alert('Exporting data as CSV…')}
            className="btn btn-secondary btn-sm flex-shrink-0 self-start sm:self-auto"
          >
            <FileDown size={13} /> Export CSV
          </button>
        </div>
      )}

      {/* ── Table wrapper ─────────────────────────────────────────────────── */}
      <div className="data-table-wrapper">
        <div className="data-table-scroll">
          <table
            className="data-table"
            role="grid"
            aria-label="Data table"
            aria-rowcount={totalRows}
          >
            {/* ── Head ─────────────────────────────────────────────────────── */}
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((header) => {
                    const sorted = header.column.getIsSorted();
                    const canSort = header.column.getCanSort();
                    return (
                      <th
                        key={header.id}
                        className={`${canSort ? 'cursor-pointer select-none' : ''}`}
                        onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                        aria-sort={
                          sorted === 'asc' ? 'ascending' :
                          sorted === 'desc' ? 'descending' : undefined
                        }
                        style={{ width: header.id === '_actions' ? 80 : undefined }}
                      >
                        <div className={`flex items-center gap-1.5 ${header.id === '_actions' ? 'justify-end' : ''}`}>
                          {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                          {canSort && (
                            <span className="text-text-disabled">
                              {sorted === 'asc'  ? <ChevronUp size={12} className="text-accent-purple-mid" /> :
                               sorted === 'desc' ? <ChevronDown size={12} className="text-accent-purple-mid" /> :
                               <ChevronsUpDown size={11} />}
                            </span>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>

            {/* ── Body ─────────────────────────────────────────────────────── */}
            <tbody>
              {isLoading ? (
                Array.from({ length: pageSize > 5 ? 6 : pageSize }).map((_, i) => (
                  <SkeletonRow key={i} cols={colCount} />
                ))
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={colCount}>
                    <div className="empty-state">
                      <div className="empty-state-icon">
                        <Database size={20} />
                      </div>
                      <p className="text-sm font-medium text-text-secondary">No records found</p>
                      <p className="text-xs text-text-muted">
                        {globalFilter ? 'Try adjusting your search or filters.' : 'No data available yet.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => handleRowClick(row.original)}
                    className={onRowClick ? 'cursor-pointer' : ''}
                    role={onRowClick ? 'button' : undefined}
                    tabIndex={onRowClick ? 0 : undefined}
                    onKeyDown={onRowClick ? (e) => { if (e.key === 'Enter') handleRowClick(row.original); } : undefined}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={`${cell.column.id === '_actions' ? 'text-right' : ''}`}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ────────────────────────────────────────────────────── */}
        {!isLoading && totalRows > 0 && (
          <div className="flex items-center justify-between gap-4 px-4 py-3 border-t border-brand-border bg-brand-panel flex-wrap">
            <p className="text-xs text-text-muted">
              Showing{' '}
              <span className="font-semibold text-text-secondary">{startRow}–{endRow}</span>
              {' '}of{' '}
              <span className="font-semibold text-text-secondary">{totalRows}</span>
              {' '}records
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                className="btn btn-ghost btn-sm px-2"
                aria-label="First page"
              >
                <ChevronsLeft size={14} />
              </button>
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="btn btn-ghost btn-sm"
                aria-label="Previous page"
              >
                <ChevronLeft size={14} />
                <span className="hidden sm:inline">Prev</span>
              </button>

              {/* Page numbers */}
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i;
                } else if (pageIndex < 3) {
                  pageNum = i;
                } else if (pageIndex > totalPages - 4) {
                  pageNum = totalPages - 5 + i;
                } else {
                  pageNum = pageIndex - 2 + i;
                }
                const isActive = pageNum === pageIndex;
                return (
                  <button
                    key={pageNum}
                    onClick={() => table.setPageIndex(pageNum)}
                    className={`btn btn-sm px-2.5 min-w-[32px] ${isActive ? 'btn-primary' : 'btn-ghost'}`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {pageNum + 1}
                  </button>
                );
              })}

              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="btn btn-ghost btn-sm"
                aria-label="Next page"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight size={14} />
              </button>
              <button
                onClick={() => table.setPageIndex(totalPages - 1)}
                disabled={!table.getCanNextPage()}
                className="btn btn-ghost btn-sm px-2"
                aria-label="Last page"
              >
                <ChevronsRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(DataTableComponent) as typeof DataTableComponent;
