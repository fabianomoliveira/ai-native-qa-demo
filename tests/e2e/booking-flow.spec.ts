import { test, expect } from '@playwright/test';
import { BookingPage } from '../pages/booking.page';
import { isoDate } from '../support/data';

test.describe('Booking flow', () => {
  test('customer books lawn mowing and sees the confirmation', async ({ page }) => {
    const booking = new BookingPage(page);
    await booking.goto();
    await booking.book({ address: '123 Oak Street, Austin, TX', service: 'Lawn mowing — $45', date: isoDate(3) });

    await expect(booking.card).toContainText('Booking confirmed');
    await expect(booking.card).toContainText('Lawn mowing at 123 Oak Street, Austin, TX');
    await expect(booking.errors).toBeEmpty();
  });

  test('customer sees a clear error for a past date', async ({ page }) => {
    const booking = new BookingPage(page);
    await booking.goto();
    await booking.book({ address: '123 Oak Street, Austin, TX', service: 'Aeration — $90', date: isoDate(-2) });

    await expect(booking.errors).toHaveText('date cannot be in the past');
    await expect(booking.card).toHaveCount(0);
  });
});
