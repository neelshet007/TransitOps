-- Seeding script for TransitOps

-- 1. Insert standard roles
INSERT INTO roles (id, name, code, description) VALUES
('b192ea60-a29d-4235-afc7-d86895df7b1a', 'Administrator', 'admin', 'System Administrator with full access'),
('c53ea861-c88a-40a2-9e8c-851f0fdb1a2b', 'Operator', 'operator', 'Fleet and dispatch operator'),
('d5a23f4b-0a7b-4df2-8c43-2cb979dcf922', 'Driver', 'driver', 'Vehicle driver'),
('e3b5df5b-a81d-40d1-9cb6-c0458df8a21f', 'Maintenance Staff', 'maintenance', 'Maintenance technician')
ON CONFLICT (code) DO NOTHING;

-- 2. Insert standard permissions
INSERT INTO permissions (id, name, code, description) VALUES
-- Users & Roles
('11b7dfb1-789a-4dbb-a590-7fdcde8a61ff', 'View Users', 'users:view', 'View user accounts'),
('22c8dfc2-890b-4ecc-b691-8feddf9b72ff', 'Create Users', 'users:create', 'Create user accounts'),
('33d9dfd3-901c-4fdd-c782-9feddfa283ff', 'Edit Users', 'users:edit', 'Edit user accounts'),
('44e0dfe4-012d-4fee-d893-afeddfb394ff', 'Delete Users', 'users:delete', 'Delete user accounts'),
('55b7dfb1-789a-4dbb-a590-7fdcde8a61ff', 'View Roles', 'roles:view', 'View role configurations'),
('66c8dfc2-890b-4ecc-b691-8feddf9b72ff', 'Manage Roles', 'roles:manage', 'Manage role configurations'),
-- Vehicles
('55f1dff5-123e-4fff-e9a4-bfeddfc405ff', 'View Vehicles', 'vehicles:view', 'View fleet vehicles'),
('66a2dfa6-234f-40aa-a9b5-cfeddfd516ff', 'Create Vehicles', 'vehicles:create', 'Add new vehicles'),
('77b3dfb7-3450-41ab-bab6-dfeddfe627ff', 'Edit Vehicles', 'vehicles:edit', 'Edit vehicles'),
('88c4dfc8-4561-42bc-cab7-efeddff738ff', 'Delete Vehicles', 'vehicles:delete', 'Remove vehicles'),
-- Drivers & Trips
('99d5dfd9-5672-43cd-dab8-ffedd00849ff', 'View Drivers', 'drivers:view', 'View system drivers'),
('aad6dfe6-6783-44de-eab9-1fedd0195aff', 'Create Drivers', 'drivers:create', 'Add system drivers'),
('bbd7dfd7-7894-45df-fab9-2fedd02a6bff', 'Edit Drivers', 'drivers:edit', 'Edit driver profiles'),
('77d5dfd9-5672-43cd-dab8-ffedd00849ff', 'Delete Drivers', 'drivers:delete', 'Delete driver profiles'),
('ccd8dfd8-8905-46df-0ab9-3fedd03b7cff', 'View Trips', 'trips:view', 'View trip dispatch logs'),
('ddd9dfd9-9016-47df-1ab9-4fedd04c8dff', 'Create Trips', 'trips:create', 'Schedule new trips'),
('eed0dfe0-0127-48df-2ab9-5fedd05d9eff', 'Edit Trips', 'trips:edit', 'Modify active trips'),
('88d9dfd9-9016-47df-1ab9-4fedd04c8dff', 'Close Trips', 'trips:close', 'Close completed trips'),
-- Fuel & Maintenance
('ffd1dff1-1238-49df-3ab9-6fedd06e0fff', 'View Fuel Logs', 'fuel:view', 'View fuel logs'),
('00a2dfa2-2349-4adf-4ab9-7fedd07f1fff', 'Create Fuel Logs', 'fuel:create', 'Add new fuel logs'),
('11b3dfb3-345a-4bdf-5ab9-8fedd08f2fff', 'View Maintenance', 'maintenance:view', 'View maintenance logs'),
('22c4dfc4-456b-4cdf-6ab9-9fedd09f3fff', 'Manage Maintenance', 'maintenance:manage', 'Schedule or update maintenance'),
-- Expenses & Settings
('33d5dfd5-567c-4ddf-7ab9-afedd0af4fff', 'View Expenses', 'expenses:view', 'View system expenses'),
('44e6dfe6-678d-4edf-8ab9-bfedd0bf5fff', 'Create Expenses', 'expenses:create', 'Log new expenses'),
('55f7dff7-789e-4fdf-9ab9-cfedd0cf6fff', 'View Reports', 'reports:view', 'View operations reports'),
('66a8dfa8-890f-4fdf-aab9-dfedd0df7fff', 'Manage Settings', 'settings:manage', 'Update application settings')
ON CONFLICT (code) DO NOTHING;

-- 3. Map all permissions to admin role
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'b192ea60-a29d-4235-afc7-d86895df7b1a', id FROM permissions
ON CONFLICT DO NOTHING;

-- 4. Map subset of permissions to operator role
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'c53ea861-c88a-40a2-9e8c-851f0fdb1a2b', id FROM permissions
WHERE code IN (
    'vehicles:view', 'vehicles:create', 'vehicles:edit',
    'drivers:view', 'drivers:create', 'drivers:edit',
    'trips:view', 'trips:create', 'trips:edit',
    'fuel:view', 'fuel:create',
    'maintenance:view', 'maintenance:manage',
    'expenses:view', 'expenses:create',
    'reports:view'
)
ON CONFLICT DO NOTHING;

-- 5. Insert default admin user (Password: Password123)
INSERT INTO users (id, email, password_hash, first_name, last_name, is_active) VALUES
('a192ea60-1a9d-1235-afc7-d86895df7b1a', 'admin@transitops.com', '$2b$10$WmqI7ydlfgkm5H2eKLws..pruf6Y/hBYYBJQxw0ftUkBM/cw5kFsy', 'System', 'Administrator', true)
ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash;

-- 6. Map admin user to admin role
INSERT INTO user_roles (user_id, role_id) VALUES
('a192ea60-1a9d-1235-afc7-d86895df7b1a', 'b192ea60-a29d-4235-afc7-d86895df7b1a')
ON CONFLICT DO NOTHING;
