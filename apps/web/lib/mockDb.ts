// TransitOps Centralized Mock Database
// Programmatically generates 100+ realistic transport operations records

// Helper to generate UUIDs
const uuid = () =>
  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

// Realistic Fleet configurations
const truckModels = [
  { make: 'Freightliner', model: 'Cascadia', capacity: 44000, fuelCap: 120, mpg: 6.8 },
  { make: 'Peterbilt', model: '579', capacity: 40000, fuelCap: 150, mpg: 6.5 },
  { make: 'Volvo', model: 'VNL 860', capacity: 42000, fuelCap: 130, mpg: 7.2 },
  { make: 'Kenworth', model: 'T680', capacity: 45000, fuelCap: 140, mpg: 6.9 },
  { make: 'Mack', model: 'Anthem', capacity: 41000, fuelCap: 120, mpg: 6.7 },
];

const driverNames = [
  { first: 'Marcus', last: 'Vance', phone: '(404) 555-0143', email: 'marcus.vance@transitops.com' },
  { first: 'Ronald', last: 'Jenkins', phone: '(312) 555-0192', email: 'r.jenkins@transitops.com' },
  { first: 'Elena', last: 'Rostova', phone: '(718) 555-0211', email: 'e.rostova@transitops.com' },
  { first: 'David', last: 'Kim', phone: '(213) 555-0245', email: 'david.kim@transitops.com' },
  { first: 'Sarah', last: 'Alvarez', phone: '(305) 555-0288', email: 's.alvarez@transitops.com' },
  {
    first: 'Douglas',
    last: 'Miller',
    phone: '(617) 555-0322',
    email: 'doug.miller@transitops.com',
  },
  { first: 'Amir', last: 'Hassan', phone: '(713) 555-0367', email: 'amir.hassan@transitops.com' },
  { first: 'Tanya', last: 'Grover', phone: '(206) 555-0419', email: 't.grover@transitops.com' },
];

const cities = [
  'Atlanta, GA',
  'Chicago, IL',
  'Dallas, TX',
  'Los Angeles, CA',
  'Miami, FL',
  'Seattle, WA',
  'Houston, TX',
  'Boston, MA',
  'Denver, CO',
  'Phoenix, AZ',
  'Charlotte, NC',
  'Nashville, TN',
];

// Generate Vehicles (50 records)
export const vehicles = Array.from({ length: 50 }).map((_, index) => {
  const modelConfig = truckModels[index % truckModels.length];
  const year = 2018 + (index % 6);
  const status = index === 5 ? 'maintenance' : index % 12 === 0 ? 'inactive' : 'active';
  const id = `veh-${1000 + index}`;
  return {
    id,
    plate_number: `TX-${10000 + index * 17}`,
    make: modelConfig.make,
    model: modelConfig.model,
    year,
    vin: `1FVACWDB${index * 3}EH${100000 + index}`,
    status,
    payload_capacity_lbs: modelConfig.capacity,
    fuel_capacity_gal: modelConfig.fuelCap,
    average_mpg: modelConfig.mpg,
    current_mileage: 120000 + index * 4521,
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
    license_number: `CDL-${88000 + index * 13}`,
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
  const revenue = 1200 + (index % 15) * 220;
  const status =
    index < 3 ? 'in_progress' : index < 6 ? 'scheduled' : index === 8 ? 'cancelled' : 'completed';
  const startTime = new Date(Date.now() - (index % 20) * 24 * 60 * 60 * 1000);
  const endTime =
    status === 'completed' ? new Date(startTime.getTime() + 8 * 60 * 60 * 1000) : null;

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
    end_odometer: status === 'completed' ? vehicle.current_mileage - 1200 + index * 10 + 350 : null,
    distance_miles: status === 'completed' ? 350 + (index % 5) * 50 : 0,
    revenue,
  };
});

// Generate Fuel Logs (100 records)
export const fuelLogs = Array.from({ length: 100 }).map((_, index) => {
  const vehicle = vehicles[index % vehicles.length];
  const driver = drivers[index % drivers.length];
  const gallons = 80 + (index % 10) * 5;
  const cost = Number((gallons * (3.15 + (index % 5) * 0.12)).toFixed(2));

  return {
    id: `fuel-${6000 + index}`,
    vehicle_id: vehicle.id,
    vehicle_plate: vehicle.plate_number,
    driver_id: driver.id,
    driver_name: `${driver.first_name} ${driver.last_name}`,
    refuel_date: new Date(Date.now() - (index % 30) * 24 * 60 * 60 * 1000).toISOString(),
    gallons,
    cost,
    odometer: vehicle.current_mileage - 3000 + index * 25,
    station_name: index % 2 === 0 ? 'Loves Travel Stop' : 'Pilot Flying J',
    receipt_number: `REC-${80000 + index * 9}`,
  };
});

// Generate Maintenance Records (50 records)
export const maintenance = Array.from({ length: 50 }).map((_, index) => {
  const vehicle = vehicles[index % vehicles.length];
  const cost = 250 + (index % 10) * 180;
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
    service_center: 'Speedy Fleet Maintenance Services',
  };
});

// Generate Expenses (100 records)
const expenseCategories = [
  'Tolls',
  'Driver Lodging',
  'Permits',
  'Scales',
  'Emergency Repairs',
  'Misc',
];
export const expenses = Array.from({ length: 100 }).map((_, index) => {
  const trip = trips[index % trips.length];
  const amount = index % 4 === 0 ? 120 + (index % 5) * 35 : 15 + (index % 6) * 5;
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
    payment_method: index % 2 === 0 ? 'Fleet Card' : 'Reimbursement',
    status,
  };
});

// Settings configuration mockup
export const settings = [
  { key: 'company_name', value: 'Apex Logistics Operations Inc.', group: 'General' },
  { key: 'timezone', value: 'America/New_York', group: 'General' },
  { key: 'currency', value: 'USD', group: 'General' },
  { key: 'idle_alert_threshold', value: '15', group: 'Alerts' },
  { key: 'speed_alert_threshold', value: '75', group: 'Alerts' },
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
