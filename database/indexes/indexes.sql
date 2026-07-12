-- SQL Indices for transitops Database Performance

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_roles_code ON roles(code) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_permissions_code ON permissions(code) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_vehicles_plate ON vehicles(plate_number) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_trips_vehicle_driver ON trips(vehicle_id, driver_id, status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_maintenance_vehicle_status ON maintenance(vehicle_id, status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_fuel_logs_vehicle ON fuel_logs(vehicle_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(expense_category_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON activity_logs(user_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_name, entity_id) WHERE deleted_at IS NULL;
