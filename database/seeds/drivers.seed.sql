-- Driver Management Module: Seed Data
-- 20 Realistic Indian commercial transport drivers

INSERT INTO drivers (
  id, employee_id, first_name, last_name, phone, email,
  license_number, license_expiry, license_class, license_issue_date, license_issuing_authority, license_verified,
  date_of_birth, gender, blood_group,
  address, city, state, pincode,
  emergency_contact_name, emergency_contact_phone, emergency_contact_relation,
  medical_certificate_expiry, medical_certificate_verified,
  date_of_joining, experience_years, availability, status,
  total_trips, completed_trips, cancelled_trips,
  average_rating, on_time_percentage, safety_score, total_distance, total_driving_hours,
  violations, accidents
) VALUES
(
  'a1000001-0000-0000-0000-000000000001', 'DRV-001', 'Rajesh', 'Kumar', '+919876501001', 'rajesh.kumar@vrl.in',
  'MH012019001234', '2027-04-15', 'HMV', '2019-04-15', 'RTO Mumbai Central', true,
  '1985-03-12', 'Male', 'B+',
  '14, Andheri East, Near Saki Naka', 'Mumbai', 'Maharashtra', '400072',
  'Sunita Kumar', '+919876502001', 'Wife',
  '2026-03-10', true,
  '2018-06-01', 8, 'available', 'active',
  312, 301, 11, 4.70, 94.20, 97.50, 142850.00, 2850.00,
  2, 0
),
(
  'a1000001-0000-0000-0000-000000000002', 'DRV-002', 'Gurpreet', 'Singh', '+919876501002', 'gurpreet.singh@safeexpress.in',
  'DL012020005678', '2026-08-20', 'HMV', '2020-08-20', 'RTO Delhi North', true,
  '1982-07-25', 'Male', 'O+',
  'House No 45, Rohini Sector 11', 'Delhi', 'Delhi', '110085',
  'Harpreet Kaur', '+919876502002', 'Wife',
  '2025-07-15', true,
  '2017-03-15', 10, 'on_duty', 'active',
  428, 415, 13, 4.85, 96.50, 98.20, 198320.00, 3965.00,
  1, 0
),
(
  'a1000001-0000-0000-0000-000000000003', 'DRV-003', 'Amit', 'Patel', '+919876501003', 'amit.patel@tci.in',
  'KA032021009101', '2028-02-10', 'HMV', '2021-02-10', 'RTO Bengaluru North', true,
  '1990-11-08', 'Male', 'A+',
  '78, 5th Cross, Rajajinagar', 'Bengaluru', 'Karnataka', '560010',
  'Kavita Patel', '+919876502003', 'Wife',
  '2026-12-20', true,
  '2020-01-10', 6, 'available', 'active',
  198, 191, 7, 4.60, 92.90, 96.80, 89420.00, 1788.00,
  3, 0
),
(
  'a1000001-0000-0000-0000-000000000004', 'DRV-004', 'Suresh', 'Sharma', '+919876501004', 'suresh.sharma@vrl.in',
  'RJ142018004567', '2025-11-30', 'HMV', '2018-11-30', 'RTO Jaipur', true,
  '1978-05-20', 'Male', 'AB+',
  '22, Vaishali Nagar, Near Pink City Mall', 'Jaipur', 'Rajasthan', '302021',
  'Rekha Sharma', '+919876502004', 'Wife',
  '2025-10-05', true,
  '2016-09-01', 12, 'resting', 'active',
  512, 495, 17, 4.75, 95.10, 97.80, 231560.00, 4631.00,
  2, 1
),
(
  'a1000001-0000-0000-0000-000000000005', 'DRV-005', 'Vijay', 'Yadav', '+919876501005', 'vijay.yadav@safeexpress.in',
  'UP322019008765', '2027-06-15', 'HMV', '2019-06-15', 'RTO Lucknow', true,
  '1988-01-15', 'Male', 'B-',
  '156, Gomti Nagar Extension', 'Lucknow', 'Uttar Pradesh', '226010',
  'Priya Yadav', '+919876502005', 'Wife',
  '2026-05-28', true,
  '2019-02-14', 7, 'available', 'active',
  256, 248, 8, 4.55, 91.80, 95.60, 115800.00, 2316.00,
  4, 0
),
(
  'a1000001-0000-0000-0000-000000000006', 'DRV-006', 'Mohan', 'Reddy', '+919876501006', 'mohan.reddy@tci.in',
  'TN012020003214', '2026-03-20', 'HMV', '2020-03-20', 'RTO Chennai Central', true,
  '1983-09-30', 'Male', 'O-',
  '45, Anna Nagar West, 3rd Avenue', 'Chennai', 'Tamil Nadu', '600040',
  'Lakshmi Reddy', '+919876502006', 'Mother',
  '2025-02-14', false,
  '2018-07-20', 9, 'leave', 'active',
  380, 365, 15, 4.65, 93.40, 96.20, 171000.00, 3420.00,
  3, 0
),
(
  'a1000001-0000-0000-0000-000000000007', 'DRV-007', 'Arjun', 'Nair', '+919876501007', 'arjun.nair@vrl.in',
  'KL012021007890', '2028-09-05', 'HMV', '2021-09-05', 'RTO Kochi', true,
  '1992-04-22', 'Male', 'A-',
  '12, MG Road, Near Ernakulam Junction', 'Kochi', 'Kerala', '682011',
  'Anjali Nair', '+919876502007', 'Wife',
  '2027-08-30', true,
  '2021-01-05', 5, 'available', 'active',
  145, 140, 5, 4.80, 96.55, 98.90, 65250.00, 1305.00,
  1, 0
),
(
  'a1000001-0000-0000-0000-000000000008', 'DRV-008', 'Deepak', 'Gupta', '+919876501008', 'deepak.gupta@safeexpress.in',
  'MH042017002345', '2025-05-10', 'HMV', '2017-05-10', 'RTO Pune', true,
  '1975-12-18', 'Male', 'B+',
  '89, Kothrud, Near Karve Road', 'Pune', 'Maharashtra', '411038',
  'Meena Gupta', '+919876502008', 'Wife',
  '2024-04-22', false,
  '2015-04-01', 13, 'available', 'suspended',
  498, 471, 27, 3.90, 82.50, 78.40, 224100.00, 4482.00,
  8, 2
),
(
  'a1000001-0000-0000-0000-000000000009', 'DRV-009', 'Ramesh', 'Tiwari', '+919876501009', 'ramesh.tiwari@tci.in',
  'MP092019006543', '2027-01-25', 'HMV', '2019-01-25', 'RTO Bhopal', true,
  '1986-08-14', 'Male', 'AB-',
  '34, Arera Colony, Block E', 'Bhopal', 'Madhya Pradesh', '462016',
  'Savitri Tiwari', '+919876502009', 'Wife',
  '2026-12-10', true,
  '2019-03-18', 7, 'training', 'active',
  234, 228, 6, 4.50, 90.60, 94.30, 105300.00, 2106.00,
  5, 0
),
(
  'a1000001-0000-0000-0000-000000000010', 'DRV-010', 'Santosh', 'Mishra', '+919876501010', 'santosh.mishra@vrl.in',
  'WB202018005432', '2026-07-12', 'HMV', '2018-07-12', 'RTO Kolkata North', true,
  '1980-02-28', 'Male', 'O+',
  '67, Salt Lake City, Sector 3', 'Kolkata', 'West Bengal', '700091',
  'Mamata Mishra', '+919876502010', 'Wife',
  '2026-06-20', true,
  '2017-11-10', 9, 'on_duty', 'active',
  367, 351, 16, 4.62, 92.10, 95.90, 165150.00, 3303.00,
  3, 1
),
(
  'a1000001-0000-0000-0000-000000000011', 'DRV-011', 'Naresh', 'Rao', '+919876501011', 'naresh.rao@safeexpress.in',
  'AP072021001122', '2028-04-18', 'HMV', '2021-04-18', 'RTO Hyderabad', true,
  '1991-06-11', 'Male', 'A+',
  '23, KPHB Colony, Phase 7', 'Hyderabad', 'Telangana', '500072',
  'Padma Rao', '+919876502011', 'Mother',
  '2027-03-25', true,
  '2020-08-20', 6, 'available', 'active',
  178, 172, 6, 4.72, 93.82, 97.10, 80100.00, 1602.00,
  2, 0
),
(
  'a1000001-0000-0000-0000-000000000012', 'DRV-012', 'Harish', 'Joshi', '+919876501012', 'harish.joshi@tci.in',
  'GJ012020008901', '2027-11-08', 'HMV', '2020-11-08', 'RTO Ahmedabad', true,
  '1984-10-05', 'Male', 'B+',
  '101, Satellite Area, Judges Bungalow Road', 'Ahmedabad', 'Gujarat', '380015',
  'Hema Joshi', '+919876502012', 'Wife',
  '2026-10-15', true,
  '2018-12-01', 8, 'available', 'active',
  298, 287, 11, 4.68, 94.00, 96.50, 134100.00, 2682.00,
  2, 0
),
(
  'a1000001-0000-0000-0000-000000000013', 'DRV-013', 'Mahesh', 'Verma', '+919876501013', 'mahesh.verma@vrl.in',
  'HR192019003456', '2026-12-28', 'HMV', '2019-12-28', 'RTO Gurugram', true,
  '1987-03-17', 'Male', 'O+',
  '56, DLF Phase 2, Sector 25', 'Gurugram', 'Haryana', '122002',
  'Pooja Verma', '+919876502013', 'Wife',
  '2025-11-20', true,
  '2019-05-15', 7, 'resting', 'active',
  242, 234, 8, 4.58, 91.32, 94.80, 108900.00, 2178.00,
  4, 0
),
(
  'a1000001-0000-0000-0000-000000000014', 'DRV-014', 'Pradeep', 'Srivastava', '+919876501014', 'pradeep.sriv@safeexpress.in',
  'UP142016007654', '2024-09-15', 'HMV', '2016-09-15', 'RTO Varanasi', true,
  '1976-11-22', 'Male', 'AB+',
  '78, Sigra, Near BHU', 'Varanasi', 'Uttar Pradesh', '221010',
  'Asha Srivastava', '+919876502014', 'Wife',
  '2024-08-10', false,
  '2014-02-20', 14, 'unavailable', 'inactive',
  612, 580, 32, 4.20, 86.60, 83.50, 275400.00, 5508.00,
  9, 2
),
(
  'a1000001-0000-0000-0000-000000000015', 'DRV-015', 'Balbir', 'Chauhan', '+919876501015', 'balbir.chauhan@tci.in',
  'PB102022004321', '2029-03-22', 'HMV', '2022-03-22', 'RTO Ludhiana', true,
  '1993-08-30', 'Male', 'B+',
  '34, Model Town, Phase 1', 'Ludhiana', 'Punjab', '141002',
  'Simran Chauhan', '+919876502015', 'Wife',
  '2028-02-14', true,
  '2022-04-01', 4, 'available', 'active',
  98, 95, 3, 4.88, 97.96, 99.00, 44100.00, 882.00,
  0, 0
),
(
  'a1000001-0000-0000-0000-000000000016', 'DRV-016', 'Sunil', 'Das', '+919876501016', 'sunil.das@vrl.in',
  'OD152020009876', '2027-08-14', 'HMV', '2020-08-14', 'RTO Bhubaneswar', true,
  '1989-02-05', 'Male', 'O-',
  '12, Saheed Nagar, Near Bhubaneswar Railway Station', 'Bhubaneswar', 'Odisha', '751007',
  'Rina Das', '+919876502016', 'Wife',
  '2026-07-28', true,
  '2020-09-10', 6, 'on_duty', 'active',
  189, 182, 7, 4.55, 92.06, 95.80, 85050.00, 1701.00,
  3, 0
),
(
  'a1000001-0000-0000-0000-000000000017', 'DRV-017', 'Kishore', 'Pandey', '+919876501017', 'kishore.pandey@safeexpress.in',
  'UP252018006789', '2026-05-30', 'HMV', '2018-05-30', 'RTO Allahabad', true,
  '1981-07-19', 'Male', 'A-',
  '45, Civil Lines, Near High Court', 'Prayagraj', 'Uttar Pradesh', '211001',
  'Geeta Pandey', '+919876502017', 'Wife',
  '2025-04-22', true,
  '2017-08-25', 9, 'available', 'active',
  334, 320, 14, 4.48, 90.12, 93.40, 150300.00, 3006.00,
  6, 1
),
(
  'a1000001-0000-0000-0000-000000000018', 'DRV-018', 'Dinesh', 'Pal', '+919876501018', 'dinesh.pal@tci.in',
  'CG082021002134', '2028-06-25', 'HMV', '2021-06-25', 'RTO Raipur', true,
  '1994-12-08', 'Male', 'B-',
  '23, Shankar Nagar, Near Medical College', 'Raipur', 'Chhattisgarh', '492001',
  'Sunita Pal', '+919876502018', 'Mother',
  '2027-05-15', true,
  '2021-07-15', 5, 'available', 'active',
  112, 108, 4, 4.78, 96.43, 98.20, 50400.00, 1008.00,
  1, 0
),
(
  'a1000001-0000-0000-0000-000000000019', 'DRV-019', 'Rajan', 'Pillai', '+919876501019', 'rajan.pillai@vrl.in',
  'KL042019005678', '2026-10-18', 'HMV', '2019-10-18', 'RTO Thiruvananthapuram', true,
  '1985-04-14', 'Male', 'AB-',
  '67, Kowdiar, Near Raj Bhavan', 'Thiruvananthapuram', 'Kerala', '695003',
  'Sheela Pillai', '+919876502019', 'Wife',
  '2025-09-30', false,
  '2018-11-20', 8, 'leave', 'active',
  278, 267, 11, 4.52, 90.65, 94.10, 125100.00, 2502.00,
  4, 0
),
(
  'a1000001-0000-0000-0000-000000000020', 'DRV-020', 'Arun', 'Malik', '+919876501020', 'arun.malik@safeexpress.in',
  'DL072022003456', '2029-07-20', 'HMV', '2022-07-20', 'RTO Delhi South', true,
  '1995-09-25', 'Male', 'O+',
  '89, Vasant Kunj, Sector C', 'Delhi', 'Delhi', '110070',
  'Neha Malik', '+919876502020', 'Sister',
  '2028-06-14', true,
  '2022-08-01', 4, 'available', 'active',
  87, 84, 3, 4.92, 98.85, 99.50, 39150.00, 783.00,
  0, 0
)
ON CONFLICT (employee_id) DO NOTHING;

-- Add driver documents for a few drivers
INSERT INTO driver_documents (driver_id, document_type, document_number, issue_date, expiry_date, issuing_authority, status, verified, notes) VALUES
('a1000001-0000-0000-0000-000000000001', 'driving_license', 'MH012019001234', '2019-04-15', '2027-04-15', 'RTO Mumbai Central', 'active', true, 'HMV License - Verified'),
('a1000001-0000-0000-0000-000000000001', 'medical_certificate', 'MED-2024-001234', '2024-03-10', '2026-03-10', 'Dr. Sharma Hospital Mumbai', 'active', true, 'Fitness A1'),
('a1000001-0000-0000-0000-000000000001', 'government_id', 'AADHAAR-1234-5678', '2015-06-01', NULL, 'UIDAI', 'active', true, 'Aadhaar Card Verified'),
('a1000001-0000-0000-0000-000000000002', 'driving_license', 'DL012020005678', '2020-08-20', '2026-08-20', 'RTO Delhi North', 'active', true, 'HMV License - Verified'),
('a1000001-0000-0000-0000-000000000002', 'medical_certificate', 'MED-2024-002345', '2024-07-15', '2025-07-15', 'Apollo Hospital Delhi', 'expiring_soon', true, 'Expiring in 90 days'),
('a1000001-0000-0000-0000-000000000003', 'driving_license', 'KA032021009101', '2021-02-10', '2028-02-10', 'RTO Bengaluru North', 'active', true, 'HMV License - Verified'),
('a1000001-0000-0000-0000-000000000004', 'driving_license', 'RJ142018004567', '2018-11-30', '2025-11-30', 'RTO Jaipur', 'expiring_soon', true, 'Expiring within 6 months'),
('a1000001-0000-0000-0000-000000000005', 'driving_license', 'UP322019008765', '2019-06-15', '2027-06-15', 'RTO Lucknow', 'active', true, 'Verified'),
('a1000001-0000-0000-0000-000000000008', 'driving_license', 'MH042017002345', '2017-05-10', '2025-05-10', 'RTO Pune', 'expiring_soon', true, 'Suspension under review')
ON CONFLICT DO NOTHING;
