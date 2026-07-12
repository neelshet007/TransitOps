import { randomUUID } from 'crypto';
import { APIResponse } from '@transitops/types';

// UUID Generator using Node's crypto
export const generateUUID = (): string => {
  return randomUUID();
};

// Date Formatter
export const formatDate = (
  date: Date | string | number,
  formatStr: string = 'YYYY-MM-DD',
): string => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const pad = (num: number) => String(num).padStart(2, '0');
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const min = pad(d.getMinutes());
  const ss = pad(d.getSeconds());

  return formatStr
    .replace('YYYY', String(yyyy))
    .replace('MM', mm)
    .replace('DD', dd)
    .replace('HH', hh)
    .replace('mm', min)
    .replace('ss', ss);
};

// API Response Helpers
export const successResponse = <T>(
  message: string,
  data?: T,
  meta?: Record<string, unknown>,
): APIResponse<T> => {
  return {
    success: true,
    message,
    data,
    meta,
  };
};

export const errorResponse = (message: string, errors: string[] = []): APIResponse => {
  return {
    success: false,
    message,
    errors,
  };
};

// Pagination Helper
export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total_records: number;
    total_pages: number;
  };
}

export const buildPagination = <T>(
  data: T[],
  totalRecords: number,
  page: number,
  limit: number,
): PaginatedResult<T> => {
  const totalPages = Math.ceil(totalRecords / limit);
  return {
    data,
    meta: {
      page,
      limit,
      total_records: totalRecords,
      total_pages: totalPages,
    },
  };
};

// Search Helper: builds a search query for Prisma
export const buildSearchQuery = (
  searchStr: string | undefined,
  fields: string[],
): Record<string, unknown> | undefined => {
  if (!searchStr) return undefined;
  return {
    OR: fields.map((field) => ({
      [field]: {
        contains: searchStr,
        mode: 'insensitive',
      },
    })),
  };
};

// Sort Helper: returns sorting configuration
export const buildSortQuery = (
  sortBy: string | undefined,
  sortOrder: 'asc' | 'desc' | undefined,
  defaultField: string = 'created_at',
  defaultOrder: 'asc' | 'desc' = 'desc',
): Record<string, 'asc' | 'desc'> => {
  const field = sortBy || defaultField;
  const order = sortOrder || defaultOrder;
  return {
    [field]: order,
  };
};

// Filter Helper: clean empty/undefined filters
export const cleanFilters = (filters: Record<string, unknown>): Record<string, unknown> => {
  const cleaned: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== '') {
      cleaned[key] = value;
    }
  }
  return cleaned;
};

// File Helper
export const getFileExtension = (filename: string): string => {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2).toLowerCase();
};

export const formatBytes = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};
