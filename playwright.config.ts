import { defineConfig, devices } from "@playwright/test";
const isDevelopment = typeof process.env.CI === "undefined";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

const devProjects = [
  {
    name: "chromium",
    use: { ...devices["Desktop Chrome"] },
  },
];
const ciProjects = [
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
];

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Fail the build early on CI if you break too many tests. */
  maxFailures: 25,
  retries: isDevelopment ? 0 : 1,
  // timeout: 10000,
  // expect: {
  //   timeout: 10000,
  // },
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? "100%" : "50%",
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  webServer: process.env.CI
    ? []
    : {
        command: "pnpm run preview",
        url: "http://localhost:3000/",
        timeout: 60 * 1000,
        reuseExistingServer: !process.env.CI,
      },
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.CI ? process.env.BASE_URL : "http://localhost:3000",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: process.env.CI ? ciProjects : devProjects,
});
