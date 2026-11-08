import { test, expect } from '@playwright/test';
import { isoDate, validBooking } from '../support/data';

test.describe('Bookings API', () => {
  test('creates a booking and returns price from the service catalog', async ({ request }) => {
    const res = await request.post('/api/bookings', { data: validBooking({ serviceId: 'leaf' }) });
    expect(res.status()).toBe(201);
    const booking = await res.json();
    expect(booking).toMatchObject({ serviceId: 'leaf', priceUsd: 120, status: 'confirmed' });

    const fetched = await request.get(`/api/bookings/${booking.id}`);
    expect(fetched.status()).toBe(200);
    expect(await fetched.json()).toEqual(booking);
  });

  test('accepts a booking for today (boundary)', async ({ request }) => {
    const res = await request.post('/api/bookings', { data: validBooking({ date: isoDate(0) }) });
    expect(res.status()).toBe(201);
  });

  const invalidCases = [
    { name: 'past date', data: validBooking({ date: isoDate(-1) }), error: 'date cannot be in the past' },
    { name: 'malformed date', data: validBooking({ date: '07/11/2026' }), error: 'date must be YYYY-MM-DD' },
    { name: 'unknown service', data: validBooking({ serviceId: 'pool' }), error: 'serviceId is not a known service' },
    { name: 'short address', data: validBooking({ address: 'Oak' }), error: 'address must be at least 5 characters' },
  ];

  for (const c of invalidCases) {
    test(`rejects ${c.name} with 422`, async ({ request }) => {
      const res = await request.post('/api/bookings', { data: c.data });
      expect(res.status()).toBe(422);
      expect((await res.json()).errors).toContain(c.error);
    });
  }

  test('cancels a booking once and rejects a second cancel with 409', async ({ request }) => {
    const { id } = await (await request.post('/api/bookings', { data: validBooking() })).json();

    const first = await request.post(`/api/bookings/${id}/cancel`);
    expect(first.status()).toBe(200);
    expect((await first.json()).status).toBe('cancelled');

    const second = await request.post(`/api/bookings/${id}/cancel`);
    expect(second.status()).toBe(409);
  });

  test('returns 404 for an unknown booking', async ({ request }) => {
    const res = await request.get('/api/bookings/does-not-exist');
    expect(res.status()).toBe(404);
  });
});
