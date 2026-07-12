-- Migration 005: Maintenance Module Extensions

-- Add columns to maintenance if not exists
ALTER TABLE maintenance ADD COLUMN IF NOT EXISTS category VARCHAR(50);
ALTER TABLE maintenance ADD COLUMN IF NOT EXISTS next_service_date DATE;
ALTER TABLE maintenance ADD COLUMN IF NOT EXISTS odometer INT;
ALTER TABLE maintenance ADD COLUMN IF NOT EXISTS maintenance_interval INT;
ALTER TABLE maintenance ADD COLUMN IF NOT EXISTS technician_name VARCHAR(150);
ALTER TABLE maintenance ADD COLUMN IF NOT EXISTS vendor_name VARCHAR(150);
ALTER TABLE maintenance ADD COLUMN IF NOT EXISTS labour_cost NUMERIC(10, 2) DEFAULT 0.00 NOT NULL;
ALTER TABLE maintenance ADD COLUMN IF NOT EXISTS parts_cost NUMERIC(10, 2) DEFAULT 0.00 NOT NULL;

-- Create maintenance parts table
CREATE TABLE IF NOT EXISTS maintenance_parts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    maintenance_id UUID NOT NULL REFERENCES maintenance(id) ON DELETE CASCADE,
    part_name VARCHAR(150) NOT NULL,
    quantity INT NOT NULL,
    unit_cost NUMERIC(10, 2) NOT NULL,
    total_cost NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create maintenance vendors table
CREATE TABLE IF NOT EXISTS maintenance_vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) UNIQUE NOT NULL,
    contact_email VARCHAR(150),
    phone VARCHAR(50),
    address VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create maintenance documents table
CREATE TABLE IF NOT EXISTS maintenance_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    maintenance_id UUID NOT NULL REFERENCES maintenance(id) ON DELETE CASCADE,
    document_name VARCHAR(255) NOT NULL,
    document_url VARCHAR(255) NOT NULL,
    file_size INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create maintenance history table
CREATE TABLE IF NOT EXISTS maintenance_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    maintenance_id UUID NOT NULL REFERENCES maintenance(id) ON DELETE CASCADE,
    old_status VARCHAR(50) NOT NULL,
    new_status VARCHAR(50) NOT NULL,
    notes TEXT,
    changed_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
