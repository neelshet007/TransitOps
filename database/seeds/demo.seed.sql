-- Demo Seed Data for TransitOps Dashboard & ERP Modules

-- 1. Seed Maintenance Types
INSERT INTO maintenance_types (id, name, description) VALUES
('11b3dfb3-345a-4bdf-5ab9-8fedd08f2fff', 'Routine Maintenance', 'Regular preventive servicing')
ON CONFLICT (name) DO NOTHING;

-- 2. Seed Expense Categories
INSERT INTO expense_categories (id, name, description) VALUES
('33d5dfd5-567c-4ddf-7ab9-afedd0af4fff', 'Tolls', 'Road toll fees')
ON CONFLICT (name) DO NOTHING;

-- 3. Seed Vehicles
INSERT INTO vehicles (id, plate_number, make, model, year, vin, status, odometer) VALUES
('e1000001-0000-0000-0000-000000000001', 'MH-12-Q-4521', 'BharatBenz', '2823R Heavy Duty', 2022, 'BBNZ2823R90012345', 'active', 125000),
('e1000001-0000-0000-0000-000000000002', 'MH-14-R-6789', 'Tata Motors', 'Prima 2825.K', 2021, 'TATA2825K80098765', 'active', 185000),
('e1000001-0000-0000-0000-000000000003', 'DL-01-A-1234', 'Ashok Leyland', 'Ecomet 1615 HE', 2023, 'ALEY1615HE1002468', 'active', 45000),
('e1000001-0000-0000-0000-000000000004', 'KA-03-B-5678', 'Mahindra', 'Furio 14 Cargo', 2022, 'MAHN14FURI3005577', 'maintenance', 92000),
('e1000001-0000-0000-0000-000000000005', 'GJ-01-C-9012', 'Eicher', 'Pro 2049 Light', 2023, 'EICH2049L40088990', 'active', 32000)
ON CONFLICT (plate_number) DO NOTHING;

-- 4. Seed Trips
INSERT INTO trips (id, vehicle_id, driver_id, origin, destination, start_time, end_time, start_odometer, end_odometer, distance, status, cargo, customer, notes) VALUES
('d1000001-0000-0000-0000-000000000001', 'e1000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000001', 'Mumbai Terminal 1', 'Pune Hub A', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 days 22 hours', 124800, 124950, 150, 'completed', 'Electronics', 'Reliance Retail', 'Delivered ahead of time'),
('d1000001-0000-0000-0000-000000000002', 'e1000001-0000-0000-0000-000000000002', 'a1000001-0000-0000-0000-000000000002', 'Delhi Transit Hub', 'Jaipur Crossing', NOW() - INTERVAL '5 hours', NULL, 185000, NULL, 260, 'dispatched', 'Automobile Parts', 'Maruti Suzuki Ltd', 'In transit, weather overcast'),
('d1000001-0000-0000-0000-000000000003', 'e1000001-0000-0000-0000-000000000003', 'a1000001-0000-0000-0000-000000000003', 'Bengaluru Depot', 'Chennai Terminal', NOW() - INTERVAL '24 hours', NOW() - INTERVAL '18 hours', 44650, 45000, 350, 'completed', 'Apparel & Textiles', 'Aditya Birla Fashion', 'Scheduled standard routing')
ON CONFLICT (id) DO NOTHING;

-- 5. Seed Fuel Logs
INSERT INTO fuel_logs (id, vehicle_id, driver_id, trip_id, fuel_type, quantity, gallons, price_per_liter, total_cost, cost, odometer, fuel_date, refuel_date, payment_method, notes) VALUES
('f1000001-0000-0000-0000-000000000001', 'e1000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000001', 'd1000001-0000-0000-0000-000000000001', 'Diesel', 120.00, 120.00, 93.50, 11220.00, 11220.00, 124950, CURRENT_DATE, CURRENT_DATE, 'Corporate Card', 'Indian Oil Outlet'),
('f1000001-0000-0000-0000-000000000002', 'e1000001-0000-0000-0000-000000000002', 'a1000001-0000-0000-0000-000000000002', 'd1000001-0000-0000-0000-000000000002', 'Diesel', 150.00, 150.00, 94.00, 14100.00, 14100.00, 185000, CURRENT_DATE, CURRENT_DATE, 'Cash', 'Bharat Petroleum Pump')
ON CONFLICT (id) DO NOTHING;

-- 6. Seed Maintenance Logs
INSERT INTO maintenance (id, vehicle_id, maintenance_type_id, scheduled_date, completed_date, parts_cost, cost, labour_cost, vendor_name, status, notes) VALUES
('c1000001-0000-0000-0000-000000000001', 'e1000001-0000-0000-0000-000000000004', '11b3dfb3-345a-4bdf-5ab9-8fedd08f2fff', NOW() - INTERVAL '3 days', NOW() - INTERVAL '1 days', 4500.00, 5700.00, 1200.00, 'Tata Service Hub', 'completed', 'Routine 90K oil change and safety checks'),
('c1000001-0000-0000-0000-000000000002', 'e1000001-0000-0000-0000-000000000001', '11b3dfb3-345a-4bdf-5ab9-8fedd08f2fff', NOW() + INTERVAL '2 days', NULL, 0.00, 0.00, 0.00, 'Tata Service Hub', 'scheduled', 'Tire rotation and pressure evaluation')
ON CONFLICT (id) DO NOTHING;

-- 7. Seed Expenses
INSERT INTO expenses (id, trip_id, vehicle_id, expense_category_id, amount, expense_date, notes, driver_id, status, gst_number, gst_rate, vendor_name, invoice_number) VALUES
('e2000001-0000-0000-0000-000000000001', 'd1000001-0000-0000-0000-000000000001', 'e1000001-0000-0000-0000-000000000001', '33d5dfd5-567c-4ddf-7ab9-afedd0af4fff', 1200.00, NOW() - INTERVAL '1 days', 'Fastag Auto-deduct toll gate Mumbai-Pune expressway', 'a1000001-0000-0000-0000-000000000001', 'approved', 'GST1234567890', 18.00, 'NHAI Fastag Depot', 'INV-2026-00124'),
('e2000001-0000-0000-0000-000000000002', 'd1000001-0000-0000-0000-000000000002', 'e1000001-0000-0000-0000-000000000002', '33d5dfd5-567c-4ddf-7ab9-afedd0af4fff', 2500.00, NOW(), 'Driver Overnight stay allowance at Rajasthan Highway', 'a1000001-0000-0000-0000-000000000002', 'pending', '', 0.00, 'Highway Rest Inn', 'REC-9005')
ON CONFLICT (id) DO NOTHING;
