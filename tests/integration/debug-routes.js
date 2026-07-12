const http = require('http');

function makeReq(options, body) {
  return new Promise((resolve) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (c) => { data += c; });
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('error', (e) => resolve({ status: 0, body: e.message }));
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function main() {
  // Login
  const login = await makeReq({
    hostname: 'localhost', port: 5000,
    path: '/api/v1/auth/login', method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { email: 'admin@transitops.com', password: 'Password123' });
  
  const token = login.body?.data?.accessToken;
  console.log('LOGIN:', login.status, token ? '(token received)' : 'NO TOKEN', !token ? JSON.stringify(login.body).slice(0, 200) : '');
  
  if (!token) return;

  const endpoints = [
    '/api/v1/dashboard/stats',
    '/api/v1/fuel',
    '/api/v1/fuel/dashboard',
    '/api/v1/fuel/analytics',
    '/api/v1/notifications',
    '/api/v1/analytics/dashboard',
  ];

  for (const path of endpoints) {
    const res = await makeReq({
      hostname: 'localhost', port: 5000,
      path, method: 'GET',
      headers: { Authorization: 'Bearer ' + token }
    });
    const summary = res.body?.success ? 'OK' : JSON.stringify(res.body).slice(0, 150);
    console.log(`${res.status} ${path} - ${summary}`);
  }
}

main().catch(console.error);
