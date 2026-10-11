import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const baseURL = process.env.BASE_URL?.trim() || 'https://billio-psi.vercel.app';
const parsedBaseURL = new URL(baseURL);

if (!['http:', 'https:'].includes(parsedBaseURL.protocol)) {
  throw new Error('BASE_URL must use the http or https protocol.');
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  // The demo may contain shared mutable records; keep execution serial until
  // scenario data isolation is demonstrated.
  workers: 1,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  outputDir: 'test-results',
});
