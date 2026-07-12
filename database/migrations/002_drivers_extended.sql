-- Driver Management Module: Schema Extensions
-- Migration: 002_drivers_extended.sql

-- Make user_id nullable (drivers can exist without system accounts)
ALTER TABLE drivers ALTER COLUMN user_id DROP NOT NULL;

-- Add extended columns to drivers table
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS employee_id        VARCHAR(50);
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS first_name         VARCHAR(100);
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS last_name          VARCHAR(100);
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS phone              VARCHAR(20);
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS email              VARCHAR(255);
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS date_of_birth      DATE;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS gender             VARCHAR(20);
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS blood_group        VARCHAR(10);
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS address            TEXT;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS city               VARCHAR(100);
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS state              VARCHAR(100);
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS pincode            VARCHAR(10);
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS emergency_contact_name     VARCHAR(100);
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS emergency_contact_phone    VARCHAR(20);
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS emergency_contact_relation VARCHAR(50);
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS license_class              VARCHAR(50);
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS license_issue_date         DATE;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS license_issuing_authority  VARCHAR(100);
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS license_verified           BOOLEAN DEFAULT FALSE;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS medical_certificate_number VARCHAR(100);
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS medical_certificate_expiry DATE;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS medical_certificate_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS avatar_url         TEXT;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS date_of_joining    DATE;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS experience_years   INT DEFAULT 0;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS availability       VARCHAR(50) DEFAULT 'available';
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS total_trips        INT DEFAULT 0;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS completed_trips    INT DEFAULT 0;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS cancelled_trips    INT DEFAULT 0;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS average_rating     NUMERIC(3,2) DEFAULT 0.00;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS on_time_percentage NUMERIC(5,2) DEFAULT 0.00;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS safety_score       NUMERIC(5,2) DEFAULT 100.00;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS total_distance     NUMERIC(12,2) DEFAULT 0;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS total_driving_hours NUMERIC(10,2) DEFAULT 0;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS violations         INT DEFAULT 0;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS accidents          INT DEFAULT 0;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS notes              TEXT;

-- Add unique constraints
ALTER TABLE drivers ADD CONSTRAINT uq_driver_employee_id UNIQUE (employee_id);
ALTER TABLE drivers ADD CONSTRAINT uq_driver_phone UNIQUE (phone);
ALTER TABLE drivers ADD CONSTRAINT uq_driver_email UNIQUE (email);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_drivers_employee_id ON drivers(employee_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_drivers_status ON drivers(status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_drivers_availability ON drivers(availability) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_drivers_license_expiry ON drivers(license_expiry) WHERE deleted_at IS NULL;

-- DRIVER DOCUMENTS TABLE
CREATE TABLE IF NOT EXISTS driver_documents (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  driver_id           UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  document_type       VARCHAR(50) NOT NULL,
  document_number     VARCHAR(100),
  issue_date          DATE,
  expiry_date         DATE,
  issuing_authority   VARCHAR(100),
  file_url            TEXT,
  status              VARCHAR(50) DEFAULT 'pending',
  verified            BOOLEAN DEFAULT FALSE,
  verified_by         UUID REFERENCES users(id),
  verified_at         TIMESTAMP WITH TIME ZONE,
  notes               TEXT,
  created_at          TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at          TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  deleted_at          TIMESTAMP WITH TIME ZONE,
  created_by          UUID,
  updated_by          UUID
);
CREATE INDEX IF NOT EXISTS idx_driver_docs_driver_id ON driver_documents(driver_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_driver_docs_type ON driver_documents(document_type) WHERE deleted_at IS NULL;

-- DRIVER ASSIGNMENTS TABLE (prepared for Trip module integration)
CREATE TABLE IF NOT EXISTS driver_assignments (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  driver_id     UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  vehicle_id    UUID REFERENCES vehicles(id),
  trip_id       UUID,
  assigned_at   TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  unassigned_at TIMESTAMP WITH TIME ZONE,
  status        VARCHAR(50) DEFAULT 'active',
  notes         TEXT,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  deleted_at    TIMESTAMP WITH TIME ZONE,
  created_by    UUID,
  updated_by    UUID
);
CREATE INDEX IF NOT EXISTS idx_driver_assign_driver ON driver_assignments(driver_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_driver_assign_vehicle ON driver_assignments(vehicle_id) WHERE deleted_at IS NULL;

-- DRIVER ATTENDANCE TABLE
CREATE TABLE IF NOT EXISTS driver_attendance (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  driver_id     UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  date          DATE NOT NULL,
  status        VARCHAR(50) NOT NULL DEFAULT 'present',
  clock_in      TIMESTAMP WITH TIME ZONE,
  clock_out     TIMESTAMP WITH TIME ZONE,
  working_hours NUMERIC(5,2),
  notes         TEXT,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  CONSTRAINT uq_driver_attendance_date UNIQUE(driver_id, date)
);
CREATE INDEX IF NOT EXISTS idx_driver_attendance_driver ON driver_attendance(driver_id);
CREATE INDEX IF NOT EXISTS idx_driver_attendance_date ON driver_attendance(date);
