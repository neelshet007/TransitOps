-- Migration 009: Add Missing Columns to fuel_logs and notifications Tables
-- This corrective migration adds columns that were in the migration file
-- but the table already existed from a prior schema with different columns.

-- ============================================================
-- Fix fuel_logs table: add missing Phase 4 columns
-- ============================================================
ALTER TABLE fuel_logs ADD COLUMN IF NOT EXISTS fuel_station_id UUID REFERENCES fuel_stations(id) ON DELETE SET NULL;
ALTER TABLE fuel_logs ADD COLUMN IF NOT EXISTS fuel_type VARCHAR(50) DEFAULT 'Diesel';
ALTER TABLE fuel_logs ADD COLUMN IF NOT EXISTS quantity NUMERIC(10,2);
ALTER TABLE fuel_logs ADD COLUMN IF NOT EXISTS price_per_liter NUMERIC(10,2);
ALTER TABLE fuel_logs ADD COLUMN IF NOT EXISTS total_cost NUMERIC(10,2);
ALTER TABLE fuel_logs ADD COLUMN IF NOT EXISTS mileage NUMERIC(10,2);
ALTER TABLE fuel_logs ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50);
ALTER TABLE fuel_logs ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE fuel_logs ADD COLUMN IF NOT EXISTS fuel_date DATE;
ALTER TABLE fuel_logs ADD COLUMN IF NOT EXISTS trip_id UUID REFERENCES trips(id) ON DELETE SET NULL;

-- Backfill computed columns from old data
UPDATE fuel_logs 
SET 
  fuel_type = 'Diesel',
  quantity = COALESCE(gallons, 0),
  total_cost = COALESCE(cost, 0),
  price_per_liter = CASE WHEN COALESCE(gallons, 0) > 0 THEN COALESCE(cost, 0) / COALESCE(gallons, 0) ELSE 0 END,
  fuel_date = COALESCE(refuel_date::date, CURRENT_DATE)
WHERE quantity IS NULL OR fuel_date IS NULL;

-- ============================================================
-- Fix notifications table: add missing Phase 4 columns
-- ============================================================
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS action_url VARCHAR(255);
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS reference_id UUID;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS reference_type VARCHAR(100);
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS created_by UUID;

-- ============================================================
-- Add missing notification_preferences and notification_history tables
-- ============================================================
CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  email_alerts BOOLEAN DEFAULT true,
  push_alerts BOOLEAN DEFAULT true,
  sms_alerts BOOLEAN DEFAULT false,
  alert_types JSONB DEFAULT '{"Success": true, "Information": true, "Warning": true, "Critical": true}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS notification_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notification_id UUID NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL,
  action_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
