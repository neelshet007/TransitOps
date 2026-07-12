export interface BaseEntity {
  id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
  created_by?: string | null;
  updated_by?: string | null;
}

// User & Auth Management
export interface Permission extends BaseEntity {
  name: string;
  description?: string | null;
  code: string; // e.g., 'vehicles:create'
}

export interface Role extends BaseEntity {
  name: string;
  description?: string | null;
  code: string; // e.g., 'admin', 'operator'
  permissions?: Permission[];
}

export interface User extends BaseEntity {
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  roles?: Role[];
}

export interface JWTPayload {
  userId: string;
  email: string;
  roles: string[];
  permissions: string[];
}

export interface AuthenticatedRequest extends Record<string, any> {
  user?: JWTPayload;
}

// API standard interfaces
export interface APIResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    total_records?: number;
    total_pages?: number;
    [key: string]: unknown;
  };
  errors?: string[];
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Module Interfaces
export interface Vehicle extends BaseEntity {
  plate_number: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  status: 'active' | 'inactive' | 'maintenance';
}

export interface Driver extends BaseEntity {
  user_id: string;
  license_number: string;
  license_expiry: Date;
  status: 'active' | 'inactive' | 'suspended';
}

export interface Trip extends BaseEntity {
  vehicle_id: string;
  driver_id: string;
  start_time: Date;
  end_time?: Date | null;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  origin: string;
  destination: string;
  start_odometer: number;
  end_odometer?: number | null;
}

export interface FuelLog extends BaseEntity {
  vehicle_id: string;
  driver_id: string;
  refuel_date: Date;
  gallons: number;
  cost: number;
  odometer: number;
}

export interface MaintenanceType extends BaseEntity {
  name: string;
  description?: string | null;
}

export interface Maintenance extends BaseEntity {
  vehicle_id: string;
  maintenance_type_id: string;
  scheduled_date: Date;
  completed_date?: Date | null;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  cost?: number | null;
  notes?: string | null;
}

export interface ExpenseCategory extends BaseEntity {
  name: string;
  description?: string | null;
}

export interface Expense extends BaseEntity {
  trip_id?: string | null;
  vehicle_id?: string | null;
  expense_category_id: string;
  amount: number;
  expense_date: Date;
  notes?: string | null;
}

export interface Notification extends BaseEntity {
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
  type: string;
}

export interface Setting extends BaseEntity {
  key: string;
  value: string;
  group: string;
}

export interface FileEntity extends BaseEntity {
  filename: string;
  mime_type: string;
  size: number;
  url: string;
}
