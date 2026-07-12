-- Migration 003: Fleet Operational Availability Extensions

-- Add columns to vehicles if not exists
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS fitness_expiry DATE;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS insurance_expiry DATE;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS puc_expiry DATE;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS fuel_level INT DEFAULT 100 NOT NULL;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS odometer INT DEFAULT 0 NOT NULL;

-- Create vehicle status history table
CREATE TABLE IF NOT EXISTS vehicle_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    old_status VARCHAR(50) NOT NULL,
    new_status VARCHAR(50) NOT NULL,
    reason VARCHAR(255),
    changed_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create fleet availability logs table
CREATE TABLE IF NOT EXISTS fleet_availability_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    total_vehicles INT NOT NULL,
    available_count INT NOT NULL,
    on_trip_count INT NOT NULL,
    maintenance_count INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Update existing vehicle records with realistic operational metadata
UPDATE vehicles SET fitness_expiry = CURRENT_DATE + INTERVAL '180 days', insurance_expiry = CURRENT_DATE + INTERVAL '240 days', puc_expiry = CURRENT_DATE + INTERVAL '90 days', fuel_level = 85, odometer = 145000 WHERE fitness_expiry IS NULL;
