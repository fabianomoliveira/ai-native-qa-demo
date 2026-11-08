import { test, expect } from '@playwright/test';
import Ajv from 'ajv';
import { bookingSchema, errorSchema, serviceSchema } from './booking.schema';
import { validBooking } from '../support/data';

const ajv = new Ajv({ allErrors: true });

function expectToMatch(schema: object, payload: unknown) {
  const validate = ajv.compile(schema);
  const ok = validate(payload);
  expect(ok, ajv.errorsText(validate.errors)).toBe(true);
}

test.describe('API contract', () => {
  test('GET /api/services returns the service shape the UI renders', async ({ request }) => {
    const res = await request.get('/api/services');
    expect(res.status()).toBe(200);
    const services = await res.json();
    expect(services.length).toBeGreaterThan(0);
    for (const s of services) expectToMatch(serviceSchema, s);
  });

  test('POST /api/bookings success body matches the booking contract', async ({ request }) => {
    const res = await request.post('/api/bookings', { data: validBooking() });
    expect(res.status()).toBe(201);
    expectToMatch(bookingSchema, await res.json());
  });

  test('validation errors use the shared error envelope', async ({ request }) => {
    const res = await request.post('/api/bookings', { data: {} });
    expect(res.status()).toBe(422);
    expectToMatch(errorSchema, await res.json());
  });
});
