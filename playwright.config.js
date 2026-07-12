// playwright.config.js
import { defineConfig, devices } from '@playwright/test';

// BASE_URL defaults to your live Vercel deployment so tests run against
// real production behavior (matches how you've been testing throughout
// this project — real device / real deploy, not just DevTools).
// Override locally with: BASE_URL=http://localhost:5173 npx playwright test
const BASE_URL = process.env.BASE_URL || 'https://resildas-boutique.vercel.app';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: [
    ['html', { open: 'never' }],   // generates playwright-report/index.html
    ['list'],                       // readable console output while running
  ],
  use: {
    baseURL: BASE_URL,
    actionTimeout: 60000,
    navigationTimeout: 60000,
    trace: 'retain-on-failure',     // full trace (DOM snapshots, network) on failed tests
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'] },
      // Real mobile-viewport testing — important given the New Arrivals /
      // testimonials / cart-drawer bugs that only showed up on real phones,
      // not desktop DevTools emulation.
    },
    {
      name: 'desktop-chrome',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});