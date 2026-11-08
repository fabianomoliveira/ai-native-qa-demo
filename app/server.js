// YardBook — a tiny lawn-care booking app used as the system under test.
// Zero dependencies: node:http only. Set BUGGY=1 to inject a known defect
// (past dates accepted) so we can prove the test suite actually catches bugs.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');

const PORT = Number(process.env.PORT || 3000);
const BUGGY = process.env.BUGGY === '1';

const SERVICES = [
  { id: 'mow', name: 'Lawn mowing', priceUsd: 45 },
  { id: 'leaf', name: 'Leaf removal', priceUsd: 120 },
  { id: 'aerate', name: 'Aeration', priceUsd: 90 },
];

const bookings = new Map();

function json(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function validateBooking(input) {
  const errors = [];
  if (!input || typeof input !== 'object') return ['Body must be a JSON object'];
  const { address, serviceId, date } = input;
  if (typeof address !== 'string' || address.trim().length < 5) errors.push('address must be at least 5 characters');
  if (!SERVICES.some((s) => s.id === serviceId)) errors.push('serviceId is not a known service');
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) errors.push('date must be YYYY-MM-DD');
  else if (!BUGGY && date < today()) errors.push('date cannot be in the past');
  return errors;
}

function readBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (c) => (data += c));
    req.on('end', () => {
      try { resolve(JSON.parse(data || 'null')); } catch { resolve(undefined); }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'GET' && url.pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    return res.end(fs.readFileSync(path.join(__dirname, 'index.html')));
  }
  if (req.method === 'GET' && url.pathname === '/api/services') return json(res, 200, SERVICES);

  if (req.method === 'POST' && url.pathname === '/api/bookings') {
    const body = await readBody(req);
    const errors = validateBooking(body);
    if (errors.length) return json(res, 422, { errors });
    const service = SERVICES.find((s) => s.id === body.serviceId);
    const booking = {
      id: randomUUID(),
      address: body.address.trim(),
      serviceId: service.id,
      serviceName: service.name,
      priceUsd: service.priceUsd,
      date: body.date,
      status: 'confirmed',
    };
    bookings.set(booking.id, booking);
    return json(res, 201, booking);
  }

  const match = url.pathname.match(/^\/api\/bookings\/([\w-]+)(\/cancel)?$/);
  if (match) {
    const booking = bookings.get(match[1]);
    if (!booking) return json(res, 404, { errors: ['booking not found'] });
    if (req.method === 'GET' && !match[2]) return json(res, 200, booking);
    if (req.method === 'POST' && match[2]) {
      if (booking.status === 'cancelled') return json(res, 409, { errors: ['booking already cancelled'] });
      booking.status = 'cancelled';
      return json(res, 200, booking);
    }
  }

  json(res, 404, { errors: ['not found'] });
});

server.listen(PORT, () => console.log(`YardBook running on http://localhost:${PORT}${BUGGY ? ' (BUGGY mode)' : ''}`));
