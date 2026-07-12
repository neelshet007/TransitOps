-- Migration 004: Trip Management Extensions

-- Add columns to trips if not exists
ALTER TABLE trips ADD COLUMN IF NOT EXISTS distance NUMERIC;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS estimated_time VARCHAR(50);
ALTER TABLE trips ADD COLUMN IF NOT EXISTS actual_start TIMESTAMP WITH TIME ZONE;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS actual_end TIMESTAMP WITH TIME ZONE;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS cargo VARCHAR(255);
ALTER TABLE trips ADD COLUMN IF NOT EXISTS customer VARCHAR(255);
ALTER TABLE trips ADD COLUMN IF NOT EXISTS notes TEXT;

-- Create trip assignments table
CREATE TABLE IF NOT EXISTS trip_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create trip logs table
CREATE TABLE IF NOT EXISTS trip_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    log_type VARCHAR(50) NOT NULL, -- status_change, info, issue, system
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create trip status history table
CREATE TABLE IF NOT EXISTS trip_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    old_status VARCHAR(50) NOT NULL,
    new_status VARCHAR(50) NOT NULL,
    reason VARCHAR(255),
    changed_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
