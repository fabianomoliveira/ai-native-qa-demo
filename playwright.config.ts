import { defineConfig, devices } from '@playwright/test';

const PORT = Number(process.env.PORT || 3000);

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'api', testMatch: /(api|contract)\/.*\.spec\.ts/ },
    { name: 'e2e-chromium', testMatch: /(e2e|a11y)\/.*\.spec\.ts/, use: { ...devices['Desktop Chrome'] } },
    { name: 'e2e-mobile', testMatch: /e2e\/.*\.spec\.ts/, use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: 'node app/server.js',
    url: `http://localhost:${PORT}/api/services`,
    reuseExistingServer: !process.env.CI,
    env: { PORT: String(PORT), BUGGY: process.env.BUGGY ?? '0' },
  },
});
