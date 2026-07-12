/**
 * TransitOps Phase 5 - Integration Test Suite
 * Tests all 6 business workflows and validates API response integrity.
 * Run: node tests/integration/run-tests.js
 */

const http = require('http');
const https = require('https');

const BASE_URL = 'http://localhost:5000/api/v1';
let TOKEN = '';
let userId = '';
let roleId = '';
let vehicleId = '';
let driverId = '';
let tripId = '';
let maintenanceId = '';
let expenseId = '';

const colors = {
  green: '\x1b[32m',
  red:   '\x1b[31m',
  yellow:'\x1b[33m',
  cyan:  '\x1b[36m',
  reset: '\x1b[0m',
  bold:  '\x1b[1m',
};

let passed = 0;
let failed = 0;
const results = [];

async function req(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${BASE_URL}${path}`);
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname: url.hostname,
      port:     url.port || 80,
      path:     url.pathname + url.search,
      method:   method,
      headers:  {
        'Content-Type': 'application/json',
        ...(token || TOKEN ? { 'Authorization': `Bearer ${token || TOKEN}` } : {}),
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {})
      }
    };

    const reqFn = url.protocol === 'https:' ? https.request : http.request;
    const request = reqFn(options, (res) => {
      let raw = '';
      res.on('data', (chunk) => { raw += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(raw) });
        } catch {
          resolve({ status: res.statusCode, body: raw });
        }
      });
    });

    request.on('error', reject);
    if (data) request.write(data);
    request.end();
  });
}

function assert(label, condition, detail = '') {
  if (condition) {
    passed++;
    results.push({ label, ok: true });
    console.log(`  ${colors.green}✓${colors.reset} ${label}`);
  } else {
    failed++;
    results.push({ label, ok: false, detail });
    console.log(`  ${colors.red}✗${colors.reset} ${label} ${detail ? colors.yellow + '→ ' + detail + colors.reset : ''}`);
  }
}

async function section(title, fn) {
  console.log(`\n${colors.bold}${colors.cyan}[ ${title} ]${colors.reset}`);
  await fn();
}

async function run() {
  console.log(`\n${colors.bold}TransitOps Integration Test Suite${colors.reset}`);
  console.log('='.repeat(50));

  // ============================================================
  // WORKFLOW 1: Authentication
  // ============================================================
  await section('WORKFLOW 1: Authentication', async () => {
    // Health Check
    const health = await req('GET', '/../../health');
    assert('Health endpoint returns 200', health.status === 200);

    // Login with admin credentials
    const login = await req('POST', '/auth/login', {
      email: 'admin@transitops.com',
      password: 'Password123'
    });
    assert('Admin login returns 200', login.status === 200);
    assert('Login response has accessToken', !!login.body?.data?.accessToken);
    TOKEN = login.body?.data?.accessToken || '';

    // Get current user
    if (TOKEN) {
      const me = await req('GET', '/auth/me');
      assert('GET /auth/me returns 200', me.status === 200);
      assert('User data has email', !!me.body?.data?.email);
      userId = me.body?.data?.id;
    }
  });

  // ============================================================
  // WORKFLOW 2: Dashboard
  // ============================================================
  await section('WORKFLOW 2: Dashboard & KPIs', async () => {
    const stats = await req('GET', '/dashboard/stats');
    assert('Dashboard stats return 200', stats.status === 200);
    assert('Stats have total_vehicles', stats.body?.data?.total_vehicles !== undefined);
    assert('Stats have total_drivers', stats.body?.data?.total_drivers !== undefined);
    assert('Stats have active_trips', stats.body?.data?.active_trips !== undefined);
  });

  // ============================================================
  // WORKFLOW 3: User & Role Management
  // ============================================================
  await section('WORKFLOW 3: Users & Roles', async () => {
    const usersRes = await req('GET', '/users');
    assert('GET /users returns 200', usersRes.status === 200);
    assert('Users list is an array', Array.isArray(usersRes.body?.data));

    const rolesRes = await req('GET', '/roles');
    assert('GET /roles returns 200', rolesRes.status === 200);
    assert('Roles list is an array', Array.isArray(rolesRes.body?.data));
    roleId = rolesRes.body?.data?.[0]?.id;
  });

  // ============================================================
  // WORKFLOW 4: Vehicles
  // ============================================================
  await section('WORKFLOW 4: Vehicle Management', async () => {
    const vehiclesRes = await req('GET', '/vehicles');
    assert('GET /vehicles returns 200', vehiclesRes.status === 200);

    const fleetStats = await req('GET', '/fleet/availability');
    assert('Fleet availability returns 200', fleetStats.status === 200);
    assert('Fleet stats have total_vehicles', fleetStats.body?.data?.total_vehicles !== undefined);

    const availVehicles = await req('GET', '/fleet/available');
    assert('Available vehicles endpoint returns 200', availVehicles.status === 200);
    assert('Available vehicles is array', Array.isArray(availVehicles.body?.data));

    // Use first available vehicle if present
    vehicleId = availVehicles.body?.data?.[0]?.id || '';
  });

  // ============================================================
  // WORKFLOW 5: Drivers
  // ============================================================
  await section('WORKFLOW 5: Driver Management', async () => {
    const driversRes = await req('GET', '/drivers');
    assert('GET /drivers returns 200', driversRes.status === 200);
    assert('Drivers list is an array', Array.isArray(driversRes.body?.data));
    driverId = driversRes.body?.data?.[0]?.id || '';

    if (driverId) {
      const driverDetail = await req('GET', `/drivers/${driverId}`);
      assert('GET /drivers/:id returns 200', driverDetail.status === 200);
      assert('Driver detail has license_number', !!driverDetail.body?.data?.license_number);
    }
  });

  // ============================================================
  // WORKFLOW 6: Trips CRUD + Status Changes
  // ============================================================
  await section('WORKFLOW 6: Trip Lifecycle', async () => {
    const tripsRes = await req('GET', '/trips');
    assert('GET /trips returns 200', tripsRes.status === 200);
    assert('Trips list is an array', Array.isArray(tripsRes.body?.data));
    tripId = tripsRes.body?.data?.[0]?.id || '';

    if (tripId) {
      const tripDetail = await req('GET', `/trips/${tripId}`);
      assert('GET /trips/:id returns 200', tripDetail.status === 200);
      assert('Trip has status field', !!tripDetail.body?.data?.status);
    }

    // Validation test – attempt trip with missing fields
    const badTrip = await req('POST', '/trips', { origin: 'Mumbai' });
    assert('POST /trips with missing fields returns 400', badTrip.status === 400 || badTrip.status === 422);
  });

  // ============================================================
  // WORKFLOW 7: Maintenance
  // ============================================================
  await section('WORKFLOW 7: Maintenance', async () => {
    const maintRes = await req('GET', '/maintenance');
    assert('GET /maintenance returns 200', maintRes.status === 200);

    const dashRes = await req('GET', '/maintenance/dashboard');
    assert('GET /maintenance/dashboard returns 200', dashRes.status === 200);

    const calRes = await req('GET', '/maintenance/calendar');
    assert('GET /maintenance/calendar returns 200', calRes.status === 200);
    maintenanceId = maintRes.body?.data?.[0]?.id || '';
  });

  // ============================================================
  // WORKFLOW 8: Fuel Management
  // ============================================================
  await section('WORKFLOW 8: Fuel Logging', async () => {
    const fuelRes = await req('GET', '/fuel');
    assert('GET /fuel returns 200', fuelRes.status === 200);

    const dashRes = await req('GET', '/fuel/dashboard');
    assert('GET /fuel/dashboard returns 200', dashRes.status === 200);
    assert('Fuel dashboard has total_fuel_cost', dashRes.body?.data?.total_fuel_cost !== undefined);

    const analyticsRes = await req('GET', '/fuel/analytics');
    assert('GET /fuel/analytics returns 200', analyticsRes.status === 200);

    // Validation test – missing required fields
    const badFuel = await req('POST', '/fuel', { notes: 'test only' });
    assert('POST /fuel with missing fields returns 400', badFuel.status === 400 || badFuel.status === 422);
  });

  // ============================================================
  // WORKFLOW 9: Expenses
  // ============================================================
  await section('WORKFLOW 9: Expense Management', async () => {
    const expRes = await req('GET', '/expenses');
    assert('GET /expenses returns 200', expRes.status === 200);

    const dashRes = await req('GET', '/expenses/dashboard');
    assert('GET /expenses/dashboard returns 200', dashRes.status === 200);
    expenseId = expRes.body?.data?.[0]?.id || '';
  });

  // ============================================================
  // WORKFLOW 10: Notifications
  // ============================================================
  await section('WORKFLOW 10: Notification Center', async () => {
    const notifRes = await req('GET', '/notifications');
    assert('GET /notifications returns 200', notifRes.status === 200);
    assert('Notifications is array', Array.isArray(notifRes.body?.data));

    // Mark all as read
    const markAll = await req('PATCH', '/notifications/read-all');
    assert('PATCH /notifications/read-all returns 200', markAll.status === 200);
  });

  // ============================================================
  // WORKFLOW 11: Reports & Analytics
  // ============================================================
  await section('WORKFLOW 11: Reports & Analytics', async () => {
    const fleetRpt = await req('GET', '/reports/fleet');
    assert('GET /reports/fleet returns 200', fleetRpt.status === 200);

    const driverRpt = await req('GET', '/reports/drivers');
    assert('GET /reports/drivers returns 200', driverRpt.status === 200);

    const tripRpt = await req('GET', '/reports/trips');
    assert('GET /reports/trips returns 200', tripRpt.status === 200);

    const analytics = await req('GET', '/analytics/dashboard');
    assert('GET /analytics/dashboard returns 200', analytics.status === 200);
    assert('Analytics has fleet_utilization', analytics.body?.data?.fleet_utilization !== undefined);
  });

  // ============================================================
  // SECURITY: Unauthorized Access Tests
  // ============================================================
  await section('SECURITY: Unauthorized Access', async () => {
    const protectedReqs = ['/users', '/drivers', '/trips', '/maintenance', '/expenses', '/fuel', '/notifications'];
    for (const path of protectedReqs) {
      const res = await req('GET', path, null, 'invalid-token');
      assert(`${path} rejects invalid token with 401`, res.status === 401);
    }
  });

  // ============================================================
  // FINAL REPORT
  // ============================================================
  const total = passed + failed;
  console.log('\n' + '='.repeat(50));
  console.log(`${colors.bold}RESULTS: ${passed}/${total} tests passed${colors.reset}`);
  if (failed > 0) {
    console.log(`${colors.red}${failed} test(s) FAILED${colors.reset}`);
    results.filter(r => !r.ok).forEach(r => console.log(`  - ${r.label}`));
  } else {
    console.log(`${colors.green}All tests passed! ✓${colors.reset}`);
  }
  const score = Math.round((passed / total) * 100);
  console.log(`\nProduction Readiness Score: ${score}%`);
  console.log('='.repeat(50) + '\n');
  process.exit(failed > 0 ? 1 : 0);
}

run().catch(console.error);
