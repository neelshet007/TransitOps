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
  user_id?: string | null;
  employee_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  date_of_birth?: Date | string | null;
  gender?: string | null;
  blood_group?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  emergency_contact_relation?: string | null;
  license_number: string;
  license_class: string;
  license_issue_date?: Date | string | null;
  license_expiry: Date | string;
  license_issuing_authority?: string | null;
  license_verified?: boolean;
  medical_certificate_number?: string | null;
  medical_certificate_expiry?: Date | string | null;
  medical_certificate_verified?: boolean;
  avatar_url?: string | null;
  date_of_joining?: Date | string | null;
  experience_years?: number;
  availability: 'available' | 'assigned' | 'driving' | 'resting' | 'leave' | 'training' | 'suspended' | 'unavailable';
  status: 'active' | 'inactive' | 'suspended';
  total_trips?: number;
  completed_trips?: number;
  cancelled_trips?: number;
  average_rating?: number;
  on_time_percentage?: number;
  safety_score?: number;
  total_distance?: number;
  total_driving_hours?: number;
  violations?: number;
  accidents?: number;
  notes?: string | null;
  current_vehicle_plate?: string | null;
  current_vehicle_id?: string | null;
}

export interface DriverDocument extends BaseEntity {
  driver_id: string;
  document_type: 'driving_license' | 'government_id' | 'medical_certificate' | 'police_verification' | 'address_proof' | 'photograph' | 'employment_contract' | 'other';
  document_number?: string | null;
  issue_date?: Date | string | null;
  expiry_date?: Date | string | null;
  issuing_authority?: string | null;
  file_url?: string | null;
  status: 'pending' | 'active' | 'expiring_soon' | 'expired' | 'rejected';
  verified?: boolean;
  verified_by?: string | null;
  verified_at?: Date | string | null;
  notes?: string | null;
}

export interface DriverAssignment extends BaseEntity {
  driver_id: string;
  vehicle_id?: string | null;
  trip_id?: string | null;
  assigned_at?: Date | string;
  unassigned_at?: Date | string | null;
  status: 'active' | 'completed' | 'cancelled';
  notes?: string | null;
}

export interface DriverAttendance {
  id: string;
  driver_id: string;
  date: Date | string;
  status: 'present' | 'absent' | 'leave' | 'half_day' | 'training' | 'holiday';
  clock_in?: Date | string | null;
  clock_out?: Date | string | null;
  working_hours?: number | null;
  notes?: string | null;
  created_at: Date | string;
  updated_at: Date | string;
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
  distance?: number | null;
  estimated_time?: string | null;
  actual_start?: Date | string | null;
  actual_end?: Date | string | null;
  cargo?: string | null;
  customer?: string | null;
  notes?: string | null;
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
