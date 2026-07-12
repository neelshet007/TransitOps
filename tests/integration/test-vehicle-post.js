const http = require('http');

const data = JSON.stringify({
  plate_number: 'MH-12-Q-9999',
  make: 'Tata',
  model: 'Signa',
  year: 2023,
  vin: 'MBL12TATA99EH100000',
  status: 'active'
});

const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/v1/vehicles',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, (res) => {
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => {
    console.log('STATUS:', res.statusCode);
    console.log('RESPONSE:', body);
  });
});

req.write(data);
req.end();
