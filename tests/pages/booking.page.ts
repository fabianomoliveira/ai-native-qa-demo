import type { Locator, Page } from '@playwright/test';

// Page object: user-facing locators only (roles and labels), so tests
// survive markup refactors and double as an accessibility check.
export class BookingPage {
  readonly address: Locator;
  readonly service: Locator;
  readonly date: Locator;
  readonly submit: Locator;
  readonly errors: Locator;
  readonly card: Locator;
  readonly cancel: Locator;

  constructor(private readonly page: Page) {
    this.address = page.getByLabel('Service address');
    this.service = page.getByLabel('Service', { exact: true });
    this.date = page.getByLabel('Date');
    this.submit = page.getByRole('button', { name: 'Book now' });
    this.errors = page.getByRole('alert');
    this.card = page.getByTestId('booking-card');
    this.cancel = page.getByRole('button', { name: 'Cancel booking' });
  }

  async goto() {
    await this.page.goto('/');
    await this.service.locator('option').first().waitFor({ state: 'attached' });
  }

  async book(input: { address: string; service: string; date: string }) {
    await this.address.fill(input.address);
    await this.service.selectOption({ label: input.service });
    await this.date.fill(input.date);
    await this.submit.click();
  }
}
