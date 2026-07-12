// TransitOps Centralized Mock Database
// Programmatically generates 100+ realistic Indian transport operations records

// Helper to generate UUIDs
const uuid = () =>
  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

// Realistic Indian Fleet configurations
const truckModels = [
  { make: 'Tata', model: 'Signa 4825.T', capacity: 48000, fuelCap: 300, mpg: 4.2 },
  { make: 'Ashok Leyland', model: 'Ecomet 1615', capacity: 16000, fuelCap: 185, mpg: 5.5 },
  { make: 'Mahindra', model: 'Blazo X 49', capacity: 49000, fuelCap: 415, mpg: 3.8 },
  { make: 'BharatBenz', model: '3523R', capacity: 35000, fuelCap: 380, mpg: 4.5 },
  { make: 'Eicher', model: 'Pro 6048', capacity: 48000, fuelCap: 350, mpg: 4.0 },
];

const driverNames = [
  {
    first: 'Rajesh',
    last: 'Kumar',
    phone: '+91 98765 01234',
    email: 'rajesh.kumar@vrl-logistics.com',
  },
  {
    first: 'Gurpreet',
    last: 'Singh',
    phone: '+91 98765 05678',
    email: 'gurpreet.s@vrl-logistics.com',
  },
  { first: 'Amit', last: 'Patel', phone: '+91 98765 09012', email: 'amit.patel@vrl-logistics.com' },
  {
    first: 'Suresh',
    last: 'Sharma',
    phone: '+91 98765 03456',
    email: 'suresh.s@vrl-logistics.com',
  },
  {
    first: 'Vijay',
    last: 'Yadav',
    phone: '+91 98765 07890',
    email: 'vijay.yadav@vrl-logistics.com',
  },
  {
    first: 'Harpreet',
    last: 'Brar',
    phone: '+91 98765 02345',
    email: 'harpreet.b@vrl-logistics.com',
  },
  { first: 'Sanjay', last: 'Dutt', phone: '+91 98765 06789', email: 'sanjay.d@vrl-logistics.com' },
  {
    first: 'Praveen',
    last: 'Hegde',
    phone: '+91 98765 01122',
    email: 'praveen.h@vrl-logistics.com',
  },
];

const cities = [
  'Mumbai, MH',
  'Delhi, DL',
  'Bengaluru, KA',
  'Kolkata, WB',
  'Chennai, TN',
  'Pune, MH',
  'Hyderabad, TS',
  'Ahmedabad, GJ',
  'Jaipur, RJ',
  'Lucknow, UP',
  'Chandigarh, CH',
  'Indore, MP',
];

// Generate Vehicles (50 records)
export const vehicles = Array.from({ length: 50 }).map((_, index) => {
  const modelConfig = truckModels[index % truckModels.length];
  const year = 2019 + (index % 6);
  const status = index === 5 ? 'maintenance' : index % 12 === 0 ? 'inactive' : 'active';
  const id = `veh-${1000 + index}`;

  // Indian State Plate codes
  const stateCodes = ['MH-12', 'DL-01', 'KA-03', 'GJ-01', 'HR-55'];
  const stateCode = stateCodes[index % stateCodes.length];

  return {
    id,
    plate_number: `${stateCode}-Q-${1000 + index * 17}`,
    make: modelConfig.make,
    model: modelConfig.model,
    year,
    vin: `MBL12TATA${index * 3}EH${100000 + index}`,
    status,
    payload_capacity_lbs: modelConfig.capacity,
    fuel_capacity_gal: modelConfig.fuelCap,
    average_mpg: modelConfig.mpg,
    current_mileage: 65000 + index * 3210,
    last_service_date: new Date(Date.now() - (index % 30) * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
  };
});

// Generate Drivers (50 records)
export const drivers = Array.from({ length: 50 }).map((_, index) => {
  const driverConfig = driverNames[index % driverNames.length];
  const status = index % 15 === 0 ? 'suspended' : index % 8 === 0 ? 'inactive' : 'active';
  const id = `drv-${2000 + index}`;
  const mappedVehicle = status === 'active' ? vehicles[index % vehicles.length] : null;

  return {
    id,
    first_name: `${driverConfig.first} ${String.fromCharCode(65 + (index % 26))}.`,
    last_name: driverConfig.last,
    email: driverConfig.email.replace('@', `${index}@`),
    phone: driverConfig.phone,
    license_number: `IND-DL-${88000 + index * 13}`,
    license_expiry: new Date(Date.now() + (30 + index * 45) * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    status,
    rating: (4.2 + (index % 9) * 0.1).toFixed(1),
    join_date: new Date(Date.now() - index * 40 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    current_vehicle_id: mappedVehicle ? mappedVehicle.id : null,
    current_vehicle_plate: mappedVehicle ? mappedVehicle.plate_number : 'N/A',
  };
});

// Generate Trips (100 records)
export const trips = Array.from({ length: 100 }).map((_, index) => {
  const vehicle = vehicles[index % vehicles.length];
  const driver = drivers[index % drivers.length];
  const origin = cities[index % cities.length];
  const destination = cities[(index + 3) % cities.length];
  const revenue = 35000 + (index % 15) * 4500; // in INR
  const status =
    index < 3 ? 'in_progress' : index < 6 ? 'scheduled' : index === 8 ? 'cancelled' : 'completed';
  const startTime = new Date(Date.now() - (index % 20) * 24 * 60 * 60 * 1000);
  const endTime =
    status === 'completed' ? new Date(startTime.getTime() + 12 * 60 * 60 * 1000) : null;

  return {
    id: `trp-${5000 + index}`,
    trip_number: `TRP-${10000 + index}`,
    vehicle_id: vehicle.id,
    vehicle_plate: vehicle.plate_number,
    driver_id: driver.id,
    driver_name: `${driver.first_name} ${driver.last_name}`,
    start_time: startTime.toISOString(),
    end_time: endTime ? endTime.toISOString() : null,
    status,
    origin,
    destination,
    start_odometer: vehicle.current_mileage - 1200 + index * 10,
    end_odometer: status === 'completed' ? vehicle.current_mileage - 1200 + index * 10 + 450 : null,
    distance_miles: status === 'completed' ? 450 + (index % 5) * 80 : 0, // in KM actually
    revenue,
  };
});

// Generate Fuel Logs (100 records)
export const fuelLogs = Array.from({ length: 100 }).map((_, index) => {
  const vehicle = vehicles[index % vehicles.length];
  const driver = drivers[index % drivers.length];
  const gallons = 120 + (index % 10) * 15; // in Liters
  const cost = Number((gallons * (92.4 + (index % 5) * 1.5)).toFixed(2)); // in INR

  return {
    id: `fuel-${6000 + index}`,
    vehicle_id: vehicle.id,
    vehicle_plate: vehicle.plate_number,
    driver_id: driver.id,
    driver_name: `${driver.first_name} ${driver.last_name}`,
    refuel_date: new Date(Date.now() - (index % 30) * 24 * 60 * 60 * 1000).toISOString(),
    gallons, // Liters
    cost, // INR
    odometer: vehicle.current_mileage - 3000 + index * 25,
    station_name: index % 2 === 0 ? 'Indian Oil Retail Outlet' : 'Bharat Petroleum Pump',
    receipt_number: `REC-${80000 + index * 9}`,
  };
});

// Generate Maintenance Records (50 records)
export const maintenance = Array.from({ length: 50 }).map((_, index) => {
  const vehicle = vehicles[index % vehicles.length];
  const cost = 4500 + (index % 10) * 2500; // in INR
  const type =
    index % 3 === 0
      ? 'Preventative Maintenance'
      : index % 4 === 0
        ? 'Brake Service'
        : 'Tire Replacement';
  const status = index < 3 ? 'in_progress' : index < 6 ? 'scheduled' : 'completed';

  return {
    id: `maint-${7000 + index}`,
    vehicle_id: vehicle.id,
    vehicle_plate: vehicle.plate_number,
    scheduled_date: new Date(Date.now() + ((index % 15) - 5) * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    completed_date:
      status === 'completed'
        ? new Date(Date.now() - (index % 15) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        : null,
    type,
    status,
    cost,
    notes: `Routine inspection and parts swap matching ${type.toLowerCase()} check list criteria.`,
    service_center: 'Tata Authorized Service Station',
  };
});

// Generate Expenses (100 records)
const expenseCategories = [
  'Tolls',
  'Driver Lodging',
  'State Permits',
  'Scales',
  'Emergency Repairs',
  'Misc',
];
export const expenses = Array.from({ length: 100 }).map((_, index) => {
  const trip = trips[index % trips.length];
  const amount = index % 4 === 0 ? 3500 + (index % 5) * 600 : 450 + (index % 6) * 150; // in INR
  const category = expenseCategories[index % expenseCategories.length];
  const status = index % 10 === 0 ? 'rejected' : index % 8 === 0 ? 'pending' : 'approved';

  return {
    id: `exp-${8000 + index}`,
    trip_id: trip.id,
    trip_number: trip.trip_number,
    vehicle_id: trip.vehicle_id,
    vehicle_plate: trip.vehicle_plate,
    category,
    amount,
    expense_date: new Date(trip.start_time).toISOString().split('T')[0],
    notes: `${category} logged for route ${trip.origin} -> ${trip.destination}`,
    payment_method: index % 2 === 0 ? 'Fastag RFID' : 'Corporate Wallet',
    status,
  };
});

// Settings configuration mockup
export const settings = [
  { key: 'company_name', value: 'VRL Logistics Operations India Inc.', group: 'General' },
  { key: 'timezone', value: 'Asia/Kolkata', group: 'General' },
  { key: 'currency', value: 'INR', group: 'General' },
  { key: 'idle_alert_threshold', value: '15', group: 'Alerts' },
  { key: 'speed_alert_threshold', value: '80', group: 'Alerts' },
  { key: 'jwt_expiration', value: '900', group: 'Security' },
];

// Security Audit Logs
export const auditLogs = Array.from({ length: 50 }).map((_, index) => {
  const actions = [
    'USER_LOGIN',
    'VEHICLE_CREATE',
    'TRIP_DISPATCH',
    'EXPENSE_APPROVE',
    'SETTING_UPDATE',
  ];
  const tables = ['users', 'vehicles', 'trips', 'expenses', 'settings'];
  const user = driverNames[index % driverNames.length];

  return {
    id: uuid(),
    timestamp: new Date(Date.now() - index * 2 * 60 * 60 * 1000).toISOString(),
    user_email: user.email,
    action: actions[index % actions.length],
    entity: tables[index % tables.length],
    ip_address: `192.168.1.${100 + index}`,
    details: `Executed ${actions[index % actions.length]} transaction context.`,
  };
});
