import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  timeout: 7 * 1000,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  // forbidOnly: !!import.meta.env.CI,
  /* Retry on CI only */
  retries: import.meta.env.CI ? 0 : 0,
  /* Opt out of parallel tests on CI. */
  workers: import.meta.env.CI ? 1 : 4,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Fail the build on CI if there are too many failures or flakes. */
  maxFailures: import.meta.env.CI ? 4 : undefined,
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  // webServer: {
  //   command: "npm run start",
  //   port: 4321,
  //   timeout: 60 * 1000,
  //   reuseExistingServer: !import.meta.env.CI,
  // },
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: import.meta.env.BASE_URL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },

    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !import.meta.env.CI,
  // },
});
