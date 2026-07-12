-- Migration 007: Fuel Management

CREATE TABLE IF NOT EXISTS fuel_stations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    contact_number VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS fuel_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
    trip_id UUID REFERENCES trips(id) ON DELETE SET NULL,
    fuel_station_id UUID REFERENCES fuel_stations(id) ON DELETE SET NULL,
    fuel_type VARCHAR(50) NOT NULL,
    quantity NUMERIC(10, 2) NOT NULL,
    price_per_liter NUMERIC(10, 2) NOT NULL,
    total_cost NUMERIC(10, 2) NOT NULL,
    odometer NUMERIC(10, 2),
    mileage NUMERIC(10, 2),
    payment_method VARCHAR(50),
    notes TEXT,
    fuel_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID
);

CREATE TABLE IF NOT EXISTS fuel_receipts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fuel_log_id UUID NOT NULL REFERENCES fuel_logs(id) ON DELETE CASCADE,
    invoice_number VARCHAR(100),
    document_url VARCHAR(255) NOT NULL,
    file_size INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS fuel_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fuel_log_id UUID NOT NULL REFERENCES fuel_logs(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,
    notes TEXT,
    changed_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
