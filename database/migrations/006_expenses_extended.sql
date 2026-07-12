-- Migration 006: Expense Module Extensions

-- Add columns to expenses if not exists
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL;
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending' NOT NULL;
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS gst_number VARCHAR(50);
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS gst_rate NUMERIC(5, 2) DEFAULT 0.00 NOT NULL;
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS gst_amount NUMERIC(10, 2) DEFAULT 0.00 NOT NULL;
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS vendor_name VARCHAR(150);
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS invoice_number VARCHAR(100);

-- Create expense documents table
CREATE TABLE IF NOT EXISTS expense_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    expense_id UUID NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
    document_name VARCHAR(255) NOT NULL,
    document_url VARCHAR(255) NOT NULL,
    file_size INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create expense history table
CREATE TABLE IF NOT EXISTS expense_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    expense_id UUID NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
    old_status VARCHAR(50) NOT NULL,
    new_status VARCHAR(50) NOT NULL,
    notes TEXT,
    changed_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Seed default expense categories if missing
INSERT INTO expense_categories (name, description) VALUES
('Fuel', 'Charges incurred refuelling vehicles'),
('Maintenance', 'Periodic preventive maintenance services'),
('Repairs', 'Corrective maintenance repairs'),
('Insurance', 'Insurance policy coverage plans'),
('Registration', 'Vehicle regulatory and licensing registrations'),
('Tyres', 'Tyre replacements and wheel alignments'),
('Salary', 'Employee and driver compensations'),
('Toll', 'Highway transit road tolls'),
('Parking', 'Vehicle parking charges'),
('Miscellaneous', 'Other general operational expenditures')
ON CONFLICT (name) DO NOTHING;
