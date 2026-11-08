// Shared test data builders. Tests never hardcode dates: they derive them
// from "today" so the suite stays green on any day it runs.
export function isoDate(daysFromToday: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + daysFromToday);
  return d.toISOString().slice(0, 10);
}

export function validBooking(overrides: Partial<{ address: string; serviceId: string; date: string }> = {}) {
  return {
    address: '123 Oak Street, Austin, TX',
    serviceId: 'mow',
    date: isoDate(7),
    ...overrides,
  };
}
