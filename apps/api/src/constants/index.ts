export const ROLES = {
  ADMIN: 'admin',
  OPERATOR: 'operator',
  DRIVER: 'driver',
  MAINTENANCE: 'maintenance',
} as const;

export type RoleCode = (typeof ROLES)[keyof typeof ROLES];

export const PERMISSIONS = {
  // Auth & Users
  USERS_VIEW: 'users:view',
  USERS_CREATE: 'users:create',
  USERS_EDIT: 'users:edit',
  USERS_DELETE: 'users:delete',

  // Roles
  ROLES_VIEW: 'roles:view',
  ROLES_MANAGE: 'roles:manage',

  // Vehicles
  VEHICLES_VIEW: 'vehicles:view',
  VEHICLES_CREATE: 'vehicles:create',
  VEHICLES_EDIT: 'vehicles:edit',
  VEHICLES_DELETE: 'vehicles:delete',

  // Drivers
  DRIVERS_VIEW: 'drivers:view',
  DRIVERS_CREATE: 'drivers:create',
  DRIVERS_EDIT: 'drivers:edit',
  DRIVERS_DELETE: 'drivers:delete',

  // Trips
  TRIPS_VIEW: 'trips:view',
  TRIPS_CREATE: 'trips:create',
  TRIPS_EDIT: 'trips:edit',
  TRIPS_CLOSE: 'trips:close',

  // Maintenance
  MAINTENANCE_VIEW: 'maintenance:view',
  MAINTENANCE_MANAGE: 'maintenance:manage',

  // Fuel Logs
  FUEL_VIEW: 'fuel:view',
  FUEL_CREATE: 'fuel:create',

  // Expenses
  EXPENSES_VIEW: 'expenses:view',
  EXPENSES_CREATE: 'expenses:create',

  // Reports & Analytics
  REPORTS_VIEW: 'reports:view',
  ANALYTICS_VIEW: 'analytics:view',

  // Settings
  SETTINGS_MANAGE: 'settings:manage',
} as const;

export type PermissionCode = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const API_ROUTES = {
  AUTH: {
    ROOT: '/api/v1/auth',
    LOGIN: '/login',
    LOGOUT: '/logout',
    REFRESH: '/refresh',
    ME: '/me',
  },
  VEHICLES: '/api/v1/vehicles',
  DRIVERS: '/api/v1/drivers',
  TRIPS: '/api/v1/trips',
  MAINTENANCE: '/api/v1/maintenance',
  FUEL: '/api/v1/fuel',
  EXPENSES: '/api/v1/expenses',
} as const;

export const MESSAGES = {
  AUTH: {
    SUCCESS_LOGIN: 'Login successful.',
    SUCCESS_LOGOUT: 'Logout successful.',
    SUCCESS_REFRESH: 'Tokens rotated successfully.',
    INVALID_CREDENTIALS: 'Invalid email or password.',
    TOKEN_EXPIRED: 'Access token has expired.',
    REFRESH_TOKEN_EXPIRED: 'Refresh token has expired or is invalid.',
    UNAUTHORIZED: 'Access unauthorized. Please log in.',
    FORBIDDEN: 'Access forbidden. Insufficient permissions.',
  },
  GENERAL: {
    NOT_FOUND: 'Requested resource not found.',
    INTERNAL_ERROR: 'An internal server error occurred.',
    VALIDATION_ERROR: 'Request validation failed.',
  },
} as const;

export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  DATABASE_ERROR: 'DATABASE_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;
